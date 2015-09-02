var gulp = require('gulp');
var stubby = require('gulp-stubby-server');
var config = require('../config').stubby;

gulp.task('stubby', function(cb) {
    var options = {
        files: config.src
    };
    stubby(options, cb);
});
