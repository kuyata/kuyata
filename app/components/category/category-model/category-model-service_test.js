/**
 * @fileOverview
 *
 * This file contains the Category model unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';
import _ from 'lodash';

import jsData from 'js-data';
import jsDataNg from 'js-data-angular';
import jsDataNgMocks from 'js-data-angular-mocks';

import utilsModule from '../../utils/utils'
import categoryModelModule from './category-model';

describe("Category model", () => {
    let rootScope, Category, DS, utils;

    // Use to inject the code under test
    function _inject(done) {
        inject((_Category_, _DS_, _utils_, _$rootScope_) => {
            Category = _Category_;
            DS = _DS_;
            utils = _utils_;
            rootScope = _$rootScope_;

            done();
        });
    }

    // Call this before each test, except where you are testing for errors
    let _setup = done => _inject(done);

    // Clean your mess
    function _tearDown() {

    }

    // Init the module before each test case
    beforeEach(() => angular.mock.module(categoryModelModule.name));

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));

    describe("cloneDeviceCategory()", () => {

        beforeEach(done => _setup(done));

        it("should populate the category object", () => {


        });
    });
});