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
 * {number}     id                  id on our local DB
 * {string}     name                category name
 * {number}     source_id           source id on DB
 * {number}     parent_category_id  parent category model id on local DB. 'null' for root categories
 * {string}     src_id              category id on source. For sync reasons
 * {string}     status              category status
 * {timedate}   created_at          creation date on our DB
 * {timedate}   updated_at          last modified date on our DB
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