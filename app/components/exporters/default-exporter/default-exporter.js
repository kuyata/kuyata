import angular from 'angular';

import DefaultExporter from './default-exporter-service.js';
import Exporter from './../../exporter/exporter.js';

export default angular.module('app.exporters.default', [
    Exporter.name
])

.service('DefaultExporter', DefaultExporter);