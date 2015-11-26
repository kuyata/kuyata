var gulp              = require('gulp');
var gulpLess          = require('gulp-less');
var gulpMinifyCss     = require('gulp-minify-css');
var config = require('../config').less;
var plugins = require('../config').plugins;

gulp.task('less', function(){
    gulp.src(config.src)
        .pipe(gulpLess())
        .pipe(gulpMinifyCss())
        .pipe(gulp.dest(config.dest));
});

gulp.task('pluginLess', function (callback) {
    plugins.forEach(function(plugin) {
        gulp.src(plugin.styles)
            .pipe(gulpLess())
            .pipe(gulpMinifyCss())
            .pipe(gulp.dest(plugin.dest));
    });
    callback();
});
