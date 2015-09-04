import angular from 'angular';
import itemList from './item-list/item-list';
import categories from './../components/common/models/categories-model';
import CategoriesController from './categories-controller';

export default angular.module('app.categories', [
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
