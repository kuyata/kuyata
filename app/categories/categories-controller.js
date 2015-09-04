export default class CategoriesController {
	constructor(categories, items, $stateParams) {

		categories.getCategories()
			.then( result => {
				this.categories = result;
			});

		items.getItems()
			.then(result => {
				this.items = result;
			});

		this.getCurrentCategorySlug = categories.getCurrentCategorySlug;
	}
}



