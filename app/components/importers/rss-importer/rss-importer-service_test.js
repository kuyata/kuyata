/**
 * @fileOverview
 *
 * This file contains the RSS Importer service unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import RSSImporterModule from './rss-importer';

describe("RSSImporter", () => {
    let rootScope, q, RSSImporter;

    // Use to inject the code under test
    function _inject(done) {
        inject((_$rootScope_, _$q_, _RSSImporter_) => {
            rootScope = _$rootScope_;
            q = _$q_;
            RSSImporter = _RSSImporter_;

            done();
        });
    }

    // Call this before each test, except where you are testing for errors
    let _setup = done => _inject(done);

    // Clean your mess
    function _tearDown() {

    }

    // Init the module before each test case
    beforeEach(() => angular.mock.module(RSSImporterModule.name));

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));
});
