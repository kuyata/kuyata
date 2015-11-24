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

import sources from './ui/sources/sources';

import {sourcesData} from './components/common/data/sources';
import {categoriesData} from './components/common/data/categories';
import {itemsData} from './components/common/data/items';
import {feedsRssData} from './components/common/data/feeds_rss';

import Importer from './components/importer/importer';
import Exporter from './components/exporter/exporter';

import SourceManager from './components/source/source-manager/source-manager';
import CategoryManager from './components/category/category-manager/category-manager';
import ItemManager from './components/item/item-manager/item-manager';


var appModules = [
    uiRouter,
    'ui.bootstrap',
    'angularSpinner',

    sources.name,

    Importer.name,
    Exporter.name,
    SourceManager.name,
    CategoryManager.name,
    ItemManager.name
];

window.pluginConfigs.forEach(plugin => {
    appModules.push(plugin.ui.module);
});

export default angular.module('app', appModules)

.config(($stateProvider, $urlRouterProvider, DSProvider) => {

    $stateProvider

        .state("app", {
            abstract: true
        });

    $urlRouterProvider.otherwise("/");
    DSProvider.defaults.debug = true;

})

.run(($q, DS, Importer, Exporter, SourceManager, CategoryManager, ItemManager, $rootScope) => {

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
                    t.string('name');
                    t.string('guid');
                    t.string('checksum');
                    t.string('status');
                    t.string('url');
                    t.timestamp('last_feed_date');
                    t.string('type');
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
                    t.string('name');
                    t.integer('source_id');
                    t.integer('parent_category_id');
                    t.string('guid');
                    t.string('checksum');
                    t.string('status');
                    t.timestamp('last_feed_date');
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
                    t.integer('source_id');
                    t.integer('category_id');
                    t.integer('subcategory_id');
                    t.string('title');
                    t.string('body');
                    t.string('author');
                    t.string('guid');
                    t.string('orig_source_id');
                    t.string('orig_category_id');
                    t.string('orig_subcategory_id');
                    t.string('checksum');
                    t.string('status');
                    t.string('url');
                    t.timestamp('last_feed_date');
                    t.timestamps();
                });
            }
            else {
                console.log("ITEM table already exist");
                return this.$q.when(false);
            }
        });
    }

    // TODO: create indexes from knex

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
            //SourceManager.createSampleData(sourcesData).then(() => {
            //    CategoryManager.createSampleData(categoriesData).then(() => {
            //        ItemManager.createSampleData(itemsData).then(() => {
                        // Get source list
                        //SourceManager.fetch().then(() => {
                        //    SourceManager.createSourcesTree().then(() => {
                        //        $rootScope.$emit("adapter:ready");
                        //    });
                        //});

            //SourceManager.clearAdapter().then(() => {
            //    let importPromises = [];
            //    console.log("## import example data");

                // TODO: initial sources and categories fetch for populate collections and tree

                //feedsRssData.forEach((feed) => {
                //    importPromises.push(Importer.import(feed.meta, feed.content));
                //});

                //this.$q.all(importPromises).then(() => {
                //    console.log("## data inserted");

                    SourceManager.createSourcesTree().then(() => {
                        $rootScope.$emit("adapter:ready");

                    });
                //});
            //});

            //        });
            //    });
            //});
        });
    });
});