import angular from 'angular';
import uiRouter from 'angular-ui-router';
import itemList from './item-list/item-list';
import categories from './../components/categories/categories';
import items from './../components/items/items';
import CategoriesController from './categories-controller';

export default angular.module('app.categories', [
	uiRouter,
	itemList.name,
	categories.name,
	items.name
])

.config(($stateProvider, $urlRouterProvider) => {

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
