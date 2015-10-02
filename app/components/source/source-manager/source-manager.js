/**
 * @fileOverview
 *
 * This file contains the Source manager module definition
 */

import angular from 'angular';

import Source from '../source-model/source-model.js';
import SourceManager from './source-manager-service.js'

module.exports = angular.module('app.managers.source', [
    Source.name
])

.service('SourceManager', SourceManager);
