/**
 * @fileOverview
 *
 * This file contains the items directive and controller
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
		this.ItemManager = ItemManager;

		if(this.subcategory) {
			ItemManager.initialPage({source: this.source, category: this.category, subcategory: this.subcategory}).then((items) => {
				this.items = items;
			});
		}
		else if (this.category) {
			ItemManager.initialPage({source: this.source, category: this.category}).then((items) => {
				this.items = items;
			});
		}
		else if(this.source) {
			ItemManager.initialPage({source: this.source}).then((items) => {
				this.items = items;
			});
		}
	}

	gotoItemDetails(id) {
		if(this.subcategory) {
			this.state.go("app.sources.itemsSubcategory.details", {id: id});
		}
		else if(this.category) {
			this.state.go("app.sources.itemsCategory.details", {id: id});
		}
		else if(this.source) {
			this.state.go("app.sources.items.details", {id: id});
		}
	}

	pageDown() {
		this.ItemManager.pageDown().then((items) => {
			if(items) {
				this.items = items;
			}
		});
	}

	pageUp() {
		this.ItemManager.pageUp().then((items) => {
			if(items) {
				this.items = items;
			}
		});
	}
}