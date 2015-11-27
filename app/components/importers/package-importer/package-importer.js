import angular from 'angular';

import PackageImporter from './package-importer-service.js';
import Importer from './../../importer/importer.js';

export default angular.module('app.importers.package', [
    Importer.name
])

.service('PackageImporter', PackageImporter);