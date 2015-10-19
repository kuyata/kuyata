/**
 * @fileOverview
 *
 * This file contains the Source manager
 */

import _ from 'lodash';
import jsData from 'js-data';
import jsDataAngular from 'js-data-angular';

/**
 * Manage everything about sources
 *
 * @class
 */
export default class SourceManager {

    constructor($q, DS, Source, CategoryManager){
        this.$q = $q;
        this.Source = Source;
        this.CategoryManager = CategoryManager;

        this.data = {collection: DS.store[Source.name].collection, tree:[]}; // Get the DS store collection
        this.current = null;
    }

    /**
     * Getter method to retrieve data from DB or use cached data if it already exists
     * @returns {*}
     */
    fetch(){
        this.current = null;
        this.Source.ejectAll();
        return this.Source.findAll({sort: [['created_on', 'DESC']], status: 'enabled'});
    }

    /**
     * Creates a multilevel sources array with its category trees
     * @returns a promise
     */
    createSourcesTree(){
        return this.fetch().then(() => {
            return this.CategoryManager.getCategoriesTree().then(categoriesTree => {
                let sourcesTree = angular.copy(this.data.collection);
                sourcesTree.forEach(node => {
                    node.categories = categoriesTree[node.source_id];
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
                let r = _.filter(this.data.tree, { 'source_id': sourceId})[0];
                return r ? r.categories : false;
            });
        }
        else {
            return this.$q.when(_.filter(this.data.tree, { 'source_id': sourceId})[0].categories);
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
     * Return true if a source has not categories
     *
     * @param sourceId
     * @returns {boolean}
     */
    isEmpty(sourceId) {
        if(!_.isEmpty(this.data.tree)) {
            return !this.data.tree[_.findIndex(this.data.tree, { 'id': sourceId })].categories;
        }
        return false;
    }

    /**
     * Auxiliar method to create initial sample data for sources
     * @param data is the source fixtures
     */
    createSampleData(data){
        return this.Source.destroyAll().then(() => {
            return this.$q((resolve) => {
                console.log('SourceManager. createSampleData');
                let promises = [];
                data.forEach(item => {
                    promises.push(this.Source.create(item).catch((e) => {console.log(e);}));
                });
                this.$q.all(promises).then(() => {
                    resolve();
                });
            });
        }).catch((e) => {console.log(e);});

        //return this.$q.when(false);
    }
}