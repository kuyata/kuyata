/**
 * @fileOverview
 *
 * This file contains the utils module definition
 */

import angular from 'angular';

import Utils from './utils-service.js';

export default angular.module('app.utils', [])

.service('utils', Utils);
