/**
 * @fileOverview
 *
 * This file contains the Source model module definition
 */

import angular from 'angular';

import Utils from '../../utils/utils';
import Source from './source-model-service.js'

export default angular.module('app.models.source', [
    'js-data',

    Utils.name
])

.factory('Source', Source);