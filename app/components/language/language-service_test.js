/**
 * @fileOverview
 *
 * This file contains the Language service unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import languageModule from './language';

describe("Language", () => {
    let rootScope, q, Language;

    // Use to inject the code under test
    function _inject(done) {
        inject((_$rootScope_, _$q_, _Language_) => {
            rootScope = _$rootScope_;
            q = _$q_;
            Language = _Language_;

            done();
        });
    }

    // Call this before each test, except where you are testing for errors
    let _setup = done => _inject(done);

    // Clean your mess
    function _tearDown() {

    }

    // Init the module before each test case
    beforeEach(() => {
        angular.mock.module(languageModule.name)
    });
});
