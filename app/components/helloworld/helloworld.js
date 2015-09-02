/**
 * @fileOverview
 *
 * This file contains the Contact List component module definition
 */

import angular from 'angular';
import HelloworldDirective from './helloworld-directive'

export default angular.module('app.helloworld', [

])

.directive('helloworld', HelloworldDirective);

