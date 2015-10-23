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
 * {number}     id              id on our local DB
 * {string}     name            source name
 * {string}     guid            source id from the source on feed. For sync reasons
 * {string}     status          source status
 * {string}     url             source url on source
 * {timedate}   last_feed_date  last source update date on feed. For sync reasons
 * {timedate}   created_at      creation date on our DB
 * {timedate}   updated_at      last modified date on our DB
 *
 */
class Source {

    constructor() {}
}