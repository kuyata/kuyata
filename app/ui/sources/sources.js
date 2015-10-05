import angular from 'angular';
import uiRouter from 'angular-ui-router';

//import itemList from './item-list/item-list';
import SourceManager from './../../components/source/source-manager/source-manager';
import CategoryManager from './../../components/category/category-manager/category-manager';
import SourcesDirective from './sources-directive';

export default angular.module('app.sources', [
	uiRouter,

	//itemList.name,
	SourceManager.name,
	CategoryManager.name
])

.config(($stateProvider, $urlRouterProvider) => {

	$stateProvider

		.state("app.sources", {
			url: "/",
			views: {
				'sources@': {
					template: '<sources></sources>'
				}
			}
		})
})

.directive('sources', SourcesDirective);
