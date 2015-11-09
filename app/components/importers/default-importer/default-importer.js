import angular from 'angular';

import DefaultImporter from './default-importer-service.js';
import Importer from './../../importer/importer.js';

module.exports = angular.module('app.importers.default', [
    Importer.name
])

.service('DefaultImporter', DefaultImporter);