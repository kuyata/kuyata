var gulp = require('gulp');
var changed = require('gulp-changed');
var del = require('del');
var config = require('../config').misc;

gulp.task('fonts', function (callback) {
    gulp.src(config.font.src)
        .pipe(changed(config.font.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.font.dest));

    callback();
});

gulp.task('clean', function (callback) {
    del([config.distDir + '/**/*'], callback)
});
