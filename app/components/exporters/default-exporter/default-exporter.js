import angular from 'angular';

import DefaultExporter from './default-exporter-service.js';
import Exporter from './../../exporter/exporter.js';
import Settings from './../../../settings';

module.exports = angular.module('app.exporters.default', [
    Exporter.name,
    Settings.name
])

.service('DefaultExporter', DefaultExporter);