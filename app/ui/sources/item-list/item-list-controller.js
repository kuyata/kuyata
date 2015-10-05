export default class ItemListController {

	constructor(items, $filter, $stateParams, $state) {
		this.$stateParams = $stateParams;
		this.$state = $state;

		items.getItems()
			.then(result => {
				this.items = result;

				//TODO: to ad-model
				if($stateParams.subcat2) {
					this.items = $filter('filter')(this.items, {subcat2: this.$stateParams.subcat2});
				}
				else if ($stateParams.subcat1) {
					this.items = $filter('filter')(this.items, {subcat1: this.$stateParams.subcat1});
				}
				else if($stateParams.category) {
					this.items = $filter('filter')(this.items, {category: this.$stateParams.category});
				}
			});
	}

	gotoItemDetails (id) {
		if(this.$stateParams.subcat2) {
			this.$state.go("app.categories.itemListSubcat2.details", {id: id});
		}
		else if(this.$stateParams.subcat1) {
			this.$state.go("app.categories.itemListSubcat1.details", {id: id});
		}
		else if(this.$stateParams.category) {
			this.$state.go("app.categories.itemList.details", {id: id});
		}
	}
}