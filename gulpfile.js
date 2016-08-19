var gulp = require('gulp'),
	express = require('express'),
	livereload = require('gulp-livereload'),
   less = require('gulp-less'),
   sourcemaps = require('gulp-sourcemaps'),
   autoprefixer = require('gulp-autoprefixer'),
   rename = require('gulp-rename'),
   minifycss = require('gulp-minify-css');

gulp.task('default', ['html','styles','js','server','img','watch']);

gulp.task('server',function(){
	var app = express();
	app.use(express.static('./public'));
	app.listen(4000);
});

gulp.task('watch', function(){
	livereload.listen();

	gulp.watch('src/js/*.js',['js']);
	gulp.watch('src/*.html',['html']);
	gulp.watch('src/less/*.less',['styles']);
})

gulp.task('js', function(){
	return gulp.src('src/js/*.js')
	.pipe(gulp.dest('public/js'))
	.pipe(livereload());
});

gulp.task('html', function(){
	return gulp.src('src/*.html')
	.pipe(gulp.dest('public/'))
	.pipe(livereload());
});

gulp.task('img', function(){
	return gulp.src('src/img/*/*.*')
	.pipe(gulp.dest('public/img'))
	.pipe(livereload());
});

gulp.task('css', function(){
	return gulp.src('src/css/*.css')
	.pipe(gulp.dest('public/css'))
	.pipe(livereload());
});

gulp.task('styles', function() {
  return gulp.src('src/less/main.less')
    .pipe(less())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('public/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());
});