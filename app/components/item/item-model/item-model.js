/**
 * @fileOverview
 *
 * This file contains the Item model module definition
 */

import angular from 'angular';

import Utils from '../../utils/utils';
import Item from './item-model-service.js'

export default angular.module('app.models.item', [
    'js-data',

    Utils.name
])

.factory('Item', Item);