/**
 * @fileOverview
 *
 * This file contains the Categories model unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import _ from 'lodash';

import jsData from 'js-data';
import jsDataNg from 'js-data-angular';
import jsDataNgMocks from 'js-data-angular-mocks';

import utilsModule from '../../utils/utils'
import categoryModelModule from '../category-model/category-model';
import categoryManagerModule from './category-manager';
import {categoriesData} from './../../common/data/categories';

describe("CategoryManager", () => {
    let rootScope, Category, utils, CategoryManager, q, DS;

    // Use to inject the code under test
    function _inject(done) {
        inject((_utils_, _$rootScope_, _$q_, _Category_, _CategoryManager_, _DS_) => {
            utils = _utils_;
            rootScope = _$rootScope_;
            q = _$q_;
            DS = _DS_;
            Category = _Category_;
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
    beforeEach(() => angular.mock.module(categoryManagerModule.name));

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));

    describe("fetch()", () => {

        beforeEach(done => _setup(done));

        it("should get categories data and add to store if necesary", () => {
            DS.expectFindAll(Category.name, {sort: [['created_at', 'DESC']], status: 'enabled'}).respond(categoriesData);

            CategoryManager.fetch().then((categories) => {
                expect(categories).toEqual(categoriesData);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });

    describe("getCategoriesTree()", () => {

        beforeEach(done => _setup(done));

        it("should create a multilevel tree", () => {
            DS.expectFindAll(Category.name, {sort: [['created_at', 'DESC']], status: 'enabled'}).respond([{"id": 1,"source_id":1,"parent_category_id": null},{"id": 4,"source_id":1,"parent_category_id": 1},{"id": 6,"source_id":2,"parent_category_id": null},{"id": 2,"source_id":1,"parent_category_id": 4},{"id": 3,"source_id":2,"parent_category_id": 6}]);
            CategoryManager.data.collection = [{"id": 1,"source_id": 1,"parent_category_id": null},{"id": 4,"source_id":1,"parent_category_id": 1},{"id": 6,"source_id":2,"parent_category_id": null},{"id": 2,"source_id":1,"parent_category_id": 4},{"id": 3,"source_id":2,"parent_category_id": 6}];

            // expexted result
            let res =
            {
                1:
                    [
                        {"id":1,"source_id":1,"parent_category_id":null,"children":
                            [{"id":4,"source_id":1,"parent_category_id":1,"children":[
                                {"id":2,"source_id":1,"parent_category_id":4}]
                            }]
                        }
                    ],
                2:
                    [
                        {"id":6,"source_id":2,"parent_category_id":null,"children":
                            [{"id":3,"source_id":2,"parent_category_id":6}]
                        }
                    ]
            };

            CategoryManager.getCategoriesTree().then((tree) => {
                expect(JSON.stringify(tree)).toEqual(JSON.stringify(res));
            });


            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });
});
