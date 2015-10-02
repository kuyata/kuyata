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

    describe("findList()", () => {

        beforeEach(done => _setup(done));

        it("should get cached data", () => {
            CategoryManager.data.list = categoriesData;
            CategoryManager.findList().then(() => {
                expect(CategoryManager.data.list).toEqual(categoriesData);
            });

            DS.verifyNoOutstandingExpectation();

        });

        it("should get data from database", () => {
            DS.expectFindAll(Category.name, {}).respond(categoriesData);

            CategoryManager.findList().then(() => {
                expect(CategoryManager.data.list).toEqual(categoriesData);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });

    describe("createCategoriesTree()", () => {

        beforeEach(done => _setup(done));

        it("should create a multilevel tree", () => {
            CategoryManager.data.list = [{"id": "1","source": "1","parent_category": null},{"id": "4","source": "1","parent_category": "1"},{"id": "6","source": "2","parent_category": null},{"id": "2","source": "1","parent_category": "4"},{"id": "3","source": "2","parent_category": "6"}];

            // expexted result
            let res =
            {
                "1":
                    [
                        {"id":"1","source":"1","parent_category":null,"children":
                            [{"id":"4","source":"1","parent_category":"1","children":[
                                {"id":"2","source":"1","parent_category":"4"}]
                            }]
                        }
                    ],
                "2":
                    [
                        {"id":"6","source":"2","parent_category":null,"children":
                            [{"id":"3","source":"2","parent_category":"6"}]
                        }
                    ]
            };

            CategoryManager.createCategoriesTree();

            expect(JSON.stringify(CategoryManager.data.tree)).toEqual(JSON.stringify(res));
        });
    });


    describe("getCategoryById(id)", () => {

        beforeEach(done => _setup(done));

        it("should get category item by id", () => {
            CategoryManager.data.list = categoriesData;

            // expexted result
            let res = {
                "id": "10",
                "name": "Internet",
                "source": "1",
                "parent_category": "1",
                "src_id": "",
                "status": "",
                "created_on": "1430847165",
                "updated_on": "1430847165"
            }

            let cat = CategoryManager.getCategoryById("10");

            expect(JSON.stringify(cat)).toEqual(JSON.stringify(res));
        });
    });
});
