var gulp = require('gulp');
var karma = require('karma').server;
var config = require('../config').test;

/**
 * Run test once and exit
 */
gulp.task('unit-test', function (done) {
    karma.start({
        configFile: config.karmaConf,
        singleRun: true,
        autoWatch: false
    }, function () {
        done();
    });
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    karma.start({
        configFile: config.karmaConf,
        singleRun: false,
        autoWatch: true
    }, function () {
        done();
    });
});

gulp.task('test', ['unit-test']);
