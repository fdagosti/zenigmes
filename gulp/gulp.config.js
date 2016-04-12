module.exports = {

    build_dir: 'build',
    compile_dir: 'bin',
    server: 'app.js',

    app_files: {
        // source, but NO specs
        js: ['app_client/src/**/*.js', '!app_client/src/**/*.spec.js', './app_client/src/**/*.css'],
        js_compile: ['gulp/module.prefix', 'build/app/**/*.js', 'build/vendor/**/*.js', 'gulp/module.suffix'],
        vendor: ['app_client/libs/**/*.js', 'app_client/libs/**/*.css', 'app_client/libs/**/*.woff','app_client/libs/**/*.map'],
        jsunit: ['src/**/*.spec.js'],
        // our partial templates
        atpl: ['app_client/src/**/*.view.html', 'app_client/src/**/*.template.html'],
        // tpl_src: ["./app_client/build/libs/**/*.js", "./app_client/build/app/**/*.js", "./app_client/build/css/**/*.css"],
        tpl_src: ["./app_client/build/app/**/*.js", "./app_client/build/css/**/*.css"],
        // the index.html
        html: ['app_client/index.html'],
        styles: ['app_client/css/**/*.less'],
        data_compile: ['build/data/**/*.*'],
        assets_compile: ['build/assets/**/*.*', '!build/assets/css/**/*.*'],
        ngmin_js: ['./bin/**/*.js']
    },

    test_files: {
        js: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
        ]
    },

    vendor_files: {
        // the vendor/ needs to be prefixed by the task
        js: [
            'angular-ui-router.min.js'
        ],
        css: [],
        assets: []
    }
};