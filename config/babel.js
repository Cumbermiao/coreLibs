const { task, src, dest } = require('gulp');
const babel = require('gulp-babel');
const {resolve} = require('path');

const babelJs = function(cb){
  let filepath=resolve(__dirname,'../src/*.js');
  let dist=resolve(__dirname,'../dist');
  src(filepath).pipe(babel()).pipe(dest(dist));
  cb();
}

module.exports = babelJs