var gulp    = require('gulp');
var gettext = require('gulp-angular-gettext');
var config = require('../config').gettext;
var plugins = require('../config').gettext.plugins;

gulp.task('pot', function () {
    return gulp.src(config.src)
        .pipe(gettext.extract('template.pot', {
            // options to pass to angular-gettext-tools...
        }))
        .pipe(gulp.dest(config.dest.po));
});

gulp.task('translations', function () {
    return gulp.src(config.pofiles)
        .pipe(gettext.compile({
            // options to pass to angular-gettext-tools...
            //format: 'json'
        }))
        .pipe(gulp.dest(config.dest.translations));
});

gulp.task('pluginPot', function (callback) {
    plugins.forEach(function(plugin) {
        return gulp.src(plugin.src)
            .pipe(gettext.extract('template.pot', {
                // options to pass to angular-gettext-tools...
            }))
            .pipe(gulp.dest(plugin.dest.po));
    });
    callback();
});

gulp.task('pluginTranslations', function (callback) {
    plugins.forEach(function(plugin) {
        return gulp.src(plugin.pofiles)
            .pipe(gettext.compile({
                // options to pass to angular-gettext-tools...
                //format: 'json'
            }))
            .pipe(gulp.dest(plugin.dest.translations));
    });
    callback();
});