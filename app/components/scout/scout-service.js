import resolveUrl from "resolve-url";

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


    findFeedUrlInHtml(body, url) {
        //var dom = cheerio.load(body);
        let html = document.createElement('html');
        html.innerHTML = body;

        let href = html.querySelector('link[type="application/rss+xml"]').getAttribute('href');
        if (!href) {
            href = html.querySelector('link[type="application/atom+xml"]').getAttribute('href');
        }
        if (href) {
            //relative path
            if (!href.match(/^http/)) {
                href = resolveUrl(url, href);
            }
            return href;
        }
        return null;
    }


    /**
     * use $http service to get data from a url
     *
     * @param url
     * @returns {a promise with url data}
     */
    fetch(url) {
        this.url = url;
        if (!url.match(/^http/)) {
            this.url = 'http://' + this.url;
        }

        return this.$http.get(this.url);
    }
}