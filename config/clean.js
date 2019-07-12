const { task, src, dest } = require('gulp');
const rm = require('gulp-rm');
const {resolve} = require('path');
const fs = require('fs');

const cleanCoverage = function(cb){
  src(resolve(__dirname,'../coverage/**/*'),{ read: false }).pipe(rm());
  cb();
}

module.exports = cleanCoverage;