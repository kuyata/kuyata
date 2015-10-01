/**
 * @fileOverview
 *
 * This file contains the Items model unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import _ from 'lodash';

import jsData from 'js-data';
import jsDataNg from 'js-data-angular';
import jsDataNgMocks from 'js-data-angular-mocks';

import utilsModule from '../../utils/utils'
import itemModelModule from '../item-model/item-model';
import itemManagerModule from './item-manager';
import {itemsData} from './../../common/data/items';

describe("ItemManager", () => {
    let rootScope, Item, utils, ItemManager, q, DS;

    // Use to inject the code under test
    function _inject(done) {
        inject((_utils_, _$rootScope_, _$q_, _Item_, _ItemManager_, _DS_) => {
            utils = _utils_;
            rootScope = _$rootScope_;
            q = _$q_;
            DS = _DS_;
            Item = _Item_;
            ItemManager = _ItemManager_;

            done();
        });
    }

    // Call this before each test, except where you are testing for errors
    let _setup = done => _inject(done);

    // Clean your mess
    function _tearDown() {

    }

    // Init the module before each test case
    beforeEach(() => angular.mock.module(itemManagerModule.name));

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));

    describe("findList(params)", () => {

        beforeEach(done => _setup(done));

        it("should get cached data", () => {
            ItemManager.data.list = itemsData;
            ItemManager.findList({}, false).then(() => {
                expect(ItemManager.data.list).toEqual(itemsData);
            });

            DS.verifyNoOutstandingExpectation();
        });

        it("should get data from database", () => {
            DS.expectFindAll(Item.name, {"sort":[["src_date","DESC"]], "skip": 0, "limit": ItemManager.pageLength}).respond(itemsData);
            ItemManager.findList().then(() => {
                expect(ItemManager.data.list).toEqual(itemsData);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });


    describe("findListPage(params, page)", () => {

        beforeEach(done => _setup(done));

        it("should get first find of db-items and initialize the cache. final cache [0]", () => {
            let res = itemsData.slice(0,2); // result must be pages [0]
            ItemManager.pageLength = 2;
            DS.expectFindAll(Item.name, {
                "sort":[["src_date","DESC"]],
                "skip": 0,
                "limit": ItemManager.pageLength})
                    .respond(itemsData.slice(0,2));

            ItemManager.findListPage({}).then(() => {
                expect(ItemManager.data.list).toEqual(res);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should get second page of db-items and add to cache not full. final cache [0,1]", () => {
            let res = itemsData.slice(0,4); // result must be pages [0,1]
            let pageRequested = 1;
            ItemManager.data.list = itemsData.slice(0,2);
            ItemManager.currentPage = 0;
            ItemManager.loadedPages = [0];
            ItemManager.pageLength = 2;
            DS.expectFindAll(Item.name, {
                "sort":[["src_date","DESC"]],
                "skip": pageRequested * ItemManager.pageLength,
                "limit": ItemManager.pageLength})
                    .respond(itemsData.slice(2,4));

            ItemManager.findListPage({}, pageRequested).then(() => {
                expect(ItemManager.data.list).toEqual(res);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should get one page more of db-items and add to already full cache. final cache [1,2,3]", () => {
            let res = itemsData.slice(2,8); // result must be pages [1,2,3]
            let pageRequested = 3;
            ItemManager.data.list = itemsData.slice(0,6);
            ItemManager.currentPage = 2;
            ItemManager.loadedPages = [0,1,2];
            ItemManager.pageLength = 2;
            DS.expectFindAll(Item.name, {
                "sort":[["src_date","DESC"]],
                "skip": pageRequested * ItemManager.pageLength,
                "limit": ItemManager.pageLength})
                .respond(itemsData.slice(6,8));

            ItemManager.findListPage({}, pageRequested).then(() => {
                expect(ItemManager.data.list).toEqual(res);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should get one page more of db-items and add to already full cache. final cache [3,4,1] ", () => {
            let res = itemsData.slice(6,10).concat(itemsData.slice(2,4)); // result must be pages [3,4,1]
            let pageRequested = 1;
            ItemManager.data.list = itemsData.slice(4,10);
            ItemManager.currentPage = 4;
            ItemManager.loadedPages = [2,3,4];
            ItemManager.pageLength = 2;
            DS.expectFindAll(Item.name, {
                "sort":[["src_date","DESC"]],
                "skip": pageRequested * ItemManager.pageLength,
                "limit": ItemManager.pageLength})
                .respond(itemsData.slice(2,4));

            ItemManager.findListPage({}, pageRequested).then(() => {
                expect(ItemManager.data.list).toEqual(res);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });


    describe("getItemById()", () => {

        beforeEach(done => _setup(done));

        it("should get item from cached data", () => {
            ItemManager.data.list = itemsData;
            let cachedItem = _.first(ItemManager.data.list);
            expect(ItemManager.getItemById(cachedItem.id)).toEqual(cachedItem);
        });

        it("should fail on get item from cached data", () => {
            let invalidItemId = -1;
            ItemManager.data.list = itemsData;
            expect(ItemManager.getItemById(invalidItemId)).toBeUndefined();
        });
    });
});
