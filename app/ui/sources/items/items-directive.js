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
	
	/*@ngInject*/
	constructor(ItemManager, $state, usSpinnerService) {

		this.state = $state;
		this.ItemManager = ItemManager;
		this.usSpinnerService = usSpinnerService;

		if(this.subcategory) {
			ItemManager.initialPage({source: this.source, category: this.category, subcategory: this.subcategory}).then((items) => {
				this.items = items;
				this.usSpinnerService.stop('spinner-list');
			});
		}
		else if (this.category) {
			ItemManager.initialPage({source: this.source, category: this.category}).then((items) => {
				this.items = items;
				this.usSpinnerService.stop('spinner-list');
			});
		}
		else if(this.source) {
			ItemManager.initialPage({source: this.source}).then((items) => {
				this.items = items;
				this.usSpinnerService.stop('spinner-list');
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
		this.usSpinnerService.spin('spinner-list');
		this.ItemManager.pageDown().then((items) => {
			if(items) {
				this.items = items;
			}
			document.getElementById("item-list-container").scrollTop = 0;
			this.usSpinnerService.stop('spinner-list');
		});
	}

	pageUp() {
		this.usSpinnerService.spin('spinner-list');
		this.ItemManager.pageUp().then((items) => {
			if(items) {
				this.items = items;
			}
			document.getElementById("item-list-container").scrollTop = 0;
			this.usSpinnerService.stop('spinner-list');
		});
	}

	plainText(text) {
		return  text ? String(text).replace(/(&#160;|&nbsp;|<([^>]+)>)/ig, '') : '';
	}
}