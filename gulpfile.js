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
    runSequence('copy-build', 'index', callback)
});

/*
 Use 'del', a standard npm lib, to completely delete the build dir
 */
gulp.task('clean', function () {
    return del(['./app_client/build'], {force: true})
});

/*
 Use 'del', a standard npm lib, to completely delete the bin (production) dir
 */
gulp.task('clean-bin', function (callback) {
    del(['./bin'], {force: true}, callback)
});

gulp.task('copy-build', ['copy-assets', 'copy-app', 'copy-libs-js']);

gulp.task('copy-assets', function () {
    return gulp.src('./app_client/src/rsc/**/*')
        .pipe(gulp.dest('./app_client/build/rsc'));
});


gulp.task('copy-app', function () {
    return gulp.src(files.app_files.js)
        .pipe(gulp.dest('./app_client/build'));
});

gulp.task('copy-libs-js', function () {
  return gulp.src(files.app_files.vendor)
    .pipe(gulp.dest('./app_client/build/libs'));
});

gulp.task('copy-compile', ['copy-compile-assets']);

gulp.task('copy-compile-assets', function () {
    return gulp.src(files.app_files.assets_compile)
        .pipe(gulp.dest('./bin/assets'));
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
    return gulp.src('./src/index.html')
        .pipe(inject(gulp.src(['./bin/**/*.js', './bin/**/*.css'], {read: false}), {
            ignorePath: files.compile_dir + '/'
        }))
        .pipe(gulp.dest("./" + files.compile_dir));
});

gulp.task('ngmin', function () {
    return gulp.src(files.app_files.ngmin_js)
        .pipe(ngmin())
        .pipe(gulp.dest(files.compile_dir));
});

gulp.task('uglify', function () {
    return gulp.src(files.app_files.ngmin_js)
        .pipe(uglify());
});

gulp.task('concat', function () {

    return gulp.src(files.app_files.js_compile)
        .pipe(concat(pkg.name + '-' + pkg.version + '.min.js'))
        .pipe(gulp.dest('./bin/assets'))
});

gulp.task('serve', function () {
    nodemon({ignore: ["app_client/"] })
        .on('restart', function () {
            console.log('restarted!')
        })
});

gulp.task('compile', function (callback) {
    runSequence('build',
        'clean-bin',
        'copy-compile',
        'concat',
        'ngmin',
        'uglify',
        'index-compile',
        callback);
});

gulp.task('lint', function() {
    return gulp.src(files.app_files.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
    gulp.watch(files.app_files.js, ['lint', 'build-src']);
    gulp.watch(files.app_files.atpl, ['html2js', 'index']);
    gulp.watch(files.app_files.html, ['index']);
    

    gulp.watch('./src/config/**/*.json', ['config-build']);
});



