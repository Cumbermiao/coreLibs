"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TYPES = {
  addListener: "addListener",
  removeListener: "removeListener"
};

var Broadcast =
/*#__PURE__*/
function () {
  function Broadcast() {
    _classCallCheck(this, Broadcast);

    Broadcast.init.call(this);
  }

  _createClass(Broadcast, [{
    key: "setMaxListeners",
    value: function setMaxListeners(count) {
      if (typeof count === "number" && count > -1 && !isNaN(count)) {
        this._maxListener = count;
        return true;
      } else {
        throw new RangeError("count should be a non-negative number! Received ".concat(count));
      }
    }
  }, {
    key: "getMaxListeners",
    value: function getMaxListeners() {
      return $getMaxListeners(this);
    }
  }, {
    key: "addListener",
    value: function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    }
  }, {
    key: "on",
    value: function on(type, listener) {
      return this.addListener(type, listener);
    }
  }, {
    key: "once",
    value: function once(type, listener) {
      return this.addListener(type, _onceWrap(this, type, listener));
    }
  }, {
    key: "prependListener",
    value: function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    }
  }, {
    key: "prependOnceListener",
    value: function prependOnceListener(type, listener) {
      return this.prependListener(type, _onceWrap(this, type, listener));
    }
  }, {
    key: "_removeOneListener",
    value: function _removeOneListener(type, listener) {
      if (typeof listener !== "function") throw new TypeError("listener should be Function, Received ".concat(_typeof(listener), "!"));
      var events = this._events;
      if (events === "undefined") return this;
      var handlers = events[type];
      if (handlers === "undefined") return this;

      if (typeof handlers === "function") {
        //handlers is a function
        if (handlers === listener || handlers.listener === listener) {
          this._eventsCount--;
          delete events[type]; //XXX: Is it necessary to deassign this._events
          // this._eventsCount===0?this._events=Object.create(null):null

          if (events[TYPES.removeListener]) {
            this.emit(TYPES.removeListener, type, listener);
          }
        }
      } else if (Array.isArray(handlers)) {
        //handlers is a array
        var postion = -1;

        for (postion = 0; postion < handlers.length; postion++) {
          if (handlers[postion] === listener || handlers[postion].listener === listener) break;
        }

        if (postion < handlers.length) {
          handlers.splice(postion, 1);

          if (events[TYPES.removeListener]) {
            this.emit(TYPES.removeListener, type, listener);
          }

          if (handlers.length === 1) events[type] = handlers[0];
        }
      }

      return this;
    }
  }, {
    key: "removeListener",
    value: function removeListener(type, listener) {
      // if no param for listener , remove all listeners in type
      if (arguments.length === 1) {
        var events = this._events;
        if (events === undefined) return this;
        var handlers = events[type];
        if (handlers === undefined) return this;else if (typeof handlers === "function") {
          this._removeOneListener(type, handlers);
        } else if (Array.isArray(handlers)) {
          //LIFO
          for (var i = handlers.length - 1; i >= 0; i--) {
            this._removeOneListener(type, handlers[i]);
          }
        }
        return this;
      } else {
        //remove listener in type
        if (typeof listener !== "function") throw new TypeError("listener should be Function, Received ".concat(_typeof(listener), "!"));
        return this._removeOneListener(type, listener);
      }
    }
  }, {
    key: "off",
    value: function off(type, listener) {
      return this.removeListener(type, listener);
    }
  }, {
    key: "removeAllEvents",
    value: function removeAllEvents() {
      this._events = Object.create(null);
      this._eventsCount = 0;
      return this;
    }
  }, {
    key: "emit",
    value: function emit(type) {
      //UNFINISHED: emit error
      var params = [];
      var events = this._events;
      var handlers = events[type];
      var i = 1;

      while (i < arguments.length) {
        params.push(arguments[i]);
        i++;
      }

      if (handlers === undefined) return false;

      if (typeof handlers === "function") {
        ReflectApply(handlers, this, params);
        return true;
      } else if (Array.isArray(handlers)) {
        //handlers is a array
        //XXX: why should copy handlers when handler in handlers is still a reference type
        var copyHandlers = arrayClone(handlers, handlers.length); //LIFO

        for (i = copyHandlers.length - 1; i >= 0; i--) {
          ReflectApply(copyHandlers[i], this, params);
        }

        return true;
      } else {
        //handlers is either undefined function nor array
        throw new TypeError("listeners in ".concat(type, " is either undefined function nor array !"));
      }
    }
  }, {
    key: "getListeners",
    value: function getListeners(type) {
      var events = this._events;
      if (events === undefined) return [];
      var handlers = events[type];
      if (handlers === undefined) return [];else if (typeof handlers === "function") return [handlers];else if (Array.isArray(handlers)) return arrayClone(handlers, handlers.length);
    }
  }, {
    key: "getListenerCount",
    value: function getListenerCount(type) {
      var handlers = this.getListeners(type);
      return handlers.length;
    }
  }, {
    key: "getAllEvents",
    value: function getAllEvents() {
      if (this._events === undefined) return [];else {
        return ReflectOwnkeys(this._events);
      }
    }
  }, {
    key: "hasEvent",
    value: function hasEvent(type) {
      if (this._events === undefined) return false;else {
        if (this._events[type] !== undefined) return true;
        return false;
      }
    }
  }]);

  return Broadcast;
}();

var defaultMaxListener = 10;

var isNaN = function isNaN(val) {
  return Number.isNaN(val) || val !== val;
};

Object.defineProperty(Broadcast, "defaultMaxListener", {
  enumerable: true,
  get: function get() {
    return defaultMaxListener;
  },
  set: function set(count) {
    if (typeof count === "number" && count > -1 && !isNaN(count)) {
      defaultMaxListener = count;
    } else {
      throw new RangeError("defaultMaxListener should be a non-negative number! Received ".concat(defaultMaxListener));
    }
  }
});

Broadcast.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    var events = Object.create(null);
    this._events = events;
    this._eventsCount = 0;
  }
};

function arrayClone(arr, len) {
  return arr.slice(0, len);
}
/**
 *
 * @param {Broadcast} target Broadcast instance
 * @param {String} type key of target._events
 * @param {Function} listener value of target._events
 * @param {Boolean} prepend whether to emit first when trigger type
 */


function _addListener(target, type, listener, prepend) {
  var events = target._events;
  var handlers;
  var handlersLen = 0;

  if (typeof listener !== "function") {
    throw new TypeError("listener expect to be of type Function, but received ".concat(_typeof(listener), "!"));
  }

  if (events === undefined) {
    target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    //if global listener addListener exists, emit addListener XXX: should default add addListener/removeListener type when init?
    if (events[TYPES.addListener] !== undefined) {
      //XXX: Will it be better to emit wrapped function when this.once(type)
      target.emit(TYPES.addListener, type, listener); //XXX: Is it necessary in event.js: Re-assign `events` because a addListener handler could have caused the this._events to be assigned to a new object

      events = target._events;
    }

    handlers = events[type];

    if (handlers === undefined) {
      events[type] = listener;
    } else if (typeof handlers === "function") {
      events[type] = prepend ? [listener, handlers] : [handlers, listener];
      handlersLen = 1;
    } else if (Array.isArray(handlers)) {
      prepend ? handlers.unshift(listener) : handlers.push(listener);
      handlersLen = handlers.length;
    } else {
      //handlers is either undefined function nor array
      throw new TypeError("listeners in ".concat(type, " is either undefined function nor array !"));
    }
  } //whether handlers length is more than maxListener or not


  var maxListener = target.getMaxListeners();

  if (maxListener < handlersLen) {
    //this is not a error,should print a warning
    console.warn("listeners in ".concat(type, " is more than maxListener ").concat(maxListener, "!"));
  }

  return target;
}
/**
 *
 * @param {Broadcast} target
 */


function $getMaxListeners(target) {
  if (target._maxListener) return target._maxListener;
  return Broadcast.defaultMaxListener;
}
/**
 *
 * @param {Object} target  handler.apply(target,params)
 * @param {Function} handler
 * @param {ArrayLike} params
 */


function ReflectApply(handler, target, params) {
  return Function.prototype.apply.call(handler, target, params);
}
/**
 *
 * @param {Broadcast} target
 * @param {String} type
 * @param {Function} listener
 *
 * @description bind wrapped function to target._events
 */


function _onceWrap(target, type, listener) {
  //return wrapped listener & target bind wrapped listener
  var wrapper = {
    fired: false,
    target: target,
    type: type,
    listener: listener,
    wrapFn: undefined
  };
  var wrapFn = onceWrapper.bind(wrapper);
  wrapper.wrapFn = wrapFn;
  wrapFn.listener = listener;
  return wrapFn;
}
/**
 * @description wrap listener which emit once
 */


function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, arguments);
  }
}
/**
 *
 * @param {Broadcast} target
 *
 * @description get target own properties includes symbol properties , same with Reflect.ownKeys
 */


function ReflectOwnkeys(target) {
  return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
}

if (typeof define !== "undefined" && define.amd) {
  define(function () {
    return Broadcast;
  });
} else {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Broadcast;
  } else {
    window.Broadcast = Broadcast;
  }
}