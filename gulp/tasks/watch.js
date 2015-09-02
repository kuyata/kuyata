/* Notes:
 - gulp/tasks/browserify.js handles js recompiling with watchify
 */

var gulp = require('gulp');
var config = require('../config');
var runSequence = require('run-sequence');

gulp.task('watch', function () {
    config.browserify.isWatching = true;
    runSequence('build', '_watch');
});

gulp.task('_watch', function () {
    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.markup.src, ['markup']);
});
