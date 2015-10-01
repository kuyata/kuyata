/**
 * @fileOverview
 *
 * This file contains the Item manager
 */

import _ from 'lodash';

/**
 * Manage everything about items
 *
 * @class
 */
export default class ItemManager {

    constructor($q, Item){
        this.$q = $q;
        this.Item = Item;

        this.currentPage = 0;
        this.loadedPages = [0];
        this.pageLength = 50;
        this.maxPages = 3;

        this.data = {list:[]};
    }

    /**
     * Getter method to retrieve data from DB or use cached data if it already exists
     * OR if is wanted to force clear and get from database
     *
     * @param params is an Object with any or all these properties: "query, source, category, skip, limit"
     * @returns a promise
     */
    findList(params = {}, clear = true){
        // if data.list is empty OR if is wanted to force clear and get from database
        if(_.isEmpty(this.data.list) || clear) {
            this.Item.ejectAll();
            this.data.list = [];
            let query = createQuery(params, 0, this.pageLength);

            return this.Item.findAll(query).then((items) => {
                this.currentPage = 0;
                this.loadedPages = [0];
                this.data.list = items;
                return this.data.list;
            });
        }

        // find on already cached data
        else {
            return this.$q.when(this.data.list);
        }
    }

    /**
     * Get item by id. Find data from DB or use cache data
     * The item must be already cached. Single item only is requested through listed and cached items
     * @param itemId on INT format which to find,
     * @returns Item Object
     */
    getItemById (itemId) {
        return _.find(this.data.list, (item) => {
            return item.id === itemId
        })
    };
}

/**
 * Private function to generate JSON of params used on DS finds queries
 *
 * @param params is an Object with any or all these properties: "title, source, category, skip, limit"
 * @returns a DS format params Object
 */
function createQuery(params, skip, limit) {
    let _params = {sort: [['src_date', 'DESC']], skip: skip, limit: limit};
    if(params != {}){
        if(params.title){
            _params.where = {};
            _params.where.title = {'in': params.title};
        }
        if(params.source){
            _params.where = {};
            _params.where.source = {'==': params.source};
        }
        if(params.category){
            _params.where = {};
            _params.where.category = {'==': params.category};
        }
    }
    return _params;
}