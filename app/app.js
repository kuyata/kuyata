/**
 * @fileOverview App module. This is the main entry point
 */

import angular from 'angular';
import helloworld from './components/helloworld/helloworld';

export default angular.module('app', [
    helloworld.name
])