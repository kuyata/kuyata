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

    describe("findList()", () => {

        beforeEach(done => _setup(done));

        it("should get cached data", () => {
            ItemManager.data.list = itemsData;
            ItemManager.findList().then(() => {
                expect(ItemManager.data.list).toEqual(itemsData);
            });

            DS.verifyNoOutstandingExpectation();

        });

        it("should get data from database", () => {
            DS.expectFindAll(Item.name, {}).respond(itemsData);

            ItemManager.findList().then(() => {
                expect(ItemManager.data.list).toEqual(itemsData);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });

    //describe("createItems()", () => {
    //
    //    beforeEach(done => _setup(done));
    //
    //    it("should ... createItems", () => {
    //
    //        DS.expectCreate(Item.name, {"name":"Things","slug":"things"}).respond({});
    //        ItemManager.createItems();
    //        expect(true).toBe(true);
    //    });
    //});
});
