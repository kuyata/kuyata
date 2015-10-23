export default class Importer {

    constructor($q, SourceManager, CategoryManager, ItemManager){

        this.url = null;
        this.$q = $q;
        this.SourceManager = SourceManager;
        this.CategoryManager = CategoryManager;
        this.ItemManager = ItemManager;
    }
}