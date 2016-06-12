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
		templateUrl: 'scripts/importers/default-importer/ui/default-importer.html'
	};
}

class DefaultImporterController {
	
	/*@ngInject*/
	constructor(DefaultImporter, usSpinnerService, $rootScope) {
		this.DefaultImporter = DefaultImporter;
		this.usSpinnerService = usSpinnerService;
		this.state = 1;
		this.msg = "";
		this.sourceList = [];
		this.sourceListConfirmed = [];
		this.file = "";

		let chooser = document.querySelector("#fileDialog");
		chooser.addEventListener("change", (e) => {
			this.sourceList = [];
			this.sourceListConfirmed = [];
			this.file = "";
			if(this.DefaultImporter.isValidFile(e.target.value)) {
				this.file = e.target.value;
				this.getSourceList();
			}
			$rootScope.$digest();
		}, false);
	}

	setSources(confirmed, index) {
		this.sourceListConfirmed[index] = confirmed;
	}

	getSourceList() {
		this.usSpinnerService.spin('spinner-global');
		this.DefaultImporter.getSourceList(this.file).then(sourceList => {
			this.sourceList = sourceList;
			this.usSpinnerService.stop('spinner-global');
		});

		this.sourceListConfirmed = Array(this.sourceList.length);
	}

	notConfirmedSources() {
		if(this.sourceListConfirmed.indexOf(true) == -1) {
			return true;
		}
		return false;
	}

	importDefaults() {
		this.state = 0;
		this.msg = "";
		let importList = [];

		this.usSpinnerService.spin('spinner-global');
		this.sourceList.forEach((source, i) => {
			this.sourceListConfirmed[i] ? importList.push(source) : importList.push(false);
		});
		this.DefaultImporter.importList(this.file, importList).then((response) => {
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