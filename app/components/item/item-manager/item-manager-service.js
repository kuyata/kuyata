/**
 * @fileOverview
 *
 * This file contains the Item manager
 */

import _ from 'lodash';
import jsData from 'js-data';
import jsDataAngular from 'js-data-angular';

/**
 * Manage everything about items
 *
 * @class
 */
export default class ItemManager {

    constructor($q, DS, Item){
        this.$q = $q;
        this.Item = Item;

        this.currentPage = 0;
        this.pageLength = 25;
        this.params = {};   // last params set requests
        this.data = {collection: DS.store[Item.name].collection}; // Get the DS store collection
        this.current = null;
        this.lastedPage = false;    // flag to control the right-end of a list of items
    }

    /**
     * Retrieve a Item list as a paged segment on store
     *
     * @param params Object with any or all these properties: "title, source, category"
     * @param page Int that indicate what items page it required
     * @returns a promise
     */
    fetch(params = {}, page = 0){
        let offset = page*this.pageLength;
        let query = createQuery(params, offset, this.pageLength);

        return this.Item.findAll(query).then((items) => {
            this.currentPage = page;
            return items;
        });

        //return this.$q.when(false);
    }

    /**
     * Method to fetch the first page for a query, reseting store and all controls
     *
     * @param params
     * @returns a promise
     */
    initialPage(params = {}) {
        this.Item.ejectAll();
        this.currentPage = 0;
        this.lastedPage = false;
        return this.fetch(params).then((items) => {
            this.params = params;
            if (items.length < this.pageLength) {
                this.lastedPage = true;
            }
            return items;
        });
    }

    /**
     * Method to fetch the next page for a stablished query
     *
     * @returns a promise
     */
    pageUp(){
        if(!this.lastedPage) {
            return this.fetch(this.params, this.currentPage + 1).then((items) => {
                if(items.length == 0) {
                    this.lastedPage = true;
                    this.currentPage--;
                    return false;
                }

                else if (items.length < this.pageLength) {
                    this.lastedPage = true;
                }

                return items;
            });
        }
        else {
            return this.$q.when(false);
        }
    }

    /**
     * Method to fetch the previous page for a stablished query
     *
     * @returns a promise
     */
    pageDown(){
        if(this.currentPage > 0) {
            return this.fetch(this.params, this.currentPage - 1).then((items) => {
                if(this.lastedPage) {this.lastedPage = false;}
                return items;
            });
        }
        else {
            return this.$q.when(false);
        }
    }

    /**
     * Get current page
     *
     * @returns {*}
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Get the id of the current item. To control the item selected
     *
     * @returns {*}
     */
    getCurrentItemId() {
        return this.current;
    }

    /**
     * Set the id of the current item. To control the selected
     *
     * @param newCurrent. The id of the new current item selected
     */
    setCurrentItemId(newCurrent) {
        this.current = newCurrent;
    }

    /**
     * Reset the current item
     *
     */
     resetCurrentItem() {
        this.current = null;
    }

    /**
     * Get True is list is on the first page
     *
     * @returns {boolean}
     */
    isFirstPage() {
        return this.currentPage == 0 ? true : false;
    }

    /**
     * Get True is list is on the last page
     *
     * @returns {boolean}
     */
     isLastPage() {
        return this.lastedPage ? true : false;
    }

    /**
     * Determine if a item exist on the Item collection
     *
     * @param builded source item
     * @return Boolean
     */
    exists(item, key) {
        let dataCached, whereKey;

        if (key == 'guid') {
            dataCached = _.find(this.data.collection, {'guid': item.guid});
            whereKey = {'guid': {'==': item.guid}};

        }
        else if (key == 'checksum') {
            dataCached = _.find(this.data.collection, {'checksum': item.checksum});
            whereKey = {'checksum': {'==': item.checksum}};
        }

        if(dataCached) {
            return this.$q.when(dataCached);
        }
        else {
            return this.Item.findAll({
                where: whereKey,
                limit: 1
            },{
                bypassCache: true
            }).then((item) => {
                return item[0] || false;
            });
        }
    }

    /**
     * Create items from articles list and ids
     *
     * @param items, {source_id, category_id, subcategory_id}
     * @returns {promise}
     */
    createItems(items, itemIds) {
        let promises = [];

        return this.$q(resolve => {
            items.forEach(item => {
                promises.push(this.createItem(item, itemIds));
            });
            this.$q.all(promises).then(() => {
                resolve();
            });
        });
    }

    /**
     * Create a new DS.Item
     *
     * @param item, {reference_ids}
     * @returns {promise}
     */
    createItem(item, itemIds) {
        let _item = item;
        _item.created_at = Date.now();
        _item.updated_at = _item.created_at;
        _item.source_id = itemIds.sourceId;
        _item.category_id = itemIds.categoryId || null;
        _item.subcategory_id = itemIds.subcategoryId || null;

        if(!item.last_feed_date || item.last_feed_date == "") {
            item.last_feed_date = _item.updated_at;
        }

        return this.Item.create(_item);
    }


    /**
     *
     *
     * @param itemOnStore
     * @param newItem
     * @returns {*}
     */
    updateItem(itemOnStore, newItem) {
        return this.$q(resolve => {
            if(!_.isMatch(itemOnStore, newItem)) {
                this.Item.update(itemOnStore.id, newItem).then(() =>  {
                    resolve(true);
                });
            }
            else {
                resolve(false);
            }
        });
    }

    /**
     * Recusive method to find and delete all items for a source
     *
     * @param source
     * @param pageNumber
     * @returns {*}
     */
    deletePages(source, pageNumber) {
        return this.$q((resolve) => {
            let currentPage = pageNumber + 1;

            this.fetch({source: source}, pageNumber).then((items) => {
                //deleting items

                items.forEach((item) => {
                    this.Item.destroy(item);
                });

                //no items or last page
                if (items.length == 0 || items.length < this.pageLength) {
                    resolve();
                }
                else {
                    this.deletePages(source, currentPage).then(() => {
                        resolve();
                    });
                }
            });
        });
    }

    /**
     * Delete all items for a source
     *
     * @param source
     * @returns {*}
     */
    deleteItems(source) {
        return this.$q((resolve) => {
            let initialPage = 0;

            this.deletePages(source, initialPage).then(() => {
                resolve();
            });
        });
    }
    
    /**
     * Auxiliar method to create initial sample data for categories
     * @param data is the categories fixtures
     */
    createSampleData(data){
        return this.Item.destroyAll().then(() => {
            return this.$q((resolve) => {
                console.log('ItemManager. createSampleData');
                let promises = [];
                data.forEach(item => {
                    promises.push(this.Item.create(item).catch((e) => {console.log(e);}));
                });
                this.$q.all(promises).then(() => {
                    resolve();
                });
            });
        }).catch((e) => {console.log(e);});

        //return this.$q.when(false);
    }
}

/**
 * Private function to generate JSON of params used on DS finds queries
 *
 * @param params is an Object with any or all these properties: "title, source, category, offset, limit"
 * @returns a DS format params Object
 */
function createQuery(params, offset = false, limit = false) {
    let _params = {sort: [['last_feed_date', 'DESC']], status: 'enabled'};

    if(offset !== false) {
        _params.offset = offset;
        _params.limit = limit;
    }

    if(!_.isEmpty(params)){
        _params.where = {};

        //TODO: id typeof to INT for NWJS (remove)
        if (typeof(process) != 'undefined') {
            params.source = parseInt(params.source);
            if(params.category) {
                params.category = parseInt(params.category);
            }
            if(params.subcategory) {
                params.subcategory = parseInt(params.subcategory);
            }

        }

        if(params.source){
            _params.where.source_id = {'==': params.source};
        }
        if(params.category){
            _params.where.category_id = {'==': params.category};
        }
        if(params.subcategory){
            _params.where.subcategory_id = {'==': params.subcategory};
        }
    }

    return _params;
}