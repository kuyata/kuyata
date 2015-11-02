import angular from 'angular';

import Exporter from './exporter-service.js';

module.exports = angular.module('app.exporter', [])

.service('Exporter', Exporter);