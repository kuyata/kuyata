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

        this.Category.findAll({orderBy: [['isTarget', 'DESC']]}).then(categories => {
            this.data.list = categories;
        });
    }
}
