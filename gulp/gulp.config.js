module.exports = {

    build_dir: 'app_client/build',
    compile_dir: 'app_client/bin',
    server: 'app.js',

    app_files: {
        // source, but NO specs
        js: ['app_client/src/**/*.js', '!app_client/src/**/*.spec.js', './app_client/src/**/*.css'],
        js_compile: ['app_client/build/app/**/*.js'],
        vendor: ['app_client/libs/**/*'],
        jsunit: ['src/**/*.spec.js'],
        // our partial templates
        atpl: ['app_client/src/**/*.view.html', 'app_client/src/**/*.template.html'],
        tpl_src: ["./app_client/build/app/**/*.js", "./app_client/build/css/**/*.css"],
        // the index.html
        html: ['app_client/src/index.html'],
        assets_compile: ['app_client/build/**/*.css'],
        ngmin_js: ['./app_client/bin/**/*.js']
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