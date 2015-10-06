/**
 * @fileOverview
 *
 * This file contains the sources directive and controller
 */

import {itemsData} from './../../../components/common/data/items';

/**
 * Items directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function ItemsDirective(){
	return {
		scope: {
			state: "@",
			stateParams: "@"
		},
		controllerAs: 'vm',
		controller: ItemsController,
		bindToController: true,
		templateUrl: 'ui/sources/items/items.html'
	};
}


class ItemsController {
	constructor(ItemManager, $filter) {

		ItemManager.createSampleData(itemsData).then(() => {
			if(this.stateParams.subcategory) {
				ItemManager.findListPage({source: this.stateParams.source, category: this.stateParams.subcategory}).then(() => {
					this.items = ItemManager.data.list;
				});
			}
			else if (this.stateParams.category) {
				ItemManager.findListPage({source: this.stateParams.source, category: this.stateParams.category}).then(() => {
					this.items = ItemManager.data.list;
				});
			}
			else if(this.stateParams.source) {
				ItemManager.findListPage({source: this.stateParams.source}).then(() => {
					this.items = ItemManager.data.list;
				});
			}
		});
	}

	gotoItemDetails(id) {
		if(this.stateParams.subcategory) {
			this.state.go("app.categories.itemsSubcategory.details", {id: id});
		}
		else if(this.stateParams.category) {
			this.state.go("app.categories.itemsCategory.details", {id: id});
		}
		else if(this.stateParams.source) {
			this.state.go("app.categories.items.details", {id: id});
		}
	}
}