var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');

gulp.task('_nw', function () {

    var nw = new NwBuilder({
        version: '0.12.3',
        files: files,
        macIcns: './www/icon.icns',
        macPlist: {mac_bundle_id: 'myPkg'},
        //platforms: ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64'],
        //macZip: true,
        platforms: ['osx64'],
        buildDir: './releases',
        buildType: 'versioned'
    });

    // Log stuff you want
    nw.on('log', function (msg) {
        gutil.log('nw-builder', msg);
    });

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().catch(function (err) {
        gutil.log('nw-builder', err);
    });
});

gulp.task('nw', function(cb) {
    runSequence('build', ['_nw'], cb);
});

gulp.task('nw-release', function(cb) {
    runSequence('build-release', ['_nw'], cb);
});

// This is basically knex and its dependencies
// TODO: Fix the knex mess
var files = [
    './www/**',

    './node_modules/ansi-regex/**',
    './node_modules/ansi-styles/**',
    './node_modules/balanced-match/**',
    './node_modules/bluebird/**',
    './node_modules/brace-expansion/**',
    './node_modules/chalk/**',
    './node_modules/commander/**',
    './node_modules/concat-map/**',
    './node_modules/core-util-is/**',
    './node_modules/debug/**',
    './node_modules/double-ended-queue/**',
    './node_modules/escape-string-regexp/**',
    './node_modules/extend/**',
    './node_modules/findup-sync/**',
    './node_modules/flagged-respawn/**',
    './node_modules/glob/**',
    './node_modules/graceful-readlink/**',
    './node_modules/has-ansi/**',
    './node_modules/hashmap/**',
    './node_modules/inflight/**',
    './node_modules/inherits/**',
    './node_modules/interpret/**',
    './node_modules/isarray/**',
    './node_modules/knex/**',
    './node_modules/liftoff/**',
    './node_modules/lodash/**',
    './node_modules/minimatch/**',
    './node_modules/minimist/**',
    './node_modules/mkdirp/**',
    './node_modules/ms/**',
    './node_modules/once/**',
    './node_modules/path-is-absolute/**',
    './node_modules/pg-connection-string/**',
    './node_modules/pool2/**',
    './node_modules/readable-stream/**',
    './node_modules/rechoir/**',
    './node_modules/resolve/**',
    './node_modules/simple-backoff/**',
    './node_modules/sqlite3/**',
    './node_modules/string_decoder/**',
    './node_modules/strip-ansi/**',
    './node_modules/supports-color/**',
    './node_modules/tildify/**',
    './node_modules/user-home/**',
    './node_modules/v8flags/**',
    './node_modules/wrappy/**'
];