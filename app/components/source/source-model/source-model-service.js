/**
 * @fileOverview
 *
 * This file contains the Source model
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
    Source.$q = $q;
    Source.utils = utils;

    return utils.defineAngularDataResource(DS, Source, {
        name: 'source'
    });
}


/**
 * @class
 *
 * Properties: as is all dynamic this is to keep track of what properties we are using within this model
 *
 * {string}     id              id on our local DB
 * {string}     name            source name
 * {string}     src_id          source id on source. For sync reasons
 * {string}     status          source status
 * {string}     url             source url on source
 * {timestamp}  created_on      creation date on our DB
 * {timestamp}  updated_on      last modified date on our DB
 *
 */
class Source {

    constructor() {}
}