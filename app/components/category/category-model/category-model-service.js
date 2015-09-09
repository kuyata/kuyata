/**
 * @fileOverview
 *
 * This file contains the Category model
 */

import _ from 'lodash';

/**
 *
 * @param $q
 * @param DS
 * @param utils
 * @returns {*}
 * @ngInject
 *
 */
export default function factory($q, DS, utils){
    Category.$q = $q;
    Category.utils = utils;

    return utils.defineAngularDataResource(DS, Category, {
        name: 'category'
    });
}


/**
 * @class
 *
 * Properties: as is all dynamic this is to keep track of what properties we are using within this model
 *
 * {string}  id            id on our local DB
 *
 */
class Category {

    constructor() {
    }

    instanceMethod(){
        this.foo = 'bar';
        return this.foo;
    }

    static classMethod(){

    }
}