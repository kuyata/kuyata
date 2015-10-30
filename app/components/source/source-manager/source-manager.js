/**
 * @fileOverview
 *
 * This file contains the Source manager module definition
 */

import angular from 'angular';

import Source from '../source-model/source-model.js';
import SourceManager from './source-manager-service.js'
import CategoryManager from '../../category/category-manager/category-manager.js'
import ItemManager from '../../item/item-manager/item-manager.js'

module.exports = angular.module('app.managers.source', [
    Source.name,
    CategoryManager.name,
    ItemManager.name
])

.service('SourceManager', SourceManager);
