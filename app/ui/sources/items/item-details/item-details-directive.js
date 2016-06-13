/**
 * @fileOverview
 *
 * This file contains the item details directive and controller
 */


/**
 * Items directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function ItemDetailsDirective(){
	return {
		scope: {
			item: "@"
		},
		controllerAs: 'vm',
		controller: ItemDetailsController,
		bindToController: true,
		templateUrl: 'ui/sources/items/item-details/item-details.html'
	};
}


class ItemDetailsController {
	
	/*@ngInject*/
	constructor(ItemManager, $state) {

		this.state = $state;
		this.ItemManager = ItemManager;

		this.ItemManager.Item.find(this.item).then((item) => {
			if(item) {
				this.details = item;
				this.details.source().then((source) => {
					this.details.sourceName = source.name;
				});
				this.details.category().then((category) => {
					this.details.categoryName = category.name;
				});
				this.details.subcategory().then((subcategory) => {
					this.details.subcategoryName = subcategory.name;
				});
			}
			else {
				this.returnToItemList();
			}
		});
	}

	returnToItemList () {
		this.$state.go("app.sources");
	}

	openExternal(url){
		gui.Shell.openExternal(url);
	}

	supportExternalLinks(e){
		e.preventDefault();
		console.log(e);
		if(e.target.nodeName === "A"){
			this.openExternal(e.target.href);
		}
		else if(e.toElement.parentElement.nodeName === "A") {
			this.openExternal(e.toElement.parentElement.href);
		}
	}
}
