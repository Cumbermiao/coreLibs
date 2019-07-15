const { task, watch,  series} = require('gulp');
const {babelJs, babelUnit, cleanCoverage} = require('./config/task');

task(babelJs);
task(cleanCoverage);
task(babelUnit);


task('watch',()=>{
  watch('src/*.js',series('babelSrc'))
})

let  build = series(babelJs);

build.displayName = 'build';

task(build);