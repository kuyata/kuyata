import angular from 'angular';
import iuRouter from 'angular-ui-router';
import itemList from './item-list/item-list';
import categories from './../components/common/models/categories-model';
import items from './../components/common/models/items-model';
import CategoriesController from './categories-controller';

export default angular.module('app.categories', [
	iuRouter,
	itemList.name,
	categories.name,
	items.name
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
