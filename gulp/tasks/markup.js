var gulp = require('gulp');
var changed = require('gulp-changed');
var config = require('../config').markup;
var plugins = require('../config').plugins;

gulp.task('markup', function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.dest));
});

gulp.task('pluginMarkup', function (callback) {
    plugins.forEach(function(plugin) {
        return gulp.src(plugin.html)
            .pipe(changed(plugin.dest)) // Ignore unchanged files
            .pipe(gulp.dest(plugin.dest));
    });
    callback();
});
