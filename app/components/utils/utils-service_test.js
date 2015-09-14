/**
 * @fileOverview
 *
 * This file contains the utils service unit tests
 */

import angular from 'angular';
import ngMocks from 'angular-mocks';

import jsData from 'js-data';
import jsDataNg from 'js-data-angular';

import Utils from './utils';

describe("Service: utils", function(){
    var utils;

    // Use to inject the code under test
    function _inject() {
        inject(function (_utils_) {
            utils = _utils_;
        });
    }

    // Call this before each test, except where you are testing for errors
    function _setup() {
        // Inject the code under test
        _inject();
    }

    // Clean your mess
    function _tearDown(){

    }

    // Init the module before each test case
    beforeEach(angular.mock.module('app.utils'));

    describe('function: defineAngularDataResource()', function () {
        var DS;
        beforeEach(() => {
            angular.mock.module('js-data');
            inject(function (_DS_) {
                DS = _DS_;
            })

        });
        beforeEach(_setup);
        afterEach(_tearDown);

        it('should return a angular-data resource with a class name', function ()  {
            expect(utils.defineAngularDataResource(DS, TestResource, {name: 'test'}).class).toBe('Test');
        });

        it('should have the class method we added', function ()  {
            expect(utils.defineAngularDataResource(DS, TestResource, {name: 'test'}).classMethod).toBeDefined();
        });

        it('should have the instance method we added', function ()  {
            var Resource = utils.defineAngularDataResource(DS, TestResource, {name: 'test'}),
                instance = Resource.createInstance({foo: 'bar'});

            expect(instance.instanceMethod).toBeDefined();
        });

        it('should bind the right context to instance methods', function ()  {
            var Resource = utils.defineAngularDataResource(DS, TestResource, {name: 'test'}),
                instance = Resource.createInstance({foo: 'bar'});

            expect(instance.instanceMethod()).toBe('BAR');

        });
    });

});

class TestResource {
    static classMethod(){}

    instanceMethod(){
        return this.foo.toUpperCase();
    }
}
