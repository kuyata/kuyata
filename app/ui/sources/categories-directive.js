/**
 * @fileOverview
 *
 * This file contains the categories directive and controller
 */


/**
 * Categories directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function CategoriesDirective(){
	return {
		scope: {
			sourceId: "@"
		},
		controllerAs: 'vm',
		controller: CategoriesController,
		bindToController: true,
		templateUrl: 'ui/sources/categories.html'
	};
}


/**
 * Categories directive controller
 *
 * @constructor
 * @ngInject
 */
class CategoriesController {
	constructor(SourceManager) {
		// Get category list filtered by source id
		SourceManager.getCategoriesTreeBySourceId(this.sourceId).then((sourceTree) => {
			this.categories = sourceTree;
		});
	}
}
