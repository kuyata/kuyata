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
		let deferred = this.$q;

		return deferred ( resolve => {
				if (this.items) {
					resolve(findItem(itemId, this.items))
				} else {
					itemsModel.getItems().then(() => {
						resolve(findItem(itemId, this.items))
					})
				}
			}
		)
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
	return _.find(items, (item) => {
		return item.id === parseInt(itemId, 10);
	})
}