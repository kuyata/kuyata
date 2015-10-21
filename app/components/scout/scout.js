import angular from 'angular';

import Scout from './scout-service.js';

module.exports = angular.module('app.scout', [])

.service('Scout', Scout);