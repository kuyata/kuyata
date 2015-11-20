/**
 * @fileOverview
 *
 * This file contains the PackageImporter directive and controller
 */


/**
 * Package directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function PackageImporterDirective(){
	return {
		scope: {},
		controllerAs: 'vm',
		controller: PackageImporterController,
		bindToController: true,
		templateUrl: 'ui/importer/importers/package-importer/package-importer.html'
	};
}

class PackageImporterController {
	constructor(PackageImporter) {
		this.PackageImporter = PackageImporter;
	}
}