import angular from 'angular';
import angularSpinner from 'angular-spinner';

import PackageImporter from './../package-importer';
import PackageImporterDirective from './package-importer-directive';


export default angular.module('importer.package', [
	PackageImporter.name
])


.directive('packageimporter', PackageImporterDirective);