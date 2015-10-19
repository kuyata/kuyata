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
import DSLocalStorageAdapter from 'js-data-localstorage';
import jsDataAngular from 'js-data-angular';
import uiBootstrap from 'angular-bootstrap';

import sources from './ui/sources/sources'

export default angular.module('app', [
    uiRouter,
    'ui.bootstrap',

    sources.name
])

.config(($stateProvider, $urlRouterProvider) => {

    $stateProvider

        .state("app", {
            abstract: true
        });

    $urlRouterProvider.otherwise("/");

})

.run((DS) => {

    DS.registerAdapter('localstorage', new DSLocalStorageAdapter(), { default: true });

});