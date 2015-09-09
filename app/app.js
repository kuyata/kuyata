/**
 * @fileOverview App module. This is the main entry point
 */

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import jsData from 'js-data';
import DSLocalStorageAdapter from 'js-data-localstorage';
import jsDataAngular from 'js-data-angular';

import header from './header/header'
import options from './options/options'
import categories from './categories/categories'

export default angular.module('app', [
    uiRouter,
    header.name,
    options.name,
    categories.name
])

.config(($stateProvider, $urlRouterProvider) => {

    $stateProvider

        .state("app", {
            abstract: true,
            views: {
                'header@': {
                    templateUrl: 'header/header.html'
                },
                'options@': {
                    templateUrl: 'options/options.html'
                }
            }
        })

    $urlRouterProvider.otherwise("/");

})

.run((DS) => {

    DS.registerAdapter('localstorage', new DSLocalStorageAdapter(), { default: true });

});