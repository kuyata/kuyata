export default class ItemDetailsController {
	constructor (items, $stateParams, $state) {

		function returnToItemList () {
			$state.go("app.categories.itemList", {
				category: $stateParams.category
			})
		}

		items.getItemById($stateParams.id).then(item => {

			if(item) {
				this.itemDetailed = item;
			}
			else {
				returnToItemList();
			}
		});
	}
}
