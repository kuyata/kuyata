/**
 * @fileOverview
 *
 * This file contains the Default Importer service unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import DefaultImporterModule from './default-importer';

describe("DefaultImporter", () => {
    let rootScope, q, DefaultImporter;

    // Use to inject the code under test
    function _inject(done) {
        inject((_$rootScope_, _$q_, _DefaultImporter_) => {
            rootScope = _$rootScope_;
            q = _$q_;
            DefaultImporter = _DefaultImporter_;

            done();
        });
    }

    // Call this before each test, except where you are testing for errors
    let _setup = done => _inject(done);

    // Clean your mess
    function _tearDown() {

    }

    // Init the module before each test case
    beforeEach(() => angular.mock.module(DefaultImporterModule.name));

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));
});
