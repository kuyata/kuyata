// load packages
var gulp              = require('gulp');
var gulpAutoprefixer  = require('gulp-autoprefixer');
var gulpLess          = require('gulp-less');
var gulpMinifyCss     = require('gulp-minify-css');
var config = require('../config').less;

// browsers for which autoprefix will add prefixes
var browsers = '> 1%, last 2 versions, IE >= 8, Firefox ESR, Opera 12.1';

gulp.task('less', function(){
    // compile less files
    gulp.src(config.src)
        .pipe(gulpLess())
        .pipe(gulpMinifyCss())
        //.pipe(gulpAutoprefixer(browsers))
        .pipe(gulp.dest(config.dest));
});

//gulp.task('browserslist', function(){
//    // display browsers for which autoprefix will add prefixes
//    console.log(browserslist(browsers));
//});

//gulp.task('watch', function(){
//    gulp.watch('./**/*.less', ['less']);
//});