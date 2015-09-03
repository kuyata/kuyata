var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var config = require('../config').serve;

gulp.task('serve', function() {
    runSequence('watch', 'browser-sync', function(){
        gulp.watch(config.watchDir).on("change", browserSync.reload);
    });
});