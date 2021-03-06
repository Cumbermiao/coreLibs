// Karma configuration
// Generated on Tue Jun 25 2019 11:46:45 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    files: [
      "dist/*.js",
      "unit/*.spec.js"
    ],

    // list of files / patterns to exclude
    exclude: ["src/**/*.js","unit/test.spec.js"],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "dist/**/*.js": ["coverage",]//coveralls
    },

    coverageReporter: {
      type: "lcov",
      dir: "coverage/",
      // reporters: [{ type: "html" , subdir:'html'}, { type: "lcov",subdir:'lcov' }]
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress", "coverage"],

    // web server port
    port: 9877,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    autoWatchBatchDelay: 2000,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome"],//PhantomJS

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // plugins:['karma-coverage']
  });
  var configuration = {
    // other things
 
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },
  };
 
  if (process.env.TRAVIS) {
      configuration.browsers = ['Chrome_travis_ci'];
  }
  config.set(configuration);
};
