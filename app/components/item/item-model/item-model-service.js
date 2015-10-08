/**
 * @fileOverview
 *
 * This file contains the Item model
 */

import _ from 'lodash';
import Source from '../../source/source-model/source-model';
import Category from '../../category/category-model/category-model';

/**
 *
 * @param $q
 * @param DS
 * @param utils
 * @returns {*}
 * @ngInject
 *
 */
export default function factory($q, DS, utils, Source, Category){
    Item.$q = $q;
    Item.utils = utils;
    Item.Source = Source;
    Item.Category = Category;

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
 * {string}     source_id       source id on our DB
 * {string}     category_id     level 1 category id on our DB
 * {string}     subcategory_id  level 2 category id on our DB
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

    /**
     * Get Source Object for the item source
     * @returns {*}
     */
    source() {
        if(this.source_id) {
            return Item.Source.get(this.source_id)
        }
        else {
            return false;
        }
    }

    /**
     * Get Category Object for the item category
     * @returns {*}
     */
    category() {
        if(this.category_id) {
            return Item.Category.get(this.category_id)
        }
        else {
            return false;
        }
    }

    /**
     * Get Category Object for the item subcategory
     * @returns {*}
     */
    subcategory() {
        if(this.subcategory_id) {
            return Item.Category.get(this.subcategory_id)
        }
        else {
            return false;
        }
    }
}