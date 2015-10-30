/**
 * @fileOverview
 *
 * This file contains the sources directive and controller
 */


/**
 * Sources directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function SourcesDirective(){
	return {
		scope: {},
		controllerAs: 'vm',
		controller: SourcesController,
		bindToController: true,
		templateUrl: 'ui/sources/sources.html'
	};
}


/**
 * Sources directive controller
 *
 * @constructor
 * @ngInject
 */
class SourcesController {
	constructor($q, SourceManager, ItemManager, RSSImporter, PackageImporter, $state, $rootScope, usSpinnerService) {
		this.$q = $q;
		this.state = $state;
		this.SourceManager = SourceManager;
		this.ItemManager = ItemManager;
		this.RSSImporter = RSSImporter;
		this.usSpinnerService = usSpinnerService;

		$rootScope.$on("adapter:ready", () => {
			this.updateAllSources(SourceManager.data.collection).then(() => {
				this.sources = SourceManager.data.collection;
			});
		});
	}

	activeItem(sourceId) {
		this.SourceManager.CategoryManager.clearCurrentItemId();
		this.SourceManager.setCurrentItemId(sourceId);
	}

	itemListBySource(source) {
		this.state.go("app.sources.items", {source: source});
		this.ItemManager.resetCurrentItem();
	}

	updateAllSources(sourceList) {
		let promises = [];
		let deferred = this.$q.defer();

		this.usSpinnerService.spin('spinner-sources');

		sourceList.forEach(source => {
			if(source.type == 'rss') {
				promises.push(this.RSSImporter.import(source.url));
			}
			else if(source.type == 'package') {
				promises.push(this.PackageImporter.import(source));
			}
		});
		this.$q.all(promises).then(() => {
			deferred.resolve();
			this.usSpinnerService.stop('spinner-sources');
		});

		return deferred.promise;
	}
}
