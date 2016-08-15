var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var cache = require('gulp-cached');

gulp.task('sass', function () {
	sass('./sass/**/*.scss', {
		style: 'compressed',
		sourcemap: true,
		cacheLocation: '/.sass-cache'
	})
	.on('error', sass.logError)
	.pipe(cache('sass'))
	.pipe(autoprefixer(['last 3 version', 'ie >= 9', 'Android 4.0']))
	.pipe(sourcemaps.write('/maps'))
	.pipe(gulp.dest('./css'))
	.pipe(browserSync.stream());
});

gulp.task('reload', function () {
	browserSync.reload();
});

gulp.task('watch', function(){
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	gulp.watch('./sass/**/*.scss', ['sass']);
	gulp.watch(['./*.html', 'js/**/*.js'], ['reload']);
});

gulp.task('default', ['watch']);
