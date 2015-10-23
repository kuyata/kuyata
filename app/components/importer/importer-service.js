export default class Importer {

    constructor($q, SourceManager, CategoryManager, ItemManager){
        this.$q = $q;
        this.SourceManager = SourceManager;
        this.CategoryManager = CategoryManager;
        this.ItemManager = ItemManager;
    }

    /**
     * Method to explore ddbb and analize if follow a create or update flow
     * from a normalized feed Object
     *
     * @param url
     */
    import(feed) {

        //TODO: manage create and update flows
        //if new source
        if(!this.SourceManager.exists(feed.source)){

            let itemIds = {};

            this.SourceManager.createSource(feed.source).then((sourceId) => {
                // separate feed.categories ?? or all on a tree struct
                // if source already exists, add only new items (check date??)
                // if items are new
                itemIds.source_id = sourceId;
                this.ItemManager.createItems(feed.items, itemIds);
            }).catch((e) => {console.log(e);});

        }


    }
}