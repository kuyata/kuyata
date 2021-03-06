var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config');

gulp.task('build', function(cb) {
    runSequence('clean', ['browserify', 'less', 'markup', 'fonts', 'pluginConfigs', 'pluginLess', 'pluginMarkup'], cb);
});

gulp.task('build-release', function() {
    config.browserify.debug = false;
    gulp.start('build');
});
