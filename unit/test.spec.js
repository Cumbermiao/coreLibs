function addOne(num) {
  return num + 1;
}

describe("addOne", () => {
  it("should return  a number plus one ", () => {
    expect(addOne(1)).toEqual(2);
  });
});

describe("addOne", () => {
  let num;
  beforeEach(() => {
    num = 1;
  });
  afterEach(() => {
    num = 0;
  });
  it("should return 2 when num equals 1", () => {
    expect(addOne(num)).toEqual(2);
  });
  it("should return 2 when num equals 1", () => {
    expect(addOne(num)).toEqual(2);
  });
});

describe("addOne", () => {
  beforeEach(() => {
    this.num = 1;
  });

  it("should return 2 when num equals 1", () => {
    expect(addOne(this.num)).toEqual(2);
  });
  it("should return 2 when num equals 1", () => {
    expect(addOne(this.num)).toEqual(2);
  });
});

describe("A spy", function() {
  var foo,
    bar = null;

  beforeEach(function() {
    foo = {
      setBar: function(value) {
        bar = value;
      }
    };

    spyOn(foo, "setBar");

    foo.setBar(123);
    foo.setBar(456, "another param");
  });

  it("tracks that the spy was called", function() {
    expect(foo.setBar).toHaveBeenCalled();
  });

  it("tracks all the arguments of its calls", function() {
    expect(foo.setBar).toHaveBeenCalledWith(123);
    expect(foo.setBar).toHaveBeenCalledWith(456, "another param");
  });

  it("stops all execution on a function", function() {
    expect(bar).toBeNull();
  });
});

describe("A spy", function() {
  var foo,
    bar = null;

  beforeEach(function() {
    foo = {
      setBar: function(value) {
        bar = value;
      }
    };

    spyOn(foo, "setBar").and.callThrough();
  });

  it("can call through and then stub in the same spec", function() {
    foo.setBar(123);
    expect(bar).toEqual(123);

    foo.setBar.and.stub();
    bar = null;

    foo.setBar(123);
    expect(bar).toBe(null);
  });
});

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
    expect(value).toBeGreaterThan(0);
    setTimeout(()=>{
      value ++;
      expect(value).toBeGreaterThan(0);
      done();
    },5000)
  });
});

describe("Mocking setTimeout & setInterval,",()=>{
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

// promise & async await
describe('Asynchronous specs with',()=>{
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