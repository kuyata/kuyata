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
        angular.mock.module(sourceManagerModule.name),
        angular.mock.module(categoryManagerModule.name)
    });

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));

    describe("fetch()", () => {

        beforeEach(done => _setup(done));

        it("should get data and add to store if necesary", () => {
            DS.expectFindAll(Source.name, {sort: [['created_at', 'DESC']], status: 'enabled'}).respond(sourcesData);

            SourceManager.fetch().then((sources) => {
                expect(sources).toEqual(sourcesData);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });

    xdescribe("setSourcesTree()", () => {

        beforeEach(done => _setup(done));

        it("should create the sources tree", () => {
            DS.expectFindAll(Source.name, {sort: [['created_at', 'DESC']], status: 'enabled'}).respond(sourcesData);

            SourceManager.data.collection = [{"id": 1, "name": "Source 1"},{"id": 2, "name": "Source 2"}];
            CategoryManager.data.collection = [{"id": 1,"source_id": 1,"parent_category_id": null},{"id": "4","source_id": 1,"parent_category_id": "1"},{"id": "6","source_id": 2,"parent_category_id": null},{"id": "2","source_id": 1,"parent_category_id": "4"},{"id": "3","source_id": 2,"parent_category_id": "6"}];

            // expexted result
            let res =
                [
                    {
                        "id": 1,
                        "name": "Source 1",
                        "categories": [
                            {"id":1,"source_id":1,"parent_category_id":null,"children":
                                [{"id":4,"source_id":1,"parent_category_id":1,"children":[
                                    {"id":2,"source_id":1,"parent_category_id":4}]
                                }]
                            }
                        ]

                    },
                    {
                        "id": 2,
                        "name": "Source 2",
                        "categories": [
                            {"id":6,"source_id":2,"parent_category_id":null,"children":
                                [{"id":3,"source_id":2,"parent_category_id":6}]
                            }
                        ]
                    }
                ];


            SourceManager.createSourcesTree().then(() => {
                expect(JSON.stringify(SourceManager.data.tree)).toEqual(JSON.stringify(res));
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });

    xdescribe("getCategoriesTreeBySourceId(sourceId)", () => {

        beforeEach(done => _setup(done));

        it("should get a category tree from a created tree", () => {
            SourceManager.data.tree = [
                {
                    "id": 1,
                    "name": "Source 1",
                    "categories": [
                        {"id":1,"source_id":1,"parent_category_id":null,"children":
                            [{"id":4,"source_id":1,"parent_category_id":1,"children":[
                                {"id":2,"source_id":1,"parent_category_id":4}]
                            }]
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "Source 2",
                    "categories": [
                        {"id":6,"source_id":2,"parent_category_id":null,"children":
                            [{"id":3,"source_id":2,"parent_category_id":6}]
                        }
                    ]
                }
            ];

            let res = [
                {"id":1,"source_id":1,"parent_category_id":null,"children":
                    [{"id":4,"source_id":1,"parent_category_id":1,"children":[
                        {"id":2,"source_id":1,"parent_category_id":4}]
                    }]
                }
            ];

            SourceManager.getCategoriesTreeBySourceId("1").then((categoryTree) => {
                expect(categoryTree).toEqual(res);
            });

            DS.verifyNoOutstandingExpectation();

        });

        it("should get a category tree after to create the entire tree", () => {
            DS.expectFindAll(Source.name, {sort: [['created_at', 'DESC']], status: 'enabled'}).respond(sourcesData);
            SourceManager.data.collection = [{"id": 1, "name": "Source 1"},{"id": 2, "name": "Source 2"}];
            CategoryManager.data.collection = [{"id": 1,"source_id": 1,"parent_category_id": null},{"id": 4,"source_id": 1,"parent_category_id": 1},{"id": 6,"source_id": 2,"parent_category_id": null},{"id": 2,"source_id": 1,"parent_category_id": 4},{"id": 3,"source_id": 2,"parent_category_id": 6}];

            let res = [
                {"id":1,"source_id":1,"parent_category_id":null,"children":
                    [{"id":4,"source_id":1,"parent_category_id":1,"children":[
                        {"id":2,"source_id":1,"parent_category_id":4}]
                    }]
                }
            ];

            SourceManager.getCategoriesTreeBySourceId("1").then((categoryTree) => {
                expect(categoryTree).toEqual(res);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });

    describe("exists()", () => {

        beforeEach(done => _setup(done));

        it("should find Source and return not false", () => {
            SourceManager.data.collection = [{"guid": "1", "name": "Source 1"},{"guid": "2", "name": "Source 2"}];

            let item = {"guid": "1", "name": "Source 1"};
            expect(SourceManager.exists(item)).toBeTruthy();
        });

        it("should not find Source and return false", () => {
            SourceManager.data.collection = [{"guid": "1", "name": "Source 1"},{"guid": "2", "name": "Source 2"}];

            let item = {"guid": "3", "name": "Source 3"};
            expect(SourceManager.exists(item)).toBeFalsy();
        });
    });
});




