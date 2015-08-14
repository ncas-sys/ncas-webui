var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),
	minifyCSS = require('gulp-minify-css'),
	clean = require('gulp-clean'),
	browserify = require('browserify'),
	gbrowserify = require('gulp-browserify'),
	concat = require('gulp-concat'),
	gutil = require('gulp-util'),
	less = require('gulp-less'),
	jade = require('gulp-jade'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	livereload = require('gulp-livereload'),
    express = require('express'),
    path = require('path'),
    app = express();
    lr = require('tiny-lr')();

gulp.task('lint', function() {
	gulp.src(['./app/src/**/*.js', '!./app/bower_components/**', '!./app/scripts/app.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
	return gulp.src('./build/*')
		.pipe(clean({force: true}));
});

gulp.task('minify-css', function() {
	var opts = {comments:true,spare:true};
	gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
		.pipe(minifyCSS(opts))
		.pipe(gulp.dest('./build/'))
});

gulp.task('copy-bower-components', function () {
	gulp.src('./app/bower_components/**')
		.pipe(gulp.dest('build/bower_components'));
});

gulp.task('copy-assets', function () {
	gulp.src('./app/assets/**')
		.pipe(gulp.dest('build/assets'));
});

gulp.task('copy-js', function () {
	gulp.src('./app/js/**')
		.pipe(gulp.dest('build/js'));
});

gulp.task('copy-html-files', function () {
	gulp.src('./app/**/*.html')
		.pipe(gulp.dest('build/'));
});

gulp.task('browserify', function() {
	gulp.src(['app/scripts/app.js'])
		.pipe(gbrowserify({
			insertGlobals: true,
			debug: true
		}))
	.pipe(concat('app.min.js'))
	.pipe(gulp.dest('./app/scripts'))
});


gulp.task('browserifyDist', function() {
  return browserify('./app/scripts/app.js')
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts'));
});



gulp.task('browserifyWatch', function () {
    
    var bundler = watchify(browserify('./app/scripts/app.js', {
    		noparse: ['jquery', 'lodash', 'q'],
			cache: {},
			packageCache: {},
			fullPaths: true,
			debug: true
		}));

		function rebundle() {
			return bundler.bundle()
				.pipe(source('app.min.js'))
				.pipe(gulp.dest('./app/scripts'))
				//.pipe(livereload());
		}
		bundler.on('update', rebundle);

		return rebundle();
});






gulp.task('less', function () {
	//gulp.src('./app/less/**/*.less', {base: "./app/less"})
	gulp.src('./app/less/app.less', {base: "./app/less"})
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(gulp.dest('./app/styles'))
});

gulp.task('templates', function() {
	gulp.src('./app/**/*.jade', {base: "./app"})
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('./app'))
});


gulp.task('express', function() {
	app.use(require('connect-livereload')({port: 4002}));
	app.use(express.static(path.resolve('./app')));
	app.listen(1333);
	gutil.log('Listening on port: 1337');
});

gulp.task('livereload', function() {
	tinylr = require('tiny-lr')();
	tinylr.listen(4002);
});

gulp.task('connectBuild', function () {
	livereload.listen();
	app.use(express.static(path.resolve('./build')));
	app.listen(1338);
	gutil.log('Serving build dir');
});

gulp.task('watch', function () {
  	gulp.watch('app/less/**/*.less',['less']);
	gulp.watch('app/**/*.jade',['templates']);
	gulp.watch('app/scripts/app.min.js', notifyLiveReload);
	gulp.watch('app/**/*.html', notifyLiveReload);
	gulp.watch('app/styles/app.css', notifyLiveReload);
});



gulp.task('default',
	[
		'livereload',
		'lint', 
		'less',
		'templates',
		'browserifyWatch',
		'express',
		'watch',
	]
);

gulp.task('build', ['clean'], function(){
	gulp.start('buildDistribution');
});
gulp.task('buildDistribution', [
	'minify-css', 
	'browserifyDist', 
	'copy-html-files', 
	'copy-bower-components', 
	'copy-assets',
	'copy-js'
]);


function notifyLiveReload(event) {
	var fileName = require('path').relative(__dirname, event.path);

	tinylr.changed({
		body: {
			files: [fileName]
		}
	});
}

