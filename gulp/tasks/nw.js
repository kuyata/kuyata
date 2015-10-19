var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');

gulp.task('_nw', function () {

    var nw = new NwBuilder({
        version: '0.12.3',
        files: './www/**',
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