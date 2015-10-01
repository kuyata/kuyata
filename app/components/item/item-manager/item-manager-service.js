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

        this.data = {list:[]};
    }

    /**
     * Getter method to retrieve data from DB or use cached data if it already exists
     *
     * @param params is an Object with any or all these properties: "query, source, category, skip, limit"
     * @returns a promise
     */
    findList(params = {}){
        let query = createQuery(params);
        if(_.isEmpty(this.data.list)){
            return this.Item.findAll(query).then((items) => {
                this.data.list = items;
                return this.data.list;
            });
        }
        else {
            return this.$q.when(this.data.list);
        }
    }

    /**
     * Get item by id. Find data from DB or use cache data
     *
     * @param itemId on INT format which to find,
     * @returns {*}
     */
    getItemById (itemId) {
        return this.$q ( resolve => {
                if (_.isEmpty(this.data.list)) {
                    this.findList().then(() => {
                        resolve(findItem(itemId, this.data.list));
                    })
                }
                else {
                    resolve(findItem(itemId, this.data.list));
                }
            }
        )
    };
}

/**
 * Private function to find item into items collection
 *
 * @param itemId on INT format which to find
 * @param list array data of items
 * @returns item with id passed on 'itemId' param
 */
function findItem(itemId, list) {
    return _.find(list, (item) => {
        return item.id === itemId
    })
}

/**
 * Private function to generate JSON of params used on DS finds queries
 *
 * @param params is an Object with any or all these properties: "query, source, category, skip, limit"
 * @returns a DS format params Object
 */
function createQuery(params) {
    let _params = {sort: [['src_date', 'DESC']]};
    if(params != {}){
        if(params.query){
            _params.where = {};
            _params.where.title = {'in': params.query};
        }
        if(params.source){
            _params.where = {};
            _params.where.source = {'==': params.source};
        }
        if(params.category){
            _params.where = {};
            _params.where.category = {'==': params.category};
        }
        if(params.skip){
            _params.skip = params.skip;
        }
        if(params.limit){
            _params.limit = params.limit;
        }
    }
    return _params;
}