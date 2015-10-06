import angular from 'angular';
import uiRouter from 'angular-ui-router';

//import details from './details/details';
import ItemManager from './../../../components/item/item-manager/item-manager';
import ItemsDirective from './items-directive';

export default angular.module('app.sources.items', [
	uiRouter,

	//details.name,
	ItemManager.name
])

.config(($stateProvider, $urlRouterProvider) => {

	$stateProvider

		.state("app.sources.items", {
			url: ":source/",
			views: {
				'itemList@': {
					template: '<items state="vm.state" state-params="vm.stateParams"></items>',
					controller: ($state, $stateParams) => {this.state = $state; this.stateParams = $stateParams;},
					controllerAs: 'vm'
				}
			}
		})

		.state("app.sources.itemsCategory", {
			url: ":source/:category/",
			views: {
				'itemList@': {
					template: '<items state="vm.state" state-params="vm.stateParams"></items>',
					controller: ($state, $stateParams) => {this.state = $state; this.stateParams = $stateParams;},
					controllerAs: 'vm'
				}
			}
		})

		.state("app.sources.itemsSubcategory", {
			url: ":source/:category/:subcategory/",
			views: {
				'itemList@': {
					template: '<items state="vm.state" state-params="vm.stateParams"></items>',
					controller: ($state, $stateParams) => {this.state = $state; this.stateParams = $stateParams;},
					controllerAs: 'vm'
				}
			}
		})
})

.directive('items', ItemsDirective);