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
                    node.categories = categoriesTree[node.source_id];
                });
                this.data.tree = sourcesTree;
            });
        });
    }


    addSourceToTree(item){
        this.data.tree.push(item);
        this.data.tree[this.data.tree.length - 1].categories = undefined;
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
     * Determine if a item exist on the Source collection
     *
     * @param builded source item
     * @return Boolean
     */
    exists(item) {
        let res = _.find(this.data.collection, (elem) => {
            if (elem.src_id == item.src_id || elem.name == item.name ) {
                return true;
            }
        });

        return res || false;
    }

    /**
     * Create a source from a Feedparser meta item
     *
     * @param item
     * @returns {a promise: The response object has {'isNew' and 'source'}}
     */
    createItem(item) {
        let deferred = this.$q.defer();
        let newItem = this.buildedItem(item);

        newItem.source_id = newItem.created_at;

        // check item not exists
        let foundedItem = this.exists(newItem);

        if(!foundedItem){
            this.Source.create(newItem).then((res) => {
                this.addSourceToTree(res);
                deferred.resolve({isNew: true, source: res});
            });
        }

        else {
            deferred.resolve({isNew: false, source: foundedItem});
        }

        return deferred.promise;
    }

    /**
     * Build a new Source from a item
     *
     * @param item Feedparser element
     * @returns {Source}
     */
    buildedItem(item) {
        let newSource = {};

        newSource.status = 'enabled';

        //set created_at
        newSource.created_at = Date.now();
        newSource.updated_at = Date.now();

        // set name
        if(item.title && item.title != '') {
            newSource.name = item.title;
        }
        else if(item.description && item.description != '') {
            newSource.name = item.description;
        }
        else if(item.link && item.link != '') {
            newSource.name = item.link;
        }
        else {
            newSource.name = "s_" + newSource.created_at;
        }

        // set guid
        if(item.guid && item.guid != '') {
            newSource.src_id = item.guid;
        }
        else {
            newSource.src_id = newSource.created_at;
        }

        // set url
        newSource.url = '';
        if(item.link && item.link != '') {
            newSource.url = item.link;
        }
        else if(item.origlink && item.origlink  != '') {
            newSource.url = item.origlink;
        }
        else if(item.permalink && item.permalink  != '') {
            newSource.url = item.permalink;
        }
        else {
            newSource.url = '';
        }

        return newSource;
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