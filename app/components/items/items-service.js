import _ from 'lodash'
import {itemsData} from './../common/data/items';

export default class ItemsService {

	constructor($http, $q, $filter) {

		this.$http = $http;
		this.$q = $q;
		this.$filter = $filter;
		this.URLS = {
				FETCH: ''
			};
		this.items = itemsData;		//TODO: trick
	}

	getItems () {
		return (this.items) ? this.$q.when(this.items) : this.$http.get(this.URLS.FETCH).then(cacheItems);
	};

	getItemById (itemId) {
		var deferred = this.$q.defer();
		if (this.items) {
			deferred.resolve(findItem(itemId, this.items))
		} else {
			itemsModel.getItems().then(function () {
				deferred.resolve(findItem(itemId, this.items))
			})
		}
		return deferred.promise;
	};

	getItemsLengthByCategoryId (categoryId) {
		return this.items.length
	};
}

function extract(result) {
	return result.data;
}

function cacheItems(result) {
	items = extract(result);
	return items;
}

function findItem(itemId, items) {
	return _.find(items, function (item) {
		return item.id === parseInt(itemId, 10);
	})
}