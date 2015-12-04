import angular from 'angular';
import angularSpinner from 'angular-spinner';

import es from './translations/es';

import DefaultExporter from './../default-exporter';
import DefaultExporterDirective from './default-exporter-directive';


export default angular.module('exporter.default', [
	DefaultExporter.name,
	'gettext'
])


.directive('defaultexporter', DefaultExporterDirective);