import angular from 'angular';
import iuRouter from 'angular-ui-router';
import itemList from './item-list/item-list';
import categories from './../components/common/models/categories-model';
import CategoriesController from './categories-controller';

export default angular.module('app.categories', [
	iuRouter,
	itemList.name,
	categories.name
])

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider

		.state("app.categories", {
			url: "/",
			views: {
				'categories@': {
					templateUrl: 'categories/categories.html',
					controller: 'CategoriesController as vm'
				}
			}
		})
})

.controller('CategoriesController', CategoriesController);
