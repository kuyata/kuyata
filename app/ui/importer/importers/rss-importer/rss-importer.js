import angular from 'angular';

import RSSImporter from './../../../../components/importers/rss-importer/rss-importer';
import RSSImporterDirective from './rss-importer-directive';


export default angular.module('importer.rss', [
	RSSImporter.name
])


.directive('rssimporter', RSSImporterDirective);