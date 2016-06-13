export default class PackageImporter {

    /*@ngInject*/
    constructor($q, Importer, $rootScope){
        this.$q = $q;
        this.Importer = Importer;

        $rootScope.$on("import:type:package", (e, source) => {
            //this.import(source);
        });
    }
}