import angular from 'angular';
import iuRouter from 'angular-ui-router';
import items from './../../components/common/models/items-model'
import itemDetails from './item-details/item-details'
import ItemListController from './item-list-controller'

export default angular.module('app.categories.itemList', [
	iuRouter,
	items.name,
	itemDetails.name
])

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider

		.state("app.categories.itemList", {
			url: ":category/",
			views: {
				'itemList@': {
					templateUrl: 'categories/item-list/item-list.html',
					controller: 'ItemList as vm'
				}
			}
		})

		.state("app.categories.itemListSubcat1", {
			url: ":category/:subcat1/",
			views: {
				'itemList@': {
					templateUrl: 'categories/item-list/item-list.html',
					controller: 'ItemList as vm'
				}
			}
		})

		.state("app.categories.itemListSubcat2", {
			url: ":category/:subcat1/:subcat2/",
			views: {
				'itemList@': {
					templateUrl: 'categories/item-list/item-list.html',
					controller: 'ItemList as vm'
				}
			}
		})
})

.controller('ItemList', ItemListController);