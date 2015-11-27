import angular from 'angular';

import DefaultImporter from './default-importer-service.js';
import Importer from './../../importer/importer.js';
import Settings from './../../../settings';

export default angular.module('app.importers.default', [
    Importer.name,
    Settings.name
])

.service('DefaultImporter', DefaultImporter);