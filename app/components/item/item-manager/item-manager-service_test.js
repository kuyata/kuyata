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

    describe("initialPage(params)", () => {

        beforeEach(done => _setup(done));

        it("should get first page of items", () => {
            ItemManager.pageLength = 5;
            let res = _.sortByOrder(_.filter(itemsData, {source_id: "1"}), ['src_date'], [false]).slice(0,ItemManager.pageLength);

            DS.expectFindAll(Item.name, {
                "where": {
                    source_id: {"==":"1"}
                },
                "sort":[["src_date","DESC"]],
                "status": 'enabled',
                "skip": 0,
                "limit": ItemManager.pageLength})
                .respond(res);

            ItemManager.initialPage({source: "1"}).then((items) => {
                expect(items).toEqual(res);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });

    describe("pageUp()", () => {

        beforeEach(done => _setup(done));

        it("should get second page of items from the first one", () => {
            ItemManager.currentPage = 0;
            ItemManager.lastedPage = false;
            ItemManager.pageLength = 5;
            ItemManager.params = {source: "1"};

            let res = _.sortByOrder(_.filter(itemsData, {source_id: "1"}), ['src_date'], [false]).slice(ItemManager.pageLength,ItemManager.pageLength*2);

            DS.expectFindAll(Item.name, {
                "where": {
                    source_id: {"==":"1"}
                },
                "sort":[["src_date","DESC"]],
                "status": 'enabled',
                "skip": ItemManager.pageLength,
                "limit": ItemManager.pageLength})
                .respond(res);

            ItemManager.pageUp().then((items) => {
                expect(items).toEqual(res);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should get false trying to paging up on a unconfirmed lasted list", () => {
            ItemManager.currentPage = 1;
            ItemManager.lastedPage = false;
            ItemManager.pageLength = 5;
            ItemManager.params = {source: "1"};

            DS.expectFindAll(Item.name, {
                "where": {
                    source_id: {"==":"1"}
                },
                "sort":[["src_date","DESC"]],
                "status": 'enabled',
                "skip": ItemManager.pageLength*2,
                "limit": ItemManager.pageLength})
                .respond([]);

            ItemManager.pageUp().then((items) => {
                expect(items).toEqual(false);
                expect(ItemManager.lastedPage).toEqual(true);
                expect(ItemManager.currentPage).toEqual(1);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should get false trying to paging up on a confirmed lasted list", () => {
            ItemManager.currentPage = 1;
            ItemManager.lastedPage = true;
            ItemManager.pageLength = 5;
            ItemManager.params = {source: "1"};

            ItemManager.pageUp().then((items) => {
                expect(items).toEqual(false);
                expect(ItemManager.lastedPage).toEqual(true);
                expect(ItemManager.currentPage).toEqual(1);
            });

            DS.verifyNoOutstandingExpectation();
        });
    });

    describe("pageDown()", () => {

        beforeEach(done => _setup(done));

        it("should get first page of items from the second", () => {
            ItemManager.currentPage = 1;
            ItemManager.lastedPage = false;
            ItemManager.pageLength = 5;
            ItemManager.params = {source: "1"};

            let res = _.sortByOrder(_.filter(itemsData, {source_id: "1"}), ['src_date'], [false]).slice(0,ItemManager.pageLength);

            DS.expectFindAll(Item.name, {
                "where": {
                    source_id: {"==":"1"}
                },
                "sort":[["src_date","DESC"]],
                "status": 'enabled',
                "skip": 0,
                "limit": ItemManager.pageLength})
                .respond(res);

            ItemManager.pageDown().then((items) => {
                expect(items).toEqual(res);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should get the previous page from a confirmed lasted list", () => {
            ItemManager.currentPage = 1;
            ItemManager.lastedPage = true;
            ItemManager.pageLength = 5;
            ItemManager.params = {source: "1"};

            let res = _.sortByOrder(_.filter(itemsData, {source_id: "1"}), ['src_date'], [false]).slice(0,ItemManager.pageLength);

            DS.expectFindAll(Item.name, {
                "where": {
                    source_id: {"==":"1"}
                },
                "sort":[["src_date","DESC"]],
                "status": 'enabled',
                "skip": 0,
                "limit": ItemManager.pageLength})
                .respond(res);

            ItemManager.pageDown().then((items) => {
                expect(items).toEqual(res);
                expect(ItemManager.lastedPage).toEqual(false);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should get false trying to paging down on a confirmed lasted list", () => {
            ItemManager.currentPage = 0;
            ItemManager.lastedPage = false;
            ItemManager.pageLength = 5;
            ItemManager.params = {source: "1"};

            ItemManager.pageDown().then((items) => {
                expect(items).toEqual(false);
                expect(ItemManager.lastedPage).toEqual(false);
                expect(ItemManager.currentPage).toEqual(0);
            });

            DS.verifyNoOutstandingExpectation();
        });
    });
});
