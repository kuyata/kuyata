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
 * {string}     url             orig source url parsed successfully, from url typed by user
 * {string}     checksum        to find changes on the same guid elem. For sync reasons
 * {timedate}   last_feed_date  last source update date on feed
 * {string}     type            type is defined by specific Importer witch it was imported with (e.g. 'rss')
 * {timedate}   created_at      creation date on our DB
 * {timedate}   updated_at      last modified date on our DB
 *
 */
class Source {

    constructor() {}
}