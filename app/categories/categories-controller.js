export default class CategoriesController {
	constructor(categories, items) {

		categories.getCategories()
			.then( result => {
				this.categories = result;
			});

		items.getItems()
			.then(result => {
				this.items = result;
			});
	}
}
