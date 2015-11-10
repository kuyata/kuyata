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
        this.Category.ejectAll();
        return this.Category.findAll({sort: [['created_at', 'DESC']], status: 'enabled'});
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
     * Reset current item
     *
     */
    clearCurrentItemId() {
        this.current = null;
    }

    /**
     * Get Category Id from a origCategoryId
     *
     * @param origCategoryId
     * @returns {category.id|boolean}
     */
    getCategoryIdFromOrigin(origCategoryId) {
        let category = _.find(this.data.collection, { 'guid': origCategoryId });
        return category ? category.id : false;
    }

    /**
     * Return true if a category has not subcategories
     *
     * @param categoryId
     * @returns {boolean}
     */
    isEmpty(categoryId) {
        return ! _.some(this.data.collection, 'parent_category_id', categoryId);
    }

    /**
     * Determine if a item exist on the Category collection
     *
     * @param builded category item
     * @return Boolean
     */
    exists(item) {
        return _.find(this.data.collection, {'guid': item.guid});
    }

    /**
     * Create a category
     *
     * @param item
     * @returns {a promise: The response object has the 'source.id'}
     */
    createCategory(category, source_id, parent_category_id = null) {
        let _category = angular.copy(category);
        _category.source_id = source_id;
        _category.parent_category_id = parent_category_id;
        _category.created_at = Date.now();
        _category.updated_at = Date.now();

        delete _category.subcategories;

        return this.Category.create(_category);
    }

    /**
     * Auxiliar method to create initial sample data for categories
     * @param data is the categories fixtures
     */
    createSampleData(data){
        console.log('CategoryManager. createSampleData');
        return this.Category.destroyAll().then(() => {
            return this.$q((resolve) => {
                let promises = [];

                data.forEach(item => {
                    promises.push(this.Category.create(item).catch((e) => {console.log(e);}));
                });

                this.$q.all(promises).then(() => {
                    resolve();
                });
            });
        }).catch((e) => {console.log(e);});

        //return this.$q.when(false);
    }
}