/**
 * @fileOverview
 *
 * This file contains the Item model
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
    Item.$q = $q;
    Item.utils = utils;

    return utils.defineAngularDataResource(DS, Item, {
        name: 'item'
    });
}


/**
 * @class
 *
 * Properties: as is all dynamic this is to keep track of what properties we are using within this model
 *
 * {string}     id              id on our local DB
 * {string}     source          source id on our DB
 * {string}     category        level 1 category id on our DB
 * {string}     subcategory     level 2 category id on our DB
 * {string}     title           item title
 * {string}     body            item body
 * {string}     author          item author
 * {string}     url             item url on source
 * {string}     status          item status
 * {date}       src_date        creation date on source
 * {timestamp}  created_on      creation date on our DB
 * {timestamp}  updated_on      last modified date on our DB
 *
 */
class Item {

    constructor() {
    }

    instanceMethod(){
        this.foo = 'bar';
        return this.foo;
    }

    static classMethod(){

    }
}