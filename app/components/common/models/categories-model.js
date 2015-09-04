import {categoriesData} from './../data/categories'

export default angular.module('app.models.categories', [])
	.service('categories', function CategoriesService($http, $q) {

		var URLS = {
				FETCH: ''
			},
			categories = categoriesData,		//TODO: trick
			currentCategory,
			categoriesModel = this;

		function extract(result) {
			return result.data;
		}

		function cacheCategories(result) {
			categories = extract(result);
			return categories;
		}

		categoriesModel.getCategories = function () {
			return (categories) ? $q.when(categories) : $http.get(URLS.FETCH).then(cacheCategories);
		};

		categoriesModel.getCurrentCategory = function () {
			return currentCategory;
		}

		categoriesModel.getCurrentCategorySlug = function () {
			return currentCategory ? currentCategory.slug : '';
		};

		categoriesModel.setCurrentCategory = function (category) {
		  currentCategory = category;
		  return currentCategory;
		};

		function findCategory(categoryId) {
			return _.find(categories, function (category) {
				return category.id === parseInt(categoryId, 10);
			})
		}

		categoriesModel.getCategoryById = function (categoryId) {
			var deferred = $q.defer();
			if (categories) {
				deferred.resolve(findCategory(categoryId))
			} else {
				categoriesModel.getCategories().then(function () {
					deferred.resolve(findCategory(categoryId))
				})
			}
			return deferred.promise;
		};
	})
;