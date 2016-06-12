/**
 *
 * @class
 */

import _ from 'lodash';

export default class Language {

    /*@ngInject*/
    constructor($q, Settings, gettextCatalog, $window){
        this.$q = $q;
        this.Settings = Settings;
        this.gettextCatalog = gettextCatalog;
        this.$window = $window;
    }

    setLanguage(code) {
        this.gettextCatalog.setCurrentLanguage(code);
    }

    getLanguages() {
        return this.Settings.languages;
    }
}
