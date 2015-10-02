/**
 * @fileOverview
 *
 * This file contains the Item model module definition
 */

import angular from 'angular';

import Utils from '../../utils/utils';
import Item from './item-model-service.js';
import Source from '../../source/source-model/source-model';
import Category from '../../category/category-model/category-model';

export default angular.module('app.models.item', [
    'js-data',

    Utils.name,
    Source.name,
    Category.name
])

.factory('Item', Item);