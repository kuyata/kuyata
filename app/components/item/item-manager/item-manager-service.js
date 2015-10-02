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
        this.current = null;
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
}

/**
 * Private function to find item into items collection
 *
 * @param itemId on INT format which to find
 * @param list array data of items
 * @returns {*}
 */
function findItem(itemId, list) {
    return _.find(list, (item) => {
        return item.id === itemId
    })
}