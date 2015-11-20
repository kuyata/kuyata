import angular from 'angular';

import Exporter from './exporter-service.js';

import SourceManager from '../source/source-manager/source-manager.js'
import CategoryManager from '../category/category-manager/category-manager.js'
import ItemManager from '../item/item-manager/item-manager.js'

module.exports = angular.module('app.exporter', [
    SourceManager.name,
    CategoryManager.name,
    ItemManager.name
])

.service('Exporter', Exporter);