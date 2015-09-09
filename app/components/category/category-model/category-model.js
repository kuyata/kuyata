/**
 * @fileOverview
 *
 * This file contains the Category model module definition
 */

import angular from 'angular';

import Utils from '../../utils/utils';
import Category from './category-model-service.js'

export default angular.module('app.models.category', [
    'js-data',

    Utils.name
])

.factory('Category', Category);