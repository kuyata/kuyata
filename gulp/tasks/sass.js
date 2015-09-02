/**
 * Note: we are not using auto autoprefixer because ionic runs on modern browsers, but who knows.
 *
 * @type {Gulp|exports}
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var handleErrors = require('../util/handleErrors');
var config = require('../config').sass;
var minifyCss = require('gulp-minify-css');

gulp.task('sass', function (callback) {
    gulp.src(config.src)
        .pipe(sass(config.settings))
        .on('error', handleErrors)
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(config.dest))
        .on('end', callback);
});
