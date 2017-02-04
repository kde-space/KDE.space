var gulp 		 = require('gulp');
var sass		 = require('gulp-sass');
var sourcemaps	 = require('gulp-sourcemaps');
var del			 = require('del');
var rename 		 = require('gulp-rename');
var concat		 = require('gulp-concat');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var plumber		 = require('gulp-plumber');
var notify 		 = require('gulp-notify');
var imagemin 	 = require('gulp-imagemin');
var pngquant 	 = require('imagemin-pngquant');
var runSequence  = require('run-sequence');
var htmlBeautify = require('gulp-html-beautify');

var config = {
	srcDir			: 'app/src/',
	distDir			: 'app/dist/',
	srcHtml			: 'app/src/html/**/*.html',
	srcSass			: 'app/src/sass/**/*.scss',
	srcJs			: 'app/src/js/**/*.js',
	srcImg			: 'app/src/img/**',
	srcOthers       : 'app/src/_others/**'
}

/**
* エラー時に通知を出して、監視を止めない
*/
function plumberNotify() {
  return plumber({errorHandler: notify.onError("<%= error.message %>")});
}

/* sassコンパイル
*  ---------------------------------*/
gulp.task('sass', function(){
	return gulp.src([
		config.srcSass,
		'!app/src/**/sass/**/_*/'
	])
	.pipe(sourcemaps.init())
	.pipe(plumberNotify())
	.pipe(sass({
		outputStyle: 'compressed' // nested, expanded, compact, compressed
	}))
	.pipe(autoprefixer({
		browsers: ['last 3 version', 'ie >= 9', 'Android 4.0']
	}))
	.pipe(rename(function(path){
		// ディレクトリ名を変更
		var changedDirName = path.dirname.replace('sass', '');
		path.dirname = changedDirName + '/css';
	}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(config.distDir))
	.pipe(browserSync.reload({stream:true}));
});

/* htmlのコピー
*  ---------------------------------*/
gulp.task('html', function() {
	gulp.src(config.srcHtml)
	.pipe(gulp.dest(config.distDir))
	.pipe(htmlBeautify({indent_with_tabs: true,preserve_newlines: false}))
	.pipe(browserSync.reload({stream:true}));
});

/* jsのコピー
*  ---------------------------------*/
gulp.task('js', function() {
	gulp.src([
		config.srcJs,
		'!app/src/js/lib/**'
	])
	.pipe(rename(function(path){
		// ディレクトリ名を変更
		path.dirname += '/js';
	}))
	.pipe(gulp.dest(config.distDir));
});

/* imageのコピー
*  ---------------------------------*/
gulp.task('image', function(callback) {
	return gulp.src(config.srcImg)
	.pipe(imagemin({
		use: [pngquant({
				quality: 70,
				speed: 7
			})
		]
	}))
	.pipe(rename(function(path){
		if (path.dirname === 'common') {
			path.dirname = 'img/common';
		} else {
			path.dirname += '/img';
		}
	}))
	.pipe(gulp.dest(config.distDir))
	// 終了後に無駄なフォルダを削除
	.on('end', function() {
		del([config.distDir + 'img/sp']);
	});
});

/* jsの結合
*  ---------------------------------*/
gulp.task('jsConcat', function() {
	gulp.src([
		config.srcDir + 'js/lib/modernizr-custom.js',
		config.srcDir + 'js/lib/underscore-min.js',
		config.srcDir + 'js/lib/jquery-2.2.4.min.js',
		config.srcDir + 'js/lib/velocity.min.js'])
	.pipe(concat('lib.js'))
	.pipe(gulp.dest(config.distDir + 'js/lib'));
});

/* ローカルサーバー立ち上げ
*  ---------------------------------*/
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: config.distDir
		}
	});
});

/* ファイルの監視
*  ---------------------------------*/
gulp.task('watch', function() {
	gulp.watch(config.srcHtml, ['html']);
	gulp.watch(config.srcSass, ['sass']);
	gulp.watch(config.srcJs, ['js']);
	gulp.watch(config.srcImg, ['image']);
});

/* srcフォルダをdistフォルダへ全コピー
*  ---------------------------------*/
gulp.task('copy', function() {
	return gulp.src('app/src/**')
	.pipe(gulp.dest(config.distDir));
});

/* その他アイテムをdistフォルダへコピー
*  ---------------------------------*/
gulp.task('others', function() {
	return gulp.src(config.srcOthers)
	.pipe(gulp.dest(config.distDir));
});

/* distフォルダ内のsassファイルを削除
*  ---------------------------------*/
gulp.task('clean', function() {
	del([
		config.distDir + '**/sass/**'
	]);
});

/* 全コンパイル
*  ---------------------------------*/
gulp.task('build', function() {
	runSequence(
		['html', 'sass', 'js', 'jsConcat', 'image', 'others'],
		'clean'
	)
});

/* distフォルダを削除
*  ---------------------------------*/
gulp.task('cleanAll', function() {
	del([config.distDir]);
});

gulp.task('default', ['server', 'watch']);
