/**
 * @fileOverview
 *
 * This file contains the Category manager
 */

import _ from 'lodash';
import jsData from 'js-data';
import jsDataAngular from 'js-data-angular';

/**
 * Manage everything about categories
 *
 * @class
 */
export default class CategoryManager {

    constructor($q, DS, Category){
        this.$q = $q;
        this.Category = Category;

        this.data = {collection: DS.store[Category.name].collection}; // Get the DS store collection
        this.current = null;
    }

    /**
     * Getter method to retrieve data from DB or use cached data if it already exists
     * @returns {*}
     */
    fetch(){
        this.current = null;
        return this.Category.findAll({});
    }

    /**
     * Creates a multilevel categories array of object, starting with the source
     *
     * @return a promise with the category tree
     */
    getCategoriesTree() {
        return this.fetch().then(() => {
            let list = angular.copy(this.data.collection);
            let tree = [];
            let dataMap = {};
            list.forEach(node => {
                dataMap[node.id] = node;
            });

            list.forEach(node => {
                // add to parent
                var parent = dataMap[node.parent_category_id];
                if (parent) {
                    // create child array if it doesn't exist
                    (parent.children || (parent.children = []))
                        // add node to child array
                        .push(node);
                } else {
                    // parent is null or missing
                    tree.push(node);
                }
            });

            return _.groupBy(tree, item => {
                return item.source_id;
            });
        })
    }

    /**
     * Get the id of the current category item. To control de category selected
     *
     * @returns {*}
     */
    getCurrentItemId() {
        return this.current;
    }

    /**
     * Set the id of the current category item. To control de category selected
     *
     * @param newCurrent. The id of the new current category item selected
     */
    setCurrentItemId(newCurrent) {
        this.current = newCurrent;
    }


    /**
     * Auxiliar method to create initial sample data for categories
     * @param data is the categories fixtures
     */
    createSampleData(data){
        console.log('CategoryManager. createSampleData');
        return this.$q((resolve) => {
            let promises = [];

            data.forEach(item => {
                promises.push(this.Category.create(item));
            });

            this.$q.all(promises).then(() => {
                resolve();
            });
        });
    }
}