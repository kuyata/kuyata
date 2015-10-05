/**
 * @fileOverview
 *
 * This file contains the Source manager
 */

import _ from 'lodash';

/**
 * Manage everything about sources
 *
 * @class
 */
export default class SourceManager {

    constructor($q, Source, CategoryManager){
        this.$q = $q;
        this.Source = Source;
        this.CategoryManager = CategoryManager;

        this.data = {list:[], tree:[]};
        this.current = null;
    }

    /**
     * Getter method to retrieve data from DB or use cached data if it already exists
     * @returns {*}
     */
    findList(){

        if(_.isEmpty(this.data.list)){
            return this.Source.findAll({}).then((sources) => {
                this.data.list = sources;
                return this.data.list;
            });
        }
        else {
            return this.$q.when(this.data.list);
        }
    }

    /**
     * Get the source element by passed id
     *
     * @param id
     * @returns a source element
     */
     getSourceById(id){
        return _.find(this.data.list, item => {
            return item.id === id;
        });
     }

    /**
     * Creates a multilevel sources array with its category trees
     * @returns a promise
     */
    createSourcesTree(){

        return this.findList().then(() => {

            return this.CategoryManager.getCategoriesTree().then(categoriesTree => {

                let sourcesTree = angular.copy(this.data.list);

                sourcesTree.forEach(node => {

                    node.categories = categoriesTree[node.id];

                });

                this.data.tree = sourcesTree;
            });
        });
    }


    /**
     * Get a category tree from a source
     *
     * @param sourceId
     * @returns {Array}
     */
    getCategoriesTreeBySourceId(sourceId){
        if(_.isEmpty(this.data.tree)){
            return this.createSourcesTree().then(() => {
                return _.filter(this.data.tree, { 'id': sourceId})[0].categories;
            });
        }
        else {
            return this.$q.when(_.filter(this.data.tree, { 'id': sourceId})[0].categories);
        }
    }

    /**
     * Get the id of the current source item. To control de source selected
     *
     * @returns {*}
     */
    getCurrentItemId() {
        return this.current;
    }

    /**
     * Set the id of the current source item. To control de source selected
     *
     * @param newCurrent. The id of the new current source item selected
     */
    setCurrentItemId(newCurrent) {
        this.current = newCurrent;
    }

    /**
     * Auxiliar method to create initial sample data for sources
     * @param data is the source fixtures
     */
    createSampleData(data){
        console.log('SourceManager. createSampleData');
        return this.$q((resolve) => {
            let promises = [];

            data.forEach(item => {
                promises.push(this.Source.create(item));
            });

            this.$q.all(promises).then(() => {
                resolve();
            });
        });
    }
}