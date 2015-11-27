import angular from 'angular';

import uiBootstrap from 'angular-bootstrap';
import Exporter from './../../components/exporter/exporter';
import ExporterDirective from './exporter-directive';

export default angular.module('exporter', [
	'ui.bootstrap',
	Exporter.name
])

.directive('exporter', ExporterDirective);
