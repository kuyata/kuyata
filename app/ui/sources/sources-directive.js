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
 */
class SourcesController {
	
	/*@ngInject*/
	constructor($q, SourceManager, ItemManager, $state, $rootScope, usSpinnerService) {
		this.$q = $q;
		this.state = $state;
		this.$rootScope = $rootScope;
		this.SourceManager = SourceManager;
		this.ItemManager = ItemManager;
		this.usSpinnerService = usSpinnerService;
		this.count = 0;
		if(SourceManager.data) {
			this.sources = SourceManager.data.collection;
		}

		$rootScope.$on("adapter:ready", () => {
			this.sources = SourceManager.data.collection;
			this.updateAllSources(this.sources);
		});

		$rootScope.$on("import:done", () => {
			if(this.count > 0) this.count--;

			if(this.count == 0) {
				this.usSpinnerService.stop('spinner-sources');
				if(this.SourceManager.getCurrentItemId()){
					this.itemListBySource(this.SourceManager.getCurrentItemId(), true);
				}
			}
		});
		$rootScope.$on("import:failed", () => {
			this.usSpinnerService.stop('spinner-sources');
		});
	}

	activeItem(sourceId) {
		this.SourceManager.CategoryManager.clearCurrentItemId();
		this.SourceManager.setCurrentItemId(sourceId);
	}

	itemListBySource(source, reload=false) {
		this.state.go("app.sources.items", {source: source}, {reload: reload});
		this.ItemManager.resetCurrentItem();
	}

	updateAllSources(sourceList) {
		if(sourceList.length > 0) {
			this.count = sourceList.length;
			this.usSpinnerService.spin('spinner-sources');

			sourceList.forEach(source => {
				this.importSourceByType(source);
			});
		}
		else {
			this.usSpinnerService.stop('spinner-sources');
		}
	}

	updateSource(source, ev) {
		if(this.count == 0) {
			this.count++;
			this.importSourceByType(source);
		}
		ev.stopPropagation();
	}

	importSourceByType(source){
		this.$rootScope.$emit("import:type:" + source.type, source);
	}

	deleteSource(source, ev) {
		if(this.count == 0) {
			this.count++;
			this.SourceManager.deleteSource(source).then(() => {
				this.count--;
			});
		}
		ev.stopPropagation();
	}
}
