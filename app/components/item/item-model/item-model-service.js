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
 * {string}     category_l1     level 1 category id
 * {string}     category_l2     level 2 category id
 * {string}     category_l3     level 3 category id
 * {string}     title           item title
 * {string}     body            item body
 * {string}     author          item author
 * {string}     src_id          item id on source. For sync reasons
 * {boolean}    enabled         item status on local DB
 * {timestamp}  created_data    creation date on source
 * {timestamp}  modified_data   last modified date on source
 *
 *
 * ### for things ###
 * {string}     prize           item prize on things
 * {string}     phone           item phone on things
 * {string}     email           item email on things
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