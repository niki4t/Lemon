var gulp       	 = require('gulp'), 
	sass         = require('gulp-sass'),
	plumber 	 = require("gulp-plumber"), 
	browserSync  = require('browser-sync'), 
	concat       = require('gulp-concat'), 
	uglify       = require('gulp-uglify'), 
	minify 		 = require("gulp-csso"), 
	rename       = require('gulp-rename'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'),  
	autoprefixer = require('gulp-autoprefixer');

gulp.task('style', function() { 
	return gulp.src('source/sass/**/*.scss')
		.pipe(plumber()) 
		.pipe(sass()) 
		.pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 9', 'ie 10'], { cascade: true })) 
		.pipe(gulp.dest('source/css')) 
		.pipe(minify())
		.pipe(rename("main.min.css"))
		.pipe(gulp.dest("source/css"))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() { 
	browserSync({
		server: { 
			baseDir: 'source' 
		},
		notify: false
	});
});

gulp.task('scripts', function() {
	return gulp.src('source/in-js/*.js')
		.pipe(concat('main.js')) 
		.pipe(uglify()) 
		.pipe(gulp.dest('source/js')); 
});

gulp.task('code', function() {
	return gulp.src('source/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('clean', async function() {
	return del.sync('built'); 
});

gulp.task('images', function() {
	return gulp.src('source/img/**/*.{png,jpg,svg}') 
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true}),
			imagemin.svgo()
		]))
		.pipe(gulp.dest('built/img')); 
});

gulp.task('prebuild', async function() {

	var buildCss = gulp.src('source/css/main.min.css')
	.pipe(gulp.dest('built/css'))

	var buildFonts = gulp.src('source/fonts/**/*') 
	.pipe(gulp.dest('built/fonts'))

	var buildJs = gulp.src('source/js/**/main.js') 
	.pipe(gulp.dest('built/js'))

	var buildHtml = gulp.src('source/*.html') 
	.pipe(gulp.dest('built'));

});

gulp.task('watch', function() {
	gulp.watch('source/sass/**/*.scss', gulp.parallel('style')); 
	gulp.watch('source/*.html', gulp.parallel('code')); 
	gulp.watch('source/js/**/main.js', gulp.parallel('scripts')); 
});

gulp.task('default', gulp.parallel('code', 'style', 'scripts', 'browser-sync', 'watch'));
gulp.task('built', gulp.parallel('clean', 'images', 'prebuild', 'style', 'scripts'));