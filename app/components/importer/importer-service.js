export default class Importer {

    constructor($q, SourceManager, CategoryManager, ItemManager){
        this.$q = $q;
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
     * @returns {boolean}
     */
    import(meta, content) {

        let deferred = this.$q.defer();

        // sync sync source
        this.importSource(meta).then((sourceId) => {
            // source is new
            // source not new and was updated, including last_feed_date
            // source not new and not changed

            this.importCategories(meta.categories, sourceId).then((c) => {
                // source without categories
                // source with new categories
                // source without new categories, but, with updated categories and new subcategories
                // source without new categories, but, with updated categories
                // source without new categories, but, with new subcategories
                // source without new categories and without changes

                this.importItems(content).then(() => {

                    // new items added
                    // not new items but changed
                    // no changes

                    deferred.resolve();
                });
            });
        });

        return deferred.promise;
    }

    /**
     * Import Source from normalized data
     *
     * @param source
     * @returns {promise}
     * data: {code, Source}
     *      code: -1 ->  source response error
     *      code: 0  ->  source not new and has not new last_feed_date
     *      code: 1  ->  source not new and has new last_feed_date
     *      code: 2  ->  source not new and undefined last_feed_date
     *      code: 3  ->  source is new
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
            this.SourceManager.updateSource(sourceOnStore, meta).then((res) => {
                if (sourceOnStore.last_feed_date && meta.last_feed_date) {
                    if(sourceOnStore.last_feed_date == meta.last_feed_date) {
                        deferred.resolve({code: 0, source: sourceOnStore});
                    }
                    else {
                        deferred.resolve({code: 1, source: sourceOnStore});
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
     *
     * @param content
     * @param itemNewCheck, defaults true. Allows to check if an item is new or not. Set false to force item create
     * @param itemUpdateCheck, defaults true. Allows to check if an item was updated or not. Set false to omit this check
     * @returns {*}
     */
    importItems(content, itemNewCheck = true, itemUpdateCheck = true) {
        return this.$q(resolve => {
            let promises = [];
            content.forEach((item) => {

                //config refs
                let refs = {};
                refs.sourceId = this.SourceManager.getSourceIdFromOrigin(item.orig_source_id);
                if(item.orig_category_id) {
                    refs.categoryId = this.CategoryManager.getCategoryIdFromOrigin(item.orig_category_id);
                }
                if(item.orig_subcategory_id) {
                    refs.subcategoryId = this.CategoryManager.getCategoryIdFromOrigin(item.orig_subcategory_id);
                }

                // create, update or nop flow
                this.ItemManager.exists(item).then((itemOnStore) => {
                    if(!itemOnStore || !itemNewCheck) {
                        promises.push(this.ItemManager.createItem(item, refs));
                    }
                    else if (itemOnStore && itemUpdateCheck) {
                        promises.push(this.ItemManager.updateItem(itemOnStore, item).then((updated) => {
                            if(updated) {

                            }
                            else {

                            }
                        }));
                    }
                    else {
                        promises.push(this.$q.when());
                    }

                });


            });
            this.$q.all(promises).then(() => {
                resolve();
            });
        });
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
            msg = "Source already up to date";
        }
        else if(code == 1) {
            msg = "Source updated";
        }
        else if(code == 2) {
            msg = "Source added and updated";
        }
        else if(code == -1) {
            msg = "Source error";
        }

        return msg;
    }


}