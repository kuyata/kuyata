import angular from 'angular';
import angularSpinner from 'angular-spinner';

import es from './translations/es';

import RSSImporter from './../rss-importer';
import RSSImporterDirective from './rss-importer-directive';


export default angular.module('importer.rss', [
	RSSImporter.name
])


.directive('rssimporter', RSSImporterDirective);