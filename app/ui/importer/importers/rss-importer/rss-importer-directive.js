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
		templateUrl: 'ui/importer/importers/rss-importer/rss-importer.html'
	};
}

class RSSImporterController {
	constructor(RSSImporter, usSpinnerService) {
		this.RSSImporter = RSSImporter;
		this.usSpinnerService = usSpinnerService;
		this.state = 0;
	}

	importRSS(url) {
		this.state = 0;
		this.usSpinnerService.spin('spinner-global');
		this.RSSImporter.import(url).then((response) => {
			this.usSpinnerService.stop('spinner-global');
			this.state = 1;
		}).catch((err) => {
			this.usSpinnerService.stop('spinner-global');
			this.state = 2;
		});
	}

}