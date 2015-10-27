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
	constructor($modal) {
		this.modal = $modal;
	}

	open (type) {
		var modalInstance = this.modal.open({
			templateUrl: 'ui/importer/importer-modal.html',
			controller: ImporterModalController,
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

class ImporterModalController {
	constructor($modalInstance, importType) {
		this.modalInstance = $modalInstance;
		this.type = importType;
	}

	cancel() {
		this.modalInstance.dismiss();
	}
}