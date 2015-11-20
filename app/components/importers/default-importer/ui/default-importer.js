import angular from 'angular';
import angularSpinner from 'angular-spinner';

import DefaultImporter from './../../../../components/importers/default-importer/default-importer';
import DefaultImporterDirective from './default-importer-directive';


export default angular.module('importer.default', [
	DefaultImporter.name
])


.directive('defaultimporter', DefaultImporterDirective);