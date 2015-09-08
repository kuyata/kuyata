import angular from 'angular';
import uiRouter from 'angular-ui-router';
import items from './../../../components/items/items';
import ItemDetailsController from './item-details-controller'

export default angular.module('app.categories.itemList.details', [
	uiRouter,
	items.name
])

.config(($stateProvider, $urlRouterProvider) => {

	$stateProvider

		.state("app.categories.itemList.details", {
			url: "details/:id/",
			views: {
				'itemDetails@': {
					templateUrl: 'categories/item-list/item-details/item-details.html',
					controller: 'ItemDetailsController as vm'
				}
			}
		})

		.state("app.categories.itemListSubcat1.details", {
			url: "details/:id/",
			views: {
				'itemDetails@': {
					templateUrl: 'categories/item-list/item-details/item-details.html',
					controller: 'ItemDetailsController as vm'
				}
			}
		})

		.state("app.categories.itemListSubcat2.details", {
			url: "details/:id/",
			views: {
				'itemDetails@': {
					templateUrl: 'categories/item-list/item-details/item-details.html',
					controller: 'ItemDetailsController as vm'
				}
			}
		})
})
.controller("ItemDetailsController", ItemDetailsController);
