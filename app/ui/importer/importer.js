import angular from 'angular';

import uiBootstrap from 'angular-bootstrap';
import ImporterDirective from './importer-directive';

// importer list
import rssImporter from './importers/rss-importer/rss-importer';
import packageImporter from './importers/package-importer/package-importer';

export default angular.module('importer', [
	'ui.bootstrap',
	rssImporter.name,
	packageImporter.name
])

.directive('importer', ImporterDirective);
