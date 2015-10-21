//TODO: on lib package.json, ser "browser" params to true, for Browserify compatibility
import iconv from 'iconv-lite';

import resolveUrl from "resolve-url";
import FeedParser from 'feedparser';
import Stream from 'stream';


/**
 * Find and manage rss content on a URL
 *
 * isRss, getRss, parseRss, saveRssToStore, updateRss, deleteRss
 */
export default class Scout {

    constructor($q, $http){

        this.url = null;
        this.$q = $q;
        this.$http = $http;
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

        s.emit('data', this.normalizeEncoding(BufferedData));
        s.emit('end');

        return deferred.promise;
    }

    /**
     * (fetch + parse) Fetch a Feed URL or find a inner feed url, to try parsing feed data
     *
     * @param url
     * @returns {a promise: The response object has {'meta' and 'articles'} or null}
     */
        scout(url){
        this.url = url;
        let deferred = this.$q.defer();

        // fetching 'url'
        this.fetch(this.url).then(fetchedUrl => {
            // 'url' fetched. trying parse
            this.parse(new Buffer(fetchedUrl.data))
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
}