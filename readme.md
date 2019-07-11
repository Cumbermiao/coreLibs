
##TODO
- build/coverage icon
![Build Status](https://travis-ci.org/Cumbermiao/coreLibs.svg?branch=master)

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

## Jasmine

### 相关概念
- 分组(suite): 一个分组中可以包含多个用例， 分组的命名和用例的命名形成一个完整的用例语句。
- 用例(spec): 函数的测试用例。 
- 期望(expectation): 表示期望expression这个表达式具有某个值或者具有某种行为。
- 匹配(match): 如果期望与实际的值或行为一直则两者匹配。



#### 基础使用
describe 接收两个参数， 第一个参数为字符串一般为一组测试用例的名称， 第二个参数为一个函数， 函数里面实现具体的测试用例。
describe 可以嵌套 describe。

测试用例使用 it 定义，it 同样接收两个参数， 第一个参数和 describe 的第一参数组合起来， 为这个测试用例的具体名称， 函数里面是具体的用例实现。
it 必须要放于 describe 函数中的代码块中。 describe 的代码块可以包含多个 it。

expect 用来接收一个参数并调用一个 Matcher 来表示该测试用例所期望的结果。
expect 处于 it 的代码块， 一个 it 可以包含多个期望。
```js
function addOne(num){
  return num+1
}
describe('addOne',()=>{
  it('should return  a number plus one ',()=>{
    expect(addOne(1)).toEqual(2)
  })
})
```

#### Matchers
Matchers 用来比较实际值和期望值是否一致， Jasmine 里面内置了许多 Matchers，也 可以自定义 Matcher ，自定义 Matcher 参考 [链接](https://jasmine.github.io/2.0/custom_matcher.html) 。 常用的 Matchers 如下：
- toBe : 类似于`===`
- toEqual : 比较变量字面量的值
- toMatch : 匹配值与正则表达式
- toBeDefined / toBeUndefined : 检验变量是否定义/未定义
- toBeNull : 检验变量是否为`null`
- toBeFalsy : 检查变量值是否能转换成布尔型`假`值
- toBeTruthy : 检查变量值是否能转换成布尔型`真`值
- toContain : 检查在数组中是否包含某个元素
- toBeLessThan / toBeGreaterThan : 检查变量是否小于/大于某个数字
- toBeCloseTo : 比较两个数在保留几位小数位之后，是否相等,用于数字的精确比较
- toThrow : 检查一个函数是否会throw异常
- toThrowError : 检查一个函数是否会throw错误

#### BDD 行为驱动
上面已经介绍了 describe 和 it 函数的第一个参数都接受字符串， 两者组合起来就是该测试用例的具体名称， 使用 BDD 风格的命名方式可以让我们通过名称更好的理解该测试用例的意图。 BDD 风格参考[链接](http://en.wikipedia.org/wiki/Behavior-driven_development)。

#### beforeEach & afterEach
beforeEach 在 ==每个== it 执行前会被调用一次， afterEach 在执行后被调用一次。
```js
describe('addOne',()=>{
  let num;
  beforeEach(()=>{
    num = 1;
  })
  afterEach(()=>{
    num = 0;
  })
  it('should return 2 when num equals 1',()=>{
    expect(addOne(num)).toEqual(2)
  })
  it('should return 2 when num equals 1',()=>{
    expect(addOne(num)).toEqual(2)
  })
})
```

#### 作用域
上一个例子我们在 describe 中的代码块定义了一个函数作用域的变量 num ， 除了这个方法我们还可以使用 this , 使得每个 it 代码块都能使用该变量。
```js
describe('addOne',()=>{
  beforeEach(()=>{
    this.num = 1;
  })

  it('should return 2 when num equals 1',()=>{
    expect(addOne(this.num)).toEqual(2)
  })
  it('should return 2 when num equals 1',()=>{
    expect(addOne(this.num)).toEqual(2)
  })
})
```

#### xdescribe & xit
对于一些未完成或者不想测试的测试用例集合我们可以使用 xdescribe ， 使用 xdescribe 之后整个用例集合不会被执行也不会出现在测试结果中。

测试用例有一个状态 pending ， 被标记为 pending 状态的测试用例不会被执行, 可以使用 xit 来标记该测试用例为 pending 。 it 中如果传入了第一个参数，没有函数体， 该测试用例也会被标记为 pending。
或者你可以在 it 函数体内使用 pending() 将其标记为 pending 。


#### spy
spy 可以在 describe 和 it 中定义， 通过 spy 我们可以监测函数的调用以及传入的参数。

基础使用
```js
describe('spy',()=>{
  let foo;
  let bar = null;

  beforeEach(()=>{
    foo={
      setBar:val=>bar=val
    };
    
    spyOn(foo,'setBar');

    foo.setBar(123);
    foo.setBar(456,789);
  })

  it('can tracks the spy was called',()=>{
    expect(foo.setBar).toHaveBeenCalled();
  })
  it('can tracks all arguments',()=>{
    expect(foo.setBar).toHaveBeenCalledWith(123);
    expect(foo.setBar).toHaveBeenCalledWith(456,789);
  })
  it('should not delegate to the actual implementation',()=>{
    expect(bar).toBeNull()
  })
})
```
从上面的例子可以发现， 监听了 foo.setBar 函数之后， 其调用以及传入的参数都可以被追踪。 但是默认情况下， setBar 中的赋值操作并没有影响到实际的 bar 的值。
如果想要 spy 中函数能修改实际的值可以使用 `spyOn(foo,'setBar').and.callThrough();`。

spy 还可以使用 `.and.returnValue()` 代理函数的返回值, 例如：
```js
beforeEach(()=>{
  foo = {
    setBar:val=>bar=val,
    getBar:()=>bar
  }
  spyOn(foo,'getBar').and.returnValue(10);
  foo.setBar(1);
  let barVal = foo.getBar();
})
```
上面这个例子 spy 代理的 foo.getBar 的返回值， 尽管给 bar 赋值为 1， 但是通过 getBar 拿到的值永远是 10 。

TODO: callFake , throwError, stub, 


#### 模拟 setTimeout & setInterval
```js
describe("Mocking setTimeout & setInterval ,",()=>{
  let timerCallback;

  beforeEach(()=>{
    timerCallback = jasmine.createSpy("timerCallback");
    jasmine.clock().install();
  })

  afterEach(()=>{
    jasmine.clock().uninstall();
  })

  it('timerCallback should excute after 100ms',()=>{
    setTimeout(()=>{
      timerCallback();
    },100);
    expect(timerCallback).not.toHaveBeenCalled();
    jasmine.clock().tick(101);
    expect(timerCallback).toHaveBeenCalled();
  })

  it('timerCallback should excute in interval 100ms',()=>{
    setInterval(()=>{
      timerCallback()
    },100);
    expect(timerCallback).not.toHaveBeenCalled();
    jasmine.clock().tick(101);
    expect(timerCallback.calls.count()).toEqual(1);
    jasmine.clock().tick(100);
    expect(timerCallback.calls.count()).toEqual(2);
  })
})

```

#### 异步支持
beforeEach , it , afterEach 中接收一个可选的参数 done , 当异步处理结束时应该调用 done() 。
beforeEach 在执行 it 测试用例之前执行， 如果 beforeEach 接受了该参数， 需要在异步处理之后手动调用 done() , 否则不会进入 it 测试用例。
同样 it 中如果接收了该参数， 需要在异步操作之后调用 done() ， 否则该测试用例不会执行结束。
jasmine.DEFAULT_TIMEOUT_INTERVAL 表示异步操作的超时时间 ， 默认为 5000ms。
```js
describe("Asynchronous specs", function() {
  var value;
  var originalTimeout;
  
  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it("should support async execution of test preparation and expectations", function(done) {
    value = 1;
    value++;
    console.log(value)
    expect(value).toBeGreaterThan(0);
    setTimeout(()=>{
      value ++;
      console.log('done',value);
      expect(value).toBeGreaterThan(0);
      done();
    },5000)
  });
});
```

#### Promise & async await
```js
describe('Asynchronous specs with',()=>{
  let spy;
  let res;
  function asyncFn(){
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        res = 'done';
        resolve('done');
      },500);
    });
  }

  it('promise',(done)=>{
    asyncFn().then(()=>{
      expect(res).toEqual('done');
      done();
    })
  })

  it('async & await',async ()=>{
    async function asyncFn2(){
      return new Promise((resolve,reject)=>{
        setTimeout(()=>{
          resolve('done');
        },500);
      });
    }
    try{
      let result = await asyncFn2();
      expect(result).toEqual('done');
    }catch(err){
      fail('async failed',err)
    }
  })
})
```