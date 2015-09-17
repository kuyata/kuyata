/**
 * @fileOverview
 *
 * This file contains the Category manager
 */

import _ from 'lodash';

/**
 * Manage everything about categories
 *
 * @class
 */
export default class CategoryManager {

    constructor($q, Category){
        this.$q = $q;
        this.Category = Category;

        this.data = {list:[]};
    }

    /**
     * Getter method to retrieve data from DB or use cached data if it already exists
     * @returns {*}
     */
    findList(){

        if(_.isEmpty(this.data.list)){
            return this.Category.findAll({}).then((categories) => {
                this.data.list = categories;
                return this.data.list;
            });
        }
        else {
            return this.$q.when(this.data.list);
        }
    }
}