var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    exit = require('gulp-exit'),
    istanbul = require('gulp-istanbul');

gulp.task('pre-test', function () {
  return gulp.src(['./server/routes/**/*.js'])
  // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

/* This will run our mocha tests */
gulp.task('test:server', ['pre-test'], function(){
   return gulp.src('./server/test/*.js', {read: false})
    .pipe(mocha({reporter: 'spec'}))
     .pipe(istanbul.writeReports())
    .pipe(exit());
});
