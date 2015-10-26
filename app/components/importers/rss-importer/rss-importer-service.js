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

        this.url = null;
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
     * @param meta feedparser
     * @returns {normalizedSource Object}
     */
    buildSource(meta){

        let source = {};

        source.status = 'enabled';

        //set created_at
        source.created_at = Date.now();
        source.updated_at = Date.now();

        // set name
        if(meta.title && meta.title != '') {
            source.name = meta.title;
        }
        else if(meta.description && meta.description != '') {
            source.name = meta.description;
        }
        else if(meta.link && meta.link != '') {
            source.name = meta.link;
        }
        else {
            source.name = "s_" + source.created_at;
        }

        // set guid
        if(meta.guid && meta.guid != '') {
            source.guid = meta.guid;
        }
        else {
            source.guid = source.created_at;
        }

        // set url
        source.url = '';
        if(meta.link && meta.link != '') {
            source.url = meta.link;
        }
        else if(meta.origlink && meta.origlink  != '') {
            source.url = meta.origlink;
        }
        else if(meta.permalink && meta.permalink  != '') {
            source.url = meta.permalink;
        }
        else {
            source.url = '';
        }

        return source;
    }

    /**
     * Build a item-normalized Object from a feedparser article
     *
     * @param article feedparser
     * @returns {normalizedItem Object}
     */
    buildItem(article){
        let item = {};

        item.status = 'enabled';

        //set created_at
        item.created_at = Date.now();
        item.updated_at = Date.now();

        // set title
        if(article.title && article.title != '') {
            item.title = article.title;
        }
        else {
            item.title = "i_" + item.created_at;
        }

        // set body
        if(article.description && article.description != '') {
            item.body = article.description;
        }
        else {
            item.body = '';
        }

        // set author
        if(article.author && article.author != '') {
            item.author = article.author;
        }
        else {
            item.author = '';
        }

        // set url
        item.url = '';
        if(article.link && article.link != '') {
            item.url = article.link;
        }
        else if(article.origlink && article.origlink != '') {
            item.url = article.origlink;
        }
        else if(article.permalink && article.permalink != '') {
            item.url = article.permalink;
        }
        else {
            item.url = '';
        }

        // set last_feed_date
        if(article.date && article.date != '') {
            item.last_feed_date = article.date;
        }
        else if(article.pubdate && article.pubdate != '') {
            item.last_feed_date = article.pubdate;
        }
        else {
            item.last_feed_date = '';
        }

        return item;

    }

    /**
     * build normalized feed object
     *
     */
    normalize(rssFeed){
        let normalizedItems = [];
        rssFeed.articles.forEach((article) => {
            normalizedItems.push(this.buildItem(article));
        });

        return {source: this.buildSource(rssFeed.meta), items: normalizedItems};
    }


    /**
     *
     * @param url
     */
    import(url) {

        // explore
        this.explore(url).then((rssFeed) => {

            // normalize
            let normalizedFeed = this.normalize(rssFeed);

            // import
            this.Importer.import(normalizedFeed);
        });

    }




}