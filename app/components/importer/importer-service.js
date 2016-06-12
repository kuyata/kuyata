/**
 * Importer is a middleware between Core and Importers.
 * Read data from Core and and send to specific-importers who request it through specific-importers-ui
 *
 * @class
 */

import _ from 'lodash';
import checksum from 'json-checksum';

export default class Importer {

    /*@ngInject*/
    constructor($q, SourceManager, CategoryManager, ItemManager, gettextCatalog, $window){
        this.$q = $q;
        this.$window = $window;
        this.gettextCatalog = gettextCatalog;
        this.SourceManager = SourceManager;
        this.CategoryManager = CategoryManager;
        this.ItemManager = ItemManager;
    }

    /**
     * Method to explore ddbb and analize if follow a create or update flow
     * from a normalized feed Object
     *
     * @param feed
     *      * meta {}
     *          categories[] category{} **
     *              subcategories[] subcategory{} **
     *
     *      ** schema variations:
     *      ** -----------------------
     *      ** source{} -> categories[] undefined
     *      ** source{} -> categories[] -> subcategories[] undefined
     *      ** source{} -> categories[] -> subcategories[]
     *
     *
     * @param overwrite
     *      defaults to false
     *      when 'overwrite' is true, the Importer overwrite all DB information for that source
     *      without check updates
     *
     *
     * @returns {promise}
     * data: {code}
     *      code: -2 ->  items response error
     *      code: -1 ->  source response error
     *      code: 0  ->  source not new without changes
     *      code: 1  ->  source not new with changes
     *      code: 2  ->  source is new
     */
    import(meta, content) {

        let deferred = this.$q.defer();

        // sync sync source
        this.importSource(meta).then((sourceData) => {
            if(sourceData.code >= 1) {
                //this.importCategories(meta.categories, sourceData.source.id).then((c) => {
                    this.importItems(content, sourceData).then((itemsData) => {
                        if(sourceData.code == 3) {
                            deferred.resolve({code: 2, msg: this.responseMsg(2)});
                        }
                        // no item changes
                        else if(itemsData.code == 0){
                            deferred.resolve({code: 0, msg: this.responseMsg(0)});
                        }
                        // item changes
                        else if(itemsData.code == 1){
                            deferred.resolve({code: 1, msg: this.responseMsg(1)});
                        }
                    }).catch(() => {
                        deferred.reject({code: -2, msg: this.responseMsg(-2)});
                    });
                //});
            }
            else {
                deferred.resolve({code: 0, msg: this.responseMsg(0)});
            }
        }).catch(() => {
            deferred.reject({code: -1, msg: this.responseMsg(-1)});
        });

        return deferred.promise;
    }

    /**
     * Import Source from normalized data
     *
     * @param source
     * @returns {promise}
     * data: {code, Source[, deltaTime]}
     *      code: -1 ->  source response error
     *      code: 0  ->  source not new and has not new last_feed_date
     *      code: 1  ->  source not new and has new last_feed_date
     *      code: 2  ->  source not new and undefined last_feed_date
     *      code: 3  ->  source is new
     *
     *      deltaTime: previous last_feed_date
     */
    importSource(meta){
        let deferred = this.$q.defer();
        let sourceOnStore = this.SourceManager.exists(meta);

        if(!sourceOnStore){
            this.SourceManager.createSource(meta).then((sourceRes) => {
                this.SourceManager.addSourceToTree(sourceRes);
                deferred.resolve({code: 3, source: sourceRes});
            }).catch(() => {
                deferred.reject({code: -1, source: null});
            });
        }
        else {
            let deltaTime = sourceOnStore.last_feed_date;
            this.SourceManager.updateSource(sourceOnStore, meta).then((res) => {
                if (meta.last_feed_date) {
                    if(deltaTime == meta.last_feed_date) {
                        deferred.resolve({code: 0, source: sourceOnStore});
                    }
                    else {
                        deferred.resolve({code: 1, source: sourceOnStore, deltaTime: deltaTime});
                    }
                }
                else {
                    deferred.resolve({code: 2, source: sourceOnStore});
                }
            }).catch(() => {
                deferred.reject({code: -1, source: null});
            });
        }

        return deferred.promise;
    }

    /**
     * TODO: need review
     *
     */
    importCategories(categories, sourceId) {
        let deferred = this.$q.defer();

        if(categories) {

            let promises = [];
            categories.forEach((category) => {
                let innerDeferred = this.$q.defer();
                let categoryOnStore = this.CategoryManager.exists(category);

                // if not exist, create it and addToTree
                if(!categoryOnStore){
                    promises.push(this.CategoryManager.createCategory(category, sourceId, null).then((categoryRes) => {
                        this.SourceManager.addCategoryToTree(categoryRes);

                        //if(category.subcategories) {
                        //    promises.push(this.importSubcategories(category.subcategories, sourceId, categoryRes.id));
                        //}
                        //else {
                        //    promises.push(this.$q.when());
                        //}
                    }));
                }

                // not new category
                //else {
                //    //deferred.resolve(false);
                //
                //    // not new category with subcategories
                //    if(category.subcategories) {
                //        promises.push(this.importSubcategories(category.subcategories, sourceId, categoryOnStore.id));
                //    }
                //    else {
                //        promises.push(this.$q.when());
                //    }
                //}
            });

            this.$q.all(promises).then(() => {
                deferred.resolve("All categories added");
            });
        }

        else {
            deferred.resolve("El feed no tiene categorías");
        }

        return deferred.promise;
    }

    /**
     * TODO: need review
     *
     */
    importSubcategories(categories, sourceId, parentCategoryId) {
        let deferred = this.$q.defer();

        if(categories) {

            let promises = [];
            categories.forEach((category) => {

                let categoryOnStore = this.CategoryManager.exists(category);

                // if not exist, create it and addToTree
                if(!categoryOnStore){
                    this.CategoryManager.createCategory(category, sourceId, parentCategoryId).then((categoryRes) => {
                        this.SourceManager.addCategoryToTree(categoryRes);

                        promises.push(this.$q.when(false));
                    });
                }

                // not new category
                else {
                    promises.push(this.$q.when(false));
                }
            });

            this.$q.all(promises).then(() => {
                deferred.resolve("Subcategories added");
            });
        }

        else {
            deferred.resolve("Feed without subcategories");
        }

        return deferred.promise;
    }

    /**
     * Import Items from normalized content Array
     *
     * @param content
     * @param sourceData {code, Source}
     * @param itemNewCheck, defaults true. Allows to check if an item is new or not. Set false to force item create
     * @returns {promise}
     * data: {code}
     *      code: -1 ->  one or more item response errors
     *      code: 0  ->  no changes
     *      code: 1  ->  one or more items created or updated
     */
    importItems(content, sourceData, itemNewCheck = true, itemUpdateCheck = true) {

        let deferred = this.$q.defer();

        let promises = [];
        let contentUpdated = false;

        // import items flow
        // if source is new or itemNewCheck is false
        if(sourceData.code == 3 || !itemNewCheck){
            contentUpdated = true;
            content.forEach((item) => {
                promises.push(this.ItemManager.createItem(item, this.getItemRefs(item)));
            });
        }
        else {
            // if we know dates, check new date content
            if (sourceData.code == 1){
                contentUpdated = true;
                content = _.dropWhile(content, function(n) {
                    return n.last_feed_date <= sourceData.deltaTime;
                });
            }

            //some will be new, some will be updated
            content.forEach((item) => {
                // create, update or nop flow
                promises.push(
                    this.$q(resolve => {
                        this.ItemManager.exists(item, "guid").then((itemOnStore) => {
                            if(!itemOnStore) {
                                this.ItemManager.exists(item, "checksum").then((itemChecksum) => {
                                    if(!itemChecksum) {
                                        this.ItemManager.createItem(item, this.getItemRefs(item)).then(() => {
                                            contentUpdated = true;
                                            resolve();
                                        });
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            }
                            else {
                                this.ItemManager.updateItem(itemOnStore, item).then((updated) => {
                                    if(updated) {
                                        contentUpdated = true;
                                    }
                                    resolve();
                                });
                            }
                        })
                    })
                );
            });
        }

        this.$q.all(promises).then(() => {
            deferred.resolve({code: contentUpdated ? 1 : 0});
        }).catch(() => {
            deferred.reject({code: -1});
        });

        return deferred.promise;
    }

    /**
     * Get the source, category and subcategory ids from a normalized item
     *
     * @param item
     * @returns {sourceId, categoryId, subcategoryId}
     */
    getItemRefs(item) {
        let refs = {};
        refs.sourceId = this.SourceManager.getSourceIdFromOrigin(item.orig_source_id);
        if(item.orig_category_id) {
            refs.categoryId = this.CategoryManager.getCategoryIdFromOrigin(item.orig_category_id);
        }
        if(item.orig_subcategory_id) {
            refs.subcategoryId = this.CategoryManager.getCategoryIdFromOrigin(item.orig_subcategory_id);
        }

        return refs;
    }

    /**
     *
     * @param code
     *      code: -1 ->  error
     *      code: 0  ->  source not new without changes
     *      code: 1  ->  source not new with changes
     *      code: 2  ->  source is new
     * @returns {string}
     */
    responseMsg(code) {
        let msg = "";

        if(code == 0) {
            msg = this.gettextCatalog.getString("Source already up to date");
        }
        else if(code == 1) {
            msg = this.gettextCatalog.getString("Source updated");
        }
        else if(code == 2) {
            msg = this.gettextCatalog.getString("Source added and updated");
        }
        else if(code == -1) {
            msg = this.gettextCatalog.getString("Source error");
        }
        else if(code == -2) {
            msg = this.gettextCatalog.getString("Items error");
        }

        return msg;
    }

    /**
     * Calculate a final response from a group of responses
     *
     * @param responseCollection. An array of responses as {msg: string, code: int}
     * @returns {msg: string, code: int}
     */
    responseGroup(responseCollection) {
        let code;
        let msg = "";
        if(responseCollection.length == 1) {
            code = responseCollection[0].code;
            msg = responseCollection[0].msg;
        }
        else if(_.find(responseCollection, {'code': 2})){
            code = 2;

            msg = this.gettextCatalog.getString("Sources added and updated");
        }
        else if(_.find(responseCollection, {'code': 1})){
            code = 1;
            msg = this.gettextCatalog.getString("Sources updated");
        }
        else if(_.find(responseCollection, {'code': 0})){
            code = 0;
            msg = this.gettextCatalog.getString("Sources already up to date");
        }
        else if(_.find(responseCollection, {'code': -1})){
            code = -1;
            msg = this.gettextCatalog.getString("Source error");
        }
        else if(_.find(responseCollection, {'code': -2})){
            code = -2;
            msg = this.gettextCatalog.getString("Items error");
        }

        return {msg: msg, code: code};
    }

    /**
     *
     * @param obj
     * @returns {*}
     */
    makeItemChecksum(obj) {
        let htmlObject = document.createElement('div');
        let _obj = _.pick(obj, [
            'orig_source_id',
            'title',
            'body',
            'author',
            'orig_source_id',
            'orig_category_id',
            'orig_subcategory_id',
            'url'
        ]);
        htmlObject.innerHTML = _obj.body;
        while(htmlObject.children.length > 0){
            htmlObject.removeChild(htmlObject.children[0]);
        }
        _obj.body = htmlObject.innerHTML;

        return checksum(_obj);
    }

    /**
     * Get list of plugin importers configs
     *
     * @returns {Array} list of importer config objects
     */
    getImporters() {
        return _.filter(this.$window.pluginConfigs, { 'base': "importer" });
    }
}
