/**
 * @fileOverview
 *
 * This file contains the RSS Importer service unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import PackageImporterModule from './package-importer';

describe("PackageImporter", () => {
    let rootScope, q, PackageImporter;

    // Use to inject the code under test
    function _inject(done) {
        inject((_$rootScope_, _$q_, _PackageImporter_) => {
            rootScope = _$rootScope_;
            q = _$q_;
            PackageImporter = _PackageImporter_;

            done();
        });
    }

    // Call this before each test, except where you are testing for errors
    let _setup = done => _inject(done);

    // Clean your mess
    function _tearDown() {

    }

    // Init the module before each test case
    beforeEach(() => angular.mock.module(PackageImporterModule.name));

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));
});
