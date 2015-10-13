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
	constructor(SourceManager, $state) {
		this.state = $state;
		this.SourceManager = SourceManager;

		// Get category list filtered by source id
		SourceManager.getCategoriesTreeBySourceId(this.sourceId).then((sourceTree) => {
			this.categories = sourceTree;
		});
	}

	activeItem(categoryId, ev) {
		this.SourceManager.CategoryManager.setCurrentItemId(categoryId);
		ev.stopPropagation();
	}

	itemListByCategory(source, category) {
		this.state.go("app.sources.itemsCategory", {source: source, category: category});
	}

	itemListBySubcategory(source, category, subcategory) {
		this.state.go("app.sources.itemsSubcategory", {source: source, category: category, subcategory: subcategory});
	}
}
