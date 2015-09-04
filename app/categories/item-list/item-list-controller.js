export default class ItemListController {

	constructor(items, $stateParams, $filter, $state) {

		this.gotoItemDetails = gotoItemDetails;

		items.getItems()
			.then(result => {
				this.items = result;

				//TODO: to ad-model
				if($stateParams.subcat2) {
					this.items = $filter('filter')(this.items, {subcat2:$stateParams.subcat2});
				}

				else if ($stateParams.subcat1) {
					this.items = $filter('filter')(this.items, {subcat1:$stateParams.subcat1});
				}

				else if($stateParams.category) {
					this.items = $filter('filter')(this.items, {category:$stateParams.category});
				}

			});

		function gotoItemDetails (id) {

			if($stateParams.subcat2) {

				$state.go("app.categories.itemListSubcat2.details", {
					id: id
				})
			}

			else if($stateParams.subcat1) {

				$state.go("app.categories.itemListSubcat1.details", {
					id: id
				})
			}

			else if($stateParams.category) {

				$state.go("app.categories.itemList.details", {
					id: id
				})
			}
		}
	}

}