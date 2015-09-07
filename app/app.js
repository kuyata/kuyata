/**
 * @fileOverview App module. This is the main entry point
 */

import angular from 'angular';
import uiRouter from 'angular-ui-router';
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

});