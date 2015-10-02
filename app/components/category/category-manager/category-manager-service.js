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

        this.data = {list:[], tree:[]};
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

    /**
     * Creates a multilevel categories array of object, starting with the source
     *
     */
    createCategoriesTree() {
        let list = angular.copy(this.data.list);
        let dataMap = {};
        list.forEach(function(node) {
            dataMap[node.id] = node;
        });

        list.forEach((node) => {
            // add to parent
            var parent = dataMap[node.parent_category];
            if (parent) {
                // create child array if it doesn't exist
                (parent.children || (parent.children = []))
                    // add node to child array
                    .push(node);
            } else {
                // parent is null or missing
                this.data.tree.push(node);
            }
        });

        this.data.tree = _.groupBy(this.data.tree, item => {
            return item.source;
        });
    }

    /**
     * Get the category element by passed id
     *
     * @param id
     * @returns a category element
     */
    getCategoryById(id){
        return _.find(this.data.list, item => {
            return item.id === id;
        });
    }
}