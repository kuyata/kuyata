/**
 * @fileOverview
 *
 * This file contains the sources directive and controller
 */

import {sourcesData} from './../../components/common/data/sources';
import {categoriesData} from './../../components/common/data/categories';
import {itemsData} from './../../components/common/data/items';

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
	constructor(SourceManager, CategoryManager, ItemManager, $state) {
		this.state = $state;
		this.SourceManager = SourceManager;

		// Create sample initial data
		SourceManager.createSampleData(sourcesData).then(() => {
			CategoryManager.createSampleData(categoriesData).then(() => {
				ItemManager.createSampleData(itemsData).then(() => {
					// Get source list

					this.sources = SourceManager.data.collection;
					SourceManager.fetch();
				});
			});
		});
	}

	activeItem(sourceId) {
		this.SourceManager.CategoryManager.clearCurrentItemId();
		this.SourceManager.setCurrentItemId(sourceId);
	}

	itemListBySource(source) {
		this.state.go("app.sources.items", {source: source});
	}
}
