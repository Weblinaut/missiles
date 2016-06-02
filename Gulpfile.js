var gulp = require('gulp'),
	//sass = require('gulp-ruby-sass'),
	sass = require('gulp-sass'),
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'event-stream'],
		replaceString: /\bgulp[\-.]/
	}),
	folderSources   = {
		assetDir: './assets/',
		publicDir: './public/',
		bowerDir: './bower_components/',
		es6CompiledDir: './public/es6Compiled/'
	},
	//ES6 Stuff
	//traceur = require('gulp-traceur'),//using babel not traceur (http://weblogs.asp.net/dwahlin/getting-started-with-es6-%E2%80%93-transpiling-es6-to-es5)
	babel = require('gulp-babel'),
	plumber = require('gulp-plumber');
	//END ES6 Stuff

gulp.task('fonts', function() {
    gulp.src(folderSources.bowerDir + 'fontawesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('image', function(){
   gulp.src(folderSources.assetDir + 'images/*')
       .pipe($.imagemin())
       .pipe(gulp.dest(folderSources.publicDir + 'images'));
});

gulp.task('watch', function(){
    $.livereload.listen();

    gulp.watch(folderSources.assetDir + 'sass/*.scss', ['styles']);
    gulp.watch(folderSources.assetDir + 'js/*.js', ['scripts', 'babel']);
});

gulp.task('sass', function () {
	gulp.src(folderSources.assetDir + 'sass/*.scss')
		.pipe(sass().on('error', function(err) {
			console.error('Error!', err.message);
		}))
		.pipe(gulp.dest(folderSources.publicDir + 'stylesheets'))
		.pipe($.livereload());
});

gulp.task('loginScripts', function(){
	compileScripts('login.min.js');
});

gulp.task('registerScripts', function(){
	compileScripts('register.min.js');
});

gulp.task('gameMenuScripts', function(){
	var filesToCompile = [
		folderSources.assetDir + 'js/gameMenu.js'
	];

	compileScripts('gameMenu.min.js', filesToCompile);
});

gulp.task('mapScripts', function(){
	var filesToCompile = [
		folderSources.assetDir + 'js/map.js'
	];

	compileScripts('map.min.js', filesToCompile);
});

gulp.task('scripts', [
	'loginScripts',
	'registerScripts',
	'gameMenuScripts',
	'mapScripts'
]);

gulp.task('default', [
	'scripts',
	'sass',
	'image',
	'fonts',
	'watch'
]);

/***************
 *  Functions
 **************/
//Script compiling
function compileScripts(minFileName, filesArray) {
	var concat = $.concat,
		vendorFiles,
		projectFiles;

	vendorFiles = gulp.src($.mainBowerFiles())
		.pipe($.filter('*.js'))
		.pipe($.concat('vendor.js'));

	if(typeof filesArray !== 'undefined') {
		projectFiles = gulp.src(filesArray)
			//.pipe($.jshint())
			//.pipe($.jshint.reporter('default'))
			.pipe($.concat('app.js'))
			//babel
			.pipe(plumber())
			.pipe(babel());
	}

	//projectFiles won't be avail if there is no filesArray sent in, so just use vendorFiles, which is bower stuff :)
	$.eventStream.concat(vendorFiles, projectFiles || vendorFiles)
		.pipe($.order([
			'vendor.js',
			'app.js'
		]))
		.pipe(concat(minFileName))
		.pipe($.uglify())
		.pipe(gulp.dest(folderSources.publicDir + 'scripts'))
		.pipe($.livereload());
}

/*****************
 NOTE: Orig mick's styles wit hbootstrap, using ruby sass compile... using reg sass compile
 gulp.task('styles', function(){
 return $.rubySass(folderSources.assetDir + 'sass/styles.scss', {
 sourcemap : true,
 style: 'compressed',
 loadPath: [
 folderSources.assetDir + 'sass',
 folderSources.bowerDir + 'bootstrap-sass-official/assets/stylesheets',
 folderSources.bowerDir + 'fontawesome/scss',
 ]
 }).on('error', function (err) {
 console.error('Error!', err.message);
 })
 .pipe($.rename({ suffix: '.min' }))
 .pipe($.autoprefixer())
 .pipe($.sourcemaps.write('./map'), {
 includeContent: false,
 sourceRoot: '/source'
 })
 .pipe(gulp.dest(folderSources.publicDir + 'stylesheets'))
 .pipe($.livereload());
 });*/


/*
 gulp.task('scripts', function(){
 var vendorFiles = gulp.src($.mainBowerFiles())
 .pipe($.filter('*.js'))
 .pipe($.concat('vendor.js'));

 var projectFiles = gulp.src(folderSources.assetDir + 'js/*')
 .pipe($.jshint())
 .pipe($.jshint.reporter('default'))
 .pipe($.concat('app.js'));

 var concat = $.concat;

 $.eventStream.concat(vendorFiles, projectFiles)
 .pipe($.order([
 "vendor.js",
 "app.js"
 ]))
 .pipe(concat('main.min.js'))
 .pipe($.uglify())
 .pipe(gulp.dest(folderSources.publicDir + 'scripts'))
 .pipe($.livereload());
 });
 */