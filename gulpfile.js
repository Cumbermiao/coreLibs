const { task, watch,  series} = require('gulp');
const {babelJs, cleanCoverage} = require('./config/task')

task(babelJs);
task(cleanCoverage);

task('watch',()=>{
  watch('src/*.js',series('babelJs'))
})