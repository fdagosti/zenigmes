// Karma configuration
// Generated on Fri Apr 22 2016 20:45:49 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '..',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        // "libs/jquery/dist/jquery.js",
        // "libs/jquery-ui/jquery-ui.js",
        // "libs/tinymce/tinymce.js",
        
        // "libs/angular/angular.js",
        // "libs/angular-i18n/angular-locale_fr-fr.js",
        // "libs/angular-route/angular-route.js",
        // "libs/angular-animate/angular-animate.js",
        // "libs/angular-sanitize/angular-sanitize.min.js",
        
        // "libs/moment/min/moment.min.js",
        // "libs/angular-ui-calendar/src/calendar.js",
        // "libs/fullcalendar/dist/fullcalendar.min.js",
        // "libs/fullcalendar/dist/gcal.js",

            
        // "libs/ui-bootstrap-tpls-1.3.1.min.js",

        
        // "libs/angular-ui-sortable/sortable.js",
        // "libs/angular-ui-tinymce/src/tinymce.js",
        // "libs/fr_FR.js",
        
        
        // "libs/bootstrap/dist/js/bootstrap.js",
        // "libs/checklist-model/checklist-model.js",
        // "libs/angular-ui-grid/ui-grid.js",
        "bin/libs/combined.js",
        "https://cdnjs.cloudflare.com/ajax/libs/angular-css/1.0.8/angular-css.js",

        "libs/angular-mocks/angular-mocks.js",        
        'src/app/ngzenigmes.js',
        "build/app/templates-app.js",
        'src/app/**/*.js',
        'src/spec/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
