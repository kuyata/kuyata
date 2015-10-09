/**
 * @fileOverview App module. This is the main entry point
 */

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import jsData from 'js-data';
import DSLocalStorageAdapter from 'js-data-localstorage';
import jsDataAngular from 'js-data-angular';
import uiBootstrap from 'angular-bootstrap';

import header from './ui/header/header'
import options from './ui/options/options'
import sources from './ui/sources/sources'

export default angular.module('app', [
    uiRouter,
    'ui.bootstrap',

    header.name,
    options.name,
    sources.name,
])

.config(($stateProvider, $urlRouterProvider) => {

    $stateProvider

        .state("app", {
            abstract: true,
            views: {
                'header@': {
                    templateUrl: 'ui/header/header.html'
                },
                'options@': {
                    templateUrl: 'ui/options/options.html'
                }
            }
        })

    $urlRouterProvider.otherwise("/");

})

.run((DS) => {

    DS.registerAdapter('localstorage', new DSLocalStorageAdapter(), { default: true });

});