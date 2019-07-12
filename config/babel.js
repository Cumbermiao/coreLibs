const { task, src, dest } = require('gulp');
const babel = require('gulp-babel');
const {resolve} = require('path');

function generateBabel(path,dist){
  return function(cb){
    src(path).pipe(babel()).pipe(dest(dist));
    cb();
  }
}

let babelJs = generateBabel(resolve(__dirname,'../src/*.js'),resolve(__dirname,'../dist'));
babelJs.displayName = 'babelJs';
const babelUnit = generateBabel(resolve(__dirname,'../unit/*.spec.js'),resolve(__dirname,'../unit/dist'));
babelUnit.displayName = 'babelUnit';

module.exports = {
  babelJs,
  babelUnit
}