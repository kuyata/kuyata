/**
 * Exporter is a middleware between Core and Exporters.
 * Read data from Core and and send to specific-exporters who request it through specific-exporters-ui
 *
 * @class
 */
export default class Exporter {

    constructor($q, $rootScope, DS, SourceManager, CategoryManager, ItemManager){
        this.$q = $q;
        this.SourceManager = SourceManager;
        this.CategoryManager = CategoryManager;
        this.ItemManager = ItemManager;
        this.adapter;
        this.redableStream;

        $rootScope.$on("adapter:ready", () => {
            this.adapter = DS.adapters.sql;
        });

    }

    /**
     * Get a expose readable stream from adapter with requested sources data
     *
     * @param sourceIds, an array of source db ids requested
     * @returns an stream from adapter
     */
    getSourcesStream(sourceIds) {
        let readableStream = this.adapter.query.select('name', 'guid', 'url', 'last_feed_date', 'type')
            .from('source').whereIn('id', sourceIds).stream();
        return readableStream;
    }

    /**
     * Get a expose readable stream from adapter with requested items data
     *
     * @param sourceGuid, an array of source db guid requested
     * @returns an stream from adapter
     */
    getItemsStream(sourceGuid) {
        let readableStream = this.adapter.query.select('title', 'body', 'author', 'guid', 'url', 'last_feed_date')
            .from('item').whereIn('orig_source_id', sourceGuid).stream();
        return readableStream;
    }

}
