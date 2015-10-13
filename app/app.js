/**
 * @fileOverview App module. This is the main entry point
 */

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