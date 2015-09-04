export default class ItemDetailsController {

	constructor (items, $stateParams, $state) {
		this.$stateParams = $stateParams;
		this.$state = $state;

		items.getItemById(this.$stateParams.id).then(item => {
			if(item) {
				this.itemDetailed = item;
			}
			else {
				this.returnToItemList();
			}
		});
	}

	returnToItemList () {
		this.$state.go("app.categories.itemList", {
			category: this.$stateParams.category
		});
	}
}
