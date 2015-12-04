import angular from 'angular';
import angularSpinner from 'angular-spinner';

import es from './translations/es';

import DefaultImporter from './../default-importer';
import DefaultImporterDirective from './default-importer-directive';


export default angular.module('importer.default', [
	DefaultImporter.name
])


.directive('defaultimporter', DefaultImporterDirective);