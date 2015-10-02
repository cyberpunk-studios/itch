
var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var plumber = require('gulp-plumber');
var streamify = require('gulp-streamify');
var concat = require('gulp-concat');
var watchify = require('gulp-watchify');
var sourcemaps = require('gulp-sourcemaps');
var coffeeify = require('coffeeify');
var envify = require('envify');

var paths = {
  chrome: ['./app/chrome/main.coffee'],
  metal: ['./app/main.coffee', './app/metal/**/*.coffee'],
  scss: ['./app/style/**/*.scss']
};

/*
 * Compile and bundle chrome code with watchify
 */

var watching = false;

gulp.task('enable-watch-mode', function() {
  return watching = true;
});

gulp.task('chrome', watchify(function(watchify) {
  return gulp.src(paths.chrome).pipe(plumber()).pipe(watchify({
    watch: watching,
    extensions: ['.coffee', '.js'],
    setup: function(bundle) {
      bundle.transform(coffeeify);
      return bundle.transform(envify);
    }
  })).pipe(streamify(concat('bundle.js'))).pipe(gulp.dest('./app/chrome/'));
}));


/*
 * Compile metal code in-place with coffee-script
 */

gulp.task('metal', function() {
  return gulp.src(paths.metal, {
    base: './app/'
  }).pipe(plumber())
		.pipe(sourcemaps.init())
    .pipe(coffee().on('error', function(e) {
			return gutil.log("Coffeescript error: \n\n" + e.filename + ":" + e.location.first_line + ":" + e.location.first_column + "\n" + e.message);
  })).pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./app/'));
});


/*
 * Compile css with sass
 */

gulp.task('scss', function() {
  return gulp.src('./app/style/main.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/style'));
});


/*
 * Watch all code changes and recompile on-demand
 */

gulp.task('watch', ['enable-watch-mode'], function() {
  gulp.watch(paths.metal, ['metal']);
  gulp.watch(paths.scss, ['scss']);
  return gulp.start('chrome');
});

gulp.task('all', ['metal', 'chrome', 'scss']);

gulp.task('default', ['all']);

