import angular from 'angular';

import uiBootstrap from 'angular-bootstrap';
import ExporterDirective from './exporter-directive';

// ui exporter list
import defaultExporter from './exporters/default-exporter/default-exporter';

export default angular.module('exporter', [
	'ui.bootstrap',
	defaultExporter.name
])

.directive('exporter', ExporterDirective);
