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
     * @returns {*}
     */
    findList(){

        if(_.isEmpty(this.data.list)){
            return this.Item.findAll({}).then((items) => {
                this.data.list = items;
                return this.data.list;
            });
        }
        else {
            return this.$q.when(this.data.list);
        }
    }
}