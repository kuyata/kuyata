/**
 * @fileOverview
 *
 * This file contains the Sources model unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import _ from 'lodash';

import jsData from 'js-data';
import jsDataNg from 'js-data-angular';
import jsDataNgMocks from 'js-data-angular-mocks';

import utilsModule from '../../utils/utils'
import sourceModelModule from '../source-model/source-model';
import sourceManagerModule from './source-manager';
import categoryManagerModule from '../../category/category-manager/category-manager.js'
import {sourcesData} from './../../common/data/sources';

describe("SourceManager", () => {
    let rootScope, Source, utils, SourceManager, CategoryManager, q, DS;

    // Use to inject the code under test
    function _inject(done) {
        inject((_utils_, _$rootScope_, _$q_, _Source_, _SourceManager_, _CategoryManager_, _DS_) => {
            utils = _utils_;
            rootScope = _$rootScope_;
            q = _$q_;
            DS = _DS_;
            Source = _Source_;
            SourceManager = _SourceManager_;
            CategoryManager = _CategoryManager_;

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
        angular.mock.module(sourceManagerModule.name)
        angular.mock.module(categoryManagerModule.name)
    });

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));

    describe("findList()", () => {

        beforeEach(done => _setup(done));

        it("should get cached data", () => {
            SourceManager.data.list = sourcesData;
            SourceManager.findList().then(() => {
                expect(SourceManager.data.list).toEqual(sourcesData);
            });

            DS.verifyNoOutstandingExpectation();

        });

        it("should get data from database", () => {
            DS.expectFindAll(Source.name, {}).respond(sourcesData);

            SourceManager.findList().then(() => {
                expect(SourceManager.data.list).toEqual(sourcesData);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });

    describe("getSourceById(id)", () => {

        beforeEach(done => _setup(done));

        it("should get source item by id", () => {
            SourceManager.data.list = sourcesData;

            // expexted result
            let res = {
                "id": "2",
                "name": "Eatup",
                "src_id": "",
                "status": "",
                "url": "http://www.eatup.com",
                "created_on": "1430847165",
                "updated_on": "1430847165"
            };

            let sou = SourceManager.getSourceById("2");

            expect(JSON.stringify(sou)).toEqual(JSON.stringify(res));
        });
    });

    describe("setSourcesTree()", () => {

        beforeEach(done => _setup(done));

        it("should create the sources tree when source data is cached", () => {

            SourceManager.data.list = [{"id": "1", "name": "Source 1"},{"id": "2", "name": "Source 2"}];
            CategoryManager.data.list = [{"id": "1","source_id": "1","parent_category_id": null},{"id": "4","source_id": "1","parent_category_id": "1"},{"id": "6","source_id": "2","parent_category_id": null},{"id": "2","source_id": "1","parent_category_id": "4"},{"id": "3","source_id": "2","parent_category_id": "6"}];

            // expexted result
            let res =
                [
                    {
                        "id": "1",
                        "name": "Source 1",
                        "categories": [
                            {"id":"1","source_id":"1","parent_category_id":null,"children":
                                [{"id":"4","source_id":"1","parent_category_id":"1","children":[
                                    {"id":"2","source_id":"1","parent_category_id":"4"}]
                                }]
                            }
                        ]

                    },
                    {
                        "id": "2",
                        "name": "Source 2",
                        "categories": [
                            {"id":"6","source_id":"2","parent_category_id":null,"children":
                                [{"id":"3","source_id":"2","parent_category_id":"6"}]
                            }
                        ]
                    }
                ];


            SourceManager.createSourcesTree().then(() => {
                expect(JSON.stringify(SourceManager.data.tree)).toEqual(JSON.stringify(res));
            });

            DS.verifyNoOutstandingExpectation();
        });
    });
});




