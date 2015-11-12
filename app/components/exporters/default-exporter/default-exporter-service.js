/**
 * DefaultExporter
 *
 */

export default class DefaultExporter {

    constructor($q, Exporter, Settings){
        this.$q = $q;
        this.Exporter = Exporter;
        this.Settings = Settings;
        this.writableStream;
        this.sourceRefs;
    }

    /**
     * Check the param and remove the supported extension substring if was included on the filename
     *
     * @param filename
     * @returns normalized filename
     */
    normalizeExtension(filename) {
        let ext = filename.slice(filename.length-(this.Settings.appExporterExt.length + 1), filename.length);
        if(ext == "." + this.Settings.appExporterExt) {
            return filename.slice(0, filename.length-(this.Settings.appExporterExt.length + 1));
        }
        return filename;
    }

    /**
     * Get, on the promise, the entire source list.
     * Mainly to be used on DefaultExporter-UI, for to list sources
     *
     * @returns a promise with the extracted source list
     */
    getSourceList() {
        let deferred = this.$q.defer();
        let sourcesStream = this.Exporter.getSourcesStream();
        let sources = [];
        let chunk;

        sourcesStream.on('error', () => {
            deferred.reject();
        });

        sourcesStream.on('readable', () => {
            while ((chunk=sourcesStream.read()) != null) {
                sources.push(chunk);
            }
        });

        sourcesStream.on('end', () => {
            deferred.resolve(sources);
        });

        return deferred.promise;
    }

    /**
     * Main method to export selected sources to a file
     *
     * @param filename
     * @param sourceRefs
     * @param sourceRefs.ids - Array of source db ids to export
     * @param sourceRefs.guid - Array of source guids to export
     * @param filename
     */
    export(sourceRefs, filename) {
        let deferred = this.$q.defer();

        this.sourceRefs = sourceRefs;
        let sourcesStream = this.Exporter.getSourcesStream(this.sourceRefs.ids);

        let sep = '';
        let chunk;
        this.itemListCounter = 0;

        this.writableStream = fs.createWriteStream(filename + "." + this.Settings.appExporterExt);

        this.writableStream.on('error', () => {
            deferred.reject();
        });
        sourcesStream.on('error', () => {
            deferred.reject();
        });

        this.writableStream.on('finish', function() {
            deferred.resolve();
        });

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

        return deferred.promise;
    }

    /**
     *
     *
     * @param guid
     */
    exportItems(guid) {
        let deferred = this.$q.defer();
        if(guid) {
            let itemsStream = this.Exporter.getItemsStream(guid);
            let sep = '';
            let chunk;

            this.writableStream.write(',"i' + this.itemListCounter + '":[');

            itemsStream.on('error', () => {
                deferred.reject();
            });

            itemsStream.on('readable', () => {
                while ((chunk=itemsStream.read()) != null) {
                    this.writableStream.write(sep + JSON.stringify(chunk));
                    sep = ",";
                }
            });

            itemsStream.on('end', () => {
                this.writableStream.write("]");
                this.itemListCounter++;
                this.exportItems(this.sourceRefs.guids.shift());
            });
        }

        else {
            this.writableStream.end("}");
            deferred.resolve();
        }

        return deferred.promise;
    }
};