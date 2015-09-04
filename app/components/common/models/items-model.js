import {itemsData} from './../data/items'

export default angular.module('app.models.items', [

	])
	.service('items', function ItemsService($http, $q, $filter) {
		var URLS = {
				FETCH: ''
			},
			items = itemsData,		//TODO: trick
			itemsModel = this;

		function extract(result) {
			return result.data;
		}

		function cacheItems(result) {
			items = extract(result);
			return items;
		}

		itemsModel.getItems = function () {
			return (items) ? $q.when(items) : $http.get(URLS.FETCH).then(cacheItems);
		};

		function findItem(itemId) {
			return _.find(items, function (item) {
				return item.id === parseInt(itemId, 10);
			})
		}

		itemsModel.getItemById = function (itemId) {
			var deferred = $q.defer();
			if (items) {
				deferred.resolve(findItem(itemId))
			} else {
				itemsModel.getItems().then(function () {
					deferred.resolve(findItem(itemId))
				})
			}
			return deferred.promise;
		};

		itemsModel.getItemsLengthByCategoryId = function (categoryId) {
			return items.length
		};
	})
;