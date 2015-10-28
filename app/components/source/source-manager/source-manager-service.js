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

    constructor($q, DS, Source, CategoryManager, ItemManager){
        this.$q = $q;
        this.Source = Source;
        this.CategoryManager = CategoryManager;
        this.ItemManager = ItemManager;

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
        return this.Source.findAll({sort: [['created_at', 'DESC']], status: 'enabled'});
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
                    node.categories = categoriesTree[node.id];
                });
                this.data.tree = sourcesTree;
            });
        });
    }

    /**
     *
     * @param source
     */
    addSourceToTree(source){
        this.data.tree.push(source);
    }


    /**
     * TODO: need review
     * 
     * @param category
     */
    addCategoryToTree(category){
        let sourceIndex = _.findIndex(this.data.tree, { 'id': category.source_id});
        //let categories = this.data.tree[sourceIndex].categories || [];

        if(!this.data.tree[sourceIndex].categories) {
            this.data.tree[sourceIndex].categories = [];
        }

        // if that's a top level category
        if(!category.parent_category_id) {
            // insert it, if don't exist
            if(!_.find(this.data.tree[sourceIndex].categories, { 'id': category.category_id})) {
                this.data.tree[sourceIndex].categories.push(category);
            }
        }

        // if that's NOT a top level category
        else {
            let categoryIndex = _.findIndex(this.data.tree[sourceIndex].categories, { 'id': category.parent_category_id});
            if(!this.data.tree[sourceIndex].categories[categoryIndex].subcategories) {
                this.data.tree[sourceIndex].categories[categoryIndex].subcategories = [];
            }

            // insert it, if don't exist
            if(!_.find(this.data.tree[sourceIndex].categories[categoryIndex].subcategories, { 'id': category.id})) {
                this.data.tree[sourceIndex].categories[categoryIndex].subcategories.push(category);
            }
        }
    }

    /**
     * Get a category tree from a source
     *
     * @param sourceId
     * @returns {Array}
     */
    getCategoriesTreeBySourceId(sourceId){

        let _sourceId = sourceId;

        //TODO: id typeof to INT for NWJS (remove)
        if (typeof(process) != 'undefined') {
            _sourceId = parseInt(sourceId);
        }

        if(_.isEmpty(this.data.tree)){
            return this.createSourcesTree().then(() => {
                let r = _.filter(this.data.tree, { 'id': _sourceId})[0];
                return r ? r.categories : false;
            });
        }
        else {
            return this.$q.when(_.filter(this.data.tree, { 'id': _sourceId})[0].categories);
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
     * Get Source Id from a origSourceId
     *
     * @param origSourceId
     * @returns {source.id|boolean}
     */
    getSourceIdFromOrigin(origSourceId) {
        let source = _.find(this.data.collection, { 'guid': origSourceId });
        return source.id || false;
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
     * Determine if a item exist on the Source collection
     *
     * @param builded source item
     * @return Boolean
     */
    exists(item) {
        return _.find(this.data.collection, {'guid': item.guid});
    }

    /**
     * Create a source
     *
     * @param item
     * @returns {a promise: The response object has the 'source.id'}
     */
    createSource(source) {
        //let _source = angular.copy(source);
        source.created_at = Date.now();
        source.updated_at = Date.now();

        if(!source.last_feed_date || source.last_feed_date == "") {
            source.last_feed_date = source.updated_at;
        }

        //delete _source.categories;

        return this.Source.create(source);
    }

    /**
     *
     *
     * @param sourceOnStore
     * @param newSource
     * @returns {*}
     */
    updateSource(sourceOnStore, newSource) {
        if(!_.isMatch(sourceOnStore, newSource)) {
            return this.Source.update(sourceOnStore.id, newSource);
        }
        return this.$q.when(false);
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

    clearAdapter() {
        return this.$q((resolve) => {

            let promises = [];

            promises.push(this.Source.destroyAll());
            promises.push(this.CategoryManager.Category.destroyAll());
            promises.push(this.ItemManager.Item.destroyAll());

            this.$q.all(promises).then(() => {
                resolve();
            });
        });
    }
}