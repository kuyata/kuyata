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
        this.current = null;
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
     * @return a promise with the category tree
     */
    getCategoriesTree() {
        return this.findList().then(() => {
            let list = angular.copy(this.data.list);
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
        return this.$q((resolve) => {
            console.log('CategoryManager. createSampleData');
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