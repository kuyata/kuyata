import angular from 'angular';
import uiRouter from 'angular-ui-router';

import itemDetails from './item-details/item-details';
import ItemManager from './../../../components/item/item-manager/item-manager';
import ItemsDirective from './items-directive';

export default angular.module('app.sources.items', [
	uiRouter,

	itemDetails.name,
	ItemManager.name
])

.config(($stateProvider, $urlRouterProvider) => {

	$stateProvider

		.state("app.sources.items", {
			url: ":source/",
			views: {
				'items@': {
					template: '<items source="{{ vm.stateParams.source }}"></items>',
					controller: function ($stateParams) {this.stateParams = $stateParams;},
					controllerAs: 'vm'
				}
			}
		})

		.state("app.sources.itemsCategory", {
			url: ":source/:category/",
			views: {
				'items@': {
					template: '<items source="{{ vm.stateParams.source }}" category="{{ vm.stateParams.category }}"></items>',
					controller: function ($stateParams) {this.stateParams = $stateParams;},
					controllerAs: 'vm'
				}
			}
		})

		.state("app.sources.itemsSubcategory", {
			url: ":source/:category/:subcategory/",
			views: {
				'items@': {
					template: '<items source="{{ vm.stateParams.source }}" category="{{ vm.stateParams.category }}" subcategory="{{ vm.stateParams.subcategory }}"></items>',
					controller: function ($stateParams) {this.stateParams = $stateParams;},
					controllerAs: 'vm'
				}
			}
		})
})

.directive('items', ItemsDirective);