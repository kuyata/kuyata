import oboe from "oboe";

export default class DefaultImporter {

    constructor($q, Importer, Settings){
        this.$q = $q;
        this.Importer = Importer;
        this.Settings = Settings;
        this.file;
    }


    /**
     * use $http service to get data from a url
     *
     * @param url
     * @returns {a promise. The response object has 'data', 'status', 'headers', 'config', 'statusText'}
     */
    fetch(url) {

    }

    /**
     * Parsing a feed
     *
     * @param BufferedData
     * @returns {a promise. The response object has 'meta' and 'articles'}
     */
    parse(BufferedData) {

    }

    /**
     * (fetch + parse) Fetch a Feed URL or find a inner feed url, to try parsing feed data
     *
     * @param url
     * @returns {a promise: The response object has {'meta' and 'articles'} or null}
     */
    explore(url){

    }


    /**
     * Build a source-normalized Object from a feedparser meta
     *
     * @param meta feedparser (All generic properties are "pre-initialized"
     * to null (or empty arrays or objects for certain properties). )
     * @returns {normalizedSource Object}
     */
    buildSource(meta){
        let source = JSON.parse(angular.toJson(meta));
        source.checksum = "";
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

    }

    /**
     * build normalized feed object
     *
     * @param rssFeed {meta: *, articles: Array}
     * @returns {{source: *, items: Array}}
     */
    normalize(rssFeed){

    }

    isValidFile(file) {
        let ext = file.slice(file.length-(this.Settings.appExporterExt.length + 1), file.length);
        if(ext == "." + this.Settings.appExporterExt) {
            return true;
        }
        return false;
    }

    getSourceList(file) {
        let deferred = this.$q.defer();
        let sourceList = [];
        this.file = file;
        oboe(this.file)
            .node({
                'sources.*': (source) => {
                    sourceList.push(source);
                },
                'sources': () => {
                    deferred.resolve(sourceList);
                    this.abort();
                }
            })
            .fail(() => {
                deferred.reject();
            });

        return deferred.promise;
    }

    getItemList(itemKey) {
        let deferred = this.$q.defer();
        let itemList = [];
        oboe(this.file)
            .node(itemKey + ".*", (item) => {
                itemList.push(item);
            })
            .node(itemKey, () => {
                deferred.resolve(itemList);
                this.abort();
            })
            .fail(() => {
                deferred.reject();
            });

        return deferred.promise;
    }


    import(meta, itemKey) {
        let deferred = this.$q.defer();
        let _meta = this.buildSource(meta);

        this.getItemList("i"+itemKey).then((content) => {
            this.Importer.import(_meta, content).then((response) => {
                deferred.resolve(response);
            }).catch((response) => {
                deferred.reject(response);
            });
        });

        return deferred.promise;
    }

    /**
     *
     * @param url
     */
    importList(file, sourceList) {
        this.file = file;
        return this.$q((resolve) => {
            let promises = [];
            sourceList.forEach((source, i) => {
                if(source){promises.push(this.import(source, i));};
            });
            this.$q.all(promises).then((responses) => {
                resolve(this.Importer.responseGroup(responses));
            });
        });
    }
}