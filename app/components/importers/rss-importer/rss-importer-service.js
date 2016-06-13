import resolveUrl from "resolve-url";
import FeedParser from 'feedparser';
import Stream from 'stream';


export default class RSSImporter {

    /*@ngInject*/
    constructor($q, $http, Importer, $rootScope){
        this.$q = $q;
        this.$http = $http;
        this.Importer = Importer;
        this.$rootScope = $rootScope;

        $rootScope.$on("import:type:rss", (e, source) => {
            this.import(source.url);
        });
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
                //feed path
                if(feedHref.match(/^feed:\/\//)) {
                    feedHref = feedHref.replace("feed", "http");
                }
                //relative path
                else if (!feedHref.match(/^http/)) {
                    feedHref = resolveUrl(url, feedHref);
                }
                return feedHref;
            }
        }
        return null;
    }

    /**
     * use $http service to get data from a url
     *
     * @param url
     * @returns {a promise. The response object has 'data', 'status', 'headers', 'config', 'statusText'}
     */
     fetch(url) {
        let deferred = this.$q.defer();
        let _url = url;
        if (!url.match(/^http/)) {
            _url = 'http://' + _url;
        }

        this.$http.get(_url).then((dataFetched) => {
            deferred.resolve({data: dataFetched.data, url: _url});
        }).catch(() => {
            deferred.reject();
        });

        return deferred.promise;
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
        let deferred = this.$q.defer();

        // fetching 'url'
        this.fetch(url).then((fetchedUrl) => {
            // 'url' fetched. trying parse
            this.parse(new Buffer(fetchedUrl.data))
                .then((res) => {
                    // 'url' is a feed. parsing success
                    deferred.resolve({data: res, url: fetchedUrl.url});
                })
                .catch(() => {
                    // 'url' is NOT a feed. Trying to find inner url feed
                    let innerFeedUrl = this.findFeedUrlInHtml(fetchedUrl.data, fetchedUrl.url);

                    if(innerFeedUrl) {
                        // 'innerFeedUrl' founded. Fetching 'innerFeedUrl'
                        this.fetch(innerFeedUrl).then(innerFetchedUrl => {
                            // 'innerFeedUrl' fetched. trying parse
                            this.parse(new Buffer(innerFetchedUrl.data))
                                .then((res) => {
                                    // 'innerFeedUrl' is a feed. parsing success
                                    deferred.resolve({data: res, url: innerFetchedUrl.url});
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
    buildSource(feedUrl, meta){
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
            source.name = feedUrl;
        }

        // set guid
        source.guid = feedUrl;

        // set url
        source.url = feedUrl;

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
            item.guid = orig_source_id;
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
            item.url = orig_source_id;
        }

        // set last_feed_date<Timestamp> from article.date<Date> or article.pubdate<Date>
        if(article.date) {
            item.last_feed_date = article.date.getTime();
        }
        else if(article.pubdate) {
            item.last_feed_date = article.pubdate.getTime();
        }
        else {
            item.last_feed_date = null;
        }

        item.orig_category_id = null;
        item.orig_subcategory_id = null;

        // set checksum
        item.checksum = this.Importer.makeItemChecksum(item);

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
        feed.meta = this.buildSource(rssFeed.url, rssFeed.data.meta);
        feed.content = [];

        rssFeed.data.articles.forEach((article) => {
            feed.content.push(this.buildItem(article, feed.meta.guid));
        });

        return feed;
    }

    /**
     *
     * @param url
     */
    import(url) {
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
                console.log("response!");
                console.log(response);
                this.$rootScope.$emit("import:done");
                deferred.resolve(response);
            }).catch((response) => {
                console.log("response! error");
                console.log(response);
                this.$rootScope.$emit("import:failed");
                deferred.reject(response);
            });

        }).catch(() => {
            deferred.reject({msg: "rss error"});
        });

        return deferred.promise;
    }
}