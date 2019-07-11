const bus = new Broadcast();

function* plusOne() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  yield 6;
  yield 7;
  return 8;
}

let generator = plusOne();

/** Broadcast instance */
describe("bus", () => {
  it("should be an object instanceof Broadcast", () => {
    expect(typeof bus).toEqual("object");
  });
  it("._events should be a empty object", () => {
    expect(typeof bus._events).toEqual("object");
  });
});

/**setMaxListeners & getMaxListeners*/
describe("setMaxListeners", () => {
  it(`should throw an error while param is not an non-negative number `, () => {
    expect(() => {
      bus.setMaxListeners(-1);
    }).toThrow();
    expect(() => {
      bus.setMaxListeners(undefined);
    }).toThrow();
    expect(() => {
      bus.setMaxListeners(NaN);
    }).toThrow();
    expect(() => {
      bus.setMaxListeners(null);
    }).toThrow();
    expect(() => {
      bus.setMaxListeners("1");
    }).toThrow();
    expect(() => {
      bus.setMaxListeners([1]);
    }).toThrow();
    expect(() => {
      bus.setMaxListeners({});
    }).toThrow();
  });
});

describe("getMaxListeners", () => {
  let count = bus.getMaxListeners();
  it(`should return default ${
    Broadcast.defaultMaxListener
  } when not set`, () => {
    expect(count).toBe(Broadcast.defaultMaxListener);
  });
});

describe(`getMaxListeners`, () => {
  let count = 20;
  it(`should return ${count} after setMaxListeners(${count})`, () => {
    bus.setMaxListeners(count);
    let max = bus.getMaxListeners();
    expect(max).toBe(count);
  });
});

/** addListener/on */
describe(`addListener`, () => {
  let evtName = "addEvt1";
  let res;
  beforeEach(()=>{
    res = bus.on(evtName, () => {
      console.log(evtName);
    });
  })
  afterEach(()=>{
    res = undefined;
  })
  it("should return bus", () => {
    expect(res).toBe(bus);
  });
  it(`should throw TypeError if listener is not a function`, () => {
    expect(() => bus.on(evtName, 1)).toThrow();
    expect(() => bus.on(evtName, "1")).toThrow();
    expect(() => bus.on(evtName, NaN)).toThrow();
    expect(() => bus.on(evtName, undefined)).toThrow();
    expect(() => bus.on(evtName, null)).toThrow();
    expect(() => bus.on(evtName, {})).toThrow();
    expect(() => bus.on(evtName, [])).toThrow();
  });
});

describe(`Method on`, () => {
  let evtName = "addEvt2";
  let count;
  let res;
  let spy;
  function asyncFn(){
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve('done');
      },500);
    });
  }
  beforeEach(()=>{
    count = 0;
    spy = {
      fn:function(){count++},
      asyncFn
    }
    spyOn(spy,'fn');
    spyOn(spy,'asyncFn');
    res = bus.on(evtName, spy.fn);
    bus.on(evtName, spy.asyncFn);
    bus.emit(evtName);
    bus.emit(evtName);
    bus.emit(evtName);
    
  })
  afterEach(()=>{
    res = undefined;
    count=0;
  })
  it("should return bus", () => {
    expect(res).toBe(bus);
  });
  it("should excute the function as many as the function was emited!",()=>{
    expect(spy.fn).toHaveBeenCalled();
    expect(spy.fn).toHaveBeenCalledTimes(3);
    expect(spy.asyncFn).toHaveBeenCalled();
    expect(spy.asyncFn).toHaveBeenCalledTimes(3);
  })
});

/** once */
describe("once", () => {
  let evtName = "onceEvt1";
  let res;
  let spy;
  let count;
  beforeEach(()=>{
    count = 0;
    spy = {
      fn:function(){count++;}
    }
    spyOn(spy,'fn');
    res = bus.once(evtName, spy.fn);
    bus.emit(evtName);
    bus.emit(evtName);
    bus.emit(evtName);
  });
  afterEach(()=>{
    count = res = undefined;
  })
  it(`should return bus`, () => {
    expect(res).toBe(bus);
  });
  it(`should excute once while emit multiple times`, () => {
    expect(spy.fn).toHaveBeenCalled();
    expect(spy.fn).toHaveBeenCalledTimes(1)
  });
});

/** prependListener LIFO*/
describe("prependListener", () => {
  let evtName = "prependEvt1";
  let res;
  bus.on(evtName, () => {
    res = "add";
  });
  bus.prependListener(evtName, () => {
    res = "prepend";
  });
  bus.emit(evtName);
  it("should unshift listener", () => {
    expect(res).toBe("prepend");
  });
});

/** prependOnceListener LIFO*/
describe("prependOnceListener", function() {
  let evtName = "prependEvt2";
  let res;
  let count = 0;
  bus.on(evtName, () => {
    res = "add";
    count++;
  });
  bus.prependOnceListener(evtName, () => {
    res = "prepend";
    count++;
  });
  bus.emit(evtName);
  it(`should unshift listener and excute only once`, () => {
    expect(count).toBe(2);
    expect(res).toBe("prepend");
  });
});

describe("prependOnceListener", function() {
  let evtName = "prependEvt3";
  let res;
  let count = 0;
  bus.on(evtName, () => {
    res = "add";
    count++;
  });
  bus.prependOnceListener(evtName, () => {
    res = "prepend";
    count++;
  });
  bus.emit(evtName);
  bus.emit(evtName);
  it(`should remove the listener by removeListener after excuted`, () => {
    expect(res).toBe("add");
    expect(count).toBe(3);
  });
});

/** getListeners & getListenerCount */
describe("getListenerCount", () => {
  let evtName = "getEvt1";
  let count = bus.getListenerCount(evtName);
  it(`should return 0 when ${evtName} is not registered`, () => {
    expect(count).toBe(0);
  });
});

describe("getListenerCount", () => {
  let evtName = "getEvt2";
  bus.on(evtName, () => null);
  bus.once(evtName, () => null);
  bus.prependListener(evtName, () => null);
  bus.prependOnceListener(evtName, () => null);
  let count = bus.getListenerCount(evtName);
  it(`should plus one when ${evtName} is on , once, prependListener, prependOnceListener`, () => {
    expect(count).toBe(4);
  });
});

describe("getListenerCount", () => {
  let evtName = "getEvt3";
  let fn = () => null;
  bus.on(evtName, fn);
  bus.on(evtName, fn);
  bus.once(evtName, fn);
  bus.once(evtName, fn);
  bus.prependListener(evtName, fn);
  bus.prependListener(evtName, fn);
  bus.prependOnceListener(evtName, fn);
  bus.prependOnceListener(evtName, fn);
  let count = bus.getListenerCount(evtName);
  it(`should plus one when ${evtName} is on , once, prependListener, prependOnceListener`, () => {
    expect(count).toBe(8);
  });

  it(`should minus one when ${evtName} is removeListener`, () => {
    bus.removeListener(evtName, fn);
    let count1 = bus.getListenerCount(evtName);
    expect(count1).toBe(7);

    bus.removeListener(evtName, fn);
    let count2 = bus.getListenerCount(evtName);
    expect(count2).toBe(6);

    bus.removeListener(evtName, fn);
    bus.removeListener(evtName, fn);
    bus.removeListener(evtName, fn);
    bus.removeListener(evtName, fn);
    let count3 = bus.getListenerCount(evtName);
    expect(count3).toBe(2);
  });
});

describe("getListeners", () => {
  let evtName = "getEvt4";
  let fn1 = () => null;
  let fn2 = () => null;
  bus.on(evtName, fn1);
  bus.prependListener(evtName, fn2);
  let ls = bus.getListeners(evtName);
  it(`should return an array`, () => {
    expect(Array.isArray(ls)).toBe(true);
  });
  it(`should return an arrray in which the last element equals the last listener which is on/once`, () => {
    expect(ls[ls.length - 1]).toEqual(fn1);
  });
});

/** removeListener/off */
describe("removeListener", () => {
  let evtName = "removeEvt1";
  let res = bus.removeListener(evtName);
  it(`should return an object instance of Broadcast`, () => {
    expect(typeof res).toEqual("object");
    expect(res instanceof Broadcast).toBe(true);
  });
});

describe("removeListener", () => {
  let evtName = "removeEvt2";
  let fn1 = () => null;
  let fn2 = () => null;
  bus.on(evtName, fn1);
  bus.on(evtName, fn2);
  bus.once(evtName, fn1);
  bus.once(evtName, fn2);
  bus.removeListener(evtName, fn1);
  let count = bus.getListenerCount(evtName);
  it(`should remove the last added listener in ${evtName} which equals to if listener exists`, () => {
    expect(count).toEqual(3);
  });
  it(`should remove all listeners in ${evtName} if param listener is not passed in`, () => {
    bus.removeListener(evtName);
    let count = bus.getListenerCount(evtName);
    expect(count).toEqual(0);
  });
});

describe("off", () => {
  let evtName = "removeEvt3";
  bus.on(evtName, () => null);
  it(`should throw TypeError if param listener is not a function`, () => {
    expect(() => bus.off(evtName, 1)).toThrow();
    expect(() => bus.off(evtName, "1")).toThrow();
    expect(() => bus.off(evtName, [])).toThrow();
    expect(() => bus.off(evtName, {})).toThrow();
    expect(() => bus.off(evtName, NaN)).toThrow();
    expect(() => bus.off(evtName, undefined)).toThrow();
    expect(() => bus.off(evtName, null)).toThrow();
  });
});

/** emit */
describe(`emit`, () => {
  let evtName = "emitEvt1";
  let generator = plusOne();
  let res;
  let fn1 = () => (res = generator.next());
  let fn2 = () => (res = generator.next());
  bus.on(evtName, fn1);
  bus.once(evtName, fn2);
  bus.prependListener(evtName, fn1);
  bus.prependOnceListener(evtName, fn2);
  bus.emit(evtName);
  bus.emit(evtName);
  it(`should excute all listeners in ${evtName} and the listeners which are once or prependOnceListener excute only once`, () => {
    expect(res.value).toBe(6);
  });
});

describe(`emit`, () => {
  let evtName = "emitEvt2";
  let res;
  let fn = str => (res = str + ",");
  bus.on(evtName, fn);
  bus.emit(evtName, "name");
  it(`should pass all params to listener`, () => {
    expect(res).toBe(`name,`);
  });
});

/** getAllEvents */
describe("getAllEvents", () => {
  let bus = new Broadcast();
  let evtName1 = "test1";
  let evtName2 = "test2";
  let evtName3 = "test3";
  bus.on(evtName1, () => null);
  bus.on(evtName2, () => null);
  bus.on(evtName3, () => null);
  let events = bus.getAllEvents();
  it("should return an array", () => {
    expect(Array.isArray(events)).toBe(true);
  });
  it("should return an array in which the last one should be the last added event", () => {
    expect(events[events.length - 1]).toEqual(evtName3);
  });
  it(`should return an array which event adds in order`, () => {
    expect(events.toString()).toEqual(`${evtName1},${evtName2},${evtName3}`);
  });
});

/** hasEvent */
describe("hasEvent", () => {
  let evtName = "hasEvt1";
  let exist1 = bus.hasEvent(evtName);
  bus.on(evtName, () => null);
  let exist2 = bus.hasEvent(evtName);
  it(`should return false when ${evtName} has not been bind`, () => {
    expect(exist1).toBe(false);
  });
  it(`should return true after ${evtName} has been bind`, () => {
    expect(exist2).toBe(true);
  });
});

/** removeAllEvents */
describe("removeAllEvents", () => {
  let bus = new Broadcast();
  let evtName = "removeAllEvt1";
  bus.on(evtName, () => null);
  bus.removeAllEvents();
  let evtCount = bus.getAllEvents().length;
  let lCount = bus.getListenerCount(evtName);
  it(`should return all events & listeners`, () => {
    expect(evtCount).toEqual(0);
    expect(lCount).toEqual(0);
  });
});

/** setMaxListeners */
describe("setMaxListeners", () => {
  it(`should throw RangeError if param count is not an non-negative number`, () => {
    expect(() => bus.setMaxListeners(-1)).toThrow();
    expect(() => bus.setMaxListeners("1")).toThrow();
    expect(() => bus.setMaxListeners(NaN)).toThrow();
    expect(() => bus.setMaxListeners(null)).toThrow();
    expect(() => bus.setMaxListeners(undefined)).toThrow();
    expect(() => bus.setMaxListeners([1])).toThrow();
    expect(() => bus.setMaxListeners({ 1: 1 })).toThrow();
  });

  it(`should return true if set successfully`, () => {
    let res = bus.setMaxListeners(11);
    expect(res).toBe(true);
  });
});

/** getMaxListeners */
describe("getMaxListeners", () => {
  let bus = new Broadcast();
  let count = bus.getMaxListeners();
  it(`should return ${Broadcast.defaultMaxListener} if did not set`, () => {
    expect(count).toEqual(Broadcast.defaultMaxListener);
  });
  it(`should return the number which is set by setMaxListeners`, () => {
    let count = 20;
    bus.setMaxListeners(count);
    expect(bus.getMaxListeners()).toEqual(count);
  });
});

/** built in event: addListener & removeListener */
describe("event addListener", () => {
  let bus = new Broadcast();
  let count = 0;
  bus.on("addListener", () => count++);
  bus.on("test", () => null);
  bus.on("test", () => null);
  bus.on("test1", () => null);
  it(`should emit once a new listener was bind if event has been registered `, () => {
    expect(count).toEqual(3);
  });
});

describe("event removeListener", () => {
  let bus = new Broadcast();
  let count = 0;
  var fn = () => null;
  bus.on("removeListener", () => count++);
  bus.on("addListener", fn);
  bus.on("test", fn);
  bus.on("test", fn);
  bus.on("test1", fn);
  bus.removeListener('test');
  it(`should emit once a listener was removed if event has been registered `, () => {
    expect(count).toEqual(2)
  });
});


/** Broadcast.defaultMaxListener */
describe(`Broadcast.defaultMaxListener`, () => {
  it(`should throw RangeError if set an non-negative`, () => {
    expect(() => {
      Broadcast.defaultMaxListener = -1;
    }).toThrow();
    expect(() => {
      Broadcast.defaultMaxListener = "1";
    }).toThrow();
    expect(() => {
      Broadcast.defaultMaxListener = NaN;
    }).toThrow();
    expect(() => {
      Broadcast.defaultMaxListener = undefined;
    }).toThrow();
    expect(() => {
      Broadcast.defaultMaxListener = [1];
    }).toThrow();
    expect(() => {
      Broadcast.defaultMaxListener = {};
    }).toThrow();
    expect(() => {
      Broadcast.defaultMaxListener = null;
    }).toThrow();
  });
});
