import _ from 'lodash'
import {categoriesData} from './../common/data/categories';

export default class CategoriesService {

	constructor ($http, $q) {

		this.$http = $http;
		this.$q = $q;

		this.URLS = {
				FETCH: ''
			};
		this.categories = categoriesData;		//TODO: trick
		this.currentCategory = '';
	}

	getCategories() {
		return (this.categories) ? this.$q.when(this.categories) : this.$http.get(this.URLS.FETCH).then(cacheCategories);
	}

	getCurrentCategory() {
		return this.currentCategory;
	}

	getCurrentCategorySlug() {
		return this.currentCategory ? this.currentCategory.slug : '';
	}

	setCurrentCategory(category) {
		this.currentCategory = category;
		return this.currentCategory;
	}

	getCategoryById(categoryId) {
		let deferred = this.$q.defer();
		if (this.categories) {
			deferred.resolve(findCategory(categoryId, this.categories))
		} else {
			this.getCategories().then( () => {
				deferred.resolve(findCategory(categoryId, this.categories))
			})
		}
		return deferred.promise;
	}
}

/**
 * private functions
 * */
function extract(result) {
	return result.data;
}

function cacheCategories(result) {
	categories = extract(result);
	return categories;
}

function findCategory(categoryId, categories) {
	return _.find(categories, category => {
		return category.id === parseInt(categoryId, 10);
	})
}