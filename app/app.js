/**
 * @fileOverview App module. This is the main entry point
 */


/* DATABASE CREATE */
var db = new sqlite3.Database('database.sqlite');
db.serialize(function() {
    db.run("CREATE TABLE source (id TEXT, name TEXT, src_id TEXT, status TEXT, url TEXT, created_on TEXT, updated_on TEXT)");
    db.run("CREATE TABLE category (id TEXT, name TEXT, source_id TEXT, parent_category_id TEXT, src_id TEXT, status TEXT, created_on TEXT, updated_on TEXT)");
    db.run("CREATE TABLE item (source_id TEXT, category_id TEXT, subcategory_id TEXT, title TEXT, body TEXT, author TEXT, url TEXT, status TEXT, src_date TEXT, created_on TEXT, updated_on TEXT)");
});
db.close();


import angular from 'angular';
import uiRouter from 'angular-ui-router';
import jsData from 'js-data';
import DSSqlAdapter from 'js-data-sql';
import jsDataAngular from 'js-data-angular';
import uiBootstrap from 'angular-bootstrap';

import sources from './ui/sources/sources';

export default angular.module('app', [
    uiRouter,
    'ui.bootstrap',

    sources.name
])

.config(($stateProvider, $urlRouterProvider, DSProvider) => {

    $stateProvider

        .state("app", {
            abstract: true
        });

    $urlRouterProvider.otherwise("/");
    DSProvider.defaults.debug = true;

})

.run((DS) => {

    var adapter = new DSSqlAdapter({
        client: 'sqlite3', // or "pg" or "sqlite3"
        connection: {
            filename: "./database.sqlite"
        },
        debug: true
    });


    adapter.query.schema.hasTable('source').then(function (exists) {
        if (!exists) {
            return query.schema.createTable('source', function (t) {
                t.string('id');
                t.string('name');
                t.string('src_id');
                t.string('status');
                t.string('url');
                t.string('created_on');
                t.string('updated_on');
            });
        }
    });

        adapter.query.schema.hasTable('source').then(function (exists) {
            if (!exists) {
                return query.schema.createTable('source', function (t) {
                    t.string('id');
                    t.string('name');
                    t.string('source_id');
                    t.string('parent_category_id');
                    t.string('src_id');
                    t.string('status');
                    t.string('created_on');
                    t.string('updated_on');
                });
            }
        });

        adapter.query.schema.hasTable('source').then(function (exists) {
            if (!exists) {
                return query.schema.createTable('source', function (t) {
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
        });

    DS.registerAdapter('sql', adapter, { default: true });
});