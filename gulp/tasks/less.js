var gulp              = require('gulp');
var gulpLess          = require('gulp-less');
var gulpMinifyCss     = require('gulp-minify-css');
var config = require('../config').less;

gulp.task('less', function(){
    gulp.src(config.src)
        .pipe(gulpLess())
        .pipe(gulpMinifyCss())
        .pipe(gulp.dest(config.dest));
});