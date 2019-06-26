
## karma.conf.js
- files 里面配置的文件如果不设置 `include:false` 会默认使用 `<script>` 标签加载该文件， 而且要注意顺序， script 加载是按照 files 里的文件顺序， 如果某些文件依赖于其他文件，例如 测试文件中需要依赖于某个类， 那么这个文件需要放在前面。


- requirejs 对于某些源文件里面可能有一些兼容amd&cmd的代码， 对于这些文件需要设置 `include:false` 或者在引用的地方不使用 requirejs 中 `define(module,()=>{})` 的写法， 否则会造成 `MISMATCHED ANONYMOUS DEFINE() MODULES` 这种错误。该错误详细介绍参考 [链接](https://requirejs.org/docs/errors.html#mismatch)

- 使用 requirejs 应该生成一个 test-main.js , 我们可以将模块定义在 paths 中， 在引用的地方使用requirejs 的语法即可。
```js
var allTestFiles = []
var TEST_REGEXP = /(spec|test)\.js$/i

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '')
    allTestFiles.push(normalizedTestModule)
  }
})

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // if you use script tag to load js, do not set file in path, or it will cause error MISMATCHED ANONYMOUS DEFINE() MODULES in requirejs 
  path:{
    'broadcast':'./dist/Broadcast.js'
  },
  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
})

```