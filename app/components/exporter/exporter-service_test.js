/**
 * @fileOverview
 *
 * This file contains the Exporter service unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import exporterModule from './exporter';

describe("Exporter", () => {
    let rootScope, q, Exporter;

    // Use to inject the code under test
    function _inject(done) {
        inject((_$rootScope_, _$q_, _Exporter_) => {
            rootScope = _$rootScope_;
            q = _$q_;
            Exporter = _Exporter_;

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
        angular.mock.module(exporterModule.name)
    });
});
