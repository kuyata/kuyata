import angular from 'angular';

import Importer from './importer-service.js';

import SourceManager from '../source/source-manager/source-manager.js'
import CategoryManager from '../category/category-manager/category-manager.js'
import ItemManager from '../item/item-manager/item-manager.js'

export default angular.module('app.importer', [
    SourceManager.name,
    CategoryManager.name,
    ItemManager.name
])

.service('Importer', Importer);