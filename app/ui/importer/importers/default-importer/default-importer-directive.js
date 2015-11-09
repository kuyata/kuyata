/**
 * @fileOverview
 *
 * This file contains the DefaultImporter directive and controller
 */


/**
 * Default directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function DefaultImporterDirective(){
	return {
		scope: {
			modali: "@"
		},
		controllerAs: 'vm',
		controller: DefaultImporterController,
		bindToController: true,
		templateUrl: 'ui/importer/importers/default-importer/default-importer.html'
	};
}

class DefaultImporterController {
	constructor(DefaultImporter, usSpinnerService) {
		this.DefaultImporter = DefaultImporter;
		this.usSpinnerService = usSpinnerService;
		this.state = 0;
		this.msg = "";
		this.sourceList = [];
		this.file = "file2.daf";
		this.getSourceList(this.file);
	}

	getSourceList(file) {
		this.usSpinnerService.spin('spinner-global');
		this.DefaultImporter.getSourceList(file).then(sourceList => {
			this.sourceList = sourceList;
			this.usSpinnerService.stop('spinner-global');
		});
	}

	importDefaults() {
		this.state = 0;
		this.msg = "";

		this.DefaultImporter.importList(this.file, this.sourceList).then((response) => {
			this.usSpinnerService.stop('spinner-global');
			this.state = 1;
			this.msg = response.msg;
			console.log(":::import code: " + response.code);
		}).catch((err) => {
			this.usSpinnerService.stop('spinner-global');
			this.state = 2;
			this.msg = "ERROR: " + err.msg;
			console.log(":::import code: " + err.code);
		});
	}
}