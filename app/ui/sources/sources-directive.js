/**
 * @fileOverview
 *
 * This file contains the sources directive and controller
 */


/**
 * Sources directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function SourcesDirective(){
	return {
		scope: {},
		controllerAs: 'vm',
		controller: SourcesController,
		bindToController: true,
		templateUrl: 'ui/sources/sources.html'
	};
}


/**
 * Sources directive controller
 *
 * @constructor
 * @ngInject
 */
class SourcesController {
	constructor(SourceManager, ItemManager, $state, $rootScope) {
		this.state = $state;
		this.SourceManager = SourceManager;
		this.ItemManager = ItemManager;

		$rootScope.$on("adapter:ready", () => {
			this.sources = SourceManager.data.collection;
		});
	}

	activeItem(sourceId) {
		this.SourceManager.CategoryManager.clearCurrentItemId();
		this.SourceManager.setCurrentItemId(sourceId);
	}

	itemListBySource(source) {
		this.state.go("app.sources.items", {source: source});
		this.ItemManager.resetCurrentItem();
	}
}
