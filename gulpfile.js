const { task, watch,  series} = require('gulp');
const babel = require('gulp-babel');
const {resolve} = require('path');
const chalk = require('chalk');
const {babelJs} = require('./config/task')

task(babelJs);

task('watch',()=>{
  watch('src/*.js',series('babelJs'))
})