import angular from 'angular';

import uiBootstrap from 'angular-bootstrap';
import Importer from './../../components/importer/importer';
import ImporterDirective from './importer-directive';

export default angular.module('importer', [
	'ui.bootstrap',
	Importer.name
])

.directive('importer', ImporterDirective);
