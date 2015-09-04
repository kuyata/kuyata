import angular from 'angular';
import iuRouter from 'angular-ui-router';
import items from './../../../components/items/items';
import ItemDetailsController from './item-details-controller'

export default angular.module('app.categories.itemList.details', [
	iuRouter,
	items.name
])

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider

		.state("app.categories.itemList.details", {
			url: "details/:id/",
			views: {
				'itemDetails@': {
					templateUrl: 'categories/item-list/item-details/item-details.html',
					controller: 'ItemDetails as vm'
				}
			}
		})

		.state("app.categories.itemListSubcat1.details", {
			url: "details/:id/",
			views: {
				'itemDetails@': {
					templateUrl: 'categories/item-list/item-details/item-details.html',
					controller: 'ItemDetails as vm'
				}
			}
		})

		.state("app.categories.itemListSubcat2.details", {
			url: "details/:id/",
			views: {
				'itemDetails@': {
					templateUrl: 'categories/item-list/item-details/item-details.html',
					controller: 'ItemDetails as vm'
				}
			}
		})
})
.controller("ItemDetails", ItemDetailsController);
