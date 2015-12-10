/**
 * @fileOverview
 *
 * This file contains the RSSImporter directive and controller
 */


/**
 * RSS directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function RSSImporterDirective(){
	return {
		scope: {
			modali: "@"
		},
		controllerAs: 'vm',
		controller: RSSImporterController,
		bindToController: true,
		templateUrl: 'scripts/importers/rss-importer/ui/rss-importer.html'
	};
}

class RSSImporterController {
	constructor(RSSImporter, usSpinnerService) {
		this.RSSImporter = RSSImporter;
		this.usSpinnerService = usSpinnerService;
		this.state = 1;
		this.msg = "";
	}

	importRSS(url) {
		this.state = 0;
		this.msg = "";
		this.usSpinnerService.spin('spinner-global');
		this.RSSImporter.import(url).then((response) => {
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