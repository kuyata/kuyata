/**
 * @fileOverview
 *
 * This file contains the sources directive and controller
 */


/**
 * Language directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function LanguageDirective(){
	return {
		scope: {},
		controllerAs: 'vm',
		controller: LanguageController,
		bindToController: true,
		templateUrl: 'ui/language/language.html'
	};
}


/**
 * Language directive controller
 *
 * @constructor
 * @ngInject
 */
class LanguageController {
	constructor(Language) {
		this.Language = Language;
		this.languages = Language.getLanguages();
	}

	setLanguage(code) {
		this.Language.setLanguage(code);
	}
}

