//TODO: on lib package.json, set "browser" params to true, for Browserify compatibility
import iconv from 'iconv-lite';

import resolveUrl from "resolve-url";
import FeedParser from 'feedparser';
import Stream from 'stream';


export default class RSSImporter {

    constructor($q, $http, Importer){
        this.$q = $q;
        this.$http = $http;
        this.Importer = Importer;

        this.sourceUrl = null;  // typed by user
        this.url = null;        // final rss url
    }

    /**
     *
     * @param body: data fetched on url
     * @param url: url string
     * @returns {Feed URL or null}
     */
     findFeedUrlInHtml(body, url) {
        let html = document.createElement('html');
        html.innerHTML = body;

        let feedLink = html.querySelector('link[type="application/rss+xml"]');
        if (!feedLink) {
            feedLink = html.querySelector('link[type="application/atom+xml"]');
        }

        if(feedLink){
            let feedHref = feedLink.getAttribute('href');

            if (feedHref) {
                //relative path
                if (!feedHref.match(/^http/)) {
                    feedHref = resolveUrl(url, feedHref);
                }
                return feedHref;
            }
        }
        return null;
    }

    /**
     * Normalize most encoding
     * https://github.com/ashtuchkin/iconv-lite#supported-encodings
     *
     * @param Buffer with url data
     * @returns {normalized url data}
     */
     normalizeEncoding(bodyBuf) {
        var body = bodyBuf.toString();
        var encoding;

        var xmlDeclaration = body.match(/^<\?xml .*\?>/);
        if (xmlDeclaration) {
            var encodingDeclaration = xmlDeclaration[0].match(/encoding=("|').*?("|')/);
            if (encodingDeclaration) {
                encoding = encodingDeclaration[0].substring(10, encodingDeclaration[0].length - 1);
            }
        }

        if (encoding && encoding.toLowerCase() !== 'utf-8') {
            try {
                body = iconv.decode(bodyBuf, encoding);
            } catch (err) {
                // detected encoding is not supported, leave it as it is
            }
        }

        return body;
    }

    /**
     * use $http service to get data from a url
     *
     * @param url
     * @returns {a promise. The response object has 'data', 'status', 'headers', 'config', 'statusText'}
     */
     fetch(url) {
        this.url = url;
        if (!url.match(/^http/)) {
            this.url = 'http://' + this.url;
        }

        return this.$http.get(this.url);
    }

    /**
     * Parsing a feed
     *
     * @param BufferedData
     * @returns {a promise. The response object has 'meta' and 'articles'}
     */
     parse(BufferedData) {
        let deferred = this.$q.defer();
        let meta;
        let articles = [];

        let s = new Stream();
        s.readable = true;

        s.pipe(new FeedParser())
            .on('error', deferred.reject)
            .on('meta', function (m) {
                meta = m;
            })
            .on('readable', function () {
                let stream = this;
                let item = stream.read();
                while (item) {
                    articles.push(item);
                    item = stream.read();
                }
            })
            .on('end', function () {
                deferred.resolve({
                    meta: meta,
                    articles: articles
                });
            });

        s.emit('data', BufferedData);
        s.emit('end');

        return deferred.promise;
    }

    /**
     * (fetch + parse) Fetch a Feed URL or find a inner feed url, to try parsing feed data
     *
     * @param url
     * @returns {a promise: The response object has {'meta' and 'articles'} or null}
     */
     explore(url){
        this.url = url;
        let deferred = this.$q.defer();

        // fetching 'url'
        this.fetch(this.url).then(fetchedUrl => {
            // 'url' fetched. trying parse
            this.parse(this.normalizeEncoding(new Buffer(fetchedUrl.data)))
                .then((res) => {
                    // 'url' is a feed. parsing success
                    deferred.resolve(res);
                })
                .catch(() => {
                    // 'url' is NOT a feed. Trying to find inner url feed
                    let innerFeedUrl = this.findFeedUrlInHtml(fetchedUrl.data, this.url);

                    if(innerFeedUrl) {
                        // 'innerFeedUrl' founded. Fetching 'innerFeedUrl'
                        this.fetch(innerFeedUrl).then(innerFetchedUrl => {
                            // 'innerFeedUrl' fetched. trying parse
                            this.parse(new Buffer(innerFetchedUrl.data))
                                .then((res) => {
                                    // 'innerFeedUrl' is a feed. parsing success
                                    deferred.resolve(res);
                                })
                                .catch(() => {
                                    // 'innerFeedUrl' is NOT a valid feed.
                                    deferred.reject(null);
                                });

                        }).catch(e => {
                            // fetching 'innerFeedUrl' error
                            deferred.reject(null);
                        });
                    }
                    else {
                        // 'innerFeedUrl' NOT founded. 'url' have not feeds
                        deferred.reject(null);
                    }
                });

        }).catch(e => {
            // fetching 'url' error
            deferred.reject(null);
        });

        return deferred.promise;
    }


    /**
     * Build a source-normalized Object from a feedparser meta
     *
     * @param meta feedparser (All generic properties are "pre-initialized"
     * to null (or empty arrays or objects for certain properties). )
     * @returns {normalizedSource Object}
     */
    buildSource(meta){

        let source = {};

        source.status = 'enabled';

        // importer type. Needed for know from core, what specific Importer use on update
        source.type = 'rss';

        // set name
        if(meta.title) {
            source.name = meta.title;
        }
        else if(meta.description) {
            source.name = meta.description;
        }
        else if(meta.xmlurl) {
            source.name = meta.link;
        }
        else {
            source.name = this.url;
        }

        // set guid
        if(meta.guid) {
            source.guid = meta.guid;
        }
        else {
            source.guid = this.url;
        }

        // set url
        source.url = this.sourceUrl;

        // set checksum
        source.checksum = '';

        // set last_feed_date<Timestamp> from meta.date<Date>
        source.last_feed_date = meta.date ? meta.date.getTime() : null;

        return source;
    }

    /**
     * Build a item-normalized Object from a feedparser article. (All generic properties
     * are "pre-initialized" to null (or empty arrays or objects for certain properties). )
     *
     * @param article feedparser
     * @returns {normalizedItem Object}
     */
    buildItem(article, orig_source_id){
        let item = {};

        // TODO: not all feeds has guid. Decide what to do with them
        // TODO: guid is not unique between sources. Keep in mind on imports

        item.status = 'enabled';

        // set guid
        if(article.guid) {
            item.guid = article.guid;
        }
        else {
            item.guid = this.url;
        }

        // set title
        item.title = article.title;

        // set body
        if(article.description) {
            item.body = article.description;
        }
        else {
            item.body = '';
        }

        // set author
        item.author = article.author;

        // set orig_source_id
        item.orig_source_id = orig_source_id;

        // set url
        if(article.link) {
            item.url = article.link;
        }
        else {
            item.url = this.url;
        }

        // set checksum
        item.checksum = '';

        // set last_feed_date<Timestamp> from article.date<Date> or article.pubdate<Date>
        if(article.date) {
            item.last_feed_date = article.date ? article.date.getTime() : null;
        }
        else if(article.pubdate) {
            item.last_feed_date = article.pubdate ? article.pubdate.getTime() : null;
        }

        return item;
    }

    /**
     * build normalized feed object
     *
     * @param rssFeed {meta: *, articles: Array}
     * @returns {{source: *, items: Array}}
     */
    normalize(rssFeed){
        let feed = {};
        feed.meta = this.buildSource(rssFeed.meta);
        feed.content = [];

        rssFeed.articles.forEach((article) => {
            feed.content.push(this.buildItem(article, feed.meta.guid));
        });

        return feed;
    }


    /**
     *
     * @param url
     */
    import(url) {
        this.sourceUrl = url;
        let deferred = this.$q.defer();
        // explore
        this.explore(url).then((rssFeed) => {

            // normalize
            let normalizedFeed = this.normalize(rssFeed);

            // import

            // source not exist
            // source error
            // merge rss responses with general import response

            this.Importer.import(normalizedFeed.meta, normalizedFeed.content).then((response) => {
                deferred.resolve(response);
            }).catch(() => {
                deferred.reject(null);
            });

        }).catch(() => {
            deferred.reject(null);
        });

        return deferred.promise;
    }

}