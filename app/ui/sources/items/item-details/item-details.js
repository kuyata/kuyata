import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngSanitize from 'angular-sanitize';

import ItemManager from './../../../../components/item/item-manager/item-manager';
import ItemDetailsDirective from './item-details-directive';

export default angular.module('app.sources.items.details', [
	uiRouter,
	ngSanitize,
	ItemManager.name
])

.config(($stateProvider, $urlRouterProvider) => {

	$stateProvider

		.state("app.sources.items.details", {
			url: "details/:id/",
			views: {
				'details@': {
					template: '<itemdetails item="{{ vm.stateParams.id }}"></itemdetails>',
					controller: function ($stateParams) {this.stateParams = $stateParams;},
					controllerAs: 'vm'
				}
			}
		})

		.state("app.sources.itemsCategory.details", {
			url: "details/:id/",
			views: {
				'details@': {
					template: '<itemdetails item="{{ vm.stateParams.id }}"></itemdetails>',
					controller: function ($stateParams) {this.stateParams = $stateParams;},
					controllerAs: 'vm'
				}
			}
		})

		.state("app.sources.itemsSubcategory.details", {
			url: "details/:id/",
			views: {
				'details@': {
					template: '<itemdetails item="{{ vm.stateParams.id }}"></itemdetails>',
					controller: function ($stateParams) {this.stateParams = $stateParams;},
					controllerAs: 'vm'
				}
			}
		})
})

.directive("itemdetails", ItemDetailsDirective);