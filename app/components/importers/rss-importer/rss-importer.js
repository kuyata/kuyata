import angular from 'angular';

import RSSImporter from './rss-importer-service.js';
import Importer from './../../importer/importer.js';

module.exports = angular.module('app.importers.rss', [
    Importer.name
])

.service('RSSImporter', RSSImporter);