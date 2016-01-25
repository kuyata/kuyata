import angular from 'angular';

import uiBootstrap from 'angular-bootstrap';
import Language from './../../components/language/language';
import LanguageDirective from './language-directive';

export default angular.module('language', [
	'ui.bootstrap',
	Language.name
])

.directive('language', LanguageDirective);
