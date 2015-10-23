/**
 * @fileOverview
 *
 * This file contains the Importer service unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import importerModule from './importer';

describe("Importer", () => {
    let rootScope, q, Importer;

    // Use to inject the code under test
    function _inject(done) {
        inject((_$rootScope_, _$q_, _Importer_) => {
            rootScope = _$rootScope_;
            q = _$q_;
            Importer = _Importer_;

            done();
        });
    }

    // Call this before each test, except where you are testing for errors
    let _setup = done => _inject(done);

    // Clean your mess
    function _tearDown() {

    }

    // Init the module before each test case
    beforeEach(() => angular.mock.module(importerModule.name));

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));
});
