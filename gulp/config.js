var dest = "./www";
var src = './app';

module.exports = {

    less: {
        src: src + "/components/common/styles/main.less",
        watched: src + "/**/*.less",
        dest: dest + "/styles/",
        settings: {
            imagePath: '/images' // Used by the image-url helper
        }
    },

    sass: {
        src: src + "/app.scss",
        dest: dest + "/styles/",
        settings: {
            imagePath: '/images' // Used by the image-url helper
        }
    },

    browserify: {
        // Enable source maps
        debug: true,
        // Additional file extensions to make optional
        extensions: [],
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [
            {
                entries: '../../app/app.js',
                dest: dest + '/scripts/',
                outputName: 'app.js',
                runtime: true
            },
            // Add here your plugin directive entry point, if you want compile your plugin
            {
                entries: '../../app/components/importers/default-importer/ui/default-importer.js',
                dest: dest + '/scripts/importers/default-importer/',
                outputName: 'default-importer.js'
            },
            {
                entries: '../../app/components/importers/package-importer/ui/package-importer.js',
                dest: dest + '/scripts/importers/package-importer/',
                outputName: 'package-importer.js'
            },
            {
                entries: '../../app/components/importers/rss-importer/ui/rss-importer.js',
                dest: dest + '/scripts/importers/rss-importer/',
                outputName: 'rss-importer.js'
            },
            {
                entries: '../../app/components/exporters/default-exporter/ui/default-exporter.js',
                dest: dest + '/scripts/exporters/default-exporter/',
                outputName: 'default-exporter.js'
            }
        ],
        insertGlobalVars: {
            process: false
        }
    },

    markup: {
        src: [src + "/**/*.html", src + "/package.json", src + "/components/common/icons/**"],
        dest: dest
    },

    misc: {
        font: {
            src: ["./node_modules/font-awesome/fonts/**", "./node_modules/bootstrap/dist/fonts/**"],
            dest: dest + "/fonts/"
        },
        // Add here your plugin config json, if you want compile your plugin
        plugins: [
            {
                src: [src + "/components/importers/default-importer/config.json"],
                dest: dest + '/scripts/importers/default-importer/'
            },
            {
                src: [src + "/components/importers/package-importer/config.json"],
                dest: dest + '/scripts/importers/package-importer/'
            },
            {
                src: [src + "/components/importers/rss-importer/config.json"],
                dest: dest + '/scripts/importers/rss-importer/'
            },
            {
                src: [src + "/components/exporters/default-exporter/config.json"],
                dest: dest + '/scripts/exporters/default-exporter/'
            }
        ],

        distDir: dest
    },

    test: {
        karmaConf: __dirname + '/../karma.conf.js'
    },

    stubby: {
        src: ['api_mocks/*.{json,yaml,js}']
    },

    browsersync: {
        baseDir: dest
    },

    serve: {
        watchDir: './www/**/*'
    }
};
