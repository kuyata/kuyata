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
        this.pageLength = 5;
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
     * Auxiliar method to create initial sample data for categories
     * @param data is the categories fixtures
     */
     createSampleData(data){
        return this.$q((resolve) => {
            console.log('ItemManager. createSampleData');
            let promises = [];
            data.forEach(item => {
                promises.push(this.Item.create(item));
            });
            this.$q.all(promises).then(() => {
                resolve();
            });
        });
    }
}

/**
 * Private function to generate JSON of params used on DS finds queries
 *
 * @param params is an Object with any or all these properties: "title, source, category, skip, limit"
 * @returns a DS format params Object
 */
function createQuery(params, skip = false, limit = false) {
    let _params = {sort: [['src_date', 'DESC']], status: 'enabled'};

    if(skip !== false) {
        _params.skip = skip;
        _params.limit = limit;
    }

    if(!_.isEmpty(params)){
        _params.where = {};

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