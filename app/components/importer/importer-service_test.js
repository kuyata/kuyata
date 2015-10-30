/**
 * @fileOverview
 *
 * This file contains the Importer service unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import _ from 'lodash';

import jsData from 'js-data';
import jsDataNg from 'js-data-angular';
import jsDataNgMocks from 'js-data-angular-mocks';

import utilsModule from '../utils/utils'
import sourceModelModule from '../source/source-model/source-model';
import sourceManagerModule from './../source/source-manager/source-manager';
import itemModelModule from '../item/item-model/item-model';
import itemManagerModule from './../item/item-manager/item-manager';

import importerModule from './importer';
import {ImporterFixtures} from './../common/data/importer_test_fixtures';


describe("Importer", () => {
    let rootScope, utils, Source, SourceManager, Item, ItemManager, q, Importer, DS;

    // Use to inject the code under test
    function _inject(done) {
        inject((_$rootScope_, _utils_, _Source_, _SourceManager_, _Item_, _ItemManager_, _$q_, _Importer_, _DS_) => {
            rootScope = _$rootScope_;
            utils = _utils_;
            Source = _Source_;
            SourceManager = _SourceManager_;
            Item = _Item_;
            ItemManager = _ItemManager_;
            q = _$q_;
            Importer = _Importer_;
            DS = _DS_;

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
        angular.mock.module(itemManagerModule.name),
        angular.mock.module(importerModule.name)
    });

    //Init angular data mocks
    beforeEach(() => angular.mock.module('js-data-mocks'));


    describe("importSource(meta)", () => {
        beforeEach(done => _setup(done));

        it("should create a new Source and return promise with data.code = 3", () => {
            DS.expectCreate(Source.name, ImporterFixtures.metaDated1).respond(ImporterFixtures.metaDated1);
            Importer.importSource(ImporterFixtures.metaDated1).then((sourceData) => {
                expect(sourceData.code).toEqual(3);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should return promise with data.code = 2 :: source not new and undefined last_feed_date", () => {
            SourceManager.data.collection = [ImporterFixtures.metaUndated1];
            Importer.importSource(ImporterFixtures.metaUndated1).then((sourceData) => {
                expect(sourceData.code).toEqual(2);
            });

            rootScope.$digest();
        });

        it("should update the Source and return promise with data.code = 1 :: source not new and has new last_feed_date", () => {
            let metaPrevStored = angular.copy(ImporterFixtures.metaDated1);
            metaPrevStored.id = 1;
            let metaUpdatedStored = angular.copy(ImporterFixtures.metaDated1Updated);
            metaUpdatedStored.id = 1;

            SourceManager.data.collection = [metaPrevStored];

            DS.expectUpdate(Source.name, 1, ImporterFixtures.metaDated1Updated).respond(metaUpdatedStored);

            Importer.importSource(ImporterFixtures.metaDated1Updated).then((sourceData) => {
                expect(sourceData.code).toEqual(1);
                expect(sourceData.deltaTime).toEqual(metaPrevStored.last_feed_date);
                expect(metaPrevStored.last_feed_date).toBeLessThan(metaUpdatedStored.last_feed_date);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should return promise with data.code = 0 :: source not new and has not new last_feed_date", () => {
            SourceManager.data.collection = [ImporterFixtures.metaDated1];
            Importer.importSource(ImporterFixtures.metaDated1).then((sourceData) => {
                expect(sourceData.code).toEqual(0);
            });

            rootScope.$digest();
        });

    });

    describe("importItems(meta)", () => {
        beforeEach(done => _setup(done));

        it("should create a new list of Items on a new Source and return promise with data.code = 1", () => {
            ImporterFixtures.contentDated1.forEach((item) => {
                DS.expectCreate(Item.name, item).respond(item);
            });

            SourceManager.data.collection = [ImporterFixtures.metaDated1Stored];
            SourceManager.data.tree = [ImporterFixtures.metaDated1Stored];

            Importer.importItems(ImporterFixtures.contentDated1, {code: 3, source: ImporterFixtures.metaDated1Stored}).then((itemsData) => {
                expect(itemsData.code).toEqual(1);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should check a list of one Item on a not new undated Source and return promise with data.code = 0, since item was not changed, and cached", () => {
            SourceManager.data.collection = [ImporterFixtures.metaUndated1Stored];
            SourceManager.data.tree = [ImporterFixtures.metaUndated1Stored];
            ItemManager.data.collection = [ImporterFixtures.contentUndated1[0]];

            Importer.importItems(ImporterFixtures.contentUndated1, {code: 2, source: ImporterFixtures.metaUndated1Stored}).then((itemsData) => {
                expect(itemsData.code).toEqual(0);
            });

            rootScope.$digest();
        });

        it("should check a list of one Item on a not new undated Source and return promise with data.code = 0, since item was not changed, and not cached", () => {
            DS.expectFindAll(Item.name, {
                "where": {
                    guid: {"==":ImporterFixtures.contentUndated1[0].guid}
                },
                limit: 1
            },{
                bypassCache: true
            })
                .respond(ImporterFixtures.contentUndated1);

            SourceManager.data.collection = [ImporterFixtures.metaUndated1Stored];
            SourceManager.data.tree = [ImporterFixtures.metaUndated1Stored];

            Importer.importItems(ImporterFixtures.contentUndated1, {code: 2, source: ImporterFixtures.metaUndated1Stored}).then((itemsData) => {
                expect(itemsData.code).toEqual(0);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        it("should check a list of one Item on a not new undated Source and return promise with data.code = 1, since item was changed, and cached", () => {

            let contentUpdatedStored = angular.copy(ImporterFixtures.contentUndated1Updated[0]);
            contentUpdatedStored.id = 100;

            SourceManager.data.collection = [ImporterFixtures.metaUndated1Stored];
            SourceManager.data.tree = [ImporterFixtures.metaUndated1Stored];

            let contentPrevStored = angular.copy(ImporterFixtures.contentUndated1[0]);
            contentPrevStored.id = 100;
            ItemManager.data.collection = [contentPrevStored];

            DS.expectUpdate(Item.name, 100, ImporterFixtures.contentUndated1Updated[0]).respond(contentUpdatedStored);

            Importer.importItems(ImporterFixtures.contentUndated1Updated, {code: 2, source: ImporterFixtures.metaUndated1Stored}).then((itemsData) => {
                expect(itemsData.code).toEqual(1);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        xit("should check a list of two Item on a not new undated Source and return promise with data.code = 1, since one item was added, and the other, cached", () => {

            //require force ItemManager.exists(args) return this.$q.when(false);
            SourceManager.data.collection = [ImporterFixtures.metaUndated1Stored];
            SourceManager.data.tree = [ImporterFixtures.metaUndated1Stored];

            let contentPrevStored = angular.copy(ImporterFixtures.contentUndated1Added[0]);
            contentPrevStored.id = 100;
            ItemManager.data.collection = [contentPrevStored];

            //DS.expectFindAll(Item.name, {
            //    "where": {
            //        guid: {"==":ImporterFixtures.contentUndated1Added[1].guid}
            //    },
            //    limit: 1
            //},{
            //    bypassCache: true
            //})
            //    .respond(false);

            DS.expectCreate(Item.name, ImporterFixtures.contentUndated1Added[1]).respond(ImporterFixtures.contentUndated1Added[1]);


            Importer.importItems(ImporterFixtures.contentUndated1Added, {code: 2, source: ImporterFixtures.metaUndated1Stored}).then((itemsData) => {
                expect(itemsData.code).toEqual(1);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });

        xit("should check only newer dated Items for a not new dated Source and return promise with data.code = 1", () => {
            //require force ItemManager.exists(args) return this.$q.when(false);

            //DS.expectFindAll(Item.name, {
            //    "where": {
            //        guid: {"==":ImporterFixtures.contentDated1[1].guid}
            //    },
            //    limit: 1
            //},{
            //    bypassCache: true
            //})
            //    .respond(false);
            DS.expectCreate(Item.name, ImporterFixtures.contentDated1[1]).respond(ImporterFixtures.contentDated1[1]);

            SourceManager.data.collection = [ImporterFixtures.metaDated1Stored];
            SourceManager.data.tree = [ImporterFixtures.metaDated1Stored];

            let contentPrevStored = angular.copy(ImporterFixtures.contentDated1[0]);
            contentPrevStored.id = 100;
            ItemManager.data.collection = [contentPrevStored];

            Importer.importItems(ImporterFixtures.contentDated1, {code: 1, source: ImporterFixtures.metaDated1Stored, deltaTime: ImporterFixtures.metaDated1Stored.last_feed_date}).then((itemsData) => {
                expect(itemsData.code).toEqual(1);
            });

            DS.verifyNoOutstandingExpectation();
            DS.flush();
        });
    });

    describe("makeItemChecksum(obj)", () => {

        beforeEach(done => _setup(done));

        it("should not consider differences between object bodies with childs", () => {
            let obj1 = {
                "orig_source_id": "100",
                "title": "content Dated 1.1",
                "body": "<h1>Lorem ipsum</h1> consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
                "author":"John Doe",
                "guid": "1001",
                "checksum": "",
                "url":"",
                "status": "enabled",
                "last_feed_date": 1430847150000
            };

            let obj2 = {
                "orig_source_id": "100",
                "title": "content Dated 1.1",
                "body": " consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
                "author":"John Doe",
                "guid": "1001",
                "checksum": "",
                "url":"",
                "status": "enabled",
                "last_feed_date": 1430847150000
            };

            expect(Importer.makeItemChecksum(obj1)).toEqual(Importer.makeItemChecksum(obj2));
        });
    });

    describe("responseMsg(code)", () => {

        beforeEach(done => _setup(done));

        it("should return a not empty message", () => {
            var code = -1;
            expect(Importer.responseMsg(code)).toBeTruthy();
        });
    });
});
