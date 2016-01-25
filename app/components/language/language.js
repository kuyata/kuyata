import angular from 'angular';

import Language from './language-service.js';

import Settings from './../../settings'

export default angular.module('app.language', [
    Settings.name,
    'gettext'
])

.service('Language', Language);