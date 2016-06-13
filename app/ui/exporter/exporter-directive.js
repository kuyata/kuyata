/**
 * @fileOverview
 *
 * This file contains the sources directive and controller
 */


/**
 * Exporter directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function ExporterDirective(){
	return {
		scope: {},
		controllerAs: 'vm',
		controller: ExporterController,
		bindToController: true,
		templateUrl: 'ui/exporter/exporter.html'
	};
}


/**
 * Exporter directive controller
 *
 * @constructor
 */
class ExporterController {
	
	/*@ngInject*/
	constructor(Exporter, $modal) {
		this.modal = $modal;
		this.exporters = Exporter.getExporters();
	}

	open (exporter) {
		var modalInstance = this.modal.open({
			templateUrl: 'ui/exporter/exporter-modal.html',
			controller: ExporterModalController,
			controllerAs: 'modal',
			bindToController: true,
			size: "sm",
			resolve: {
				exporter: function () {
					return exporter;
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

class ExporterModalController {
	
	/*@ngInject*/
	constructor($modalInstance, exporter) {
		this.modalInstance = $modalInstance;
		this.exporter = exporter;
		this.templateSrc =
			"scripts/" +
			this.exporter.base + "s/" +
			this.exporter.name + "/" +
			this.exporter.ui.path +
			this.exporter.ui.template;
	}

	cancel() {
		this.modalInstance.dismiss();
	}
}