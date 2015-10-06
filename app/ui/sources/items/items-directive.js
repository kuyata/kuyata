/**
 * @fileOverview
 *
 * This file contains the sources directive and controller
 */


/**
 * Items directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function ItemsDirective(){
	return {
		scope: {
			source: "@",
			category: "@",
			subcategory: "@"
		},
		controllerAs: 'vm',
		controller: ItemsController,
		bindToController: true,
		templateUrl: 'ui/sources/items/items.html'
	};
}

class ItemsController {
	constructor(ItemManager, $state) {

		this.state = $state;

			if(this.subcategory) {
				ItemManager.findListPage({source: this.source, category: this.category, subcategory: this.subcategory}).then(() => {
					this.items = ItemManager.data.list;
				});
			}
			else if (this.category) {
				ItemManager.findListPage({source: this.source, category: this.category}).then(() => {
					this.items = ItemManager.data.list;
				});
			}
			else if(this.source) {
				ItemManager.findListPage({source: this.source}).then(() => {
					this.items = ItemManager.data.list;
				});
			}
	}

	gotoItemDetails(id) {
		if(this.subcategory) {
			this.state.go("app.categories.itemsSubcategory.details", {id: id});
		}
		else if(this.category) {
			this.state.go("app.categories.itemsCategory.details", {id: id});
		}
		else if(this.source) {
			this.state.go("app.categories.items.details", {id: id});
		}
	}
}