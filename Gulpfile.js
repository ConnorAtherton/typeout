var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var stylish = require('jshint-stylish');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var to5 = require("gulp-6to5");

var jsFileGlob = 'src/typeout.js';
var jadeFileGlob = 'example/*.jade';

gulp.task('js:lint', function() {
  return gulp.src(jsFileGlob)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('js:build', function() {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(jsFileGlob)
    .pipe(browserified)
    .pipe(to5())
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('./'));
});

gulp.task('jade:build', function() {
  return gulp.src(jadeFileGlob)
    .pipe(plugins.jade())
    .pipe(gulp.dest('./example/'));
});

gulp.task('watch', function() {
  gulp.watch(jsFileGlob, ['js:lint', 'js:build']);
  gulp.watch(jadeFileGlob, ['jade:build']);
});

gulp.task('default', ['js:lint', 'js:build', 'jade:build', 'watch']);