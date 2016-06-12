/**
 * Exporter is a middleware between Core and Exporters.
 * Read data from Core and and send to specific-exporters who request it through specific-exporters-ui
 *
 * @class
 */

import _ from 'lodash';

export default class Exporter {

    /*@ngInject*/
    constructor($q, $rootScope, DS, Settings, SourceManager, CategoryManager, ItemManager, $window){
        this.$q = $q;
        this.$window = $window;
        this.SourceManager = SourceManager;
        this.CategoryManager = CategoryManager;
        this.ItemManager = ItemManager;
        this.Settings = Settings;
        this.adapter;
        this.redableStream;

        $rootScope.$on("adapter:ready", () => {
            this.adapter = DS.adapters.sql;
        });

    }

    /**
     * Get a expose readable stream from adapter with requested sources data
     * 'id', 'checksum', 'created_at', 'updated_at' are omitted on the query.select
     *
     * @param sourceIds, an array of source db ids requested
     * @returns an stream from adapter
     */
    getSourcesStream(sourceIds = null) {
        let attr = ['id', 'name', 'guid', 'status', 'url', 'last_feed_date', 'type'];
        let readableStream;
        if(sourceIds) {
            readableStream = this.adapter.query.select(attr)
                .from('source').whereIn('id', sourceIds).stream();
        }
        else {
            readableStream = this.adapter.query.select(attr)
                .from('source').stream();
        }

        return readableStream;
    }

     /**
     * Get a expose readable stream from adapter with requested items data
     * 'id', 'source_id', 'category_id', 'subcategory_id', 'checksum', 'created_at', 'updated_at' are omitted on the query.select
     *
     * @param sourceGuid, an array of source db guid requested
     * @returns an stream from adapter
     */
    getItemsStream(sourceId) {
        let attr = [
            'title',
            'body',
            'author',
            'guid',
            'orig_source_id',
            'orig_category_id',
            'orig_subcategory_id',
            'url',
            'status',
            'last_feed_date'
        ];
        let readableStream = this.adapter.query.select(attr)
            .from('item').whereIn('source_id', sourceId).stream();
        return readableStream;
    }

    getExporterExt() {
        return this.Settings.appExporterExt;
    }

    /**
     * Get list of plugin exporters configs
     *
     * @returns {Array} list of exporter config objects
     */
    getExporters() {
        return _.filter(this.$window.pluginConfigs, { 'base': "exporter" });
    }
}
