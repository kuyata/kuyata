/**
 * @fileOverview App module. This is the main entry point
 */


import angular from 'angular';
import uiRouter from 'angular-ui-router';
import jsData from 'js-data';

//TODO: using DSSqlAdapter on NWJS & DSLocalStorageAdapter on web (remove localstorage)
import DSSqlAdapter from 'js-data-sql';
import DSLocalStorageAdapter from 'js-data-localstorage';

import jsDataAngular from 'js-data-angular';
import uiBootstrap from 'angular-bootstrap';
import angularSpinner from 'angular-spinner';

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
    'angularSpinner',

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

.run(($q, DS, SourceManager, CategoryManager, ItemManager, $rootScope, usSpinnerService) => {

    this.$q = $q;
    let sourceShema, categoryShema, itemShema;


    //TODO: if app context is on NWJS environment (remove conditional)
    if (typeof(process) != 'undefined') {
        let adapter = new DSSqlAdapter({
            client: 'sqlite3', // or "pg" or "mysql"
            connection: {
                filename: "./database.sqlite"
            },
            debug: true
        });

        sourceShema = adapter.query.schema.hasTable('source').then((exists) => {
            if (!exists) {
                console.log("SOURCE table create");
                return adapter.query.schema.createTable('source', (t) => {
                    t.increments();
                    //t.string('source_id');
                    t.string('name');
                    t.string('src_id');
                    t.string('status');
                    t.string('url');
                    t.timestamps();
                });
            }
            else {
                console.log("SOURCE table already exist");
                return this.$q.when(false);
            }
        });

        categoryShema = adapter.query.schema.hasTable('category').then((exists) => {
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
                    t.timestamps();
                });
            }
            else {
                console.log("CATEGORY table already exist");
                return this.$q.when(false);
            }
        });

        itemShema = adapter.query.schema.hasTable('item').then((exists) => {
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
                    t.timestamp('src_date');
                    t.timestamps();
                });
            }
            else {
                console.log("ITEM table already exist");
                return this.$q.when(false);
            }
        });
    }

    //TODO: if app context is on WEB environment (remove)
    else {
        sourceShema = this.$q.when(false);
        categoryShema = this.$q.when(false);
        itemShema = this.$q.when(false);
    }


    this.$q.all([sourceShema, categoryShema, itemShema]).then(() => {
        console.log("ALL tables ready!!");

        //TODO: register adapter for NWJS (remove conditional)
        if (typeof(process) != 'undefined') {
            DS.registerAdapter('sql', adapter, { default: true });
        }
        //TODO: register adapter for WEB (remove)
        else {
            DS.registerAdapter('localstorage', new DSLocalStorageAdapter(), { default: true });
        }

        // create sample data: first reset increments
        adapter.query('sqlite_sequence').del().then(() => {
            SourceManager.createSampleData(sourcesData).then(() => {
                CategoryManager.createSampleData(categoriesData).then(() => {
                    ItemManager.createSampleData(itemsData).then(() => {
                        // Get source list
                        console.log("DATA INSERTED");

                        SourceManager.fetch().then(() => {
                            SourceManager.createSourcesTree().then(() => {
                                $rootScope.$emit("adapter:ready");
                                usSpinnerService.stop('spinner-global');
                            });
                        });
                    });
                });
            });
        });
    });
});