/**
 * @fileOverview App module. This is the main entry point
 */


import angular from 'angular';
import uiRouter from 'angular-ui-router';
import jsData from 'js-data';
import DSSqlAdapter from 'js-data-sql';
import jsDataAngular from 'js-data-angular';
import uiBootstrap from 'angular-bootstrap';

import sources from './ui/sources/sources';


import {sourcesData} from './components/common/data/sources';
import {categoriesData} from './components/common/data/categories';
import {itemsData} from './components/common/data/items';
import SourceManager from './components/source/source-manager/source-manager';
import CategoryManager from './components/category/category-manager/category-manager';
import ItemManager from './components/item/item-manager/item-manager';



export default angular.module('app', [
    uiRouter,
    'ui.bootstrap',

    sources.name,

    SourceManager.name,
    CategoryManager.name,
    ItemManager.name
])

.config(($stateProvider, $urlRouterProvider, DSProvider) => {

    $stateProvider

        .state("app", {
            abstract: true
        });

    $urlRouterProvider.otherwise("/");
    DSProvider.defaults.debug = true;

})

.run(($q, DS, SourceManager, CategoryManager, ItemManager, $rootScope) => {

    var adapter = new DSSqlAdapter({
        client: 'sqlite3', // or "pg" or "sqlite3"
        connection: {
            filename: "./database.sqlite"
        },
        debug: true
    });

    this.$q = $q;

    let sourceShema = adapter.query.schema.hasTable('source').then((exists) => {
        if (!exists) {
            console.log("SOURCE table create");
            return adapter.query.schema.createTable('source', (t) => {
                t.increments();
                t.string('source_id');
                t.string('name');
                t.string('src_id');
                t.string('status');
                t.string('url');
                t.string('created_on');
                t.string('updated_on');
            });
        }
        else {
            console.log("SOURCE table already exist");
            return this.$q.when(false);
        }
    });

    let categoryShema = adapter.query.schema.hasTable('category').then((exists) => {
        if (!exists) {
            console.log("CATEGORY table create");
            return adapter.query.schema.createTable('category', (t) => {
                t.increments();
                t.string('category_id');
                t.string('name');
                t.string('source_id');
                t.string('parent_category_id');
                t.string('src_id');
                t.string('status');
                t.string('created_on');
                t.string('updated_on');
            });
        }
        else {
            console.log("CATEGORY table already exist");
            return this.$q.when(false);
        }
    });

    let itemShema = adapter.query.schema.hasTable('item').then((exists) => {
        if (!exists) {
            console.log("ITEM table create");
            return adapter.query.schema.createTable('item', (t) => {
                t.increments();
                t.string('source_id');
                t.string('category_id');
                t.string('subcategory_id');
                t.string('title');
                t.string('body');
                t.string('author');
                t.string('url');
                t.string('status');
                t.string('src_date');
                t.string('created_on');
                t.string('updated_on');
            });
        }
        else {
            console.log("ITEM table already exist");
            return this.$q.when(false);
        }
    });

    this.$q.all([sourceShema, categoryShema, itemShema]).then(() => {
        console.log("ALL tables ready!!");

        // register adapter
        DS.registerAdapter('sql', adapter, { default: true });

        // create sample data
        SourceManager.createSampleData(sourcesData).then(() => {
            CategoryManager.createSampleData(categoriesData).then(() => {
                ItemManager.createSampleData(itemsData).then(() => {
                    // Get source list
                    console.log("DATA INSERTED");

                    SourceManager.fetch().then(() => {
                        SourceManager.createSourcesTree().then(() => {
                            $rootScope.$emit("adapter:ready");
                        });
                    });
                });
            });
        });
    });
});