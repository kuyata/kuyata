/**
 * @fileOverview
 *
 * This file contains the Source manager
 */

import _ from 'lodash';

/**
 * Manage everything about sources
 *
 * @class
 */
export default class SourceManager {

    constructor($q, Source){
        this.$q = $q;
        this.Source = Source;

        this.data = {list:[]};
    }

    /**
     * Getter method to retrieve data from DB or use cached data if it already exists
     * @returns {*}
     */
    findList(){

        if(_.isEmpty(this.data.list)){
            return this.Source.findAll({}).then((sources) => {
                this.data.list = sources;
                return this.data.list;
            });
        }
        else {
            return this.$q.when(this.data.list);
        }
    }

    /**
     * Get the source element by passed id
     *
     * @param id
     * @returns a source element
     */
     getSourceById(id){
        return _.find(this.data.list, item => {
            return item.id === id;
        });
     }
}