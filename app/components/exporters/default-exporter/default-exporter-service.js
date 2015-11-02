/**
 * DefaultExporter
 *
 */

export default class DefaultExporter {

    constructor($q, Exporter){
        this.$q = $q;
        this.Exporter = Exporter;
        this.writableStream;
        this.sourceRefs;
    }

    /**
     * Main method to export selected sources to a file
     *
     * @param sourceRefs
     * @param sourceRefs.ids - Array of source db ids to export
     * @param sourceRefs.guid - Array of source guids to export
     * @param filename
     */
    export(sourceRefs, filename) {
        this.sourceRefs = sourceRefs;
        let sourcesStream = this.Exporter.getSourcesStream(this.sourceRefs.ids);

        let sep = '';
        let chunk;

        this.writableStream = fs.createWriteStream(filename + '.json');
        this.writableStream.write('{"sources":[');

        sourcesStream.on('readable', () => {
            while ((chunk=sourcesStream.read()) != null) {
                this.writableStream.write(sep + JSON.stringify(chunk));
                sep = ",";
            }
        });

        sourcesStream.on('end', () => {
            this.writableStream.write("]");
            this.exportItems(this.sourceRefs.guids.shift());
        });
    }

    /**
     *
     *
     * @param guid
     */
    exportItems(guid) {
        if(guid) {
            let itemsStream = this.Exporter.getItemsStream(guid);
            let sep = '';
            let chunk;

            this.writableStream.write(',"' + guid + '":[');

            itemsStream.on('readable', () => {
                while ((chunk=itemsStream.read()) != null) {
                    this.writableStream.write(sep + JSON.stringify(chunk));
                    sep = ",";
                }
            });

            itemsStream.on('end', () => {
                this.writableStream.write("]");
                this.exportItems(this.sourceRefs.guids.shift());
            });
        }

        else {
            this.writableStream.end("}");
            return;
        }
    }
};