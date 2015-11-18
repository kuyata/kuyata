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
 * @ngInject
 */
class ExporterController {
	constructor($modal) {
		this.modal = $modal;
	}

	open (type) {
		var modalInstance = this.modal.open({
			templateUrl: 'ui/exporter/exporter-modal.html',
			controller: ExporterModalController,
			controllerAs: 'modal',
			bindToController: true,
			size: "sm",
			resolve: {
				importType: function () {
					return type;
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
	constructor($modalInstance, importType) {
		this.modalInstance = $modalInstance;
		this.type = importType;
	}

	cancel() {
		this.modalInstance.dismiss();
	}
}