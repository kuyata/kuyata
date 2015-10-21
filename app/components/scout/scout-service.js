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
                    feedHref = resolveUrl(url, href);
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
        this.url = url;
        if (!url.match(/^http/)) {
            this.url = 'http://' + this.url;
        }

        return this.$http.get(this.url);
    }
}