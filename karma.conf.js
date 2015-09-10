// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

var istanbul = require('browserify-istanbul');
var es6ify = require('es6ify');

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['browserify', 'sinon', 'jasmine'],

        preprocessors: {
            'app/**/*_test.js': ['browserify']
        },

        browserify: {
            extensions: ['.js'],
            ignore: [],
            transform: [
                es6ify.configure(/^(?!.*node_modules)+.+\.js$/),
                //istanbul({ignore: ['**/app/**/*_test.js']})
            ],
            watch: true,
            debug: true,
            noParse: []
        },

        // list of files / patterns to load in the browser
        files: [
            'node_modules/es6ify/node_modules/traceur/bin/traceur-runtime.js',
            'app/**/*_test.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // Using this because of: http://stackoverflow.com/a/24893245/78718
        browserNoActivityTimeout: 100000,

        reporters: ['progress'/*, 'coverage'*/],

        coverageReporter: {
            dir: 'test/coverage/',
            reporters: [
                // TODO: bug with split
                // https://github.com/karma-runner/karma-coverage/issues/123
                {type: 'lcov'},
                {type: 'text-summary'}
            ]
        }
    });
};
