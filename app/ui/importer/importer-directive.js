/**
 * @fileOverview
 *
 * This file contains the sources directive and controller
 */


/**
 * Importer directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function ImporterDirective(){
	return {
		scope: {},
		controllerAs: 'vm',
		controller: ImporterController,
		bindToController: true,
		templateUrl: 'ui/importer/importer.html'
	};
}


/**
 * Importer directive controller
 *
 * @constructor
 * @ngInject
 */
class ImporterController {
	
	/*@ngInject*/
	constructor(Importer, $modal) {
		this.modal = $modal;
		this.importers = Importer.getImporters();
	}

	open (importer) {
		var modalInstance = this.modal.open({
			templateUrl: 'ui/importer/importer-modal.html',
			controller: ImporterModalController,
			controllerAs: 'modal',
			bindToController: true,
			size: "sm",
			resolve: {
				importer: function () {
					return importer;
				}
			}
		});

		//modalInstance.result.then(function (selectedItem) {
		//	$scope.selected = selectedItem;
		//}, function () {
		//	console.log('Modal dismissed at: ' + new Date());
		//});
	}
}

class ImporterModalController {
	
	/*@ngInject*/
	constructor($modalInstance, importer) {
		this.modalInstance = $modalInstance;
		this.importer = importer;
		this.templateSrc =
			"scripts/" +
			this.importer.base + "s/" +
			this.importer.name + "/" +
			this.importer.ui.path +
			this.importer.ui.template;
	}

	cancel() {
		this.modalInstance.dismiss();
	}
}