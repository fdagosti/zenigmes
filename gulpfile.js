var gulp = require('gulp'),
    del = require('del'),
    inject = require("gulp-inject"),
    runSequence = require('run-sequence'),
    rename = require("gulp-rename"),
    nodemon = require('gulp-nodemon'),
    concat = require('gulp-concat'),
    html2js = require("gulp-ng-html2js"),
    ngmin = require("gulp-ng-annotate"),
    _ = require('lodash'),
    uglify = require('gulp-uglify'),
    pkg = require('./package.json'),
    useref = require("gulp-useref"),
    gulpif = require("gulp-if"),
    babel = require("gulp-babel"),
    jshint = require('gulp-jshint');


var files = require('./gulp/gulp.config.js');

/*
 The primary build task. We use runSequence to prevent any race-conditions.
 These conditions can occur because Gulp runs in parallel.

 We pass in a callback so that runSequence can notify gulp that the sequence is complete.
 */
gulp.task('build', function (callback) {
    runSequence('clean',
        'copy-build',
        "html2js",
        'index',
        callback);
});

/*
 The defualt task that runs when we type "gulp"
 */
gulp.task('default', function (callback) {
    runSequence('build',
        'watch',
        'serve',
        callback);
});

/*
 Selectively build JUST the JS source.
 */
gulp.task('build-src', function (callback) {
    runSequence('copy-assets', 'copy-app', 'index', callback)
});

/*
 Use 'del', a standard npm lib, to completely delete the build dir
 */
gulp.task('clean', function () {
    return del(['./app_client/build'], {force: true});
});

/*
 Use 'del', a standard npm lib, to completely delete the bin (production) dir
 */
gulp.task('clean-bin', function (callback) {
    return del(['./app_client/bin'], {force: true});
});

gulp.task('copy-app', ['copy-app-js', 'copy-app-css']);

gulp.task('copy-build', ['copy-assets', 'copy-app', 'copy-libs-js']);

gulp.task('copy-assets', function () {
    return gulp.src('./app_client/src/rsc/**/*')
        .pipe(gulp.dest('./app_client/build/rsc'));
});


gulp.task('copy-app-js', function () {
    return gulp.src(files.app_files.js)
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(gulp.dest('./app_client/build'));
});

gulp.task('copy-app-css', function () {
    return gulp.src(files.app_files.css)
        .pipe(gulp.dest('./app_client/build'));
});

gulp.task('copy-libs-js', function () {
  return gulp.src(files.app_files.vendor)
    .pipe(gulp.dest('./app_client/build/libs'));
});

gulp.task('copy-libs-js-compile', function () {
  return gulp.src(files.app_files.vendor)
    .pipe(gulp.dest('./app_client/bin/libs'));
});

gulp.task('copy-compile', ['copy-compile-assets']);

gulp.task('copy-compile-assets', function () {
    return gulp.src(files.app_files.assets_compile)
        .pipe(gulp.dest('./app_client/bin'));
});

gulp.task('html2js', function () {
    return gulp.src(files.app_files.atpl)
        .pipe(html2js({
            moduleName: "templates-app"
        }))
        .pipe(concat('templates-app.js'))
        .pipe(gulp.dest("./app_client/build/app"));
});



/*
 Used to populate the index.html template with JS sources
 from the "build" dir.
 */
gulp.task('index', function () {
    return gulp.src('./app_client/src/index.html')
        .pipe(inject(
            gulp.src(files.app_files.tpl_src), {
                ignorePath: 'app_client/build'
            }))
        .pipe(gulp.dest("./app_client/build"));
});

/*
 Used to populate the index.html template with JS sources
 from the "bin" folder during compile task.
 */
gulp.task('index-compile', function () {
    return gulp.src('./app_client/build/index.html')
        .pipe(inject(
            gulp.src(['./app_client/bin/**/*.js', './app_client/bin/css/**/*.css'], {read: false}), {
            ignorePath: files.compile_dir + '/'
        }))
        .pipe(useref())
        .pipe(gulpif('*.js', uglify().on("error", function(e){
            console.log(e);
        })))
        .pipe(gulp.dest("./" + files.compile_dir));
});



gulp.task('ngmin', function () {
    return gulp.src(files.app_files.ngmin_js)
        .pipe(ngmin())
        .pipe(gulp.dest(files.compile_dir));
});

gulp.task('uglify', function () {
    return gulp.src(files.app_files.ngmin_js)
        .pipe(uglify().on("error", function(e){
            console.log(e);
        }))
        .pipe(gulp.dest(files.compile_dir));
});

gulp.task('concat', function () {

    return gulp.src(files.app_files.js_compile)
        .pipe(concat(pkg.name + '-' + pkg.version + '.min.js'))
        .pipe(gulp.dest('./app_client/bin/assets'))
});

gulp.task('serve', function () {
    nodemon({ignore: ["app_client/"] })
        .on('restart', function () {
            console.log('restarted!')
        })
});

gulp.task('set-prod-node-env', function () {
    process.env.MONGOLAB_URI='mongodb://localhost/zenigmes';
    return process.env.NODE_ENV = 'production';
});

gulp.task('serve-bin', ["set-prod-node-env", "serve"]);


gulp.task('compile', function (callback) {
    runSequence('build',
        'clean-bin',
        'copy-compile',
        'concat',
        'ngmin',
        'uglify',
        'index-compile',
        "copy-libs-js-compile",
        callback);
});


/**
 * Run test once and exit
 */
gulp.task('angular-test', function (done) {
    var Server = require('karma').Server;
  new Server({
    configFile: __dirname + '/app_client/src/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('angular-tdd', function (done) {
    var Server = require('karma').Server;
  new Server({
    configFile: __dirname + '/app_client/src/karma.conf.js'
  }, done).start();
});

gulp.task('api-test', ["set-test-node-env"],function () {
    var jasmine = require('gulp-jasmine');
    var exit = require('gulp-exit');
  return gulp.src('app_api/spec/**/*[sS]pec.js')
        .pipe(jasmine())
        .pipe(exit());
        
});

gulp.task('set-test-node-env', function() {
    return process.env.NODE_ENV = 'test';
});

gulp.task("test", function(){
    runSequence('angular-test', "api-test");
});


gulp.task('lint', function() {
    return gulp.src("app_client/src/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
    gulp.watch(files.app_files.js, ['lint', 'build-src']);
    gulp.watch(files.app_files.atpl, ['html2js', 'index']);
    gulp.watch(files.app_files.html, ['index']);
    

    gulp.watch('./src/config/**/*.json', ['config-build']);
});



