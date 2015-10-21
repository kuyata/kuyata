import angular from 'angular';

import Scout from './scout-service';

module.exports = angular.module('app.scout', [])

.service('Scout', Scout);