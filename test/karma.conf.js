// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-03-10 using
// generator-karma 0.9.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-breadcrumb/release/angular-breadcrumb.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/ng-sortable/dist/ng-sortable.js',
      'bower_components/codemirror/lib/codemirror.js',
      'bower_components/angular-ui-codemirror/ui-codemirror.js',
      'bower_components/jsedn/jsedn.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-recursion/angular-recursion.js',
      'bower_components/v-accordion/dist/v-accordion.js',
      'bower_components/raven-js/dist/raven.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/oi.select/dist/select-tpls.min.js',
      'bower_components/angular-feature-flags/dist/featureFlags.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
    //  'test/spec/**/*.js'
      'test/spec/services/transformationdatamodel.js',
      'test/spec/controllers/computetriples.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
