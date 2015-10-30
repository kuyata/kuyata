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
 * {string}     guid                category id from the category on feed. For sync reasons
 * {string}     status              category status
 * {string}     checksum            to find changes on the same guid elem. For sync reasons
 * {timedate}   last_feed_date      last category update date on feed
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