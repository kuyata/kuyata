/* browserify task
 ---------------
 Bundle javascripty things with browserify!

 This task is set up to generate multiple separate bundles, from
 different sources, and to use Watchify when run from the default task.

 See browserify.bundleConfigs in gulp/config.js
 */

var browserify = require('browserify');
var watchify = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var es6ify = require('es6ify');
var config = require('../config').browserify;

gulp.task('browserify', function (callback) {

    var bundleQueue = config.bundleConfigs.length;

    var browserifyThis = function (bundleConfig) {

        var bundler = browserify(es6ify.runtime, {
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: true,
            // Specify the entry point of your app
            //entries: bundleConfig.entries,
            // Add file extentions to make optional in your requires
            extensions: config.extensions,
            // Enable source maps!
            debug: false
        }).transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
          .require(require.resolve(bundleConfig.entries), { entry: true });

        var bundle = function () {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.outputName);

            return bundler
                //.add(es6ify.runtime)
                // Not es6ify files from node_modules/
                //.transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
                //.require(require.resolve(bundleConfig.entries), { entry: true })
                .bundle()
                // Report compile errors
                .on('error', handleErrors)
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
                .pipe(source(bundleConfig.outputName))
                // If not debug annotate and uglify
                .pipe(gulpif(!config.debug, buffer())) //convert from streaming to buffered vinyl file object
                .pipe(gulpif(!config.debug, ngAnnotate()))
                .pipe(gulpif(!config.debug, uglify()))
                // Specify the output destination
                .pipe(gulp.dest(bundleConfig.dest))
                .on('end', reportFinished);
        };

        if (config.isWatching) {
            // Wrap with watchify and rebundle on changes
            bundler = watchify(bundler);
            // Rebundle on update
            bundler.on('update', bundle);
        }

        var reportFinished = function () {
            // Log when bundling completes
            bundleLogger.end(bundleConfig.outputName)

            if (bundleQueue) {
                bundleQueue--;
                if (bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    config.bundleConfigs.forEach(browserifyThis);
});
