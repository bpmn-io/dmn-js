(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DecisionTable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var assign = require('lodash.assign'),
    restParam = require('lodash.restparam');

/**
 * Used by `_.defaults` to customize its `_.assign` use.
 *
 * @private
 * @param {*} objectValue The destination object property value.
 * @param {*} sourceValue The source object property value.
 * @returns {*} Returns the value to assign to the destination object.
 */
function assignDefaults(objectValue, sourceValue) {
  return objectValue === undefined ? sourceValue : objectValue;
}

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object for all destination properties that resolve to `undefined`. Once a
 * property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var defaults = restParam(function(args) {
  var object = args[0];
  if (object == null) {
    return object;
  }
  args.push(assignDefaults);
  return assign.apply(undefined, args);
});

module.exports = defaults;

},{"lodash.assign":2,"lodash.restparam":12}],2:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseAssign = require('lodash._baseassign'),
    createAssigner = require('lodash._createassigner'),
    keys = require('lodash.keys');

/**
 * A specialized version of `_.assign` for customizing assigned values without
 * support for argument juggling, multiple sources, and `this` binding `customizer`
 * functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 */
function assignWith(object, source, customizer) {
  var index = -1,
      props = keys(source),
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it is invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments:
 * (objectValue, sourceValue, key, object, source).
 *
 * **Note:** This method mutates `object` and is based on
 * [`Object.assign`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(function(object, source, customizer) {
  return customizer
    ? assignWith(object, source, customizer)
    : baseAssign(object, source);
});

module.exports = assign;

},{"lodash._baseassign":3,"lodash._createassigner":5,"lodash.keys":8}],3:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseCopy = require('lodash._basecopy'),
    keys = require('lodash.keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"lodash._basecopy":4,"lodash.keys":8}],4:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],5:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var bindCallback = require('lodash._bindcallback'),
    isIterateeCall = require('lodash._isiterateecall'),
    restParam = require('lodash.restparam');

/**
 * Creates a function that assigns properties of source object(s) to a given
 * destination object.
 *
 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"lodash._bindcallback":6,"lodash._isiterateecall":7,"lodash.restparam":12}],6:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = bindCallback;

},{}],7:[function(require,module,exports){
/**
 * lodash 3.0.9 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isIterateeCall;

},{}],8:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative'),
    isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? null : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"lodash._getnative":9,"lodash.isarguments":10,"lodash.isarray":11}],9:[function(require,module,exports){
/**
 * lodash 3.9.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  escapeRegExp(fnToString.call(hasOwnProperty))
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = getNative;

},{}],10:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) && objToString.call(value) == argsTag;
}

module.exports = isArguments;

},{}],11:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  escapeRegExp(fnToString.call(hasOwnProperty))
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = isArray;

},{}],12:[function(require,module,exports){
/**
 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],13:[function(require,module,exports){
'use strict';
/*global module: false, deps: true, require: false*/

if (typeof window === 'undefined') { var deps = require; }
else { var deps = window.deps; }

var State = deps('ampersand-state');
var Collection = deps('ampersand-collection');

var CellModel = State.extend({
  props: {
    value: 'string'
  },

  session: {
    editable: {
      type: 'boolean',
      default: true
    }
  },

  derived: {
    rule: {
      deps: [
        'collection',
        'collection.parent'
      ],
      fn: function () {
        return this.collection.parent;
      }
    },


    table: {
      deps: [
        'rule.collection',
        'rule.collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.rule.collection.parent;
      }
    },

    x: {
      deps: [
        'collection'
      ],
      cache: false,
      fn: function () {
        var cell = this;
        var cells = cell.collection;
        return cells.indexOf(cell);
      }
    },

    y: {
      deps: [
        'rule',
        'rule.collection'
      ],
      cache: false,
      fn: function () {
        var rules = this.rule.collection;
        return rules.indexOf(this.rule);
      }
    },

    focused: {
      deps: [
        'table',
        'table.x',
        'table.y',
        'x',
        'y'
      ],
      cache: false,
      fn: function () {
        return this.x === this.table.x && this.y === this.table.y;
      }
    },

    clauseDelta: {
      deps: [
        'table',
        'collection',
        'table.inputs',
        'table.outputs'
      ],
      fn: function () {
        var delta = this.collection.indexOf(this);
        var inputs = this.table.inputs.length;
        var outputs = this.table.inputs.length + this.table.outputs.length;

        if (delta < inputs) {
          return delta;
        }
        else if (delta < outputs) {
          return delta - inputs;
        }

        return 0;
      }
    },

    type: {
      deps: [
        'table',
        'collection',
        'table.inputs',
        'table.outputs'
      ],
      cache: false,
      fn: function () {
        var delta = this.collection.indexOf(this);
        var inputs = this.table.inputs.length;
        var outputs = this.table.inputs.length + this.table.outputs.length;

        if (delta < inputs) {
          return 'input';
        }
        else if (delta < outputs) {
          return 'output';
        }

        return 'annotation';
      }
    },

    clause: {
      deps: [
        'table',
        'collection',
        'collection.length',
        'type',
        'clauseDelta'
      ],
      cache: false,
      fn: function () {
        if (this.clauseDelta < 0 || this.type === 'annotation') { return; }
        var clause = this.table[this.type +'s'].at(this.clauseDelta);
        return clause;
      }
    },

    choices: {
      deps: [
        'table',
        'collection.length',
        'type',
        'clause',
        'clauseDelta'
      ],
      cache: false,
      fn: function () {
        if (!this.clause || !this.clause.choices) { return; }
        return this.clause.choices.map(function (val) {
          return {value: val};
        });
      }
    }
  }
});

module.exports = {
  Model: CellModel,
  Collection: Collection.extend({
    model: CellModel
  })
};

},{}],14:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var merge = deps('lodash.merge');


var ChoiceView = require('./choice-view');
var RuleCellView = View.extend(merge({}, ChoiceView.prototype, {
  template: '<td><span contenteditable></span></td>',

  bindings: merge({}, ChoiceView.prototype.bindings, {
    'model.value': {
      type: 'text',
      selector: '[contenteditable]'
    },

    'model.editable': {
      type: 'booleanAttribute',
      name: 'contenteditable',
      selector: '[contenteditable]'
    },

    'model.spellchecked': {
      type: 'booleanAttribute',
      name: 'spellcheck',
      selector: '[contenteditable]'
    },

    'model.type': {
      type: 'class'
    }
  }),

  events: merge({}, ChoiceView.prototype.events, {
    'contextmenu':                    '_handleContextMenu',
    'contextmenu [contenteditable]':  '_handleContextMenu',
    'click':                          '_handleClick',
    'click [contenteditable]':        '_handleClick'
  }),

  _focusPseudo: function () {
    var el = this.editableEl();
    if (!el) {
      return;
    }

    el.focus();
  },

  _handleFocus: function () {
    ChoiceView.prototype._handleFocus.apply(this, arguments);

    var table = this.model.table;
    var cell = this.model;
    var cells = cell.collection;
    var rule = cells.parent;
    var rules = table.rules;

    var x = cells.indexOf(cell);
    var y = rules.indexOf(rule);

    if (table.x !== x || table.y !== y) {
      table.set({
        x: x,
        y: y
      }, {
        // silent: true
      });
      table.trigger('change:focus');
    }

    this.parent.parent.hideContextMenu();
  },

  _handleClick: function () {
    this.parent.parent.hideContextMenu();
    this._focusPseudo();
  },

  _handleContextMenu: function (evt) {
    this.parent.parent.showContextMenu(this.model, evt);
  },

  setFocus: function () {
    if (!this.el) { return; }

    if (this.model.focused) {
      this.el.classList.add('focused');

      if (this.parent.parent.contextMenu) {
        this.parent.parent.contextMenu.close();
      }

      if (this.parent.parent.clauseValuesEditor) {
        this.parent.parent.clauseValuesEditor.hide();
      }

      if (this.parent.parent.clauseExpressionEditor) {
        this.parent.parent.clauseExpressionEditor.hide();
      }

      if (Element.prototype.contains && document.activeElement.contains(this.editableEl())) {
        this._focusPseudo();
      }
    }
    else {
      this.el.classList.remove('focused');
    }

    if (this.model.x === this.model.table.x) {
      this.el.classList.add('col-focused');
    }
    else {
      this.el.classList.remove('col-focused');
    }

    if (this.model.y === this.model.table.y) {
      this.el.classList.add('row-focused');
    }
    else {
      this.el.classList.remove('row-focused');
    }
  },

  initialize: function () {
    this.on('change:el', this.setFocus);
    this.listenToAndRun(this.model.table, 'change:focus', this.setFocus);
  }
}));



var RuleInputCellView = RuleCellView.extend({});

var RuleOutputCellView = RuleCellView.extend({});

var RuleAnnotationCellView = RuleCellView.extend({});



module.exports = {
  Cell:       RuleCellView,
  Input:      RuleInputCellView,
  Output:     RuleOutputCellView,
  Annotation: RuleAnnotationCellView
};

},{"./choice-view":15}],15:[function(require,module,exports){
'use strict';
/* global deps: false, require: false, module: false */
var View = deps('ampersand-view');

var SuggestionsView = require('./suggestions-view');

var suggestionsView = SuggestionsView.instance();

var specialKeys = [
  8 // backspace
];

var ChoiceView = View.extend({
  collections: {
    choices: SuggestionsView.Collection
  },

  events: {
    input: '_handleInput',
    'input [contenteditable]': '_handleInput',
    focus: '_handleFocus',
    'focus [contenteditable]': '_handleFocus'
  },

  session: {
    valid:          {
      default: true,
      type: 'boolean'
    },

    originalValue:  'string'
  },

  derived: {
    isOriginal: {
      deps: ['model.value', 'originalValue'],
      fn: function () {
        return this.model.value === this.originalValue;
      }
    }
  },

  bindings: {
    'model.value': {
      type: function (el, value) {
        if (!value || !value.trim()) { return; }
        this.el.textContent = value.trim();
      }
    },

    'model.focused': {
      type: 'booleanClass',
      name: 'focused'
    },

    isOriginal: {
      type: 'booleanClass',
      name: 'untouched'
    }
  },

  editableEl: function () {
    return this.query('[contenteditable]') || this.el;
  },

  initialize: function (options) {
    options = options || {};
    if (this.el) {
      this.el.contentEditable = true;
      this.el.spellcheck = false;
      this.originalValue = this.value = this.el.textContent.trim();
    }
    else {
      this.originalValue = this.value;
    }


    this.listenToAndRun(this.model, 'change:choices', function () {
      var choices = this.model.choices;
      if (!this.choices) {
        return;
      }
      if (!choices) {
        choices = [];
      }

      this.choices.reset(choices.map(function (choice) {
        return {value: choice};
      }));
    });

    this.suggestions = new SuggestionsView.Collection({
      parent: this.choices
    });
  },

  _filter: function (val) {
    var choices = this.model.choices || this.choices;
    var el = this.editableEl();
    var filtered = choices
          .filter(function (choice) {
            return choice.value.indexOf(val) === 0;
          })
          .map(function (choice) {
            var chars = el.textContent.length;
            var val = choice.escape ? choice.escape('value') : choice.value;
            var htmlStr = '<span class="highlighted">' + val.slice(0, chars) + '</span>';
            htmlStr += val.slice(chars);
            return {
              value: choice.value,
              html: htmlStr
            };
          }, this);
    return filtered;
  },

  _handleFocus: function () {
    this._handleInput();
  },

  _handleResize: function () {
    if (!this.el || !suggestionsView) { return; }
    var node = this.el;
    var top = node.offsetTop;
    var left = node.offsetLeft;
    var helper = suggestionsView.el;

    while ((node = node.offsetParent)) {
      if (node.offsetTop) {
        top += parseInt(node.offsetTop, 10);
      }
      if (node.offsetLeft) {
        left += parseInt(node.offsetLeft, 10);
      }
    }

    top -= helper.clientHeight;
    helper.style.top = top;
    helper.style.left = left;
  },

  _handleInput: function (evt) {
    if (evt && (specialKeys.indexOf(evt.keyCode) > -1 || evt.ctrlKey)) {
      return;
    }
    var el = this.editableEl();
    var val = el.textContent.trim();

    var filtered = this._filter(val);
    suggestionsView.show(filtered, this);
    this._handleResize();

    if (filtered.length === 1) {
      if (evt) {
        evt.preventDefault();
      }

      var matching = filtered[0].value;
      this.model.set({
        value: matching
      }, {
        silent: true
      });
      el.textContent = matching;
    }
  }
});

module.exports = ChoiceView;

},{"./suggestions-view":32}],16:[function(require,module,exports){
'use strict';
/*global module: false, deps: true, require: false*/

if (typeof window === 'undefined') { var deps = require; }
else { var deps = window.deps; }

var State = deps('ampersand-state');
var Collection = deps('ampersand-collection');

var ClauseModel = State.extend({
  /*
  collections: {
    choices: Collection.extend({
      model: State.extend({
        props: {
          value: 'string'
        }
      })
    })
  },
  */

  props: {
    label:    'string',
    choices:  'array',
    source:   'string',
    language: {type: 'string', default: 'COBOL'},
    datatype: {type: 'string', default: 'string'}
  },

  session: {
    editable: {
      type: 'boolean',
      default: true
    }
  },

  derived: {
    mapping: {
      deps: [
        'language',
        'source'
      ],
      // cache: false,
      fn: function () {
        return this.language;
      }
    }
  }
});

module.exports = {
  Model: ClauseModel,
  Collection: Collection.extend({
    model: ClauseModel
  })
};

},{}],17:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var merge = deps('lodash.merge');
var contextViewsMixin = require('./context-views-mixin');


var LabelView = View.extend(merge({}, {
  events: {
    'focus':                          '_handleFocus',
    'focus [contenteditable]':        '_handleFocus',
    'click':                          '_handleFocus',
    'click [contenteditable]':        '_handleFocus',
    'input':                          '_handleInput',
    'input [contenteditable]':        '_handleInput',
    'contextmenu':                    '_handleContextMenu',
    'contextmenu [contenteditable]':  '_handleContextMenu',
  },

  derived: merge({}, contextViewsMixin, {
    table: {
      deps: [
        'model',
        'model.collection',
        'model.collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.model.collection.parent;
      }
    }
  }),

  bindings: {
    'model.label': {
      type: function (el, val) {
        var editable = this.editableEl();
        if (document.activeElement === editable) { return; }
        editable.textContent = (val || '').trim();
      }
    }
  },

  editableEl: function () {
    return this.query('[contenteditable]') || this.el;
  },

  _handleFocus: function () {
    this.table.x = this.model.x;
    this.table.trigger('change:focus');
  },

  _handleInput: function () {
    this.model.label = this.editableEl().textContent.trim();
    this._handleFocus();
  },

  _handleContextMenu: function (evt) {
    var type = this.model.clauseType;
    var table = this.table;
    this._handleFocus();

    var addMethod = type === 'input' ? 'addInput' : 'addOutput';

    this.contextMenu.open({
      parent: this,
      top: evt.pageY,
      left: evt.pageX,
      commands: [
        {
          label: type === 'input' ? 'Input' : 'Output',
          icon: type,
          className: type,
          subcommands: [
            {
              label: 'add',
              icon: 'plus',
              fn: function () {
                table[addMethod]();
              },
              subcommands: [
                {
                  label: 'before',
                  icon: 'left',
                  fn: function () {
                    table[addMethod]();
                  }
                },
                {
                  label: 'after',
                  icon: 'right',
                  fn: function () {
                    table[addMethod]();
                  }
                }
              ]
            },
            {
              label: 'copy',
              // icon: 'plus',
              fn: function () {},
              subcommands: [
                {
                  label: 'before',
                  icon: 'left',
                  fn: function () {}
                },
                {
                  label: 'after',
                  icon: 'right',
                  fn: function () {}
                }
              ]
            },
            {
              label: 'move',
              // icon: 'plus',
              fn: function () {},
              subcommands: [
                {
                  label: 'before',
                  icon: 'left',
                  fn: function () {}
                },
                {
                  label: 'after',
                  icon: 'right',
                  fn: function () {}
                }
              ]
            },
            {
              label: 'remove',
              icon: 'minus',
              fn: function () {}
            }
          ]
        }
      ]
    });

    try {
      evt.preventDefault();
    } catch (e) {}
  },

  initialize: function () {
    var editable = document.createElement('span');
    editable.setAttribute('contenteditable', true);
    editable.textContent = (this.model.label || '').trim();
    this.el.innerHTML = '';
    this.el.appendChild(editable);
  }
}));


module.exports = LabelView;

},{"./context-views-mixin":24}],18:[function(require,module,exports){
'use strict';
/* global module: false, deps: false, require: false */

var View = deps('ampersand-view');
var merge = deps('lodash.merge');
var contextViewsMixin = require('./context-views-mixin');



var MappingView = View.extend(merge({}, {
  events: {
    'contextmenu': '_handleContextMenu'
  },

  derived: merge({}, contextViewsMixin, {
    table: {
      deps: [
        'model',
        'model.collection',
        'model.collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.model.collection.parent;
      }
    }
  }),

  bindings: {
    'model.mapping': {
      type: function (el, val) {
        if (document.activeElement === el) { return; }
        el.textContent = (val || '').trim();
      }
    }
  },

  _handleInput: function () {
    this.model.mapping = this.el.textContent.trim();
  },

  _handleContextMenu: function (evt) {
    if (evt.defaultPrevented) { return; }
    this.clauseExpressionEditor.show(this.model, this);
    evt.preventDefault();
  },

  initialize: function () {
    // this.el.setAttribute('contenteditable', true);
    this.el.textContent = (this.model.mapping || '').trim();
  }
}));

module.exports = MappingView;

},{"./context-views-mixin":24}],19:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var merge = deps('lodash.merge');
var contextViewsMixin = require('./context-views-mixin');

var ValueView = View.extend(merge({}, {
  events: {
    'contextmenu':    '_handleContextMenu'
  },

  derived: merge({}, contextViewsMixin, {
    table: {
      deps: [
        'model',
        'model.collection',
        'model.collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.model.collection.parent;
      }
    }
  }),

  bindings: {
    'model.choices': {
      type: function (el) {
        this._renderContent(el);
      }
    },
    'model.datatype': {
      type: function (el) {
        this._renderContent(el);
      }
    }
  },

  _renderContent: function (el) {
    var str = '';
    var val = this.model.choices;
    if (Array.isArray(val) && val.length) {
      str = '(' + val.join(', ') + ')';
    }
    else {
      str = this.model.datatype;
    }
    el.textContent = str;
  },

  _handleContextMenu: function (evt) {
    if (evt.defaultPrevented) { return; }
    this.clauseValuesEditor.show(this.model.datatype, this.model.choices, this);
    evt.preventDefault();
  }
}));




module.exports = ValueView;

},{"./context-views-mixin":24}],20:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var LabelView = require('./clause-label-view');
var ValueView = require('./clause-value-view');
var MappingView = require('./clause-mapping-view');





var requiredElement = {
  type: 'element',
  required: true
};

var ClauseView = View.extend({
  session: {
    labelEl:    requiredElement,
    mappingEl:  requiredElement,
    valueEl:    requiredElement
  },

  derived: {
    table: {
      deps: [
        'model',
        'model.collection',
        'model.collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.model.collection.parent;
      }
    }
  },

  initialize: function () {
    var clause = this.model;
    var self = this;

    var subviews = {
      label:    LabelView,
      mapping:  MappingView,
      value:    ValueView
    };

    Object.keys(subviews).forEach(function (kind) {
      this.listenToAndRun(this.model, 'change:' + kind, function () {
        if (this[kind + 'View']) {
          this.stopListening(this[kind + 'View']);
        }

        this[kind + 'View'] = new subviews[kind]({
          parent: this,
          model:  clause,
          el:     this[kind + 'El']
        });
      });
    }, this);

    function tableChangeFocus() {
      if (self.model.focused) {
        self.labelEl.classList.add('col-focused');
        self.mappingEl.classList.add('col-focused');
        self.valueEl.classList.add('col-focused');
      }
      else {
        self.labelEl.classList.remove('col-focused');
        self.mappingEl.classList.remove('col-focused');
        self.valueEl.classList.remove('col-focused');
      }
    }
    this.table.on('change:focus', tableChangeFocus);
    tableChangeFocus();
  }
});




module.exports = ClauseView;

},{"./clause-label-view":17,"./clause-mapping-view":18,"./clause-value-view":19}],21:[function(require,module,exports){
'use strict';
/* global module: false, deps: false, require: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');
var ComboBoxView = require('./combobox-view');


function elBox(el) {
  var node = el;
  var box = {
    top: el.offsetTop,
    left: el.offsetLeft,
    width: el.offsetWidth,
    height: el.offsetHeight
  };

  while ((node = node.offsetParent)) {
    if (node.offsetTop) {
      box.top += parseInt(node.offsetTop, 10);
    }
    if (node.offsetLeft) {
      box.left += parseInt(node.offsetLeft, 10);
    }
  }

  return box;
}


var LanguagesCollection = Collection.extend({
  last: function () {
    return this.models[this.models.length - 1];
  },

  restripe: function () {
    var models = this.filter(function (model) {
      return model.value;
    });

    models.push({
      value: ''
    });

    this.reset(models);

    return this;
  },

  model: State.extend({
    props: {
      value: 'string'
    },

    initialize: function () {
      this.on('change:value', function () {
        this.collection.restripe();
      });
    }
  })
});








var LanguagesCollection = Collection.extend({
  mainIndex: 'value',
  model: State.extend({
    props: {
      value: 'string',
      placeholder: 'string'
    }
  })
});




var defaultLanguage = [
  {
    value: 'FEEL'
  },
  {
    value: 'LUA'
  },
  {
    value: 'COBOL'
  },
  {
    value: 'PHP',
    placeholder: 'return $obj[\'propertyName\'];'
  },
  {
    value: 'LISP'
  },
  {
    value: 'Scala'
  },
  {
    value: 'C'
  },
  {
    value: 'Javascript',
    placeholder: 'return obj.propertyName;'
  },
  {
    value: 'Groovy'
  },
  {
    value: 'Python'
  },
  {
    value: 'Perl'
  }
];


var ClauseExpressionView = View.extend({
  template: '<div class="dmn-clauseexpression-setter">' +
              '<div class="language"></div>' +

              '<div class="source">' +
                '<label>Source:</label>' +
                '<textarea></textarea>' +
                '<span class="toggle-editor-size"></span>' +
              '</div>' +
            '</div>',

  subviews: {
    languageView: {
      container: '.language',
      prepareView: function (el) {
        var comboboxView = new ComboBoxView({
          parent:     this,
          collection: this.languages,
          value:      this.language,
          label:      'Language:',
          className:  el.className
        });

        var cbEl = comboboxView.render().el;
        el.parentNode.replaceChild(cbEl, el);

        this.listenTo(comboboxView, 'change:value', function () {
          this.language = comboboxView.value;
          var info = this.languages.get(this.language);
          if (!info) { return; }
          this.placeholder = info.placeholder || '';
        });

        this.on('change:visible', function () {
          if (this.visible) {
            comboboxView.setVisible();
          }
          else {
            comboboxView.suggestionsEl.style.display = 'none';
          }
        });

        return comboboxView;
      }
    }
  },

  collections: {
    languages: LanguagesCollection,
    possibleLanguages: LanguagesCollection
  },

  session: {
    visible:      'boolean',
    big:          'boolean',
    language:     {type: 'string', default: 'FEEL'},
    placeholder:  'string',
    originalBox:  'any'
  },

  derived: {
    contextMenu: {
      cache: false,
      fn: function () {
        var current = this;
        while ((current = current.parent)) {
          if (current.contextMenu) {
            return current.contextMenu;
          }
        }
      }
    },
    tableView: {
      dep: ['parent'],
      cache: false,
      fn: function () {
        var parent = this.parent;
        while ((parent = parent.parent)) {
          if (parent.tableEl instanceof Element) {
            return parent;
          }
        }
      }
    }
  },

  bindings: {
    visible: {
      type: 'toggle'
    },
    placeholder: {
      type: 'attribute',
      selector: 'textarea',
      name: 'placeholder'
    }
  },

  events: {
    'change select':              '_handleLanguageChange',
    'input textarea':             '_handleSourceInput',
    'click .toggle-editor-size':  '_handleSizeClick'
  },

  _handleLanguageChange: function () {
    this.language = this.languageEl.value;
  },

  _handleSourceInput: function () {

  },

  _handleSizeClick: function () {
    this.big = !this.big;
  },

  initialize: function () {
    var self = this;

    function hasModel() {
      return self.parent && self.parent.model && self.parent.model.language;
    }

    this.on('change:language', function () {
      if (!hasModel()) { return; }

      this.parent.model.language = this.language;
    });

    this.on('change:big', function () {
      var style = this.el.style;
      var box;

      if (this.big) {
        this.el.classList.add('big');

        box = elBox(this.tableView.el);

        style.width = box.width +'px';
        style.height = box.height +'px';
      }
      else {
        this.el.classList.remove('big');

        box = this.originalBox;

        style.width = 'auto';
        style.height = 'auto';
      }

      this._resizeTextarea(box);

      style.top = box.top +'px';
      style.left = box.left +'px';
    });
  },

  setPosition: function () {
    if (!this.parent || !this.parent.el) {
      this.visible = false;
      return;
    }

    var helper = this.el;
    var box = elBox(this.parent.el);

    box.left += this.parent.el.clientWidth;
    box.top -= 20;

    box.left += Math.min(document.body.clientWidth - (box.left + this.el.clientWidth), 0);
    box.top += Math.min(document.body.clientHeight - (box.top + this.el.clientHeight), 0);

    helper.style.top = box.top +'px';
    helper.style.left = box.left +'px';

    if (this.languageView) {
      this.languageView.setPosition();
    }

    this.originalBox = elBox(this.el);
  },

  _resizeTextarea: function (box) {
    var labelHeight = this.sourceEl.parentNode.clientHeight - this.sourceEl.clientHeight;
    this.sourceEl.style.height = (box.height - (this.languageEl.clientHeight + labelHeight)) + 'px';
  },

  show: function (model, parent) {
    if (!model) {
      return;
    }
    if (parent && this.parent !== parent) {
      this.parent = parent;
    }
    this.model = model;

    this.languages.reset(defaultLanguage);

    this.languageView.inputEl.value = this.model.language || '';


    instance.visible = true;
    if (this.parent) {
      if (this.parent.contextMenu) {
        this.parent.contextMenu.close();
      }
      if (this.parent.clauseValuesEditor) {
        this.parent.clauseValuesEditor.hide();
      }
    }

    this.setPosition();

    return this;
  },

  hide: function () {
    this.visible = false;
    return this;
  },

  render: function () {
    this.renderWithTemplate();

    this.cacheElements({
      languageEl: '.language',
      sourceEl:   '.source textarea'
    });

    this.sourceEl.setAttribute('id', this.cid);
    this.query('.source label').setAttribute('for', this.cid);

    return this;
  }
});



var instance;
ClauseExpressionView.instance = function (suggestions, parent) {
  if (!instance) {
    instance = new ClauseExpressionView({});
    instance.render();
  }

  if (!document.body.contains(instance.el)) {
    document.body.appendChild(instance.el);
  }

  instance.show(suggestions, parent);

  return instance;
};


if (typeof window !== 'undefined') {
  window.dmnClauseExpressionEditor = ClauseExpressionView.instance();
}

ClauseExpressionView.Collection = LanguagesCollection;

module.exports = ClauseExpressionView;

},{"./combobox-view":23}],22:[function(require,module,exports){
'use strict';
/* global module: false, deps: false, require: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');
var ComboBoxView = require('./combobox-view');



var ValuesCollection = Collection.extend({
  last: function () {
    return this.models[this.models.length - 1];
  },

  restripe: function () {
    var models = this.filter(function (model) {
      return model.value;
    });

    models.push({
      value: ''
    });

    this.reset(models);

    return this;
  },

  model: State.extend({
    props: {
      value: 'string'
    },

    initialize: function () {
      this.on('change:value', function () {
        this.collection.restripe();
      });
    }
  })
});

var ValuesItemView = View.extend({
  template: '<li><input tabindex="1" placeholder="An other possible value" /></li>',

  session: {
    invalid: 'boolean'
  },

  bindings: {
    'model.value': {
      type: 'value',
      selector: 'input'
    },
    invalid: {
      type: 'booleanClass',
      name: 'invalid',
      selector: 'input'
    }
  },

  events: {
    'change input':   '_handleValueChange',
    'blur input':     '_handleValueChange',
    'keydown input':  '_handleValueKeydown',
    'keyup input':    '_handleValueKeyup'
  },

  _handleValueChange: function (evt) {
    if (this.model.value !== evt.target.value) {
      this.model.value = evt.target.value;
    }

    this.validate();
  },

  _handleValueKeydown: function (evt) {
    var code = evt.which || evt.keyCode;

    var collection = this.model.collection;
    var last = collection.last();

    if (last === this.model && evt.target.value) {
      collection.add({value: ''});
    }

    if (code === 9) {
      var inputs = this.parent.queryAll('.allowed-values input');
      var lastInput = inputs[inputs.length - 1];

      if (inputs.indexOf(evt.target) === (inputs.length - 2)) {
        lastInput.focus();
      }
    }
  },

  _handleValueKeyup: function (evt) {
    var collection = this.model.collection;
    var last = collection.last();

    if (last === this.model && evt.target.value) {
      collection.add({value: ''});
    }
  },

  validate: function () {
    var val = this.model.value;
    if (!val) {
      this.invalid = false;
      return this;
    }

    var cid = this.model.cid;
    var same = this.model.collection.filter(function (other) {
      return other.cid !== cid && other.value === val;
    });

    this.invalid = same.length > 0;

    return this;
  }
});







var DatatypesCollection = Collection.extend({
  mainIndex: 'value',
  model: State.extend({
    props: {
      value: 'string',
      offer: 'string'
    }
  })
});




var primitiveTypes = [
  {
    value: 'string',
    offer: 'choices'
  },
  {
    value: 'date',
    offer: 'range'
  },

  // https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html
  {
    value: 'short',
    offer: 'range'
  },
  {
    value: 'int',
    offer: 'range'
  },
  {
    value: 'long',
    offer: 'range'
  },
  {
    value: 'float',
    offer: 'range'
  },
  {
    value: 'double',
    offer: 'range'
  },

  {
    value: 'boolean'
  }
];


var ClauseValuesView = View.extend({
  template: '<div class="dmn-clausevalues-setter choices">' +
              '<div class="datatype">' +
              '</div>' +

              '<div class="allowed-values">' +
                '<label>Allowed values:</label>' +
                '<ul></ul>' +
              '</div>' +

              '<ul class="ranged-values">' +
                '<li class="min">' +
                  '<label>Min:</label>' +
                  '<input tabindex="1" />' +
                '</li>' +
                '<li class="max">' +
                  '<label>Max:</label>' +
                  '<input tabindex="2" />' +
                '</li>' +
              '</ul>' +
            '</div>',

  subviews: {
    datatypeView: {
      container: '.datatype',
      prepareView: function (el) {
        var comboboxView = new ComboBoxView({
          parent:     this,
          collection: this.datatypes,
          // value:      this.datatype,
          label:      'Type:',
          className:  el.className
        });

        var cbEl = comboboxView.render().el;
        el.parentNode.replaceChild(cbEl, el);

        this.listenTo(comboboxView, 'change:value', function () {
          this.datatype = comboboxView.value;
        });

        this.on('change:visible', function () {
          if (this.visible) {
            comboboxView.setVisible();
          }
          else {
            comboboxView.suggestionsEl.style.display = 'none';
          }
        });

        return comboboxView;
      }
    }
  },

  collections: {
    datatypes: DatatypesCollection,
    possibleValues: ValuesCollection
  },

  session: {
    visible: 'boolean',
    datatype: {type: 'string', default: 'string'}
  },

  derived: {
    contextMenu: {
      cache: false,
      fn: function () {
        var current = this;
        while ((current = current.parent)) {
          if (current.contextMenu) {
            return current.contextMenu;
          }
        }
      }
    }
  },

  bindings: {
    visible: {
      type: 'toggle'
    },
    datatype: [
      {
        type: function(el, val, prev) {
          if (!this.datatypes.length) { return; }
          var type;

          if (prev) {
            type = this.datatypes.get(prev);
            if (type) {
              el.classList.remove(type.offer);
            }
          }

          if (val) {
            type = this.datatypes.get(val);
            if (type) {
              el.classList.add(type.offer);
            }
          }
        }
      },
      {
        selector: '.min input',
        type: function (el, val) {
          var before = new Date();
          before.setFullYear(before.getFullYear() - 1);
          el.setAttribute('placeholder', val === 'date' ? before.toISOString().split('.').shift() : '');
        }
      },
      {
        selector: '.max input',
        type: function (el, val) {
          var after = new Date();
          after.setFullYear(after.getFullYear() + 1);
          el.setAttribute('placeholder', val === 'date' ? after.toISOString().split('.').shift() : '');
        }
      }
    ]
  },

  events: {
    'change select': '_handleDatatypeChange'
  },

  _handleDatatypeChange: function () {
    this.datatype = this.datatypeEl.value;
  },

  initialize: function () {
    var self = this;

    function hasModel() {
      return self.parent && self.parent.model && self.parent.model.datatype;
    }

    this.on('change:datatype', function () {
      if (!hasModel()) { return; }

      this.parent.model.datatype = this.datatype;
    });

    this.listenTo(this.possibleValues, 'all', function () {
      if (!hasModel()) { return; }

      this.parent.model.choices = this.possibleValues
                                    .filter(function (item) {
                                      return item.value;
                                    })
                                    .map(function (item) {
                                      return item.value;
                                    });
    });
  },

  setPosition: function () {
    if (!this.parent || !this.parent.el) {
      this.visible = false;
      return;
    }

    var node = this.parent.el;
    var top = node.offsetTop;
    var left = node.offsetLeft;
    var helper = this.el;

    while ((node = node.offsetParent)) {
      if (node.offsetTop) {
        top += parseInt(node.offsetTop, 10);
      }
      if (node.offsetLeft) {
        left += parseInt(node.offsetLeft, 10);
      }
    }

    left += this.parent.el.clientWidth;
    top -= 20;

    left += Math.min(document.body.clientWidth - (left + this.el.clientWidth), 0);
    top += Math.min(document.body.clientHeight - (top + this.el.clientHeight), 0);

    helper.style.position = 'absolute';
    helper.style.top = top +'px';
    helper.style.left = left +'px';


    if (this.datatypeView) {
      this.datatypeView.setPosition();
    }
  },

  show: function (datatype, values, parent) {
    if (parent && this.parent !== parent) {
      this.parent = parent;
    }

    this.datatypes.reset(primitiveTypes);

    if (this.datatype && !this.datatypeView.inputEl.value) {
      this.datatypeView.inputEl.value = this.datatype;
    }

    values = values || [];
    var vals = (Array.isArray(values) ? values.map(function (val) {
      return { value: val };
    }) : values.toJSON())
        .filter(function (item) {
          return item.value;
        });
    vals.push({ value: '' });

    this.possibleValues.reset(vals);

    instance.visible = true;
    if (this.parent) {
      if (this.parent.contextMenu) {
        this.parent.contextMenu.close();
      }
      if (this.parent.clauseExpressionEditor) {
        this.parent.clauseExpressionEditor.hide();
      }
    }

    if (instance.visible) {
      this.setPosition();
    }

    return this;
  },

  hide: function () {
    this.visible = false;
    return this;
  },

  render: function () {
    this.renderWithTemplate();

    this.cacheElements({
      valuesEl:   'ul',

      minLabelEl: '.min label',
      minInputEl: '.min input',

      maxLabelEl: '.max label',
      maxInputEl: '.max input'
    });

    this.renderCollection(this.possibleValues, ValuesItemView, this.valuesEl);

    this.listenTo(this.possibleValues, 'change', function () {
      this.trigger('change');
    });

    return this;
  }
});



var instance;
ClauseValuesView.instance = function (suggestions, parent) {
  if (!instance) {
    instance = new ClauseValuesView({});
    instance.render();
  }

  if (!document.body.contains(instance.el)) {
    document.body.appendChild(instance.el);
  }

  instance.show(suggestions, parent);

  return instance;
};


if (typeof window !== 'undefined') {
  window.dmnClauseValuesEditor = ClauseValuesView.instance();
}

ClauseValuesView.Collection = ValuesCollection;

module.exports = ClauseValuesView;

},{"./combobox-view":23}],23:[function(require,module,exports){
'use strict';
/* global module: false, deps: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');

// function toArray(thing) {
//   return Array.prototype.slice.apply(thing);
// }

var SuggestionsCollection = Collection.extend({
  model: State.extend({
    props: {
      value: 'string',
      html: 'string'
    }
  })
});

var SuggestionView = View.extend({
  template: '<li tabindex="1"></li>',

  bindings: {
    'model.value': {
      type: 'text'
    }
  },

  events: {
    click:    '_handleClick',
    focus:    '_handleFocus',
    keydown:  '_handleKeydown'
  },

  _handleClick: function () {
    this.parent.inputEl.value = this.parent.value = this.model.value;
    this.parent.collapse();
  },

  _handleFocus: function () {
    this.parent.inputEl.value = this.parent.value = this.model.value;
  },

  _handleKeydown: function (evt) {
    var code = evt.which || evt.keyCode;
    // enter
    if (code === 13) {
      this._handleClick();
      evt.preventDefault();
    }

    // tab
    else if (code === 9) {
      var next = this.el[evt.shiftKey ? 'previousSibling' : 'nextSibling'];
      if (!next) {
        next = this.parent.inputEl;
      }
      evt.preventDefault();
      next.focus();
    }

    // down
    else if (code === 40) {
      var next = this.el.nextSibling;
      if (!next) {
        next = this.parent.inputEl;
      }
      evt.preventDefault();
      next.focus();
    }

    // up
    else if (code === 38) {
      var next = this.el.previousSibling;
      if (!next) {
        next = this.parent.inputEl;
      }
      evt.preventDefault();
      next.focus();
    }

    // esc
    else if (code === 27) {
      this.el.parentNode.style.display = 'none';
    }
  }
});



var ComboBoxView = View.extend({
  template: '<div class="dmn-combobox">' +
              '<label></label>' +
              '<input tabindex="0" />' +
              '<span class="caret"></span>' +
            '</div>',

  collections: {
    suggestions: SuggestionsCollection
  },

  session: {
    value:      'string',
    label:      'string',
    className:  'string'
  },

  bindings: {
    className: {
      type: 'class'
    },

    label: {
      type: 'text',
      selector: 'label'
    },

    placeholder: {
      type: 'attribute',
      name: 'placeholder',
      selector: 'input'
    }
  },

  events: {
    'input input':    '_handleInput',
    'focus input':    '_handleFocus',
    'blur input':     '_handleBlur',
    'keydown input':  '_handleKeydown',
    'click .caret':   '_handleCaretClick'
  },

  derived: {
    expanded: {
      deps: [],
      cache: false,
      fn: function () {
        return this.suggestionsEl.style.display !== 'none';
      }
    }
  },

  _handleFocus: function () {
    this.setPosition();

    if (!this.suggestions.length) {
      this.suggestions.reset(this.collection.toJSON());
    }
  },

  _handleBlur: function () {},

  _handleInput: function () {
    this.setPosition();
    this.value = this.inputEl.value.trim();
    this.suggestions.reset(this.filter());
  },

  _handleKeydown: function (evt) {
    var code = evt.which || evt.keyCode;
    if (code === 9 || code === 40 || code === 38) {
      var views = this.suggestionsView.views;
      var view = views[evt.shiftKey || code === 38 ? views.length - 1 : 0];
      if (view) {
        if (!this.expanded) {
          this.expand();
        }
        view.el.focus();
        evt.preventDefault();
      }
    }

    // enter
    else if (code === 13) {
      this.toggle();
    }

    // esc
    else if (code === 27) {
      this.collapse();
    }
  },

  _handleCaretClick: function () {
    this.toggle();
  },

  expand: function () {
    if (!this.expanded) {
      this.suggestions.reset(this.collection.toJSON());
      this.el.classList.add('expanded');
    }
    return this;
  },

  collapse: function () {
    if (this.expanded) {
      this.suggestionsEl.style.display = 'none';
      this.el.classList.remove('expanded');
    }
    return this;
  },

  toggle: function () {
    this[this.expanded ? 'collapse' : 'expand']();
    return this;
  },

  filter: function () {
    var filtered = this.collection.filter(function (model) {
      return model.value.indexOf(this.value) > -1;
    }, this).map(function (model) {
      return model.toJSON();
    });
    return filtered;
  },

  initialize: function () {
    if (!this.collection) {
      throw new Error('ComboBoxView requires a collection option');
    }

    this.on('change:value', function () {
      if (!this.model || this.model.value === this.value) { return; }
      this.model.value = this.value;
    });
  },

  setPosition: function () {
    if (!this.parent || !this.parent.el) {
      this.visible = false;
      return;
    }

    var node = this.inputEl;
    var top = node.offsetTop + this.inputEl.clientHeight;
    var left = node.offsetLeft;
    var helper = this.suggestionsEl;

    while ((node = node.offsetParent)) {
      if (node.offsetTop) {
        top += parseInt(node.offsetTop, 10);
      }
      if (node.offsetLeft) {
        left += parseInt(node.offsetLeft, 10);
      }
    }

    helper.style.position = 'absolute';
    helper.style.top = top + 'px';
    helper.style.left = left + 'px';
    helper.style.width = this.inputEl.clientWidth + 'px';
  },

  setVisible: function () {
    var display = 'block';

    if (this.suggestions.length < 1) {
      display = 'none';
    }

    this.suggestionsEl.style.display = display;
    if (display === 'none') {
      this.el.classList.remove('expanded');
      return;
    }

    this.el.classList.add('expanded');

    this.setPosition();

    if (document.activeElement === this.inputEl) {
      return;
    }

    this.suggestionsView.views.forEach(function (view, v) {
      if (v === 0) {
        view.el.focus();
      }
    });
  },

  render: function () {
    if (this.rendered) {
      return this;
    }
    this.renderWithTemplate();

    this.cacheElements({
      labelEl: 'label',
      inputEl: 'input'
    });

    this.labelEl.setAttribute('for', this.cid);
    this.inputEl.setAttribute('id', this.cid);

    if (this.value && !this.inputEl.value) {
      this.inputEl.value = this.value;
    }

    this.suggestionsEl = document.createElement('ul');
    this.suggestionsEl.className = 'dmn-combobox-suggestions';
    document.body.appendChild(this.suggestionsEl);

    this.suggestionsView = this.renderCollection(this.suggestions, SuggestionView, this.suggestionsEl);

    this.listenToAndRun(this.suggestions, 'all', this.setVisible);

    return this;
  },

  remove: function () {
    document.body.removeChild(this.suggestionsEl);
    View.prototype.remove.apply(this);
  }
});

module.exports = ComboBoxView;

},{}],24:[function(require,module,exports){
'use strict';
/*global module: false*/

var mixins = module.exports = {};

[
  'clauseValuesEditor',
  'clauseExpressionEditor',
  'contextMenu'
].forEach(function (name) {
  mixins[name] = {
    cache: false,
    fn: function () {
      var current = this;
      while ((current = current.parent)) {
        if (current[name]) {
          return current[name];
        }
      }
    }
  };
});

},{}],25:[function(require,module,exports){
'use strict';
/* global module: false, deps: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');


var defaultCommands = [
  {
    label: 'Cell',
    subcommands: [
      {
        label: 'clear',
        icon: 'clear',
        hint: 'Clear the content of the focused cell',
        possible: function () {
          // console.info('clear possible?', arguments, this);
        },
        fn: function () {}
      }
    ]
  },
  {
    label: 'Rule',
    icon: '',
    subcommands: [
      {
        label: 'add',
        icon: 'plus',
        fn: function () {
          this.parent.model.addRule(this.scope);
        }
      },
      {
        label: 'copy',
        icon: 'copy',
        fn: function () {
          this.parent.model.copyRule(this.scope);
        },
        subcommands: [
          {
            label: 'above',
            icon: 'above',
            hint: 'Copy the rule above the focused one',
            fn: function () {
              this.parent.model.copyRule(this.scope, -1);
            }
          },
          {
            label: 'below',
            icon: 'below',
            hint: 'Copy the rule below the focused one',
            fn: function () {
              this.parent.model.copyRule(this.scope, 1);
            }
          }
        ]
      },
      {
        label: 'remove',
        icon: 'minus',
        hint: 'Remove the focused rule',
        fn: function () {
          this.parent.model.removeRule(this.scope);
        }
      },
      {
        label: 'clear',
        icon: 'clear',
        hint: 'Clear the focused rule',
        fn: function () {
          this.parent.model.clearRule(this.scope);
        }
      }
    ]
  },
  {
    label: 'Input',
    icon: 'input',
    subcommands: [
      {
        label: 'add',
        icon: 'plus',
        subcommands: [
          {
            label: 'before',
            icon: 'left',
            hint: 'Add an input clause before the focused one',
            fn: function () {
              this.parent.model.addInput();
            }
          },
          {
            label: 'after',
            icon: 'right',
            hint: 'Add an input clause after the focused one',
            fn: function () {
              this.parent.model.addInput();
            }
          }
        ]
      },
      {
        label: 'remove',
        icon: 'minus',
        fn: function () {
          this.parent.model.removeInput();
        }
      }
    ]
  },
  {
    label: 'Output',
    icon: 'output',
    subcommands: [
      {
        label: 'add',
        icon: 'plus',
        subcommands: [
          {
            label: 'before',
            icon: 'left',
            hint: 'Add an output clause before the focused one',
            fn: function () {
              this.parent.model.addOutput();
            }
          },
          {
            label: 'after',
            icon: 'right',
            hint: 'Add an output clause after the focused one',
            fn: function () {
              this.parent.model.addOutput();
            }
          }
        ]
      },
      {
        label: 'remove',
        icon: 'minus',
        fn: function () {
          this.parent.model.removeOutput();
        }
      }
    ]
  }
];









var CommandModel = State.extend({
  props: {
    label:      'string',
    hint:       'string',
    icon:       'string',
    href:       'string',
    className:  'string',

    possible: {
      type: 'any',
      default: function () { return function () {}; },
      test: function (newValue) {
        if (typeof newValue !== 'function' && newValue !== false) {
          return 'must be either a function or false';
        }
      }
    },

    fn: {
      type: 'any',
      default: false,
      test: function (newValue) {
        if (typeof newValue !== 'function' && newValue !== false) {
          return 'must be either a function or false';
        }
      }
    }
  },

  derived: {
    disabled: {
      deps: ['possible'],
      cache: false,
      fn: function () {
        return typeof this.possible === 'function' ? !this.possible() : false;
      }
    }
  },

  subcommands: null,

  initialize: function (attributes) {
    this.subcommands = new CommandsCollection(attributes.subcommands || [], {
      parent: this
    });
  }
});










var CommandsCollection = Collection.extend({
  model: CommandModel
});










var ContextMenuItem = View.extend({
  autoRender: true,

  template: '<li>' +
              '<a>' +
                '<span class="icon"></span>' +
                '<span class="label"></span>' +
              '</a>' +
              '<ul class="dropdown-menu"></ul>' +
            '</li>',

  bindings: {
    'model.label': {
      type: 'text',
      selector: '.label'
    },

    'model.hint': {
      type: 'attribute',
      name: 'title'
    },

    'model.fn': {
      type: 'booleanClass',
      selector: 'a',
      no: 'disabled'
    },

    'model.disabled': {
      type: 'booleanClass',
      name: 'disabled'
    },

    'model.subcommands.length': {
      type: 'booleanClass',
      name: 'dropdown'
    },

    'model.href': {
      selector: 'a',
      name: 'href',
      type: function (el, value) {
        if (!value) {
          el.removeAttribute('href');
        }
        else {
          el.setAttribute('href', value);
        }
      }
    },

    'model.icon': {
      type: function (el, value) {
        el.className = 'icon ' + value;
      },
      selector: '.icon'
    },

    'model.className': {
      type: 'class'
    }
  },

  events: {
    click:      '_handleClick',
    mouseover:  '_handleMouseover',
    mouseout:   '_handleMouseout'
  },

  render: function () {
    this.renderWithTemplate();
    this.listenToAndRun(this.model, 'change:subcommands', function () {
      this.renderCollection(this.model.subcommands, ContextMenuItem, this.query('ul'));
    });
    return this;
  },

  _handleClick: function (evt) {
    if (this.model.fn) {
      this.parent.triggerCommand(this.model, evt);
    }
    else if (!this.model.href) {
      evt.preventDefault();
    }
  },

  _handleMouseover: function () {

  },



  _handleMouseout: function () {

  },



  triggerCommand: function (command, evt) {
    this.parent.triggerCommand(command, evt);
  }
});














var ContextMenuView = View.extend({
  autoRender: true,

  template: '<nav class="dmn-context-menu">' +
              '<div class="coordinates">' +
                '<label>Coords:</label>' +
                '<span class="x"></span>' +
                '<span class="y"></span>' +
              '</div>' +
              '<ul></ul>' +
            '</nav>',

  collections: {
    commands: CommandsCollection
  },

  session: {
    isOpen: 'boolean',
    scope:  'state'
  },

  bindings: {
    isOpen: {
      type: 'toggle'
    },
    'parent.model.x': {
      type: 'text',
      selector: 'div span.x'
    },
    'parent.model.y': {
      type: 'text',
      selector: 'div span.y'
    }
  },

  open: function (options) {
    var style = this.el.style;

    style.left = options.left + 'px';
    style.top = options.top + 'px';

    this.isOpen = true;
    if (options.parent) {
      if (options.parent.clauseValuesEditor) {
        options.parent.clauseValuesEditor.hide();
      }
      if (options.parent.clauseExpressionEditor) {
        options.parent.clauseExpressionEditor.hide();
      }
    }

    this.scope = options.scope;
    var commands = options.commands || defaultCommands;

    this.commands.reset(commands);
    return this;
  },

  triggerCommand: function (command, evt) {
    command.fn.call(this, evt);
    if (!command.keepOpen) {
      this.close();
    }
    return this;
  },

  close: function () {
    this.isOpen = false;
    return this;
  },

  render: function () {
    this.renderWithTemplate();
    this.cacheElements({
      commandsEl: 'ul'
    });



    this.commandsView = this.renderCollection(this.commands, ContextMenuItem, this.commandsEl);
    return this;
  }
});











var instance;
ContextMenuView.instance = function () {
  if (!instance) {
    instance = new ContextMenuView();
  }

  if (!document.body.contains(instance.el)) {
    document.body.appendChild(instance.el);
  }

  return instance;
};

if (typeof window !== 'undefined') {
  window.dmnContextMenu = ContextMenuView.instance();
}

ContextMenuView.Collection = CommandsCollection;

module.exports = ContextMenuView;

},{}],26:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false, console: false */

var View = deps('ampersand-view');
var DecisionTable = require('./table-data');
var RuleView = require('./rule-view');




var ClauseHeaderView = require('./clause-view');

function toArray(els) {
  return Array.prototype.slice.apply(els);
}


function makeTd(type) {
  var el = document.createElement('td');
  el.className = type;
  return el;
}


function makeAddButton(clauseType, table) {
  var el = document.createElement('span');
  el.className = 'icon-dmn icon-plus';
  el.addEventListener('click', function () {
    table[clauseType === 'input' ? 'addInput' : 'addOutput']();
  });
  return el;
}


var FootView = View.extend({
  template: '<tfoot><tr></tr></tfoot>',

  events: {
    'click .add-rule': '_handleAddRuleClick'
  },

  _handleAddRuleClick: function () {
    this.model.addRule();
  },

  makeLinkEl: function () {
    var td = document.createElement('td');
    td.className = 'add-rule';
    var a = document.createElement('a');
    a.setAttribute('title', 'Add a rule');
    a.className = 'icon-dmn icon-plus';
    td.appendChild(a);
    return td;
  },

  initialize: function () {
    var table = this.model;
    this.listenTo(table.inputs, 'all', this.render);
    this.listenToAndRun(table.outputs, 'all', this.render);
  },

  render: function () {
    var table = this.model;
    if (this.rowEl) {
      var children = [].slice.apply(this.rowEl.childNodes);
      children.forEach(function (el) {
        this.rowEl.removeChild(el);
      }, this);
    }
    else {
      this.renderWithTemplate();
      this.cacheElements({
        rowEl: 'tr'
      });
    }

    this.rowEl.appendChild(this.makeLinkEl());
    var count = 1 + Math.max(1, table.inputs.length) + Math.max(1, table.outputs.length);
    for (var c = 0; c < count; c++) {
      this.rowEl.appendChild(document.createElement('td'));
    }
    return this;
  }
});


var DecisionTableView = View.extend({
  autoRender: true,

  template: '<div class="dmn-table">' +
              '<div class="hints">' +
                '<i class="icon-dmn icon-info"></i> ' +
                '<span data-hook="hints"></span>' +
              '</div>' +
              '<header>' +
                '<h3 data-hook="table-name" contenteditable></h3>' +
              '</header>' +
              '<table>' +
                '<thead>' +
                  '<tr>' +
                    '<th class="hit" rowspan="4"></th>' +
                    '<th class="input double-border-right" colspan="2">Input</th>' +
                    '<th class="output" colspan="2">Output</th>' +
                    '<th class="annotation" rowspan="4">Annotation</th>' +
                  '</tr>' +
                  '<tr class="labels"></tr>' +
                  '<tr class="values"></tr>' +
                  '<tr class="mappings"></tr>' +
                '</thead>' +
                '<tbody></tbody>' +
              '</table>' +
            '</div>',

  session: {
    contextMenu:            'state',
    clauseValuesEditor:     'state',
    clauseExpressionEditor: 'state',

    hint: {
      type: 'string',
      default: 'Make a right-click on the table'
    }
  },

  bindings: {
    'model.name': {
      hook: 'table-name',
      type: 'text'
    },
    hint: {
      type: 'innerHTML',
      hook: 'hints'
    }
  },

  events: {
    'input header h3':   '_handleNameInput'
  },

  _handleNameInput: function (evt) {
    var val = evt.target.textContent.trim();
    if (val === this.model.name) { return; }
    this.model.name = val;
  },

  log: function () {
    var args = Array.prototype.slice.apply(arguments);
    var method = args.shift();
    args.unshift(this.cid);
    console[method].apply(console, args);
  },

  eventLog: function (scopeName) {
    var self = this;
    return function () {
      var args = [];
      args.unshift(scopeName);
      args.unshift('trace');
      args.push(arguments[0]);
      self.log.apply(self, args);
    };
  },

  initialize: function (options) {
    options = options || {};

    this.model = this.model || new DecisionTable.Model();
  },

  hideContextMenu: function () {
    if (!this.contextMenu) { return; }
    this.contextMenu.close();
  },

  showContextMenu: function (cellModel, evt) {
    if (!this.contextMenu) { return; }
    if (evt) {
      evt.preventDefault();
    }

    var table = this.model;

    var options = {
      scope:  cellModel,
      parent: this,
      left:   evt.pageX,
      top:    evt.pageY
    };

    options.commands = [
      {
        label: 'Rule',
        icon: '',
        subcommands: [
          {
            label: 'add',
            icon: 'plus',
            fn: function () {
              table.addRule(this.scope);
            },
            subcommands: [
              {
                label: 'above',
                icon: 'above',
                hint: 'Add a rule above the focused one',
                fn: function () {
                  table.addRule(this.scope, -1);
                }
              },
              {
                label: 'below',
                icon: 'below',
                hint: 'Add a rule below the focused one',
                fn: function () {
                  table.addRule(this.scope, 1);
                }
              }
            ]
          },
          // {
          //   label: 'copy',
          //   icon: 'copy',
          //   fn: function () {
          //     table.copyRule(this.scope);
          //   },
          //   subcommands: [
          //     {
          //       label: 'above',
          //       icon: 'above',
          //       hint: 'Copy the rule above the focused one',
          //       fn: function () {
          //         table.copyRule(this.scope, -1);
          //       }
          //     },
          //     {
          //       label: 'below',
          //       icon: 'below',
          //       hint: 'Copy the rule below the focused one',
          //       fn: function () {
          //         table.copyRule(this.scope, 1);
          //       }
          //     }
          //   ]
          // },
          {
            label: 'remove',
            icon: 'minus',
            hint: 'Remove the focused rule',
            fn: function () {
              table.removeRule(this.scope);
            }
          },
          {
            label: 'clear',
            icon: 'clear',
            hint: 'Clear the focused rule',
            fn: function () {
              table.clearRule(this.scope.rule);
            }
          }
        ]
      }
    ];

    var type = cellModel.type;
    var addMethod = type === 'input' ? 'addInput' : 'addOutput';
    if (type !== 'input' && type !== 'output') {
      this.contextMenu.open(options);
      return;
    }

    options.commands.unshift({
      label: type === 'input' ? 'Input' : 'Output',
      icon: type,
      className: type,
      subcommands: [
        {
          label: 'add',
          icon: 'plus',
          fn: function () {
            table[addMethod]();
          },
          subcommands: [
            {
              label: 'before',
              icon: 'left',
              hint: 'Add an ' + type + ' clause before the focused one',
              fn: function () {
                table[addMethod]();
              }
            },
            {
              label: 'after',
              icon: 'right',
              hint: 'Add an ' + type + ' clause after the focused one',
              fn: function () {
                table[addMethod]();
              }
            }
          ]
        },
        {
          label: 'remove',
          icon: 'minus',
          hint: 'Remove the ' + type + ' clause',
          fn: function () {
            var clause = cellModel.clause;
            var delta = clause.collection.indexOf(clause);
            clause.collection.remove(clause);

            if (clause.clauseType === 'output') {
              delta += table.inputs.length;
            }

            table.rules.forEach(function (rule) {
              var cell = rule.cells.at(delta);
              rule.cells.remove(cell);
            });
            table.rules.trigger('reset');
          }
        }
      ]
    });

    this.contextMenu.open(options);
  },


  parseChoices: function (el) {
    if (!el) {
      return 'MISSING';
    }
    var content = el.textContent.trim();

    if (content[0] === '(' && content.slice(-1) === ')') {
      return content
        .slice(1, -1)
        .split(',')
        .map(function (str) {
          return str.trim();
        })
        .filter(function (str) {
          return !!str;
        })
        ;
    }

    return [];
  },

  parseRules: function (ruleEls) {
    return ruleEls.map(function (el) {
      return el.textContent.trim();
    });
  },

  parseTable: function () {
    var inputs = [];
    var outputs = [];
    var rules = [];

    this.queryAll('thead .labels .input').forEach(function (el, num) {
      var choiceEls = this.query('thead .values .input:nth-child(' + (num + 1) + ')');

      inputs.push({
        label:    el.textContent.trim(),
        choices:  this.parseChoices(choiceEls)
      });
    }, this);

    this.queryAll('thead .labels .output').forEach(function (el, num) {
      var choiceEls = this.query('thead .values .output:nth-child(' + (num + inputs.length + 1) + ')');

      outputs.push({
        label:    el.textContent.trim(),
        choices:  this.parseChoices(choiceEls)
      });
    }, this);

    this.queryAll('tbody tr').forEach(function (row) {
      var cells = [];
      var cellEls = row.querySelectorAll('td');

      for (var c = 1; c < cellEls.length; c++) {
        var choices = null;
        var value = cellEls[c].textContent.trim();
        var type = c <= inputs.length ? 'input' : (c < (cellEls.length - 1) ? 'output' : 'annotation');
        var oc = c - (inputs.length + 1);

        if (type === 'input' && inputs[c - 1]) {
          choices = inputs[c - 1].choices;
        }
        else if (type === 'output' && outputs[oc]) {
          choices = outputs[oc].choices;
        }

        cells.push({
          value:    value,
          choices:  choices
        });
      }

      rules.push({
        cells: cells
      });
    });

    this.model.name = this.query('h3').textContent.trim();
    this.model.inputs.reset(inputs);
    this.model.outputs.reset(outputs);
    this.model.rules.reset(rules);

    return this.toJSON();
  },

  toJSON: function () {
    return this.model.toJSON();
  },

  inputClauseViews: [],
  outputClauseViews: [],

  _headerClear: function (type) {
    toArray(this.labelsRowEl.querySelectorAll('.'+ type)).forEach(function (el) {
      this.labelsRowEl.removeChild(el);
    }, this);

    toArray(this.valuesRowEl.querySelectorAll('.'+ type)).forEach(function (el) {
      this.valuesRowEl.removeChild(el);
    }, this);

    toArray(this.mappingsRowEl.querySelectorAll('.'+ type)).forEach(function (el) {
      this.mappingsRowEl.removeChild(el);
    }, this);

    return this;
  },


  render: function () {
    if (!this.el) {
      this.renderWithTemplate();
    }
    else {
      this.parseTable();
      this.trigger('change:el');
    }

    var table = this.model;

    if (!this.headerEl) {
      this.cacheElements({
        tableEl:          'table',
        tableNameEl:      'header h3',
        headerEl:         'thead',
        bodyEl:           'tbody',
        inputsHeaderEl:   'thead tr:nth-child(1) th.input',
        outputsHeaderEl:  'thead tr:nth-child(1) th.output',
        labelsRowEl:      'thead tr.labels',
        valuesRowEl:      'thead tr.values',
        mappingsRowEl:    'thead tr.mappings'
      });


      this.inputsHeaderEl.appendChild(makeAddButton('input', table));
      this.outputsHeaderEl.appendChild(makeAddButton('output', table));
    }


    ['input', 'output'].forEach(function (type) {
      this.listenToAndRun(this.model[type + 's'], 'add reset remove', function () {

        var cols = this.model[type + 's'].length;
        if (cols > 1) {
          this[type + 'sHeaderEl'].setAttribute('colspan', cols);
        }
        else {
          this[type + 'sHeaderEl'].removeAttribute('colspan');
        }

        this._headerClear(type);
        this[type + 'ClauseViews'].forEach(function (view) {
          view.remove();
        }, this);

        this.model[type + 's'].forEach(function (clause) {
          var labelEl = makeTd(type);
          var valueEl = makeTd(type);
          var mappingEl = makeTd(type);

          var view = new ClauseHeaderView({
            labelEl:    labelEl,
            valueEl:    valueEl,
            mappingEl:  mappingEl,

            model:      clause,
            parent:     this
          });

          ['label', 'value', 'mapping'].forEach(function (kind) {
            if (type === 'input') {
              this[kind +'sRowEl'].insertBefore(view[kind + 'El'], this[kind +'sRowEl'].querySelector('.output'));
            }
            else {
              this[kind +'sRowEl'].appendChild(view[kind + 'El']);
            }
          }, this);

          this.registerSubview(view);

          this[type + 'ClauseViews'].push(view);
        }, this);
      });
    }, this);


    this.bodyEl.innerHTML = '';
    this.rulesView = this.renderCollection(this.model.rules, RuleView, this.bodyEl);

    if (!this.footView) {
      var footEl = this.query('tfoot');
      if (footEl) { footEl.parentNode.removeChild(footEl); }

      this.footView = new FootView({
        model: this.model
      });
      this.tableEl.appendChild(this.footView.el);
    }

    return this;
  }
});

module.exports = DecisionTableView;

},{"./clause-view":20,"./rule-view":31,"./table-data":33}],27:[function(require,module,exports){
'use strict';
/* global require: false, module: false */

var DecisionTableView = require('./decision-table-view');
require('./contextmenu-view');
require('./clausevalues-setter-view');
require('./clauseexpression-setter-view');

module.exports = DecisionTableView;

function nodeListarray(els) {
  if (Array.isArray(els)) {
    return els;
  }
  var arr = [];
  for (var i = 0; i < els.length; i++) {
    arr.push(els[i]);
  }
  return arr;
}

function selectAll(selector, ctx) {
  ctx = ctx || document;
  return nodeListarray(ctx.querySelectorAll(selector));
}
window.selectAll = selectAll;

},{"./clauseexpression-setter-view":21,"./clausevalues-setter-view":22,"./contextmenu-view":25,"./decision-table-view":26}],28:[function(require,module,exports){
'use strict';
/*global module: false, require: false*/

var Clause = require('./clause-data');

var InputModel = Clause.Model.extend({
  clauseType: 'input',

  derived: {
    x: {
      deps: [
        'collection'
      ],
      cache: false,
      fn: function () {
        return this.collection.indexOf(this);
      }
    },

    focused: {
      deps: [
        'collection',
        'collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.collection.parent.x === this.x;
      }
    }
  }
});

module.exports = {
  Model: InputModel,
  Collection: Clause.Collection.extend({
    model: InputModel
  })
};

},{"./clause-data":16}],29:[function(require,module,exports){
'use strict';
/*global module: false, require: false*/

var Clause = require('./clause-data');

var OutputModel = Clause.Model.extend({
  clauseType: 'output',

  derived: {
    x: {
      deps: [
        'collection',
        'collection.parent',
        'collection.parent.inputs'
      ],
      cache: false,
      fn: function () {
        return this.collection.indexOf(this) + this.collection.parent.inputs.length;
      }
    },

    focused: {
      deps: [
        'collection',
        'collection.parent',
        'collection.parent.inputs'
      ],
      cache: false,
      fn: function () {
        var table = this.collection.parent;
        return table.x === this.collection.indexOf(this) + table.inputs.length;
      }
    }
  }
});

module.exports = {
  Model: OutputModel,
  Collection: Clause.Collection.extend({
    model: OutputModel
  })
};

},{"./clause-data":16}],30:[function(require,module,exports){
'use strict';
/*global module: false, deps: true, require: false*/

if (typeof window === 'undefined') { var deps = require; }
else { var deps = window.deps; }

var State = deps('ampersand-state');
var Collection = deps('ampersand-collection');
var Cell = require('./cell-data');

var RuleModel = State.extend({
  collections: {
    cells: Cell.Collection
  },

  derived: {
    table: {
      deps: [
        'collection',
        'collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.collection.parent;
      }
    },

    focused: {
      deps: [
        'collection',
        'table'
      ],
      cache: false,
      fn: function () {
        return this.collection.indexOf(this) === this.table.y;
      }
    },


    delta: {
      deps: ['collection'],
      cache: false,
      fn: function () {
        return 1 + this.collection.indexOf(this);
      }
    },

    inputCells: {
      deps: ['cells', 'table.inputs'],
      cache: false,
      fn: function () {
        return this.cells.models.slice(0, this.table.inputs.length);
      }
    },

    outputCells: {
      deps: ['cells', 'table.inputs'],
      cache: false,
      fn: function () {
        return this.cells.models.slice(this.table.inputs.length, -1);
      }
    },

    annotation: {
      deps: ['cells'],
      cache: false,
      fn: function () {
        return this.cells.models[this.cells.length - 1];
      }
    }
  },

  ensureCells: function () {
    var c = this.table.inputs.length + this.table.outputs.length + 1;

    // fine
    if (this.cells.length === c || c === 1) {
      return;
    }

    // needs to be filled
    if (this.cells.length < c) {
      while (this.cells.length <= c) {
        this.cells.add({value:''});
      }
    }

    // needs to be truncated
    else {
      this.cells.models = this.cells.models.slice(0, c);
    }
  },

  initialize: function () {
    this.listenTo(this.table.inputs, 'reset', this.ensureCells);
    this.listenToAndRun(this.table.outputs, 'reset', this.ensureCells);
  }
});

module.exports = {
  Model: RuleModel,

  Collection: Collection.extend({
    model: RuleModel,
  })
};

},{"./cell-data":13}],31:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var CellViews = require('./cell-view');
var merge = deps('lodash.merge');
var contextViewsMixin = require('./context-views-mixin');

var RuleView = View.extend({
  template: '<tr><td class="number"></td></tr>',

  bindings: {
    'model.delta': {
      type: 'text',
      selector: '.number'
    }
  },

  derived: merge({}, contextViewsMixin, {
    inputs: {
      deps: [
        'parent',
        'parent.model',
        'parent.model.inputs'
      ],
      cache: false,
      fn: function () {
        return this.parent.model.inputs;
      }
    },

    outputs: {
      deps: [
        'parent',
        'parent.model',
        'parent.model.outputs'
      ],
      cache: false,
      fn: function () {
        return this.parent.model.outputs;
      }
    },

    annotation: {
      deps: [
        'parent',
        'parent.model',
        'parent.model.annotations'
      ],
      fn: function () {
        return this.parent.model.annotations.at(0);
      }
    }
  }),

  events: {
    'contextmenu .number': '_handleRowContextMenu'
  },

  _handleRowContextMenu: function (evt) {
    var rule = this.model;
    var table = rule.collection.parent;

    this.contextMenu.open({
      parent:   this,
      left:     evt.pageX,
      top:      evt.pageY,
      commands: [
        {
          label: 'Rule',
          subcommands: [
            {
              label: 'add',
              icon: 'plus',
              fn: function () {
                table.addRule(rule);
              },
              subcommands: [
                {
                  label: 'above',
                  icon: 'above',
                  hint: 'Add a rule above the focused one',
                  fn: function () {
                    table.addRule(rule, -1);
                  }
                },
                {
                  label: 'below',
                  icon: 'below',
                  hint: 'Add a rule below the focused one',
                  fn: function () {
                    table.addRule(rule, 1);
                  }
                }
              ]
            },
            // {
            //   label: 'copy',
            //   icon: 'copy',
            //   fn: function () {
            //     table.copyRule(rule);
            //   },
            //   subcommands: [
            //     {
            //       label: 'above',
            //       icon: 'above',
            //       hint: 'Copy the rule above the focused one',
            //       fn: function () {
            //         table.copyRule(rule, -1);
            //       }
            //     },
            //     {
            //       label: 'below',
            //       icon: 'below',
            //       hint: 'Copy the rule below the focused one',
            //       fn: function () {
            //         table.copyRule(rule, 1);
            //       }
            //     }
            //   ]
            // },
            {
              label: 'remove',
              icon: 'minus',
              hint: 'Remove this rule',
              fn: function () {
                rule.collection.remove(rule);
              }
            },
            {
              label: 'clear',
              icon: 'clear',
              hint: 'Clear the focused rule',
              fn: function () {
                table.clearRule(rule);
              }
            }
          ]
        }
      ]
    });

    evt.preventDefault();
  },

  setFocus: function () {
    if (!this.el) { return; }

    if (this.model.focused) {
      this.el.classList.add('row-focused');
    }
    else {
      this.el.classList.remove('row-focused');
    }
  },

  initialize: function () {
    var table = this.model.table;

    this.listenToAndRun(table, 'change:focus', this.setFocus);
    this.listenToAndRun(table.inputs, 'add remove reset', this.render);
    this.listenToAndRun(table.outputs, 'add remove reset', this.render);
  },

  render: function () {
    this.renderWithTemplate();

    this.cacheElements({
      numberEl: '.number'
    });

    var i;
    var subview;

    for (i = 0; i < this.inputs.length; i++) {
      subview = new CellViews.Input({
        model:  this.model.cells.at(i),
        parent: this
      });

      this.registerSubview(subview.render());
      this.el.appendChild(subview.el);
    }

    for (i = 0; i < this.outputs.length; i++) {
      subview = new CellViews.Output({
        model:  this.model.cells.at(this.inputs.length + i),
        parent: this
      });

      this.registerSubview(subview.render());
      this.el.appendChild(subview.el);
    }
    subview = new CellViews.Annotation({
      model:  this.model.annotation,
      parent: this
    });
    this.registerSubview(subview.render());
    this.el.appendChild(subview.el);


    this.setFocus();
    return this;
  }
});

module.exports = RuleView;

},{"./cell-view":14,"./context-views-mixin":24}],32:[function(require,module,exports){
'use strict';
/* global module: false, deps: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');



var SuggestionsCollection = Collection.extend({
  model: State.extend({
    props: {
      value: 'string',
      html: 'string'
    }
  })
});



var SuggestionsItemView = View.extend({
  template: '<li></li>',

  bindings: {
    'model.html': {
      type: 'innerHTML'
    }
  },

  events: {
    click: '_handleClick'
  },

  _handleClick: function () {
    if (!this.parent || !this.parent.parent) { return; }
    var target = this.parent.parent;
    
    if (target.model && typeof target.model.value !== 'undefined') {
      target.model.value = this.model.value;
    }
    else if (target.el) {
      target.el.textContent = this.model.value;
    }
  }
});



var SuggestionsView = View.extend({
  session: {
    visible: 'boolean'
  },

  bindings: {
    visible: {
      type: 'toggle'
    }
  },

  template: '<ul class="dmn-suggestions-helper"></ul>',

  collections: {
    suggestions: SuggestionsCollection
  },

  setPosition: function () {
    if (!this.parent || !this.parent.el) {
      this.visible = false;
      return;
    }

    var node = this.parent.el;
    var top = node.offsetTop;
    var left = node.offsetLeft;
    var helper = this.el;

    while ((node = node.offsetParent)) {
      if (node.offsetTop) {
        top += parseInt(node.offsetTop, 10);
      }
      if (node.offsetLeft) {
        left += parseInt(node.offsetLeft, 10);
      }
    }

    top -= helper.clientHeight;
    helper.style.top = top;
    helper.style.left = left;
  },

  show: function (suggestions, parent, force) {
    if (parent) {
      this.parent = parent;
    }

    if (suggestions) {
      if (suggestions.isCollection) {
        instance.suggestions = suggestions;
      }
      else {
        instance.suggestions.reset(suggestions);
      }
      
      instance.visible = force || suggestions.length > 1;
    }
    else {
      instance.visible = false;
    }

    if (instance.visible) {
      this.setPosition();
    }

    return this;
  },

  hide: function () {
    return this.show([], this.parent);
  },

  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.suggestions, SuggestionsItemView, this.el);
    return this;
  }
});



var instance;
SuggestionsView.instance = function (suggestions, parent) {
  if (!instance) {
    instance = new SuggestionsView({});
    instance.render();
  }

  if (!document.body.contains(instance.el)) {
    document.body.appendChild(instance.el);
  }

  instance.show(suggestions, parent);

  return instance;
};


SuggestionsView.Collection = SuggestionsCollection;

module.exports = SuggestionsView;

},{}],33:[function(require,module,exports){
'use strict';
/*global module: false, deps: true, require: false, console: false*/

if (typeof window === 'undefined') { var deps = require; }
else { var deps = window.deps; }


var State = deps('ampersand-state');
var Input = require('./input-data');
var Output = require('./output-data');

var Rule = require('./rule-data');

var defaults = require('lodash.defaults');

var DecisionTableModel = State.extend({
  collections: {
    inputs:   Input.Collection,
    outputs:  Output.Collection,
    rules:    Rule.Collection
  },

  props: {
    name: 'string'
  },

  session: {
    x: {
      type: 'number',
      default: 0
    },

    y: {
      type: 'number',
      default: 0
    },


    logLevel: {
      type: 'number',
      default: 0
    }
  },

  initialize: function () {
    var table = this;
    [
      'inputs',
      'outputs',
      'rules'
    ].forEach(function (collectionName) {
      [
        'add',
        'remove',
        'sort',
        'reset'
      ].forEach(function (evtName) {
        table.listenTo(table[collectionName], evtName, function (arg1, arg2, arg3) {
          table.trigger(collectionName + ':' + evtName, arg1, arg2, arg3);
        });
      });
    });

    this.listenToAndRun(this.inputs, 'remove reset', function () {
      if (this.inputs.length) { return; }
      this.inputs.add({});
    });

    this.listenToAndRun(this.outputs, 'remove reset', function () {
      if (this.outputs.length) { return; }
      this.outputs.add({});
    });
  },

  log: function () {
    var args = Array.prototype.slice.apply(arguments);
    var method = args.shift();
    args.unshift(this.cid);
    console[method].apply(console, args);
  },

  _ruleClipboard: null,


  addRule: function (scopeCell, beforeAfter) {
    var cells = [];
    var c;

    for (c = 0; c < this.inputs.length; c++) {
      cells.push({
        value: '',
        // choices: this.inputs.at(c).choices,
        focused: c === 0
      });
    }

    for (c = 0; c < this.outputs.length; c++) {
      cells.push({
        value: '',
        // choices: this.outputs.at(c).choices
      });
    }

    cells.push({
      value: ''
    });

    var options = {};
    if (beforeAfter) {
      var ruleDelta = this.rules.indexOf(scopeCell.collection.parent);
      options.at = ruleDelta + (beforeAfter > 0 ? ruleDelta : (ruleDelta - 1));
    }

    this.rules.add({
      cells: cells
    }, options);

    return this;
  },

  removeRule: function (scopeCell) {
    this.rules.remove(scopeCell.collection.parent);
    this.rules.trigger('reset');
    return this;
  },


  copyRule: function (scopeCell, upDown) {
    var rule = scopeCell.collection.parent;
    if (!rule) { return this; }
    this._ruleClipboard = rule;

    if (upDown) {
      var ruleDelta = this.rules.indexOf(rule);
      this.pasteRule(ruleDelta + (upDown > 1 ? 0 : 1));
    }

    return this;
  },


  pasteRule: function (delta) {
    if (!this._ruleClipboard) { return this; }
    var data = this._ruleClipboard.toJSON();
    this.rules.add(data, {
      at: delta
    });
    return this;
  },


  clearRule: function (rule) {
    rule.cells.forEach(function (cell) {
      cell.value = '';
    });
    return this;
  },


  _rulesCells: function (added, delta) {
    this.rules.forEach(function (rule) {
      rule.cells.add({
        // choices: added.choices
      }, {
        at: delta,
        silent: true
      });
    });

    this.rules.trigger('reset');
  },

  addInput: function (data, position) {
    var delta = typeof position !== 'undefined' ? position : this.inputs.length;
    delta = delta < 0 ? 0 : delta;

    var input = {};
    defaults(input, data, {
      label:    null,
      choices:  null,
      mapping:  null,
      datatype: 'string'
    });

    var newModel = this.inputs.add(input, {
      at: delta
    });

    this._rulesCells(newModel, newModel.collection.indexOf(newModel));

    return this;
  },

  removeInput: function () {
    return this;
  },



  addOutput: function (data, position) {
    var delta = typeof position !== 'undefined' ? position : this.outputs.length;
    delta = delta < 0 ? 0 : delta;

    var output = {};
    defaults(output, data, {
      label:    null,
      choices:  null,
      mapping:  null,
      datatype: 'string'
    });

    var newModel = this.outputs.add(output, {
      at: delta
    });

    this._rulesCells(newModel, newModel.collection.indexOf(newModel));

    return this;
  },

  removeOutput: function () {
    return this;
  }
});

if (typeof window !== 'undefined') {
  window.DecisionTableModel = DecisionTableModel;
}

module.exports = {
  Model: DecisionTableModel
};

},{"./input-data":28,"./output-data":29,"./rule-data":30,"lodash.defaults":1}]},{},[27])(27)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5kZWZhdWx0cy9ub2RlX21vZHVsZXMvbG9kYXNoLmFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWFzc2lnbi9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY29weS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRlYXNzaWduZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZWFzc2lnbmVyL25vZGVfbW9kdWxlcy9sb2Rhc2guX2JpbmRjYWxsYmFjay9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRlYXNzaWduZXIvbm9kZV9tb2R1bGVzL2xvZGFzaC5faXNpdGVyYXRlZWNhbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2gua2V5cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5rZXlzL25vZGVfbW9kdWxlcy9sb2Rhc2guX2dldG5hdGl2ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5rZXlzL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNhcmd1bWVudHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2gua2V5cy9ub2RlX21vZHVsZXMvbG9kYXNoLmlzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2gucmVzdHBhcmFtL2luZGV4LmpzIiwic2NyaXB0cy9jZWxsLWRhdGEuanMiLCJzY3JpcHRzL2NlbGwtdmlldy5qcyIsInNjcmlwdHMvY2hvaWNlLXZpZXcuanMiLCJzY3JpcHRzL2NsYXVzZS1kYXRhLmpzIiwic2NyaXB0cy9jbGF1c2UtbGFiZWwtdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLW1hcHBpbmctdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLXZhbHVlLXZpZXcuanMiLCJzY3JpcHRzL2NsYXVzZS12aWV3LmpzIiwic2NyaXB0cy9jbGF1c2VleHByZXNzaW9uLXNldHRlci12aWV3LmpzIiwic2NyaXB0cy9jbGF1c2V2YWx1ZXMtc2V0dGVyLXZpZXcuanMiLCJzY3JpcHRzL2NvbWJvYm94LXZpZXcuanMiLCJzY3JpcHRzL2NvbnRleHQtdmlld3MtbWl4aW4uanMiLCJzY3JpcHRzL2NvbnRleHRtZW51LXZpZXcuanMiLCJzY3JpcHRzL2RlY2lzaW9uLXRhYmxlLXZpZXcuanMiLCJzY3JpcHRzL2luZGV4LmpzIiwic2NyaXB0cy9pbnB1dC1kYXRhLmpzIiwic2NyaXB0cy9vdXRwdXQtZGF0YS5qcyIsInNjcmlwdHMvcnVsZS1kYXRhLmpzIiwic2NyaXB0cy9ydWxlLXZpZXcuanMiLCJzY3JpcHRzL3N1Z2dlc3Rpb25zLXZpZXcuanMiLCJzY3JpcHRzL3RhYmxlLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBhc3NpZ24gPSByZXF1aXJlKCdsb2Rhc2guYXNzaWduJyksXG4gICAgcmVzdFBhcmFtID0gcmVxdWlyZSgnbG9kYXNoLnJlc3RwYXJhbScpO1xuXG4vKipcbiAqIFVzZWQgYnkgYF8uZGVmYXVsdHNgIHRvIGN1c3RvbWl6ZSBpdHMgYF8uYXNzaWduYCB1c2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0VmFsdWUgVGhlIGRlc3RpbmF0aW9uIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc291cmNlVmFsdWUgVGhlIHNvdXJjZSBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgdmFsdWUgdG8gYXNzaWduIHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbkRlZmF1bHRzKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHNvdXJjZVZhbHVlIDogb2JqZWN0VmFsdWU7XG59XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gKiBvYmplY3QgZm9yIGFsbCBkZXN0aW5hdGlvbiBwcm9wZXJ0aWVzIHRoYXQgcmVzb2x2ZSB0byBgdW5kZWZpbmVkYC4gT25jZSBhXG4gKiBwcm9wZXJ0eSBpcyBzZXQsIGFkZGl0aW9uYWwgdmFsdWVzIG9mIHRoZSBzYW1lIHByb3BlcnR5IGFyZSBpZ25vcmVkLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBkZWZhdWx0cyA9IHJlc3RQYXJhbShmdW5jdGlvbihhcmdzKSB7XG4gIHZhciBvYmplY3QgPSBhcmdzWzBdO1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGFyZ3MucHVzaChhc3NpZ25EZWZhdWx0cyk7XG4gIHJldHVybiBhc3NpZ24uYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4yLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlQXNzaWduID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlYXNzaWduJyksXG4gICAgY3JlYXRlQXNzaWduZXIgPSByZXF1aXJlKCdsb2Rhc2guX2NyZWF0ZWFzc2lnbmVyJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJ2xvZGFzaC5rZXlzJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmFzc2lnbmAgZm9yIGN1c3RvbWl6aW5nIGFzc2lnbmVkIHZhbHVlcyB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZywgbXVsdGlwbGUgc291cmNlcywgYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYFxuICogZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbldpdGgob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBwcm9wcyA9IGtleXMoc291cmNlKSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIodmFsdWUsIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKTtcblxuICAgIGlmICgocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkgfHxcbiAgICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG4vKipcbiAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0KHMpIHRvIHRoZSBkZXN0aW5hdGlvblxuICogb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXMgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuXG4gKiBJZiBgY3VzdG9taXplcmAgaXMgcHJvdmlkZWQgaXQgaXMgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIGZpdmUgYXJndW1lbnRzOlxuICogKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAgYW5kIGlzIGJhc2VkIG9uXG4gKiBbYE9iamVjdC5hc3NpZ25gXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LmFzc2lnbikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBhbGlhcyBleHRlbmRcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjdXN0b21pemVyYC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uYXNzaWduKHsgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICdhZ2UnOiA0MCB9LCB7ICd1c2VyJzogJ2ZyZWQnIH0pO1xuICogLy8gPT4geyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH1cbiAqXG4gKiAvLyB1c2luZyBhIGN1c3RvbWl6ZXIgY2FsbGJhY2tcbiAqIHZhciBkZWZhdWx0cyA9IF8ucGFydGlhbFJpZ2h0KF8uYXNzaWduLCBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAqICAgcmV0dXJuIF8uaXNVbmRlZmluZWQodmFsdWUpID8gb3RoZXIgOiB2YWx1ZTtcbiAqIH0pO1xuICpcbiAqIGRlZmF1bHRzKHsgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICdhZ2UnOiAzNiB9LCB7ICd1c2VyJzogJ2ZyZWQnIH0pO1xuICogLy8gPT4geyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfVxuICovXG52YXIgYXNzaWduID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgcmV0dXJuIGN1c3RvbWl6ZXJcbiAgICA/IGFzc2lnbldpdGgob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpXG4gICAgOiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMi4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZUNvcHkgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2Vjb3B5JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJ2xvZGFzaC5rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLFxuICogbXVsdGlwbGUgc291cmNlcywgYW5kIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBzb3VyY2UgPT0gbnVsbFxuICAgID8gb2JqZWN0XG4gICAgOiBiYXNlQ29weShzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQ29weShzb3VyY2UsIHByb3BzLCBvYmplY3QpIHtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgIG9iamVjdFtrZXldID0gc291cmNlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ29weTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMS4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmluZENhbGxiYWNrID0gcmVxdWlyZSgnbG9kYXNoLl9iaW5kY2FsbGJhY2snKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJ2xvZGFzaC5faXNpdGVyYXRlZWNhbGwnKSxcbiAgICByZXN0UGFyYW0gPSByZXF1aXJlKCdsb2Rhc2gucmVzdHBhcmFtJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgYXNzaWducyBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gYSBnaXZlblxuICogZGVzdGluYXRpb24gb2JqZWN0LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY3JlYXRlIGBfLmFzc2lnbmAsIGBfLmRlZmF1bHRzYCwgYW5kIGBfLm1lcmdlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIHJlc3RQYXJhbShmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAyID8gc291cmNlc1tsZW5ndGggLSAyXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgdGhpc0FyZyA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBiaW5kQ2FsbGJhY2soY3VzdG9taXplciwgdGhpc0FyZywgNSk7XG4gICAgICBsZW5ndGggLT0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VzdG9taXplciA9IHR5cGVvZiB0aGlzQXJnID09ICdmdW5jdGlvbicgPyB0aGlzQXJnIDogdW5kZWZpbmVkO1xuICAgICAgbGVuZ3RoIC09IChjdXN0b21pemVyID8gMSA6IDApO1xuICAgIH1cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoc291cmNlc1swXSwgc291cmNlc1sxXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoIDwgMyA/IHVuZGVmaW5lZCA6IGN1c3RvbWl6ZXI7XG4gICAgICBsZW5ndGggPSAxO1xuICAgIH1cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUFzc2lnbmVyO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VDYWxsYmFja2Agd2hpY2ggb25seSBzdXBwb3J0cyBgdGhpc2AgYmluZGluZ1xuICogYW5kIHNwZWNpZnlpbmcgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGJpbmQuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnQ291bnRdIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYWxsYmFjay5cbiAqL1xuZnVuY3Rpb24gYmluZENhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0aGlzQXJnID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZnVuYztcbiAgfVxuICBzd2l0Y2ggKGFyZ0NvdW50KSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfTtcbiAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgY2FzZSA1OiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG90aGVyLCBrZXksIG9iamVjdCwgc291cmNlKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlLCBvdGhlciwga2V5LCBvYmplY3QsIHNvdXJjZSk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBwcm92aWRlZCB0byBpdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiBfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbmRDYWxsYmFjaztcbiIsIi8qKlxuICogbG9kYXNoIDMuMC45IChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eXFxkKyQvO1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KSkge1xuICAgIHZhciBvdGhlciA9IG9iamVjdFtpbmRleF07XG4gICAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/ICh2YWx1ZSA9PT0gb3RoZXIpIDogKG90aGVyICE9PSBvdGhlcik7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJdGVyYXRlZUNhbGw7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjEuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJ2xvZGFzaC5fZ2V0bmF0aXZlJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCdsb2Rhc2guaXNhcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJyYXknKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBnZXROYXRpdmUoT2JqZWN0LCAna2V5cycpO1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQSBmYWxsYmFjayBpbXBsZW1lbnRhdGlvbiBvZiBgT2JqZWN0LmtleXNgIHdoaWNoIGNyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlXG4gKiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gc2hpbUtleXMob2JqZWN0KSB7XG4gIHZhciBwcm9wcyA9IGtleXNJbihvYmplY3QpLFxuICAgICAgcHJvcHNMZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICBsZW5ndGggPSBwcm9wc0xlbmd0aCAmJiBvYmplY3QubGVuZ3RoO1xuXG4gIHZhciBhbGxvd0luZGV4ZXMgPSAhIWxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgcHJvcHNMZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgIGlmICgoYWxsb3dJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbnZhciBrZXlzID0gIW5hdGl2ZUtleXMgPyBzaGltS2V5cyA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgQ3RvciA9IG9iamVjdCA9PSBudWxsID8gbnVsbCA6IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QpIHx8XG4gICAgICAodHlwZW9mIG9iamVjdCAhPSAnZnVuY3Rpb24nICYmIGlzQXJyYXlMaWtlKG9iamVjdCkpKSB7XG4gICAgcmV0dXJuIHNoaW1LZXlzKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgPyBuYXRpdmVLZXlzKG9iamVjdCkgOiBbXTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7XG4gIGxlbmd0aCA9IChsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSkgJiYgbGVuZ3RoKSB8fCAwO1xuXG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGlzUHJvdG8gPSB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBsZW5ndGggPiAwO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IChpbmRleCArICcnKTtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoc2tpcEluZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpICYmXG4gICAgICAgICEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsIi8qKlxuICogbG9kYXNoIDMuOS4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIFtzcGVjaWFsIGNoYXJhY3RlcnNdKGh0dHA6Ly93d3cucmVndWxhci1leHByZXNzaW9ucy5pbmZvL2NoYXJhY3RlcnMuaHRtbCNzcGVjaWFsKS5cbiAqIEluIGFkZGl0aW9uIHRvIHNwZWNpYWwgY2hhcmFjdGVycyB0aGUgZm9yd2FyZCBzbGFzaCBpcyBlc2NhcGVkIHRvIGFsbG93IGZvclxuICogZWFzaWVyIGBldmFsYCB1c2UgYW5kIGBGdW5jdGlvbmAgY29tcGlsYXRpb24uXG4gKi9cbnZhciByZVJlZ0V4cENoYXJzID0gL1suKis/XiR7fSgpfFtcXF1cXC9cXFxcXS9nLFxuICAgIHJlSGFzUmVnRXhwQ2hhcnMgPSBSZWdFeHAocmVSZWdFeHBDaGFycy5zb3VyY2UpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSA+IDUpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBpZiBpdCdzIG5vdCBvbmUuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZFxuICogZm9yIGBudWxsYCBvciBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiAodmFsdWUgKyAnJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGVzY2FwZVJlZ0V4cChmblRvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICByZXR1cm4gaXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAob2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZykge1xuICAgIHJldHVybiByZUlzTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVJc0hvc3RDdG9yLnRlc3QodmFsdWUpO1xufVxuXG4vKipcbiAqIEVzY2FwZXMgdGhlIGBSZWdFeHBgIHNwZWNpYWwgY2hhcmFjdGVycyBcIlxcXCIsIFwiL1wiLCBcIl5cIiwgXCIkXCIsIFwiLlwiLCBcInxcIiwgXCI/XCIsXG4gKiBcIipcIiwgXCIrXCIsIFwiKFwiLCBcIilcIiwgXCJbXCIsIFwiXVwiLCBcIntcIiBhbmQgXCJ9XCIgaW4gYHN0cmluZ2AuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGVzY2FwZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmVzY2FwZVJlZ0V4cCgnW2xvZGFzaF0oaHR0cHM6Ly9sb2Rhc2guY29tLyknKTtcbiAqIC8vID0+ICdcXFtsb2Rhc2hcXF1cXChodHRwczpcXC9cXC9sb2Rhc2hcXC5jb21cXC9cXCknXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHJpbmcpIHtcbiAgc3RyaW5nID0gYmFzZVRvU3RyaW5nKHN0cmluZyk7XG4gIHJldHVybiAoc3RyaW5nICYmIHJlSGFzUmVnRXhwQ2hhcnMudGVzdChzdHJpbmcpKVxuICAgID8gc3RyaW5nLnJlcGxhY2UocmVSZWdFeHBDaGFycywgJ1xcXFwkJicpXG4gICAgOiBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiB0aGF0IGFmZmVjdHMgU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMyAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgW3NwZWNpYWwgY2hhcmFjdGVyc10oaHR0cDovL3d3dy5yZWd1bGFyLWV4cHJlc3Npb25zLmluZm8vY2hhcmFjdGVycy5odG1sI3NwZWNpYWwpLlxuICogSW4gYWRkaXRpb24gdG8gc3BlY2lhbCBjaGFyYWN0ZXJzIHRoZSBmb3J3YXJkIHNsYXNoIGlzIGVzY2FwZWQgdG8gYWxsb3cgZm9yXG4gKiBlYXNpZXIgYGV2YWxgIHVzZSBhbmQgYEZ1bmN0aW9uYCBjb21waWxhdGlvbi5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhcnMgPSAvWy4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2csXG4gICAgcmVIYXNSZWdFeHBDaGFycyA9IFJlZ0V4cChyZVJlZ0V4cENoYXJzLnNvdXJjZSk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGlmIGl0J3Mgbm90IG9uZS4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkXG4gKiBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZXNjYXBlUmVnRXhwKGZuVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0FycmF5ID0gZ2V0TmF0aXZlKEFycmF5LCAnaXNBcnJheScpO1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgcmV0dXJuIGlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJyYXlUYWc7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmF0aXZlKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmF0aXZlKF8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGZ1bmNUYWcpIHtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KGZuVG9TdHJpbmcuY2FsbCh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHJlSXNIb3N0Q3Rvci50ZXN0KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBFc2NhcGVzIHRoZSBgUmVnRXhwYCBzcGVjaWFsIGNoYXJhY3RlcnMgXCJcXFwiLCBcIi9cIiwgXCJeXCIsIFwiJFwiLCBcIi5cIiwgXCJ8XCIsIFwiP1wiLFxuICogXCIqXCIsIFwiK1wiLCBcIihcIiwgXCIpXCIsIFwiW1wiLCBcIl1cIiwgXCJ7XCIgYW5kIFwifVwiIGluIGBzdHJpbmdgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGVSZWdFeHAoJ1tsb2Rhc2hdKGh0dHBzOi8vbG9kYXNoLmNvbS8pJyk7XG4gKiAvLyA9PiAnXFxbbG9kYXNoXFxdXFwoaHR0cHM6XFwvXFwvbG9kYXNoXFwuY29tXFwvXFwpJ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gIHN0cmluZyA9IGJhc2VUb1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1JlZ0V4cENoYXJzLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlUmVnRXhwQ2hhcnMsICdcXFxcJCYnKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjYuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGVcbiAqIGNyZWF0ZWQgZnVuY3Rpb24gYW5kIGFyZ3VtZW50cyBmcm9tIGBzdGFydGAgYW5kIGJleW9uZCBwcm92aWRlZCBhcyBhbiBhcnJheS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24gdGhlIFtyZXN0IHBhcmFtZXRlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvRnVuY3Rpb25zL3Jlc3RfcGFyYW1ldGVycykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2F5ID0gXy5yZXN0UGFyYW0oZnVuY3Rpb24od2hhdCwgbmFtZXMpIHtcbiAqICAgcmV0dXJuIHdoYXQgKyAnICcgKyBfLmluaXRpYWwobmFtZXMpLmpvaW4oJywgJykgK1xuICogICAgIChfLnNpemUobmFtZXMpID4gMSA/ICcsICYgJyA6ICcnKSArIF8ubGFzdChuYW1lcyk7XG4gKiB9KTtcbiAqXG4gKiBzYXkoJ2hlbGxvJywgJ2ZyZWQnLCAnYmFybmV5JywgJ3BlYmJsZXMnKTtcbiAqIC8vID0+ICdoZWxsbyBmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gcmVzdFBhcmFtKGZ1bmMsIHN0YXJ0KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6ICgrc3RhcnQgfHwgMCksIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgcmVzdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdFtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHN0YXJ0KSB7XG4gICAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpcywgcmVzdCk7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgcmVzdCk7XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSwgcmVzdCk7XG4gICAgfVxuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIGluZGV4ID0gLTE7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gcmVzdDtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc3RQYXJhbTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IHRydWUsIHJlcXVpcmU6IGZhbHNlKi9cblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7IHZhciBkZXBzID0gcmVxdWlyZTsgfVxuZWxzZSB7IHZhciBkZXBzID0gd2luZG93LmRlcHM7IH1cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG5cbnZhciBDZWxsTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICBwcm9wczoge1xuICAgIHZhbHVlOiAnc3RyaW5nJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICBlZGl0YWJsZToge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgcnVsZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudCdcbiAgICAgIF0sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICAgIH1cbiAgICB9LFxuXG5cbiAgICB0YWJsZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAncnVsZS5jb2xsZWN0aW9uJyxcbiAgICAgICAgJ3J1bGUuY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZS5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgeDoge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbidcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2VsbCA9IHRoaXM7XG4gICAgICAgIHZhciBjZWxscyA9IGNlbGwuY29sbGVjdGlvbjtcbiAgICAgICAgcmV0dXJuIGNlbGxzLmluZGV4T2YoY2VsbCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHk6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3J1bGUnLFxuICAgICAgICAncnVsZS5jb2xsZWN0aW9uJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBydWxlcyA9IHRoaXMucnVsZS5jb2xsZWN0aW9uO1xuICAgICAgICByZXR1cm4gcnVsZXMuaW5kZXhPZih0aGlzLnJ1bGUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmb2N1c2VkOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICd0YWJsZScsXG4gICAgICAgICd0YWJsZS54JyxcbiAgICAgICAgJ3RhYmxlLnknLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IHRoaXMudGFibGUueCAmJiB0aGlzLnkgPT09IHRoaXMudGFibGUueTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xhdXNlRGVsdGE6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAndGFibGUuaW5wdXRzJyxcbiAgICAgICAgJ3RhYmxlLm91dHB1dHMnXG4gICAgICBdLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlbHRhID0gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcyk7XG4gICAgICAgIHZhciBpbnB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGg7XG4gICAgICAgIHZhciBvdXRwdXRzID0gdGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoICsgdGhpcy50YWJsZS5vdXRwdXRzLmxlbmd0aDtcblxuICAgICAgICBpZiAoZGVsdGEgPCBpbnB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gZGVsdGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGEgPCBvdXRwdXRzKSB7XG4gICAgICAgICAgcmV0dXJuIGRlbHRhIC0gaW5wdXRzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHR5cGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAndGFibGUuaW5wdXRzJyxcbiAgICAgICAgJ3RhYmxlLm91dHB1dHMnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlbHRhID0gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcyk7XG4gICAgICAgIHZhciBpbnB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGg7XG4gICAgICAgIHZhciBvdXRwdXRzID0gdGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoICsgdGhpcy50YWJsZS5vdXRwdXRzLmxlbmd0aDtcblxuICAgICAgICBpZiAoZGVsdGEgPCBpbnB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gJ2lucHV0JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YSA8IG91dHB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gJ291dHB1dCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJ2Fubm90YXRpb24nO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGF1c2U6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAnY29sbGVjdGlvbi5sZW5ndGgnLFxuICAgICAgICAndHlwZScsXG4gICAgICAgICdjbGF1c2VEZWx0YSdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jbGF1c2VEZWx0YSA8IDAgfHwgdGhpcy50eXBlID09PSAnYW5ub3RhdGlvbicpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBjbGF1c2UgPSB0aGlzLnRhYmxlW3RoaXMudHlwZSArJ3MnXS5hdCh0aGlzLmNsYXVzZURlbHRhKTtcbiAgICAgICAgcmV0dXJuIGNsYXVzZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hvaWNlczoge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbi5sZW5ndGgnLFxuICAgICAgICAndHlwZScsXG4gICAgICAgICdjbGF1c2UnLFxuICAgICAgICAnY2xhdXNlRGVsdGEnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsYXVzZSB8fCAhdGhpcy5jbGF1c2UuY2hvaWNlcykgeyByZXR1cm47IH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlLmNob2ljZXMubWFwKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICByZXR1cm4ge3ZhbHVlOiB2YWx9O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IENlbGxNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBDZWxsTW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBtZXJnZSA9IGRlcHMoJ2xvZGFzaC5tZXJnZScpO1xuXG5cbnZhciBDaG9pY2VWaWV3ID0gcmVxdWlyZSgnLi9jaG9pY2UtdmlldycpO1xudmFyIFJ1bGVDZWxsVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHt9LCBDaG9pY2VWaWV3LnByb3RvdHlwZSwge1xuICB0ZW1wbGF0ZTogJzx0ZD48c3BhbiBjb250ZW50ZWRpdGFibGU+PC9zcGFuPjwvdGQ+JyxcblxuICBiaW5kaW5nczogbWVyZ2Uoe30sIENob2ljZVZpZXcucHJvdG90eXBlLmJpbmRpbmdzLCB7XG4gICAgJ21vZGVsLnZhbHVlJzoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICdbY29udGVudGVkaXRhYmxlXSdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmVkaXRhYmxlJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2NvbnRlbnRlZGl0YWJsZScsXG4gICAgICBzZWxlY3RvcjogJ1tjb250ZW50ZWRpdGFibGVdJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuc3BlbGxjaGVja2VkJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ3NwZWxsY2hlY2snLFxuICAgICAgc2VsZWN0b3I6ICdbY29udGVudGVkaXRhYmxlXSdcbiAgICB9LFxuXG4gICAgJ21vZGVsLnR5cGUnOiB7XG4gICAgICB0eXBlOiAnY2xhc3MnXG4gICAgfVxuICB9KSxcblxuICBldmVudHM6IG1lcmdlKHt9LCBDaG9pY2VWaWV3LnByb3RvdHlwZS5ldmVudHMsIHtcbiAgICAnY29udGV4dG1lbnUnOiAgICAgICAgICAgICAgICAgICAgJ19oYW5kbGVDb250ZXh0TWVudScsXG4gICAgJ2NvbnRleHRtZW51IFtjb250ZW50ZWRpdGFibGVdJzogICdfaGFuZGxlQ29udGV4dE1lbnUnLFxuICAgICdjbGljayc6ICAgICAgICAgICAgICAgICAgICAgICAgICAnX2hhbmRsZUNsaWNrJyxcbiAgICAnY2xpY2sgW2NvbnRlbnRlZGl0YWJsZV0nOiAgICAgICAgJ19oYW5kbGVDbGljaydcbiAgfSksXG5cbiAgX2ZvY3VzUHNldWRvOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lZGl0YWJsZUVsKCk7XG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVsLmZvY3VzKCk7XG4gIH0sXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgQ2hvaWNlVmlldy5wcm90b3R5cGUuX2hhbmRsZUZvY3VzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgdGFibGUgPSB0aGlzLm1vZGVsLnRhYmxlO1xuICAgIHZhciBjZWxsID0gdGhpcy5tb2RlbDtcbiAgICB2YXIgY2VsbHMgPSBjZWxsLmNvbGxlY3Rpb247XG4gICAgdmFyIHJ1bGUgPSBjZWxscy5wYXJlbnQ7XG4gICAgdmFyIHJ1bGVzID0gdGFibGUucnVsZXM7XG5cbiAgICB2YXIgeCA9IGNlbGxzLmluZGV4T2YoY2VsbCk7XG4gICAgdmFyIHkgPSBydWxlcy5pbmRleE9mKHJ1bGUpO1xuXG4gICAgaWYgKHRhYmxlLnggIT09IHggfHwgdGFibGUueSAhPT0geSkge1xuICAgICAgdGFibGUuc2V0KHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeVxuICAgICAgfSwge1xuICAgICAgICAvLyBzaWxlbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGFibGUudHJpZ2dlcignY2hhbmdlOmZvY3VzJyk7XG4gICAgfVxuXG4gICAgdGhpcy5wYXJlbnQucGFyZW50LmhpZGVDb250ZXh0TWVudSgpO1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGFyZW50LnBhcmVudC5oaWRlQ29udGV4dE1lbnUoKTtcbiAgICB0aGlzLl9mb2N1c1BzZXVkbygpO1xuICB9LFxuXG4gIF9oYW5kbGVDb250ZXh0TWVudTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHRoaXMucGFyZW50LnBhcmVudC5zaG93Q29udGV4dE1lbnUodGhpcy5tb2RlbCwgZXZ0KTtcbiAgfSxcblxuICBzZXRGb2N1czogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbCkgeyByZXR1cm47IH1cblxuICAgIGlmICh0aGlzLm1vZGVsLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZm9jdXNlZCcpO1xuXG4gICAgICBpZiAodGhpcy5wYXJlbnQucGFyZW50LmNvbnRleHRNZW51KSB7XG4gICAgICAgIHRoaXMucGFyZW50LnBhcmVudC5jb250ZXh0TWVudS5jbG9zZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wYXJlbnQucGFyZW50LmNsYXVzZVZhbHVlc0VkaXRvcikge1xuICAgICAgICB0aGlzLnBhcmVudC5wYXJlbnQuY2xhdXNlVmFsdWVzRWRpdG9yLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGFyZW50LnBhcmVudC5jbGF1c2VFeHByZXNzaW9uRWRpdG9yKSB7XG4gICAgICAgIHRoaXMucGFyZW50LnBhcmVudC5jbGF1c2VFeHByZXNzaW9uRWRpdG9yLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEVsZW1lbnQucHJvdG90eXBlLmNvbnRhaW5zICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY29udGFpbnModGhpcy5lZGl0YWJsZUVsKCkpKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzUHNldWRvKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmb2N1c2VkJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW9kZWwueCA9PT0gdGhpcy5tb2RlbC50YWJsZS54KSB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2NvbC1mb2N1c2VkJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2wtZm9jdXNlZCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vZGVsLnkgPT09IHRoaXMubW9kZWwudGFibGUueSkge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdyb3ctZm9jdXNlZCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgncm93LWZvY3VzZWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub24oJ2NoYW5nZTplbCcsIHRoaXMuc2V0Rm9jdXMpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbC50YWJsZSwgJ2NoYW5nZTpmb2N1cycsIHRoaXMuc2V0Rm9jdXMpO1xuICB9XG59KSk7XG5cblxuXG52YXIgUnVsZUlucHV0Q2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxudmFyIFJ1bGVPdXRwdXRDZWxsVmlldyA9IFJ1bGVDZWxsVmlldy5leHRlbmQoe30pO1xuXG52YXIgUnVsZUFubm90YXRpb25DZWxsVmlldyA9IFJ1bGVDZWxsVmlldy5leHRlbmQoe30pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENlbGw6ICAgICAgIFJ1bGVDZWxsVmlldyxcbiAgSW5wdXQ6ICAgICAgUnVsZUlucHV0Q2VsbFZpZXcsXG4gIE91dHB1dDogICAgIFJ1bGVPdXRwdXRDZWxsVmlldyxcbiAgQW5ub3RhdGlvbjogUnVsZUFubm90YXRpb25DZWxsVmlld1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBkZXBzOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcblxudmFyIFN1Z2dlc3Rpb25zVmlldyA9IHJlcXVpcmUoJy4vc3VnZ2VzdGlvbnMtdmlldycpO1xuXG52YXIgc3VnZ2VzdGlvbnNWaWV3ID0gU3VnZ2VzdGlvbnNWaWV3Lmluc3RhbmNlKCk7XG5cbnZhciBzcGVjaWFsS2V5cyA9IFtcbiAgOCAvLyBiYWNrc3BhY2Vcbl07XG5cbnZhciBDaG9pY2VWaWV3ID0gVmlldy5leHRlbmQoe1xuICBjb2xsZWN0aW9uczoge1xuICAgIGNob2ljZXM6IFN1Z2dlc3Rpb25zVmlldy5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgaW5wdXQ6ICdfaGFuZGxlSW5wdXQnLFxuICAgICdpbnB1dCBbY29udGVudGVkaXRhYmxlXSc6ICdfaGFuZGxlSW5wdXQnLFxuICAgIGZvY3VzOiAnX2hhbmRsZUZvY3VzJyxcbiAgICAnZm9jdXMgW2NvbnRlbnRlZGl0YWJsZV0nOiAnX2hhbmRsZUZvY3VzJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICB2YWxpZDogICAgICAgICAge1xuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIH0sXG5cbiAgICBvcmlnaW5hbFZhbHVlOiAgJ3N0cmluZydcbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgaXNPcmlnaW5hbDoge1xuICAgICAgZGVwczogWydtb2RlbC52YWx1ZScsICdvcmlnaW5hbFZhbHVlJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC52YWx1ZSA9PT0gdGhpcy5vcmlnaW5hbFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSB8fCAhdmFsdWUudHJpbSgpKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnbW9kZWwuZm9jdXNlZCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2ZvY3VzZWQnXG4gICAgfSxcblxuICAgIGlzT3JpZ2luYWw6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ3VudG91Y2hlZCdcbiAgICB9XG4gIH0sXG5cbiAgZWRpdGFibGVFbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5KCdbY29udGVudGVkaXRhYmxlXScpIHx8IHRoaXMuZWw7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAodGhpcy5lbCkge1xuICAgICAgdGhpcy5lbC5jb250ZW50RWRpdGFibGUgPSB0cnVlO1xuICAgICAgdGhpcy5lbC5zcGVsbGNoZWNrID0gZmFsc2U7XG4gICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB0aGlzLnZhbHVlID0gdGhpcy5lbC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG5cblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTpjaG9pY2VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNob2ljZXMgPSB0aGlzLm1vZGVsLmNob2ljZXM7XG4gICAgICBpZiAoIXRoaXMuY2hvaWNlcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWNob2ljZXMpIHtcbiAgICAgICAgY2hvaWNlcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNob2ljZXMucmVzZXQoY2hvaWNlcy5tYXAoZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICByZXR1cm4ge3ZhbHVlOiBjaG9pY2V9O1xuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdWdnZXN0aW9ucyA9IG5ldyBTdWdnZXN0aW9uc1ZpZXcuQ29sbGVjdGlvbih7XG4gICAgICBwYXJlbnQ6IHRoaXMuY2hvaWNlc1xuICAgIH0pO1xuICB9LFxuXG4gIF9maWx0ZXI6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB2YXIgY2hvaWNlcyA9IHRoaXMubW9kZWwuY2hvaWNlcyB8fCB0aGlzLmNob2ljZXM7XG4gICAgdmFyIGVsID0gdGhpcy5lZGl0YWJsZUVsKCk7XG4gICAgdmFyIGZpbHRlcmVkID0gY2hvaWNlc1xuICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNob2ljZS52YWx1ZS5pbmRleE9mKHZhbCkgPT09IDA7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgICAgIHZhciBjaGFycyA9IGVsLnRleHRDb250ZW50Lmxlbmd0aDtcbiAgICAgICAgICAgIHZhciB2YWwgPSBjaG9pY2UuZXNjYXBlID8gY2hvaWNlLmVzY2FwZSgndmFsdWUnKSA6IGNob2ljZS52YWx1ZTtcbiAgICAgICAgICAgIHZhciBodG1sU3RyID0gJzxzcGFuIGNsYXNzPVwiaGlnaGxpZ2h0ZWRcIj4nICsgdmFsLnNsaWNlKDAsIGNoYXJzKSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIGh0bWxTdHIgKz0gdmFsLnNsaWNlKGNoYXJzKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHZhbHVlOiBjaG9pY2UudmFsdWUsXG4gICAgICAgICAgICAgIGh0bWw6IGh0bWxTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIGZpbHRlcmVkO1xuICB9LFxuXG4gIF9oYW5kbGVGb2N1czogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2hhbmRsZUlucHV0KCk7XG4gIH0sXG5cbiAgX2hhbmRsZVJlc2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbCB8fCAhc3VnZ2VzdGlvbnNWaWV3KSB7IHJldHVybjsgfVxuICAgIHZhciBub2RlID0gdGhpcy5lbDtcbiAgICB2YXIgdG9wID0gbm9kZS5vZmZzZXRUb3A7XG4gICAgdmFyIGxlZnQgPSBub2RlLm9mZnNldExlZnQ7XG4gICAgdmFyIGhlbHBlciA9IHN1Z2dlc3Rpb25zVmlldy5lbDtcblxuICAgIHdoaWxlICgobm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50KSkge1xuICAgICAgaWYgKG5vZGUub2Zmc2V0VG9wKSB7XG4gICAgICAgIHRvcCArPSBwYXJzZUludChub2RlLm9mZnNldFRvcCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUub2Zmc2V0TGVmdCkge1xuICAgICAgICBsZWZ0ICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0TGVmdCwgMTApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRvcCAtPSBoZWxwZXIuY2xpZW50SGVpZ2h0O1xuICAgIGhlbHBlci5zdHlsZS50b3AgPSB0b3A7XG4gICAgaGVscGVyLnN0eWxlLmxlZnQgPSBsZWZ0O1xuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQgJiYgKHNwZWNpYWxLZXlzLmluZGV4T2YoZXZ0LmtleUNvZGUpID4gLTEgfHwgZXZ0LmN0cmxLZXkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBlbCA9IHRoaXMuZWRpdGFibGVFbCgpO1xuICAgIHZhciB2YWwgPSBlbC50ZXh0Q29udGVudC50cmltKCk7XG5cbiAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLl9maWx0ZXIodmFsKTtcbiAgICBzdWdnZXN0aW9uc1ZpZXcuc2hvdyhmaWx0ZXJlZCwgdGhpcyk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXplKCk7XG5cbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoZXZ0KSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2hpbmcgPSBmaWx0ZXJlZFswXS52YWx1ZTtcbiAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgdmFsdWU6IG1hdGNoaW5nXG4gICAgICB9LCB7XG4gICAgICAgIHNpbGVudDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IG1hdGNoaW5nO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hvaWNlVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IHRydWUsIHJlcXVpcmU6IGZhbHNlKi9cblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7IHZhciBkZXBzID0gcmVxdWlyZTsgfVxuZWxzZSB7IHZhciBkZXBzID0gd2luZG93LmRlcHM7IH1cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG5cbnZhciBDbGF1c2VNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIC8qXG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgY2hvaWNlczogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgICAgbW9kZWw6IFN0YXRlLmV4dGVuZCh7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgdmFsdWU6ICdzdHJpbmcnXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcbiAgKi9cblxuICBwcm9wczoge1xuICAgIGxhYmVsOiAgICAnc3RyaW5nJyxcbiAgICBjaG9pY2VzOiAgJ2FycmF5JyxcbiAgICBzb3VyY2U6ICAgJ3N0cmluZycsXG4gICAgbGFuZ3VhZ2U6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ0NPQk9MJ30sXG4gICAgZGF0YXR5cGU6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ3N0cmluZyd9XG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIGVkaXRhYmxlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICBtYXBwaW5nOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdsYW5ndWFnZScsXG4gICAgICAgICdzb3VyY2UnXG4gICAgICBdLFxuICAgICAgLy8gY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2U7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBDbGF1c2VNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBDbGF1c2VNb2RlbFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG52YXIgY29udGV4dFZpZXdzTWl4aW4gPSByZXF1aXJlKCcuL2NvbnRleHQtdmlld3MtbWl4aW4nKTtcblxuXG52YXIgTGFiZWxWaWV3ID0gVmlldy5leHRlbmQobWVyZ2Uoe30sIHtcbiAgZXZlbnRzOiB7XG4gICAgJ2ZvY3VzJzogICAgICAgICAgICAgICAgICAgICAgICAgICdfaGFuZGxlRm9jdXMnLFxuICAgICdmb2N1cyBbY29udGVudGVkaXRhYmxlXSc6ICAgICAgICAnX2hhbmRsZUZvY3VzJyxcbiAgICAnY2xpY2snOiAgICAgICAgICAgICAgICAgICAgICAgICAgJ19oYW5kbGVGb2N1cycsXG4gICAgJ2NsaWNrIFtjb250ZW50ZWRpdGFibGVdJzogICAgICAgICdfaGFuZGxlRm9jdXMnLFxuICAgICdpbnB1dCc6ICAgICAgICAgICAgICAgICAgICAgICAgICAnX2hhbmRsZUlucHV0JyxcbiAgICAnaW5wdXQgW2NvbnRlbnRlZGl0YWJsZV0nOiAgICAgICAgJ19oYW5kbGVJbnB1dCcsXG4gICAgJ2NvbnRleHRtZW51JzogICAgICAgICAgICAgICAgICAgICdfaGFuZGxlQ29udGV4dE1lbnUnLFxuICAgICdjb250ZXh0bWVudSBbY29udGVudGVkaXRhYmxlXSc6ICAnX2hhbmRsZUNvbnRleHRNZW51JyxcbiAgfSxcblxuICBkZXJpdmVkOiBtZXJnZSh7fSwgY29udGV4dFZpZXdzTWl4aW4sIHtcbiAgICB0YWJsZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAnbW9kZWwnLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbicsXG4gICAgICAgICdtb2RlbC5jb2xsZWN0aW9uLnBhcmVudCdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0pLFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmxhYmVsJzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWwpIHtcbiAgICAgICAgdmFyIGVkaXRhYmxlID0gdGhpcy5lZGl0YWJsZUVsKCk7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlZGl0YWJsZSkgeyByZXR1cm47IH1cbiAgICAgICAgZWRpdGFibGUudGV4dENvbnRlbnQgPSAodmFsIHx8ICcnKS50cmltKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGVkaXRhYmxlRWw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeSgnW2NvbnRlbnRlZGl0YWJsZV0nKSB8fCB0aGlzLmVsO1xuICB9LFxuXG4gIF9oYW5kbGVGb2N1czogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudGFibGUueCA9IHRoaXMubW9kZWwueDtcbiAgICB0aGlzLnRhYmxlLnRyaWdnZXIoJ2NoYW5nZTpmb2N1cycpO1xuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwubGFiZWwgPSB0aGlzLmVkaXRhYmxlRWwoKS50ZXh0Q29udGVudC50cmltKCk7XG4gICAgdGhpcy5faGFuZGxlRm9jdXMoKTtcbiAgfSxcblxuICBfaGFuZGxlQ29udGV4dE1lbnU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgdHlwZSA9IHRoaXMubW9kZWwuY2xhdXNlVHlwZTtcbiAgICB2YXIgdGFibGUgPSB0aGlzLnRhYmxlO1xuICAgIHRoaXMuX2hhbmRsZUZvY3VzKCk7XG5cbiAgICB2YXIgYWRkTWV0aG9kID0gdHlwZSA9PT0gJ2lucHV0JyA/ICdhZGRJbnB1dCcgOiAnYWRkT3V0cHV0JztcblxuICAgIHRoaXMuY29udGV4dE1lbnUub3Blbih7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICB0b3A6IGV2dC5wYWdlWSxcbiAgICAgIGxlZnQ6IGV2dC5wYWdlWCxcbiAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogdHlwZSA9PT0gJ2lucHV0JyA/ICdJbnB1dCcgOiAnT3V0cHV0JyxcbiAgICAgICAgICBpY29uOiB0eXBlLFxuICAgICAgICAgIGNsYXNzTmFtZTogdHlwZSxcbiAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbYWRkTWV0aG9kXSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdhZnRlcicsXG4gICAgICAgICAgICAgICAgICBpY29uOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbYWRkTWV0aG9kXSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdjb3B5JyxcbiAgICAgICAgICAgICAgLy8gaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge30sXG4gICAgICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAnbW92ZScsXG4gICAgICAgICAgICAgIC8vIGljb246ICdwbHVzJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYmVmb3JlJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdhZnRlcicsXG4gICAgICAgICAgICAgICAgICBpY29uOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlZGl0YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBlZGl0YWJsZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIGVkaXRhYmxlLnRleHRDb250ZW50ID0gKHRoaXMubW9kZWwubGFiZWwgfHwgJycpLnRyaW0oKTtcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoZWRpdGFibGUpO1xuICB9XG59KSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBMYWJlbFZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UsIHJlcXVpcmU6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBtZXJnZSA9IGRlcHMoJ2xvZGFzaC5tZXJnZScpO1xudmFyIGNvbnRleHRWaWV3c01peGluID0gcmVxdWlyZSgnLi9jb250ZXh0LXZpZXdzLW1peGluJyk7XG5cblxuXG52YXIgTWFwcGluZ1ZpZXcgPSBWaWV3LmV4dGVuZChtZXJnZSh7fSwge1xuICBldmVudHM6IHtcbiAgICAnY29udGV4dG1lbnUnOiAnX2hhbmRsZUNvbnRleHRNZW51J1xuICB9LFxuXG4gIGRlcml2ZWQ6IG1lcmdlKHt9LCBjb250ZXh0Vmlld3NNaXhpbiwge1xuICAgIHRhYmxlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdtb2RlbCcsXG4gICAgICAgICdtb2RlbC5jb2xsZWN0aW9uJyxcbiAgICAgICAgJ21vZGVsLmNvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSksXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubWFwcGluZyc6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbCkgeyByZXR1cm47IH1cbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSAodmFsIHx8ICcnKS50cmltKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwubWFwcGluZyA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICB9LFxuXG4gIF9oYW5kbGVDb250ZXh0TWVudTogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQuZGVmYXVsdFByZXZlbnRlZCkgeyByZXR1cm47IH1cbiAgICB0aGlzLmNsYXVzZUV4cHJlc3Npb25FZGl0b3Iuc2hvdyh0aGlzLm1vZGVsLCB0aGlzKTtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIHRoaXMuZWwudGV4dENvbnRlbnQgPSAodGhpcy5tb2RlbC5tYXBwaW5nIHx8ICcnKS50cmltKCk7XG4gIH1cbn0pKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBwaW5nVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG52YXIgY29udGV4dFZpZXdzTWl4aW4gPSByZXF1aXJlKCcuL2NvbnRleHQtdmlld3MtbWl4aW4nKTtcblxudmFyIFZhbHVlVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHt9LCB7XG4gIGV2ZW50czoge1xuICAgICdjb250ZXh0bWVudSc6ICAgICdfaGFuZGxlQ29udGV4dE1lbnUnXG4gIH0sXG5cbiAgZGVyaXZlZDogbWVyZ2Uoe30sIGNvbnRleHRWaWV3c01peGluLCB7XG4gICAgdGFibGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ21vZGVsJyxcbiAgICAgICAgJ21vZGVsLmNvbGxlY3Rpb24nLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9KSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5jaG9pY2VzJzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlckNvbnRlbnQoZWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgJ21vZGVsLmRhdGF0eXBlJzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlckNvbnRlbnQoZWwpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBfcmVuZGVyQ29udGVudDogZnVuY3Rpb24gKGVsKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIHZhciB2YWwgPSB0aGlzLm1vZGVsLmNob2ljZXM7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSAmJiB2YWwubGVuZ3RoKSB7XG4gICAgICBzdHIgPSAnKCcgKyB2YWwuam9pbignLCAnKSArICcpJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzdHIgPSB0aGlzLm1vZGVsLmRhdGF0eXBlO1xuICAgIH1cbiAgICBlbC50ZXh0Q29udGVudCA9IHN0cjtcbiAgfSxcblxuICBfaGFuZGxlQ29udGV4dE1lbnU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoZXZ0LmRlZmF1bHRQcmV2ZW50ZWQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5jbGF1c2VWYWx1ZXNFZGl0b3Iuc2hvdyh0aGlzLm1vZGVsLmRhdGF0eXBlLCB0aGlzLm1vZGVsLmNob2ljZXMsIHRoaXMpO1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59KSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gVmFsdWVWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgTGFiZWxWaWV3ID0gcmVxdWlyZSgnLi9jbGF1c2UtbGFiZWwtdmlldycpO1xudmFyIFZhbHVlVmlldyA9IHJlcXVpcmUoJy4vY2xhdXNlLXZhbHVlLXZpZXcnKTtcbnZhciBNYXBwaW5nVmlldyA9IHJlcXVpcmUoJy4vY2xhdXNlLW1hcHBpbmctdmlldycpO1xuXG5cblxuXG5cbnZhciByZXF1aXJlZEVsZW1lbnQgPSB7XG4gIHR5cGU6ICdlbGVtZW50JyxcbiAgcmVxdWlyZWQ6IHRydWVcbn07XG5cbnZhciBDbGF1c2VWaWV3ID0gVmlldy5leHRlbmQoe1xuICBzZXNzaW9uOiB7XG4gICAgbGFiZWxFbDogICAgcmVxdWlyZWRFbGVtZW50LFxuICAgIG1hcHBpbmdFbDogIHJlcXVpcmVkRWxlbWVudCxcbiAgICB2YWx1ZUVsOiAgICByZXF1aXJlZEVsZW1lbnRcbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgdGFibGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ21vZGVsJyxcbiAgICAgICAgJ21vZGVsLmNvbGxlY3Rpb24nLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhdXNlID0gdGhpcy5tb2RlbDtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgc3Vidmlld3MgPSB7XG4gICAgICBsYWJlbDogICAgTGFiZWxWaWV3LFxuICAgICAgbWFwcGluZzogIE1hcHBpbmdWaWV3LFxuICAgICAgdmFsdWU6ICAgIFZhbHVlVmlld1xuICAgIH07XG5cbiAgICBPYmplY3Qua2V5cyhzdWJ2aWV3cykuZm9yRWFjaChmdW5jdGlvbiAoa2luZCkge1xuICAgICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLm1vZGVsLCAnY2hhbmdlOicgKyBraW5kLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzW2tpbmQgKyAnVmlldyddKSB7XG4gICAgICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKHRoaXNba2luZCArICdWaWV3J10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpc1traW5kICsgJ1ZpZXcnXSA9IG5ldyBzdWJ2aWV3c1traW5kXSh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIG1vZGVsOiAgY2xhdXNlLFxuICAgICAgICAgIGVsOiAgICAgdGhpc1traW5kICsgJ0VsJ11cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIGZ1bmN0aW9uIHRhYmxlQ2hhbmdlRm9jdXMoKSB7XG4gICAgICBpZiAoc2VsZi5tb2RlbC5mb2N1c2VkKSB7XG4gICAgICAgIHNlbGYubGFiZWxFbC5jbGFzc0xpc3QuYWRkKCdjb2wtZm9jdXNlZCcpO1xuICAgICAgICBzZWxmLm1hcHBpbmdFbC5jbGFzc0xpc3QuYWRkKCdjb2wtZm9jdXNlZCcpO1xuICAgICAgICBzZWxmLnZhbHVlRWwuY2xhc3NMaXN0LmFkZCgnY29sLWZvY3VzZWQnKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzZWxmLmxhYmVsRWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sLWZvY3VzZWQnKTtcbiAgICAgICAgc2VsZi5tYXBwaW5nRWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sLWZvY3VzZWQnKTtcbiAgICAgICAgc2VsZi52YWx1ZUVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbC1mb2N1c2VkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudGFibGUub24oJ2NoYW5nZTpmb2N1cycsIHRhYmxlQ2hhbmdlRm9jdXMpO1xuICAgIHRhYmxlQ2hhbmdlRm9jdXMoKTtcbiAgfVxufSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2xhdXNlVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29tYm9Cb3hWaWV3ID0gcmVxdWlyZSgnLi9jb21ib2JveC12aWV3Jyk7XG5cblxuZnVuY3Rpb24gZWxCb3goZWwpIHtcbiAgdmFyIG5vZGUgPSBlbDtcbiAgdmFyIGJveCA9IHtcbiAgICB0b3A6IGVsLm9mZnNldFRvcCxcbiAgICBsZWZ0OiBlbC5vZmZzZXRMZWZ0LFxuICAgIHdpZHRoOiBlbC5vZmZzZXRXaWR0aCxcbiAgICBoZWlnaHQ6IGVsLm9mZnNldEhlaWdodFxuICB9O1xuXG4gIHdoaWxlICgobm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50KSkge1xuICAgIGlmIChub2RlLm9mZnNldFRvcCkge1xuICAgICAgYm94LnRvcCArPSBwYXJzZUludChub2RlLm9mZnNldFRvcCwgMTApO1xuICAgIH1cbiAgICBpZiAobm9kZS5vZmZzZXRMZWZ0KSB7XG4gICAgICBib3gubGVmdCArPSBwYXJzZUludChub2RlLm9mZnNldExlZnQsIDEwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYm94O1xufVxuXG5cbnZhciBMYW5ndWFnZXNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBsYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxzW3RoaXMubW9kZWxzLmxlbmd0aCAtIDFdO1xuICB9LFxuXG4gIHJlc3RyaXBlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVscyA9IHRoaXMuZmlsdGVyKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgcmV0dXJuIG1vZGVsLnZhbHVlO1xuICAgIH0pO1xuXG4gICAgbW9kZWxzLnB1c2goe1xuICAgICAgdmFsdWU6ICcnXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlc2V0KG1vZGVscyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMub24oJ2NoYW5nZTp2YWx1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLnJlc3RyaXBlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pXG59KTtcblxuXG5cblxuXG5cblxuXG52YXIgTGFuZ3VhZ2VzQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbWFpbkluZGV4OiAndmFsdWUnLFxuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnLFxuICAgICAgcGxhY2Vob2xkZXI6ICdzdHJpbmcnXG4gICAgfVxuICB9KVxufSk7XG5cblxuXG5cbnZhciBkZWZhdWx0TGFuZ3VhZ2UgPSBbXG4gIHtcbiAgICB2YWx1ZTogJ0ZFRUwnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ0xVQSdcbiAgfSxcbiAge1xuICAgIHZhbHVlOiAnQ09CT0wnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ1BIUCcsXG4gICAgcGxhY2Vob2xkZXI6ICdyZXR1cm4gJG9ialtcXCdwcm9wZXJ0eU5hbWVcXCddOydcbiAgfSxcbiAge1xuICAgIHZhbHVlOiAnTElTUCdcbiAgfSxcbiAge1xuICAgIHZhbHVlOiAnU2NhbGEnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ0MnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ0phdmFzY3JpcHQnLFxuICAgIHBsYWNlaG9sZGVyOiAncmV0dXJuIG9iai5wcm9wZXJ0eU5hbWU7J1xuICB9LFxuICB7XG4gICAgdmFsdWU6ICdHcm9vdnknXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ1B5dGhvbidcbiAgfSxcbiAge1xuICAgIHZhbHVlOiAnUGVybCdcbiAgfVxuXTtcblxuXG52YXIgQ2xhdXNlRXhwcmVzc2lvblZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImRtbi1jbGF1c2VleHByZXNzaW9uLXNldHRlclwiPicgK1xuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImxhbmd1YWdlXCI+PC9kaXY+JyArXG5cbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzb3VyY2VcIj4nICtcbiAgICAgICAgICAgICAgICAnPGxhYmVsPlNvdXJjZTo8L2xhYmVsPicgK1xuICAgICAgICAgICAgICAgICc8dGV4dGFyZWE+PC90ZXh0YXJlYT4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ0b2dnbGUtZWRpdG9yLXNpemVcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gIHN1YnZpZXdzOiB7XG4gICAgbGFuZ3VhZ2VWaWV3OiB7XG4gICAgICBjb250YWluZXI6ICcubGFuZ3VhZ2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICB2YXIgY29tYm9ib3hWaWV3ID0gbmV3IENvbWJvQm94Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiAgICAgdGhpcyxcbiAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLmxhbmd1YWdlcyxcbiAgICAgICAgICB2YWx1ZTogICAgICB0aGlzLmxhbmd1YWdlLFxuICAgICAgICAgIGxhYmVsOiAgICAgICdMYW5ndWFnZTonLFxuICAgICAgICAgIGNsYXNzTmFtZTogIGVsLmNsYXNzTmFtZVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgY2JFbCA9IGNvbWJvYm94Vmlldy5yZW5kZXIoKS5lbDtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2JFbCwgZWwpO1xuXG4gICAgICAgIHRoaXMubGlzdGVuVG8oY29tYm9ib3hWaWV3LCAnY2hhbmdlOnZhbHVlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMubGFuZ3VhZ2UgPSBjb21ib2JveFZpZXcudmFsdWU7XG4gICAgICAgICAgdmFyIGluZm8gPSB0aGlzLmxhbmd1YWdlcy5nZXQodGhpcy5sYW5ndWFnZSk7XG4gICAgICAgICAgaWYgKCFpbmZvKSB7IHJldHVybjsgfVxuICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSBpbmZvLnBsYWNlaG9sZGVyIHx8ICcnO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9uKCdjaGFuZ2U6dmlzaWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgICAgICBjb21ib2JveFZpZXcuc2V0VmlzaWJsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbWJvYm94Vmlldy5zdWdnZXN0aW9uc0VsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29tYm9ib3hWaWV3O1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIGxhbmd1YWdlczogTGFuZ3VhZ2VzQ29sbGVjdGlvbixcbiAgICBwb3NzaWJsZUxhbmd1YWdlczogTGFuZ3VhZ2VzQ29sbGVjdGlvblxuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICB2aXNpYmxlOiAgICAgICdib29sZWFuJyxcbiAgICBiaWc6ICAgICAgICAgICdib29sZWFuJyxcbiAgICBsYW5ndWFnZTogICAgIHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ0ZFRUwnfSxcbiAgICBwbGFjZWhvbGRlcjogICdzdHJpbmcnLFxuICAgIG9yaWdpbmFsQm94OiAgJ2FueSdcbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgY29udGV4dE1lbnU6IHtcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gdGhpcztcbiAgICAgICAgd2hpbGUgKChjdXJyZW50ID0gY3VycmVudC5wYXJlbnQpKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnQuY29udGV4dE1lbnUpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50LmNvbnRleHRNZW51O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdGFibGVWaWV3OiB7XG4gICAgICBkZXA6IFsncGFyZW50J10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgIHdoaWxlICgocGFyZW50ID0gcGFyZW50LnBhcmVudCkpIHtcbiAgICAgICAgICBpZiAocGFyZW50LnRhYmxlRWwgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgIHZpc2libGU6IHtcbiAgICAgIHR5cGU6ICd0b2dnbGUnXG4gICAgfSxcbiAgICBwbGFjZWhvbGRlcjoge1xuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXG4gICAgICBzZWxlY3RvcjogJ3RleHRhcmVhJyxcbiAgICAgIG5hbWU6ICdwbGFjZWhvbGRlcidcbiAgICB9XG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBzZWxlY3QnOiAgICAgICAgICAgICAgJ19oYW5kbGVMYW5ndWFnZUNoYW5nZScsXG4gICAgJ2lucHV0IHRleHRhcmVhJzogICAgICAgICAgICAgJ19oYW5kbGVTb3VyY2VJbnB1dCcsXG4gICAgJ2NsaWNrIC50b2dnbGUtZWRpdG9yLXNpemUnOiAgJ19oYW5kbGVTaXplQ2xpY2snXG4gIH0sXG5cbiAgX2hhbmRsZUxhbmd1YWdlQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5sYW5ndWFnZSA9IHRoaXMubGFuZ3VhZ2VFbC52YWx1ZTtcbiAgfSxcblxuICBfaGFuZGxlU291cmNlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcblxuICB9LFxuXG4gIF9oYW5kbGVTaXplQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmJpZyA9ICF0aGlzLmJpZztcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gaGFzTW9kZWwoKSB7XG4gICAgICByZXR1cm4gc2VsZi5wYXJlbnQgJiYgc2VsZi5wYXJlbnQubW9kZWwgJiYgc2VsZi5wYXJlbnQubW9kZWwubGFuZ3VhZ2U7XG4gICAgfVxuXG4gICAgdGhpcy5vbignY2hhbmdlOmxhbmd1YWdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFoYXNNb2RlbCgpKSB7IHJldHVybjsgfVxuXG4gICAgICB0aGlzLnBhcmVudC5tb2RlbC5sYW5ndWFnZSA9IHRoaXMubGFuZ3VhZ2U7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdjaGFuZ2U6YmlnJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0eWxlID0gdGhpcy5lbC5zdHlsZTtcbiAgICAgIHZhciBib3g7XG5cbiAgICAgIGlmICh0aGlzLmJpZykge1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2JpZycpO1xuXG4gICAgICAgIGJveCA9IGVsQm94KHRoaXMudGFibGVWaWV3LmVsKTtcblxuICAgICAgICBzdHlsZS53aWR0aCA9IGJveC53aWR0aCArJ3B4JztcbiAgICAgICAgc3R5bGUuaGVpZ2h0ID0gYm94LmhlaWdodCArJ3B4JztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2JpZycpO1xuXG4gICAgICAgIGJveCA9IHRoaXMub3JpZ2luYWxCb3g7XG5cbiAgICAgICAgc3R5bGUud2lkdGggPSAnYXV0byc7XG4gICAgICAgIHN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcmVzaXplVGV4dGFyZWEoYm94KTtcblxuICAgICAgc3R5bGUudG9wID0gYm94LnRvcCArJ3B4JztcbiAgICAgIHN0eWxlLmxlZnQgPSBib3gubGVmdCArJ3B4JztcbiAgICB9KTtcbiAgfSxcblxuICBzZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIXRoaXMucGFyZW50LmVsKSB7XG4gICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaGVscGVyID0gdGhpcy5lbDtcbiAgICB2YXIgYm94ID0gZWxCb3godGhpcy5wYXJlbnQuZWwpO1xuXG4gICAgYm94LmxlZnQgKz0gdGhpcy5wYXJlbnQuZWwuY2xpZW50V2lkdGg7XG4gICAgYm94LnRvcCAtPSAyMDtcblxuICAgIGJveC5sZWZ0ICs9IE1hdGgubWluKGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSAoYm94LmxlZnQgKyB0aGlzLmVsLmNsaWVudFdpZHRoKSwgMCk7XG4gICAgYm94LnRvcCArPSBNYXRoLm1pbihkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCAtIChib3gudG9wICsgdGhpcy5lbC5jbGllbnRIZWlnaHQpLCAwKTtcblxuICAgIGhlbHBlci5zdHlsZS50b3AgPSBib3gudG9wICsncHgnO1xuICAgIGhlbHBlci5zdHlsZS5sZWZ0ID0gYm94LmxlZnQgKydweCc7XG5cbiAgICBpZiAodGhpcy5sYW5ndWFnZVZpZXcpIHtcbiAgICAgIHRoaXMubGFuZ3VhZ2VWaWV3LnNldFBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5hbEJveCA9IGVsQm94KHRoaXMuZWwpO1xuICB9LFxuXG4gIF9yZXNpemVUZXh0YXJlYTogZnVuY3Rpb24gKGJveCkge1xuICAgIHZhciBsYWJlbEhlaWdodCA9IHRoaXMuc291cmNlRWwucGFyZW50Tm9kZS5jbGllbnRIZWlnaHQgLSB0aGlzLnNvdXJjZUVsLmNsaWVudEhlaWdodDtcbiAgICB0aGlzLnNvdXJjZUVsLnN0eWxlLmhlaWdodCA9IChib3guaGVpZ2h0IC0gKHRoaXMubGFuZ3VhZ2VFbC5jbGllbnRIZWlnaHQgKyBsYWJlbEhlaWdodCkpICsgJ3B4JztcbiAgfSxcblxuICBzaG93OiBmdW5jdGlvbiAobW9kZWwsIHBhcmVudCkge1xuICAgIGlmICghbW9kZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBhcmVudCAmJiB0aGlzLnBhcmVudCAhPT0gcGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuXG4gICAgdGhpcy5sYW5ndWFnZXMucmVzZXQoZGVmYXVsdExhbmd1YWdlKTtcblxuICAgIHRoaXMubGFuZ3VhZ2VWaWV3LmlucHV0RWwudmFsdWUgPSB0aGlzLm1vZGVsLmxhbmd1YWdlIHx8ICcnO1xuXG5cbiAgICBpbnN0YW5jZS52aXNpYmxlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudC5jb250ZXh0TWVudSkge1xuICAgICAgICB0aGlzLnBhcmVudC5jb250ZXh0TWVudS5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucGFyZW50LmNsYXVzZVZhbHVlc0VkaXRvcikge1xuICAgICAgICB0aGlzLnBhcmVudC5jbGF1c2VWYWx1ZXNFZGl0b3IuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuXG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgIGxhbmd1YWdlRWw6ICcubGFuZ3VhZ2UnLFxuICAgICAgc291cmNlRWw6ICAgJy5zb3VyY2UgdGV4dGFyZWEnXG4gICAgfSk7XG5cbiAgICB0aGlzLnNvdXJjZUVsLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmNpZCk7XG4gICAgdGhpcy5xdWVyeSgnLnNvdXJjZSBsYWJlbCcpLnNldEF0dHJpYnV0ZSgnZm9yJywgdGhpcy5jaWQpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxudmFyIGluc3RhbmNlO1xuQ2xhdXNlRXhwcmVzc2lvblZpZXcuaW5zdGFuY2UgPSBmdW5jdGlvbiAoc3VnZ2VzdGlvbnMsIHBhcmVudCkge1xuICBpZiAoIWluc3RhbmNlKSB7XG4gICAgaW5zdGFuY2UgPSBuZXcgQ2xhdXNlRXhwcmVzc2lvblZpZXcoe30pO1xuICAgIGluc3RhbmNlLnJlbmRlcigpO1xuICB9XG5cbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGluc3RhbmNlLmVsKSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zdGFuY2UuZWwpO1xuICB9XG5cbiAgaW5zdGFuY2Uuc2hvdyhzdWdnZXN0aW9ucywgcGFyZW50KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59O1xuXG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuZG1uQ2xhdXNlRXhwcmVzc2lvbkVkaXRvciA9IENsYXVzZUV4cHJlc3Npb25WaWV3Lmluc3RhbmNlKCk7XG59XG5cbkNsYXVzZUV4cHJlc3Npb25WaWV3LkNvbGxlY3Rpb24gPSBMYW5ndWFnZXNDb2xsZWN0aW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXVzZUV4cHJlc3Npb25WaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb21ib0JveFZpZXcgPSByZXF1aXJlKCcuL2NvbWJvYm94LXZpZXcnKTtcblxuXG5cbnZhciBWYWx1ZXNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBsYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxzW3RoaXMubW9kZWxzLmxlbmd0aCAtIDFdO1xuICB9LFxuXG4gIHJlc3RyaXBlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVscyA9IHRoaXMuZmlsdGVyKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgcmV0dXJuIG1vZGVsLnZhbHVlO1xuICAgIH0pO1xuXG4gICAgbW9kZWxzLnB1c2goe1xuICAgICAgdmFsdWU6ICcnXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlc2V0KG1vZGVscyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMub24oJ2NoYW5nZTp2YWx1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLnJlc3RyaXBlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pXG59KTtcblxudmFyIFZhbHVlc0l0ZW1WaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzxsaT48aW5wdXQgdGFiaW5kZXg9XCIxXCIgcGxhY2Vob2xkZXI9XCJBbiBvdGhlciBwb3NzaWJsZSB2YWx1ZVwiIC8+PC9saT4nLFxuXG4gIHNlc3Npb246IHtcbiAgICBpbnZhbGlkOiAnYm9vbGVhbidcbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBzZWxlY3RvcjogJ2lucHV0J1xuICAgIH0sXG4gICAgaW52YWxpZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBuYW1lOiAnaW52YWxpZCcsXG4gICAgICBzZWxlY3RvcjogJ2lucHV0J1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIGlucHV0JzogICAnX2hhbmRsZVZhbHVlQ2hhbmdlJyxcbiAgICAnYmx1ciBpbnB1dCc6ICAgICAnX2hhbmRsZVZhbHVlQ2hhbmdlJyxcbiAgICAna2V5ZG93biBpbnB1dCc6ICAnX2hhbmRsZVZhbHVlS2V5ZG93bicsXG4gICAgJ2tleXVwIGlucHV0JzogICAgJ19oYW5kbGVWYWx1ZUtleXVwJ1xuICB9LFxuXG4gIF9oYW5kbGVWYWx1ZUNoYW5nZTogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmICh0aGlzLm1vZGVsLnZhbHVlICE9PSBldnQudGFyZ2V0LnZhbHVlKSB7XG4gICAgICB0aGlzLm1vZGVsLnZhbHVlID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gIH0sXG5cbiAgX2hhbmRsZVZhbHVlS2V5ZG93bjogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBjb2RlID0gZXZ0LndoaWNoIHx8IGV2dC5rZXlDb2RlO1xuXG4gICAgdmFyIGNvbGxlY3Rpb24gPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb247XG4gICAgdmFyIGxhc3QgPSBjb2xsZWN0aW9uLmxhc3QoKTtcblxuICAgIGlmIChsYXN0ID09PSB0aGlzLm1vZGVsICYmIGV2dC50YXJnZXQudmFsdWUpIHtcbiAgICAgIGNvbGxlY3Rpb24uYWRkKHt2YWx1ZTogJyd9KTtcbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gOSkge1xuICAgICAgdmFyIGlucHV0cyA9IHRoaXMucGFyZW50LnF1ZXJ5QWxsKCcuYWxsb3dlZC12YWx1ZXMgaW5wdXQnKTtcbiAgICAgIHZhciBsYXN0SW5wdXQgPSBpbnB1dHNbaW5wdXRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoaW5wdXRzLmluZGV4T2YoZXZ0LnRhcmdldCkgPT09IChpbnB1dHMubGVuZ3RoIC0gMikpIHtcbiAgICAgICAgbGFzdElucHV0LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVWYWx1ZUtleXVwOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb247XG4gICAgdmFyIGxhc3QgPSBjb2xsZWN0aW9uLmxhc3QoKTtcblxuICAgIGlmIChsYXN0ID09PSB0aGlzLm1vZGVsICYmIGV2dC50YXJnZXQudmFsdWUpIHtcbiAgICAgIGNvbGxlY3Rpb24uYWRkKHt2YWx1ZTogJyd9KTtcbiAgICB9XG4gIH0sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsID0gdGhpcy5tb2RlbC52YWx1ZTtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgdGhpcy5pbnZhbGlkID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgY2lkID0gdGhpcy5tb2RlbC5jaWQ7XG4gICAgdmFyIHNhbWUgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24uZmlsdGVyKGZ1bmN0aW9uIChvdGhlcikge1xuICAgICAgcmV0dXJuIG90aGVyLmNpZCAhPT0gY2lkICYmIG90aGVyLnZhbHVlID09PSB2YWw7XG4gICAgfSk7XG5cbiAgICB0aGlzLmludmFsaWQgPSBzYW1lLmxlbmd0aCA+IDA7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cblxuXG5cblxuXG5cbnZhciBEYXRhdHlwZXNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtYWluSW5kZXg6ICd2YWx1ZScsXG4gIG1vZGVsOiBTdGF0ZS5leHRlbmQoe1xuICAgIHByb3BzOiB7XG4gICAgICB2YWx1ZTogJ3N0cmluZycsXG4gICAgICBvZmZlcjogJ3N0cmluZydcbiAgICB9XG4gIH0pXG59KTtcblxuXG5cblxudmFyIHByaW1pdGl2ZVR5cGVzID0gW1xuICB7XG4gICAgdmFsdWU6ICdzdHJpbmcnLFxuICAgIG9mZmVyOiAnY2hvaWNlcydcbiAgfSxcbiAge1xuICAgIHZhbHVlOiAnZGF0ZScsXG4gICAgb2ZmZXI6ICdyYW5nZSdcbiAgfSxcblxuICAvLyBodHRwczovL2RvY3Mub3JhY2xlLmNvbS9qYXZhc2UvdHV0b3JpYWwvamF2YS9udXRzYW5kYm9sdHMvZGF0YXR5cGVzLmh0bWxcbiAge1xuICAgIHZhbHVlOiAnc2hvcnQnLFxuICAgIG9mZmVyOiAncmFuZ2UnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ2ludCcsXG4gICAgb2ZmZXI6ICdyYW5nZSdcbiAgfSxcbiAge1xuICAgIHZhbHVlOiAnbG9uZycsXG4gICAgb2ZmZXI6ICdyYW5nZSdcbiAgfSxcbiAge1xuICAgIHZhbHVlOiAnZmxvYXQnLFxuICAgIG9mZmVyOiAncmFuZ2UnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ2RvdWJsZScsXG4gICAgb2ZmZXI6ICdyYW5nZSdcbiAgfSxcblxuICB7XG4gICAgdmFsdWU6ICdib29sZWFuJ1xuICB9XG5dO1xuXG5cbnZhciBDbGF1c2VWYWx1ZXNWaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkbW4tY2xhdXNldmFsdWVzLXNldHRlciBjaG9pY2VzXCI+JyArXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGF0YXR5cGVcIj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PicgK1xuXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYWxsb3dlZC12YWx1ZXNcIj4nICtcbiAgICAgICAgICAgICAgICAnPGxhYmVsPkFsbG93ZWQgdmFsdWVzOjwvbGFiZWw+JyArXG4gICAgICAgICAgICAgICAgJzx1bD48L3VsPicgK1xuICAgICAgICAgICAgICAnPC9kaXY+JyArXG5cbiAgICAgICAgICAgICAgJzx1bCBjbGFzcz1cInJhbmdlZC12YWx1ZXNcIj4nICtcbiAgICAgICAgICAgICAgICAnPGxpIGNsYXNzPVwibWluXCI+JyArXG4gICAgICAgICAgICAgICAgICAnPGxhYmVsPk1pbjo8L2xhYmVsPicgK1xuICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0YWJpbmRleD1cIjFcIiAvPicgK1xuICAgICAgICAgICAgICAgICc8L2xpPicgK1xuICAgICAgICAgICAgICAgICc8bGkgY2xhc3M9XCJtYXhcIj4nICtcbiAgICAgICAgICAgICAgICAgICc8bGFiZWw+TWF4OjwvbGFiZWw+JyArXG4gICAgICAgICAgICAgICAgICAnPGlucHV0IHRhYmluZGV4PVwiMlwiIC8+JyArXG4gICAgICAgICAgICAgICAgJzwvbGk+JyArXG4gICAgICAgICAgICAgICc8L3VsPicgK1xuICAgICAgICAgICAgJzwvZGl2PicsXG5cbiAgc3Vidmlld3M6IHtcbiAgICBkYXRhdHlwZVZpZXc6IHtcbiAgICAgIGNvbnRhaW5lcjogJy5kYXRhdHlwZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHZhciBjb21ib2JveFZpZXcgPSBuZXcgQ29tYm9Cb3hWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6ICAgICB0aGlzLFxuICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMuZGF0YXR5cGVzLFxuICAgICAgICAgIC8vIHZhbHVlOiAgICAgIHRoaXMuZGF0YXR5cGUsXG4gICAgICAgICAgbGFiZWw6ICAgICAgJ1R5cGU6JyxcbiAgICAgICAgICBjbGFzc05hbWU6ICBlbC5jbGFzc05hbWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGNiRWwgPSBjb21ib2JveFZpZXcucmVuZGVyKCkuZWw7XG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNiRWwsIGVsKTtcblxuICAgICAgICB0aGlzLmxpc3RlblRvKGNvbWJvYm94VmlldywgJ2NoYW5nZTp2YWx1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLmRhdGF0eXBlID0gY29tYm9ib3hWaWV3LnZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9uKCdjaGFuZ2U6dmlzaWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgICAgICBjb21ib2JveFZpZXcuc2V0VmlzaWJsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbWJvYm94Vmlldy5zdWdnZXN0aW9uc0VsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29tYm9ib3hWaWV3O1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIGRhdGF0eXBlczogRGF0YXR5cGVzQ29sbGVjdGlvbixcbiAgICBwb3NzaWJsZVZhbHVlczogVmFsdWVzQ29sbGVjdGlvblxuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICB2aXNpYmxlOiAnYm9vbGVhbicsXG4gICAgZGF0YXR5cGU6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ3N0cmluZyd9XG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGNvbnRleHRNZW51OiB7XG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXM7XG4gICAgICAgIHdoaWxlICgoY3VycmVudCA9IGN1cnJlbnQucGFyZW50KSkge1xuICAgICAgICAgIGlmIChjdXJyZW50LmNvbnRleHRNZW51KSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudC5jb250ZXh0TWVudTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICB2aXNpYmxlOiB7XG4gICAgICB0eXBlOiAndG9nZ2xlJ1xuICAgIH0sXG4gICAgZGF0YXR5cGU6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogZnVuY3Rpb24oZWwsIHZhbCwgcHJldikge1xuICAgICAgICAgIGlmICghdGhpcy5kYXRhdHlwZXMubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgICAgICAgIHZhciB0eXBlO1xuXG4gICAgICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgICAgIHR5cGUgPSB0aGlzLmRhdGF0eXBlcy5nZXQocHJldik7XG4gICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKHR5cGUub2ZmZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgIHR5cGUgPSB0aGlzLmRhdGF0eXBlcy5nZXQodmFsKTtcbiAgICAgICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQodHlwZS5vZmZlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzZWxlY3RvcjogJy5taW4gaW5wdXQnLFxuICAgICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbCkge1xuICAgICAgICAgIHZhciBiZWZvcmUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIGJlZm9yZS5zZXRGdWxsWWVhcihiZWZvcmUuZ2V0RnVsbFllYXIoKSAtIDEpO1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCB2YWwgPT09ICdkYXRlJyA/IGJlZm9yZS50b0lTT1N0cmluZygpLnNwbGl0KCcuJykuc2hpZnQoKSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2VsZWN0b3I6ICcubWF4IGlucHV0JyxcbiAgICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWwpIHtcbiAgICAgICAgICB2YXIgYWZ0ZXIgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIGFmdGVyLnNldEZ1bGxZZWFyKGFmdGVyLmdldEZ1bGxZZWFyKCkgKyAxKTtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgdmFsID09PSAnZGF0ZScgPyBhZnRlci50b0lTT1N0cmluZygpLnNwbGl0KCcuJykuc2hpZnQoKSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIHNlbGVjdCc6ICdfaGFuZGxlRGF0YXR5cGVDaGFuZ2UnXG4gIH0sXG5cbiAgX2hhbmRsZURhdGF0eXBlQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5kYXRhdHlwZSA9IHRoaXMuZGF0YXR5cGVFbC52YWx1ZTtcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gaGFzTW9kZWwoKSB7XG4gICAgICByZXR1cm4gc2VsZi5wYXJlbnQgJiYgc2VsZi5wYXJlbnQubW9kZWwgJiYgc2VsZi5wYXJlbnQubW9kZWwuZGF0YXR5cGU7XG4gICAgfVxuXG4gICAgdGhpcy5vbignY2hhbmdlOmRhdGF0eXBlJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFoYXNNb2RlbCgpKSB7IHJldHVybjsgfVxuXG4gICAgICB0aGlzLnBhcmVudC5tb2RlbC5kYXRhdHlwZSA9IHRoaXMuZGF0YXR5cGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMucG9zc2libGVWYWx1ZXMsICdhbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWhhc01vZGVsKCkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNob2ljZXMgPSB0aGlzLnBvc3NpYmxlVmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBzZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIXRoaXMucGFyZW50LmVsKSB7XG4gICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbm9kZSA9IHRoaXMucGFyZW50LmVsO1xuICAgIHZhciB0b3AgPSBub2RlLm9mZnNldFRvcDtcbiAgICB2YXIgbGVmdCA9IG5vZGUub2Zmc2V0TGVmdDtcbiAgICB2YXIgaGVscGVyID0gdGhpcy5lbDtcblxuICAgIHdoaWxlICgobm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50KSkge1xuICAgICAgaWYgKG5vZGUub2Zmc2V0VG9wKSB7XG4gICAgICAgIHRvcCArPSBwYXJzZUludChub2RlLm9mZnNldFRvcCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUub2Zmc2V0TGVmdCkge1xuICAgICAgICBsZWZ0ICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0TGVmdCwgMTApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxlZnQgKz0gdGhpcy5wYXJlbnQuZWwuY2xpZW50V2lkdGg7XG4gICAgdG9wIC09IDIwO1xuXG4gICAgbGVmdCArPSBNYXRoLm1pbihkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gKGxlZnQgKyB0aGlzLmVsLmNsaWVudFdpZHRoKSwgMCk7XG4gICAgdG9wICs9IE1hdGgubWluKGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gKHRvcCArIHRoaXMuZWwuY2xpZW50SGVpZ2h0KSwgMCk7XG5cbiAgICBoZWxwZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGhlbHBlci5zdHlsZS50b3AgPSB0b3AgKydweCc7XG4gICAgaGVscGVyLnN0eWxlLmxlZnQgPSBsZWZ0ICsncHgnO1xuXG5cbiAgICBpZiAodGhpcy5kYXRhdHlwZVZpZXcpIHtcbiAgICAgIHRoaXMuZGF0YXR5cGVWaWV3LnNldFBvc2l0aW9uKCk7XG4gICAgfVxuICB9LFxuXG4gIHNob3c6IGZ1bmN0aW9uIChkYXRhdHlwZSwgdmFsdWVzLCBwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50ICYmIHRoaXMucGFyZW50ICE9PSBwYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIH1cblxuICAgIHRoaXMuZGF0YXR5cGVzLnJlc2V0KHByaW1pdGl2ZVR5cGVzKTtcblxuICAgIGlmICh0aGlzLmRhdGF0eXBlICYmICF0aGlzLmRhdGF0eXBlVmlldy5pbnB1dEVsLnZhbHVlKSB7XG4gICAgICB0aGlzLmRhdGF0eXBlVmlldy5pbnB1dEVsLnZhbHVlID0gdGhpcy5kYXRhdHlwZTtcbiAgICB9XG5cbiAgICB2YWx1ZXMgPSB2YWx1ZXMgfHwgW107XG4gICAgdmFyIHZhbHMgPSAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpID8gdmFsdWVzLm1hcChmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4geyB2YWx1ZTogdmFsIH07XG4gICAgfSkgOiB2YWx1ZXMudG9KU09OKCkpXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS52YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgdmFscy5wdXNoKHsgdmFsdWU6ICcnIH0pO1xuXG4gICAgdGhpcy5wb3NzaWJsZVZhbHVlcy5yZXNldCh2YWxzKTtcblxuICAgIGluc3RhbmNlLnZpc2libGUgPSB0cnVlO1xuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgaWYgKHRoaXMucGFyZW50LmNvbnRleHRNZW51KSB7XG4gICAgICAgIHRoaXMucGFyZW50LmNvbnRleHRNZW51LmNsb3NlKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wYXJlbnQuY2xhdXNlRXhwcmVzc2lvbkVkaXRvcikge1xuICAgICAgICB0aGlzLnBhcmVudC5jbGF1c2VFeHByZXNzaW9uRWRpdG9yLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW5zdGFuY2UudmlzaWJsZSkge1xuICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuXG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgIHZhbHVlc0VsOiAgICd1bCcsXG5cbiAgICAgIG1pbkxhYmVsRWw6ICcubWluIGxhYmVsJyxcbiAgICAgIG1pbklucHV0RWw6ICcubWluIGlucHV0JyxcblxuICAgICAgbWF4TGFiZWxFbDogJy5tYXggbGFiZWwnLFxuICAgICAgbWF4SW5wdXRFbDogJy5tYXggaW5wdXQnXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5wb3NzaWJsZVZhbHVlcywgVmFsdWVzSXRlbVZpZXcsIHRoaXMudmFsdWVzRWwpO1xuXG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnBvc3NpYmxlVmFsdWVzLCAnY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuXG5cbnZhciBpbnN0YW5jZTtcbkNsYXVzZVZhbHVlc1ZpZXcuaW5zdGFuY2UgPSBmdW5jdGlvbiAoc3VnZ2VzdGlvbnMsIHBhcmVudCkge1xuICBpZiAoIWluc3RhbmNlKSB7XG4gICAgaW5zdGFuY2UgPSBuZXcgQ2xhdXNlVmFsdWVzVmlldyh7fSk7XG4gICAgaW5zdGFuY2UucmVuZGVyKCk7XG4gIH1cblxuICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoaW5zdGFuY2UuZWwpKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnN0YW5jZS5lbCk7XG4gIH1cblxuICBpbnN0YW5jZS5zaG93KHN1Z2dlc3Rpb25zLCBwYXJlbnQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn07XG5cblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5kbW5DbGF1c2VWYWx1ZXNFZGl0b3IgPSBDbGF1c2VWYWx1ZXNWaWV3Lmluc3RhbmNlKCk7XG59XG5cbkNsYXVzZVZhbHVlc1ZpZXcuQ29sbGVjdGlvbiA9IFZhbHVlc0NvbGxlY3Rpb247XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xhdXNlVmFsdWVzVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcblxuLy8gZnVuY3Rpb24gdG9BcnJheSh0aGluZykge1xuLy8gICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHRoaW5nKTtcbi8vIH1cblxudmFyIFN1Z2dlc3Rpb25zQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbW9kZWw6IFN0YXRlLmV4dGVuZCh7XG4gICAgcHJvcHM6IHtcbiAgICAgIHZhbHVlOiAnc3RyaW5nJyxcbiAgICAgIGh0bWw6ICdzdHJpbmcnXG4gICAgfVxuICB9KVxufSk7XG5cbnZhciBTdWdnZXN0aW9uVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8bGkgdGFiaW5kZXg9XCIxXCI+PC9saT4nLFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLnZhbHVlJzoge1xuICAgICAgdHlwZTogJ3RleHQnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAgICAnX2hhbmRsZUNsaWNrJyxcbiAgICBmb2N1czogICAgJ19oYW5kbGVGb2N1cycsXG4gICAga2V5ZG93bjogICdfaGFuZGxlS2V5ZG93bidcbiAgfSxcblxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBhcmVudC5pbnB1dEVsLnZhbHVlID0gdGhpcy5wYXJlbnQudmFsdWUgPSB0aGlzLm1vZGVsLnZhbHVlO1xuICAgIHRoaXMucGFyZW50LmNvbGxhcHNlKCk7XG4gIH0sXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wYXJlbnQuaW5wdXRFbC52YWx1ZSA9IHRoaXMucGFyZW50LnZhbHVlID0gdGhpcy5tb2RlbC52YWx1ZTtcbiAgfSxcblxuICBfaGFuZGxlS2V5ZG93bjogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBjb2RlID0gZXZ0LndoaWNoIHx8IGV2dC5rZXlDb2RlO1xuICAgIC8vIGVudGVyXG4gICAgaWYgKGNvZGUgPT09IDEzKSB7XG4gICAgICB0aGlzLl9oYW5kbGVDbGljaygpO1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgLy8gdGFiXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gOSkge1xuICAgICAgdmFyIG5leHQgPSB0aGlzLmVsW2V2dC5zaGlmdEtleSA/ICdwcmV2aW91c1NpYmxpbmcnIDogJ25leHRTaWJsaW5nJ107XG4gICAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMucGFyZW50LmlucHV0RWw7XG4gICAgICB9XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG5leHQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvLyBkb3duXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gNDApIHtcbiAgICAgIHZhciBuZXh0ID0gdGhpcy5lbC5uZXh0U2libGluZztcbiAgICAgIGlmICghbmV4dCkge1xuICAgICAgICBuZXh0ID0gdGhpcy5wYXJlbnQuaW5wdXRFbDtcbiAgICAgIH1cbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbmV4dC5mb2N1cygpO1xuICAgIH1cblxuICAgIC8vIHVwXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gMzgpIHtcbiAgICAgIHZhciBuZXh0ID0gdGhpcy5lbC5wcmV2aW91c1NpYmxpbmc7XG4gICAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMucGFyZW50LmlucHV0RWw7XG4gICAgICB9XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG5leHQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvLyBlc2NcbiAgICBlbHNlIGlmIChjb2RlID09PSAyNykge1xuICAgICAgdGhpcy5lbC5wYXJlbnROb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICB9XG59KTtcblxuXG5cbnZhciBDb21ib0JveFZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImRtbi1jb21ib2JveFwiPicgK1xuICAgICAgICAgICAgICAnPGxhYmVsPjwvbGFiZWw+JyArXG4gICAgICAgICAgICAgICc8aW5wdXQgdGFiaW5kZXg9XCIwXCIgLz4nICtcbiAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIHN1Z2dlc3Rpb25zOiBTdWdnZXN0aW9uc0NvbGxlY3Rpb25cbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgdmFsdWU6ICAgICAgJ3N0cmluZycsXG4gICAgbGFiZWw6ICAgICAgJ3N0cmluZycsXG4gICAgY2xhc3NOYW1lOiAgJ3N0cmluZydcbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgIGNsYXNzTmFtZToge1xuICAgICAgdHlwZTogJ2NsYXNzJ1xuICAgIH0sXG5cbiAgICBsYWJlbDoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICdsYWJlbCdcbiAgICB9LFxuXG4gICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ3BsYWNlaG9sZGVyJyxcbiAgICAgIHNlbGVjdG9yOiAnaW5wdXQnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgICdpbnB1dCBpbnB1dCc6ICAgICdfaGFuZGxlSW5wdXQnLFxuICAgICdmb2N1cyBpbnB1dCc6ICAgICdfaGFuZGxlRm9jdXMnLFxuICAgICdibHVyIGlucHV0JzogICAgICdfaGFuZGxlQmx1cicsXG4gICAgJ2tleWRvd24gaW5wdXQnOiAgJ19oYW5kbGVLZXlkb3duJyxcbiAgICAnY2xpY2sgLmNhcmV0JzogICAnX2hhbmRsZUNhcmV0Q2xpY2snXG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGV4cGFuZGVkOiB7XG4gICAgICBkZXBzOiBbXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1Z2dlc3Rpb25zRWwuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBfaGFuZGxlRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFBvc2l0aW9uKCk7XG5cbiAgICBpZiAoIXRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1Z2dlc3Rpb25zLnJlc2V0KHRoaXMuY29sbGVjdGlvbi50b0pTT04oKSk7XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVCbHVyOiBmdW5jdGlvbiAoKSB7fSxcblxuICBfaGFuZGxlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFBvc2l0aW9uKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuaW5wdXRFbC52YWx1ZS50cmltKCk7XG4gICAgdGhpcy5zdWdnZXN0aW9ucy5yZXNldCh0aGlzLmZpbHRlcigpKTtcbiAgfSxcblxuICBfaGFuZGxlS2V5ZG93bjogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBjb2RlID0gZXZ0LndoaWNoIHx8IGV2dC5rZXlDb2RlO1xuICAgIGlmIChjb2RlID09PSA5IHx8IGNvZGUgPT09IDQwIHx8IGNvZGUgPT09IDM4KSB7XG4gICAgICB2YXIgdmlld3MgPSB0aGlzLnN1Z2dlc3Rpb25zVmlldy52aWV3cztcbiAgICAgIHZhciB2aWV3ID0gdmlld3NbZXZ0LnNoaWZ0S2V5IHx8IGNvZGUgPT09IDM4ID8gdmlld3MubGVuZ3RoIC0gMSA6IDBdO1xuICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgaWYgKCF0aGlzLmV4cGFuZGVkKSB7XG4gICAgICAgICAgdGhpcy5leHBhbmQoKTtcbiAgICAgICAgfVxuICAgICAgICB2aWV3LmVsLmZvY3VzKCk7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGVudGVyXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gMTMpIHtcbiAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgfVxuXG4gICAgLy8gZXNjXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gMjcpIHtcbiAgICAgIHRoaXMuY29sbGFwc2UoKTtcbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZUNhcmV0Q2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnRvZ2dsZSgpO1xuICB9LFxuXG4gIGV4cGFuZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5leHBhbmRlZCkge1xuICAgICAgdGhpcy5zdWdnZXN0aW9ucy5yZXNldCh0aGlzLmNvbGxlY3Rpb24udG9KU09OKCkpO1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBjb2xsYXBzZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmV4cGFuZGVkKSB7XG4gICAgICB0aGlzLnN1Z2dlc3Rpb25zRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZXhwYW5kZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdG9nZ2xlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpc1t0aGlzLmV4cGFuZGVkID8gJ2NvbGxhcHNlJyA6ICdleHBhbmQnXSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGZpbHRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBmaWx0ZXJlZCA9IHRoaXMuY29sbGVjdGlvbi5maWx0ZXIoZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICByZXR1cm4gbW9kZWwudmFsdWUuaW5kZXhPZih0aGlzLnZhbHVlKSA+IC0xO1xuICAgIH0sIHRoaXMpLm1hcChmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIHJldHVybiBtb2RlbC50b0pTT04oKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZmlsdGVyZWQ7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5jb2xsZWN0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbWJvQm94VmlldyByZXF1aXJlcyBhIGNvbGxlY3Rpb24gb3B0aW9uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5vbignY2hhbmdlOnZhbHVlJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLm1vZGVsIHx8IHRoaXMubW9kZWwudmFsdWUgPT09IHRoaXMudmFsdWUpIHsgcmV0dXJuOyB9XG4gICAgICB0aGlzLm1vZGVsLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9KTtcbiAgfSxcblxuICBzZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIXRoaXMucGFyZW50LmVsKSB7XG4gICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbm9kZSA9IHRoaXMuaW5wdXRFbDtcbiAgICB2YXIgdG9wID0gbm9kZS5vZmZzZXRUb3AgKyB0aGlzLmlucHV0RWwuY2xpZW50SGVpZ2h0O1xuICAgIHZhciBsZWZ0ID0gbm9kZS5vZmZzZXRMZWZ0O1xuICAgIHZhciBoZWxwZXIgPSB0aGlzLnN1Z2dlc3Rpb25zRWw7XG5cbiAgICB3aGlsZSAoKG5vZGUgPSBub2RlLm9mZnNldFBhcmVudCkpIHtcbiAgICAgIGlmIChub2RlLm9mZnNldFRvcCkge1xuICAgICAgICB0b3AgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRUb3AsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLm9mZnNldExlZnQpIHtcbiAgICAgICAgbGVmdCArPSBwYXJzZUludChub2RlLm9mZnNldExlZnQsIDEwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZWxwZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGhlbHBlci5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgIGhlbHBlci5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgaGVscGVyLnN0eWxlLndpZHRoID0gdGhpcy5pbnB1dEVsLmNsaWVudFdpZHRoICsgJ3B4JztcbiAgfSxcblxuICBzZXRWaXNpYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgaWYgKHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgZGlzcGxheSA9ICdub25lJztcbiAgICB9XG5cbiAgICB0aGlzLnN1Z2dlc3Rpb25zRWwuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgaWYgKGRpc3BsYXkgPT09ICdub25lJykge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdleHBhbmRlZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnKTtcblxuICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcblxuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLmlucHV0RWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN1Z2dlc3Rpb25zVmlldy52aWV3cy5mb3JFYWNoKGZ1bmN0aW9uICh2aWV3LCB2KSB7XG4gICAgICBpZiAodiA9PT0gMCkge1xuICAgICAgICB2aWV3LmVsLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucmVuZGVyZWQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuXG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgIGxhYmVsRWw6ICdsYWJlbCcsXG4gICAgICBpbnB1dEVsOiAnaW5wdXQnXG4gICAgfSk7XG5cbiAgICB0aGlzLmxhYmVsRWwuc2V0QXR0cmlidXRlKCdmb3InLCB0aGlzLmNpZCk7XG4gICAgdGhpcy5pbnB1dEVsLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmNpZCk7XG5cbiAgICBpZiAodGhpcy52YWx1ZSAmJiAhdGhpcy5pbnB1dEVsLnZhbHVlKSB7XG4gICAgICB0aGlzLmlucHV0RWwudmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuc3VnZ2VzdGlvbnNFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdGhpcy5zdWdnZXN0aW9uc0VsLmNsYXNzTmFtZSA9ICdkbW4tY29tYm9ib3gtc3VnZ2VzdGlvbnMnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5zdWdnZXN0aW9uc0VsKTtcblxuICAgIHRoaXMuc3VnZ2VzdGlvbnNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuc3VnZ2VzdGlvbnMsIFN1Z2dlc3Rpb25WaWV3LCB0aGlzLnN1Z2dlc3Rpb25zRWwpO1xuXG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLnN1Z2dlc3Rpb25zLCAnYWxsJywgdGhpcy5zZXRWaXNpYmxlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5zdWdnZXN0aW9uc0VsKTtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW1vdmUuYXBwbHkodGhpcyk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbWJvQm94VmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UqL1xuXG52YXIgbWl4aW5zID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuW1xuICAnY2xhdXNlVmFsdWVzRWRpdG9yJyxcbiAgJ2NsYXVzZUV4cHJlc3Npb25FZGl0b3InLFxuICAnY29udGV4dE1lbnUnXG5dLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgbWl4aW5zW25hbWVdID0ge1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzO1xuICAgICAgd2hpbGUgKChjdXJyZW50ID0gY3VycmVudC5wYXJlbnQpKSB7XG4gICAgICAgIGlmIChjdXJyZW50W25hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcblxuXG52YXIgZGVmYXVsdENvbW1hbmRzID0gW1xuICB7XG4gICAgbGFiZWw6ICdDZWxsJyxcbiAgICBzdWJjb21tYW5kczogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ2NsZWFyJyxcbiAgICAgICAgaWNvbjogJ2NsZWFyJyxcbiAgICAgICAgaGludDogJ0NsZWFyIHRoZSBjb250ZW50IG9mIHRoZSBmb2N1c2VkIGNlbGwnLFxuICAgICAgICBwb3NzaWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIGNvbnNvbGUuaW5mbygnY2xlYXIgcG9zc2libGU/JywgYXJndW1lbnRzLCB0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgbGFiZWw6ICdSdWxlJyxcbiAgICBpY29uOiAnJyxcbiAgICBzdWJjb21tYW5kczogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ2NvcHknLFxuICAgICAgICBpY29uOiAnY29weScsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuY29weVJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdhYm92ZScsXG4gICAgICAgICAgICBpY29uOiAnYWJvdmUnLFxuICAgICAgICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYWJvdmUgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNvcHlSdWxlKHRoaXMuc2NvcGUsIC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYmVsb3cnLFxuICAgICAgICAgICAgaWNvbjogJ2JlbG93JyxcbiAgICAgICAgICAgIGhpbnQ6ICdDb3B5IHRoZSBydWxlIGJlbG93IHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jb3B5UnVsZSh0aGlzLnNjb3BlLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgaGludDogJ1JlbW92ZSB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5yZW1vdmVSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ2NsZWFyJyxcbiAgICAgICAgaWNvbjogJ2NsZWFyJyxcbiAgICAgICAgaGludDogJ0NsZWFyIHRoZSBmb2N1c2VkIHJ1bGUnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNsZWFyUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnSW5wdXQnLFxuICAgIGljb246ICdpbnB1dCcsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBpbnB1dCBjbGF1c2UgYmVmb3JlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdhZnRlcicsXG4gICAgICAgICAgICBpY29uOiAncmlnaHQnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBpbnB1dCBjbGF1c2UgYWZ0ZXIgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwucmVtb3ZlSW5wdXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnT3V0cHV0JyxcbiAgICBpY29uOiAnb3V0cHV0JyxcbiAgICBzdWJjb21tYW5kczogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICBpY29uOiAnbGVmdCcsXG4gICAgICAgICAgICBoaW50OiAnQWRkIGFuIG91dHB1dCBjbGF1c2UgYmVmb3JlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRPdXRwdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgaWNvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gb3V0cHV0IGNsYXVzZSBhZnRlciB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkT3V0cHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwucmVtb3ZlT3V0cHV0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5cblxuXG5cblxuXG5cblxuXG52YXIgQ29tbWFuZE1vZGVsID0gU3RhdGUuZXh0ZW5kKHtcbiAgcHJvcHM6IHtcbiAgICBsYWJlbDogICAgICAnc3RyaW5nJyxcbiAgICBoaW50OiAgICAgICAnc3RyaW5nJyxcbiAgICBpY29uOiAgICAgICAnc3RyaW5nJyxcbiAgICBocmVmOiAgICAgICAnc3RyaW5nJyxcbiAgICBjbGFzc05hbWU6ICAnc3RyaW5nJyxcblxuICAgIHBvc3NpYmxlOiB7XG4gICAgICB0eXBlOiAnYW55JyxcbiAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHt9OyB9LFxuICAgICAgdGVzdDogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgIT09ICdmdW5jdGlvbicgJiYgbmV3VmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuICdtdXN0IGJlIGVpdGhlciBhIGZ1bmN0aW9uIG9yIGZhbHNlJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBmbjoge1xuICAgICAgdHlwZTogJ2FueScsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlICE9PSAnZnVuY3Rpb24nICYmIG5ld1ZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiAnbXVzdCBiZSBlaXRoZXIgYSBmdW5jdGlvbiBvciBmYWxzZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGRpc2FibGVkOiB7XG4gICAgICBkZXBzOiBbJ3Bvc3NpYmxlJ10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMucG9zc2libGUgPT09ICdmdW5jdGlvbicgPyAhdGhpcy5wb3NzaWJsZSgpIDogZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHN1YmNvbW1hbmRzOiBudWxsLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5zdWJjb21tYW5kcyA9IG5ldyBDb21tYW5kc0NvbGxlY3Rpb24oYXR0cmlidXRlcy5zdWJjb21tYW5kcyB8fCBbXSwge1xuICAgICAgcGFyZW50OiB0aGlzXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5cblxuXG5cblxuXG5cblxuXG52YXIgQ29tbWFuZHNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogQ29tbWFuZE1vZGVsXG59KTtcblxuXG5cblxuXG5cblxuXG5cblxudmFyIENvbnRleHRNZW51SXRlbSA9IFZpZXcuZXh0ZW5kKHtcbiAgYXV0b1JlbmRlcjogdHJ1ZSxcblxuICB0ZW1wbGF0ZTogJzxsaT4nICtcbiAgICAgICAgICAgICAgJzxhPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImljb25cIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibGFiZWxcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICc8L2E+JyArXG4gICAgICAgICAgICAgICc8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+PC91bD4nICtcbiAgICAgICAgICAgICc8L2xpPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubGFiZWwnOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJy5sYWJlbCdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmhpbnQnOiB7XG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICd0aXRsZSdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmZuJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBzZWxlY3RvcjogJ2EnLFxuICAgICAgbm86ICdkaXNhYmxlZCdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmRpc2FibGVkJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBuYW1lOiAnZGlzYWJsZWQnXG4gICAgfSxcblxuICAgICdtb2RlbC5zdWJjb21tYW5kcy5sZW5ndGgnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICdkcm9wZG93bidcbiAgICB9LFxuXG4gICAgJ21vZGVsLmhyZWYnOiB7XG4gICAgICBzZWxlY3RvcjogJ2EnLFxuICAgICAgbmFtZTogJ2hyZWYnLFxuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSkge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdocmVmJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdocmVmJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgICdtb2RlbC5pY29uJzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSkge1xuICAgICAgICBlbC5jbGFzc05hbWUgPSAnaWNvbiAnICsgdmFsdWU7XG4gICAgICB9LFxuICAgICAgc2VsZWN0b3I6ICcuaWNvbidcbiAgICB9LFxuXG4gICAgJ21vZGVsLmNsYXNzTmFtZSc6IHtcbiAgICAgIHR5cGU6ICdjbGFzcydcbiAgICB9XG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgY2xpY2s6ICAgICAgJ19oYW5kbGVDbGljaycsXG4gICAgbW91c2VvdmVyOiAgJ19oYW5kbGVNb3VzZW92ZXInLFxuICAgIG1vdXNlb3V0OiAgICdfaGFuZGxlTW91c2VvdXQnXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwsICdjaGFuZ2U6c3ViY29tbWFuZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5tb2RlbC5zdWJjb21tYW5kcywgQ29udGV4dE1lbnVJdGVtLCB0aGlzLnF1ZXJ5KCd1bCcpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAodGhpcy5tb2RlbC5mbikge1xuICAgICAgdGhpcy5wYXJlbnQudHJpZ2dlckNvbW1hbmQodGhpcy5tb2RlbCwgZXZ0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIXRoaXMubW9kZWwuaHJlZikge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVNb3VzZW92ZXI6IGZ1bmN0aW9uICgpIHtcblxuICB9LFxuXG5cblxuICBfaGFuZGxlTW91c2VvdXQ6IGZ1bmN0aW9uICgpIHtcblxuICB9LFxuXG5cblxuICB0cmlnZ2VyQ29tbWFuZDogZnVuY3Rpb24gKGNvbW1hbmQsIGV2dCkge1xuICAgIHRoaXMucGFyZW50LnRyaWdnZXJDb21tYW5kKGNvbW1hbmQsIGV2dCk7XG4gIH1cbn0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBDb250ZXh0TWVudVZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIGF1dG9SZW5kZXI6IHRydWUsXG5cbiAgdGVtcGxhdGU6ICc8bmF2IGNsYXNzPVwiZG1uLWNvbnRleHQtbWVudVwiPicgK1xuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNvb3JkaW5hdGVzXCI+JyArXG4gICAgICAgICAgICAgICAgJzxsYWJlbD5Db29yZHM6PC9sYWJlbD4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ4XCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInlcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzx1bD48L3VsPicgK1xuICAgICAgICAgICAgJzwvbmF2PicsXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjb21tYW5kczogQ29tbWFuZHNDb2xsZWN0aW9uXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIGlzT3BlbjogJ2Jvb2xlYW4nLFxuICAgIHNjb3BlOiAgJ3N0YXRlJ1xuICB9LFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgaXNPcGVuOiB7XG4gICAgICB0eXBlOiAndG9nZ2xlJ1xuICAgIH0sXG4gICAgJ3BhcmVudC5tb2RlbC54Jzoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICdkaXYgc3Bhbi54J1xuICAgIH0sXG4gICAgJ3BhcmVudC5tb2RlbC55Jzoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICdkaXYgc3Bhbi55J1xuICAgIH1cbiAgfSxcblxuICBvcGVuOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzdHlsZSA9IHRoaXMuZWwuc3R5bGU7XG5cbiAgICBzdHlsZS5sZWZ0ID0gb3B0aW9ucy5sZWZ0ICsgJ3B4JztcbiAgICBzdHlsZS50b3AgPSBvcHRpb25zLnRvcCArICdweCc7XG5cbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgaWYgKG9wdGlvbnMucGFyZW50KSB7XG4gICAgICBpZiAob3B0aW9ucy5wYXJlbnQuY2xhdXNlVmFsdWVzRWRpdG9yKSB7XG4gICAgICAgIG9wdGlvbnMucGFyZW50LmNsYXVzZVZhbHVlc0VkaXRvci5oaWRlKCk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5wYXJlbnQuY2xhdXNlRXhwcmVzc2lvbkVkaXRvcikge1xuICAgICAgICBvcHRpb25zLnBhcmVudC5jbGF1c2VFeHByZXNzaW9uRWRpdG9yLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNjb3BlID0gb3B0aW9ucy5zY29wZTtcbiAgICB2YXIgY29tbWFuZHMgPSBvcHRpb25zLmNvbW1hbmRzIHx8IGRlZmF1bHRDb21tYW5kcztcblxuICAgIHRoaXMuY29tbWFuZHMucmVzZXQoY29tbWFuZHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHRyaWdnZXJDb21tYW5kOiBmdW5jdGlvbiAoY29tbWFuZCwgZXZ0KSB7XG4gICAgY29tbWFuZC5mbi5jYWxsKHRoaXMsIGV2dCk7XG4gICAgaWYgKCFjb21tYW5kLmtlZXBPcGVuKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICBjb21tYW5kc0VsOiAndWwnXG4gICAgfSk7XG5cblxuXG4gICAgdGhpcy5jb21tYW5kc1ZpZXcgPSB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb21tYW5kcywgQ29udGV4dE1lbnVJdGVtLCB0aGlzLmNvbW1hbmRzRWwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgaW5zdGFuY2U7XG5Db250ZXh0TWVudVZpZXcuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghaW5zdGFuY2UpIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBDb250ZXh0TWVudVZpZXcoKTtcbiAgfVxuXG4gIGlmICghZG9jdW1lbnQuYm9keS5jb250YWlucyhpbnN0YW5jZS5lbCkpIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGluc3RhbmNlLmVsKTtcbiAgfVxuXG4gIHJldHVybiBpbnN0YW5jZTtcbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuZG1uQ29udGV4dE1lbnUgPSBDb250ZXh0TWVudVZpZXcuaW5zdGFuY2UoKTtcbn1cblxuQ29udGV4dE1lbnVWaWV3LkNvbGxlY3Rpb24gPSBDb21tYW5kc0NvbGxlY3Rpb247XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGV4dE1lbnVWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSwgY29uc29sZTogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIERlY2lzaW9uVGFibGUgPSByZXF1aXJlKCcuL3RhYmxlLWRhdGEnKTtcbnZhciBSdWxlVmlldyA9IHJlcXVpcmUoJy4vcnVsZS12aWV3Jyk7XG5cblxuXG5cbnZhciBDbGF1c2VIZWFkZXJWaWV3ID0gcmVxdWlyZSgnLi9jbGF1c2UtdmlldycpO1xuXG5mdW5jdGlvbiB0b0FycmF5KGVscykge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGVscyk7XG59XG5cblxuZnVuY3Rpb24gbWFrZVRkKHR5cGUpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgZWwuY2xhc3NOYW1lID0gdHlwZTtcbiAgcmV0dXJuIGVsO1xufVxuXG5cbmZ1bmN0aW9uIG1ha2VBZGRCdXR0b24oY2xhdXNlVHlwZSwgdGFibGUpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBlbC5jbGFzc05hbWUgPSAnaWNvbi1kbW4gaWNvbi1wbHVzJztcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdGFibGVbY2xhdXNlVHlwZSA9PT0gJ2lucHV0JyA/ICdhZGRJbnB1dCcgOiAnYWRkT3V0cHV0J10oKTtcbiAgfSk7XG4gIHJldHVybiBlbDtcbn1cblxuXG52YXIgRm9vdFZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiAnPHRmb290Pjx0cj48L3RyPjwvdGZvb3Q+JyxcblxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgLmFkZC1ydWxlJzogJ19oYW5kbGVBZGRSdWxlQ2xpY2snXG4gIH0sXG5cbiAgX2hhbmRsZUFkZFJ1bGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwuYWRkUnVsZSgpO1xuICB9LFxuXG4gIG1ha2VMaW5rRWw6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIHRkLmNsYXNzTmFtZSA9ICdhZGQtcnVsZSc7XG4gICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ0FkZCBhIHJ1bGUnKTtcbiAgICBhLmNsYXNzTmFtZSA9ICdpY29uLWRtbiBpY29uLXBsdXMnO1xuICAgIHRkLmFwcGVuZENoaWxkKGEpO1xuICAgIHJldHVybiB0ZDtcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRhYmxlID0gdGhpcy5tb2RlbDtcbiAgICB0aGlzLmxpc3RlblRvKHRhYmxlLmlucHV0cywgJ2FsbCcsIHRoaXMucmVuZGVyKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRhYmxlLm91dHB1dHMsICdhbGwnLCB0aGlzLnJlbmRlcik7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRhYmxlID0gdGhpcy5tb2RlbDtcbiAgICBpZiAodGhpcy5yb3dFbCkge1xuICAgICAgdmFyIGNoaWxkcmVuID0gW10uc2xpY2UuYXBwbHkodGhpcy5yb3dFbC5jaGlsZE5vZGVzKTtcbiAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHRoaXMucm93RWwucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICAgIHJvd0VsOiAndHInXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnJvd0VsLmFwcGVuZENoaWxkKHRoaXMubWFrZUxpbmtFbCgpKTtcbiAgICB2YXIgY291bnQgPSAxICsgTWF0aC5tYXgoMSwgdGFibGUuaW5wdXRzLmxlbmd0aCkgKyBNYXRoLm1heCgxLCB0YWJsZS5vdXRwdXRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgYyA9IDA7IGMgPCBjb3VudDsgYysrKSB7XG4gICAgICB0aGlzLnJvd0VsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cblxudmFyIERlY2lzaW9uVGFibGVWaWV3ID0gVmlldy5leHRlbmQoe1xuICBhdXRvUmVuZGVyOiB0cnVlLFxuXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImRtbi10YWJsZVwiPicgK1xuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImhpbnRzXCI+JyArXG4gICAgICAgICAgICAgICAgJzxpIGNsYXNzPVwiaWNvbi1kbW4gaWNvbi1pbmZvXCI+PC9pPiAnICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gZGF0YS1ob29rPVwiaGludHNcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzxoZWFkZXI+JyArXG4gICAgICAgICAgICAgICAgJzxoMyBkYXRhLWhvb2s9XCJ0YWJsZS1uYW1lXCIgY29udGVudGVkaXRhYmxlPjwvaDM+JyArXG4gICAgICAgICAgICAgICc8L2hlYWRlcj4nICtcbiAgICAgICAgICAgICAgJzx0YWJsZT4nICtcbiAgICAgICAgICAgICAgICAnPHRoZWFkPicgK1xuICAgICAgICAgICAgICAgICAgJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImhpdFwiIHJvd3NwYW49XCI0XCI+PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImlucHV0IGRvdWJsZS1ib3JkZXItcmlnaHRcIiBjb2xzcGFuPVwiMlwiPklucHV0PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cIm91dHB1dFwiIGNvbHNwYW49XCIyXCI+T3V0cHV0PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImFubm90YXRpb25cIiByb3dzcGFuPVwiNFwiPkFubm90YXRpb248L3RoPicgK1xuICAgICAgICAgICAgICAgICAgJzwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAnPHRyIGNsYXNzPVwibGFiZWxzXCI+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJ2YWx1ZXNcIj48L3RyPicgK1xuICAgICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cIm1hcHBpbmdzXCI+PC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90aGVhZD4nICtcbiAgICAgICAgICAgICAgICAnPHRib2R5PjwvdGJvZHk+JyArXG4gICAgICAgICAgICAgICc8L3RhYmxlPicgK1xuICAgICAgICAgICAgJzwvZGl2PicsXG5cbiAgc2Vzc2lvbjoge1xuICAgIGNvbnRleHRNZW51OiAgICAgICAgICAgICdzdGF0ZScsXG4gICAgY2xhdXNlVmFsdWVzRWRpdG9yOiAgICAgJ3N0YXRlJyxcbiAgICBjbGF1c2VFeHByZXNzaW9uRWRpdG9yOiAnc3RhdGUnLFxuXG4gICAgaGludDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnTWFrZSBhIHJpZ2h0LWNsaWNrIG9uIHRoZSB0YWJsZSdcbiAgICB9XG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubmFtZSc6IHtcbiAgICAgIGhvb2s6ICd0YWJsZS1uYW1lJyxcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgIH0sXG4gICAgaGludDoge1xuICAgICAgdHlwZTogJ2lubmVySFRNTCcsXG4gICAgICBob29rOiAnaGludHMnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgICdpbnB1dCBoZWFkZXIgaDMnOiAgICdfaGFuZGxlTmFtZUlucHV0J1xuICB9LFxuXG4gIF9oYW5kbGVOYW1lSW5wdXQ6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgdmFsID0gZXZ0LnRhcmdldC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgaWYgKHZhbCA9PT0gdGhpcy5tb2RlbC5uYW1lKSB7IHJldHVybjsgfVxuICAgIHRoaXMubW9kZWwubmFtZSA9IHZhbDtcbiAgfSxcblxuICBsb2c6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO1xuICAgIHZhciBtZXRob2QgPSBhcmdzLnNoaWZ0KCk7XG4gICAgYXJncy51bnNoaWZ0KHRoaXMuY2lkKTtcbiAgICBjb25zb2xlW21ldGhvZF0uYXBwbHkoY29uc29sZSwgYXJncyk7XG4gIH0sXG5cbiAgZXZlbnRMb2c6IGZ1bmN0aW9uIChzY29wZU5hbWUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gW107XG4gICAgICBhcmdzLnVuc2hpZnQoc2NvcGVOYW1lKTtcbiAgICAgIGFyZ3MudW5zaGlmdCgndHJhY2UnKTtcbiAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbMF0pO1xuICAgICAgc2VsZi5sb2cuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfTtcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdGhpcy5tb2RlbCA9IHRoaXMubW9kZWwgfHwgbmV3IERlY2lzaW9uVGFibGUuTW9kZWwoKTtcbiAgfSxcblxuICBoaWRlQ29udGV4dE1lbnU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuY29udGV4dE1lbnUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5jb250ZXh0TWVudS5jbG9zZSgpO1xuICB9LFxuXG4gIHNob3dDb250ZXh0TWVudTogZnVuY3Rpb24gKGNlbGxNb2RlbCwgZXZ0KSB7XG4gICAgaWYgKCF0aGlzLmNvbnRleHRNZW51KSB7IHJldHVybjsgfVxuICAgIGlmIChldnQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWw7XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIHNjb3BlOiAgY2VsbE1vZGVsLFxuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgbGVmdDogICBldnQucGFnZVgsXG4gICAgICB0b3A6ICAgIGV2dC5wYWdlWVxuICAgIH07XG5cbiAgICBvcHRpb25zLmNvbW1hbmRzID0gW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ1J1bGUnLFxuICAgICAgICBpY29uOiAnJyxcbiAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnYWJvdmUnLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlLmFkZFJ1bGUodGhpcy5zY29wZSwgLTEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnYmVsb3cnLFxuICAgICAgICAgICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICAgICAgaGludDogJ0FkZCBhIHJ1bGUgYmVsb3cgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZSh0aGlzLnNjb3BlLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIHtcbiAgICAgICAgICAvLyAgIGxhYmVsOiAnY29weScsXG4gICAgICAgICAgLy8gICBpY29uOiAnY29weScsXG4gICAgICAgICAgLy8gICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vICAgICB0YWJsZS5jb3B5UnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAvLyAgIH0sXG4gICAgICAgICAgLy8gICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgLy8gICAgICAgbGFiZWw6ICdhYm92ZScsXG4gICAgICAgICAgLy8gICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAvLyAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gICAgICAgICB0YWJsZS5jb3B5UnVsZSh0aGlzLnNjb3BlLCAtMSk7XG4gICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgLy8gICAgICAgbGFiZWw6ICdiZWxvdycsXG4gICAgICAgICAgLy8gICAgICAgaWNvbjogJ2JlbG93JyxcbiAgICAgICAgICAvLyAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gICAgICAgICB0YWJsZS5jb3B5UnVsZSh0aGlzLnNjb3BlLCAxKTtcbiAgICAgICAgICAvLyAgICAgICB9XG4gICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAvLyAgIF1cbiAgICAgICAgICAvLyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoZSBmb2N1c2VkIHJ1bGUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGFibGUucmVtb3ZlUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnY2xlYXInLFxuICAgICAgICAgICAgaWNvbjogJ2NsZWFyJyxcbiAgICAgICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRhYmxlLmNsZWFyUnVsZSh0aGlzLnNjb3BlLnJ1bGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF07XG5cbiAgICB2YXIgdHlwZSA9IGNlbGxNb2RlbC50eXBlO1xuICAgIHZhciBhZGRNZXRob2QgPSB0eXBlID09PSAnaW5wdXQnID8gJ2FkZElucHV0JyA6ICdhZGRPdXRwdXQnO1xuICAgIGlmICh0eXBlICE9PSAnaW5wdXQnICYmIHR5cGUgIT09ICdvdXRwdXQnKSB7XG4gICAgICB0aGlzLmNvbnRleHRNZW51Lm9wZW4ob3B0aW9ucyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3B0aW9ucy5jb21tYW5kcy51bnNoaWZ0KHtcbiAgICAgIGxhYmVsOiB0eXBlID09PSAnaW5wdXQnID8gJ0lucHV0JyA6ICdPdXRwdXQnLFxuICAgICAgaWNvbjogdHlwZSxcbiAgICAgIGNsYXNzTmFtZTogdHlwZSxcbiAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgaGludDogJ0FkZCBhbiAnICsgdHlwZSArICcgY2xhdXNlIGJlZm9yZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRhYmxlW2FkZE1ldGhvZF0oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdhZnRlcicsXG4gICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gJyArIHR5cGUgKyAnIGNsYXVzZSBhZnRlciB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRhYmxlW2FkZE1ldGhvZF0oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICAgIGhpbnQ6ICdSZW1vdmUgdGhlICcgKyB0eXBlICsgJyBjbGF1c2UnLFxuICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2xhdXNlID0gY2VsbE1vZGVsLmNsYXVzZTtcbiAgICAgICAgICAgIHZhciBkZWx0YSA9IGNsYXVzZS5jb2xsZWN0aW9uLmluZGV4T2YoY2xhdXNlKTtcbiAgICAgICAgICAgIGNsYXVzZS5jb2xsZWN0aW9uLnJlbW92ZShjbGF1c2UpO1xuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmNsYXVzZVR5cGUgPT09ICdvdXRwdXQnKSB7XG4gICAgICAgICAgICAgIGRlbHRhICs9IHRhYmxlLmlucHV0cy5sZW5ndGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLnJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgICAgdmFyIGNlbGwgPSBydWxlLmNlbGxzLmF0KGRlbHRhKTtcbiAgICAgICAgICAgICAgcnVsZS5jZWxscy5yZW1vdmUoY2VsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRhYmxlLnJ1bGVzLnRyaWdnZXIoJ3Jlc2V0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbnRleHRNZW51Lm9wZW4ob3B0aW9ucyk7XG4gIH0sXG5cblxuICBwYXJzZUNob2ljZXM6IGZ1bmN0aW9uIChlbCkge1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybiAnTUlTU0lORyc7XG4gICAgfVxuICAgIHZhciBjb250ZW50ID0gZWwudGV4dENvbnRlbnQudHJpbSgpO1xuXG4gICAgaWYgKGNvbnRlbnRbMF0gPT09ICcoJyAmJiBjb250ZW50LnNsaWNlKC0xKSA9PT0gJyknKSB7XG4gICAgICByZXR1cm4gY29udGVudFxuICAgICAgICAuc2xpY2UoMSwgLTEpXG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgIHJldHVybiBzdHIudHJpbSgpO1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gISFzdHI7XG4gICAgICAgIH0pXG4gICAgICAgIDtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH0sXG5cbiAgcGFyc2VSdWxlczogZnVuY3Rpb24gKHJ1bGVFbHMpIHtcbiAgICByZXR1cm4gcnVsZUVscy5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICByZXR1cm4gZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIHBhcnNlVGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5wdXRzID0gW107XG4gICAgdmFyIG91dHB1dHMgPSBbXTtcbiAgICB2YXIgcnVsZXMgPSBbXTtcblxuICAgIHRoaXMucXVlcnlBbGwoJ3RoZWFkIC5sYWJlbHMgLmlucHV0JykuZm9yRWFjaChmdW5jdGlvbiAoZWwsIG51bSkge1xuICAgICAgdmFyIGNob2ljZUVscyA9IHRoaXMucXVlcnkoJ3RoZWFkIC52YWx1ZXMgLmlucHV0Om50aC1jaGlsZCgnICsgKG51bSArIDEpICsgJyknKTtcblxuICAgICAgaW5wdXRzLnB1c2goe1xuICAgICAgICBsYWJlbDogICAgZWwudGV4dENvbnRlbnQudHJpbSgpLFxuICAgICAgICBjaG9pY2VzOiAgdGhpcy5wYXJzZUNob2ljZXMoY2hvaWNlRWxzKVxuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0aGVhZCAubGFiZWxzIC5vdXRwdXQnKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgbnVtKSB7XG4gICAgICB2YXIgY2hvaWNlRWxzID0gdGhpcy5xdWVyeSgndGhlYWQgLnZhbHVlcyAub3V0cHV0Om50aC1jaGlsZCgnICsgKG51bSArIGlucHV0cy5sZW5ndGggKyAxKSArICcpJyk7XG5cbiAgICAgIG91dHB1dHMucHVzaCh7XG4gICAgICAgIGxhYmVsOiAgICBlbC50ZXh0Q29udGVudC50cmltKCksXG4gICAgICAgIGNob2ljZXM6ICB0aGlzLnBhcnNlQ2hvaWNlcyhjaG9pY2VFbHMpXG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMucXVlcnlBbGwoJ3Rib2R5IHRyJykuZm9yRWFjaChmdW5jdGlvbiAocm93KSB7XG4gICAgICB2YXIgY2VsbHMgPSBbXTtcbiAgICAgIHZhciBjZWxsRWxzID0gcm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyk7XG5cbiAgICAgIGZvciAodmFyIGMgPSAxOyBjIDwgY2VsbEVscy5sZW5ndGg7IGMrKykge1xuICAgICAgICB2YXIgY2hvaWNlcyA9IG51bGw7XG4gICAgICAgIHZhciB2YWx1ZSA9IGNlbGxFbHNbY10udGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICB2YXIgdHlwZSA9IGMgPD0gaW5wdXRzLmxlbmd0aCA/ICdpbnB1dCcgOiAoYyA8IChjZWxsRWxzLmxlbmd0aCAtIDEpID8gJ291dHB1dCcgOiAnYW5ub3RhdGlvbicpO1xuICAgICAgICB2YXIgb2MgPSBjIC0gKGlucHV0cy5sZW5ndGggKyAxKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ2lucHV0JyAmJiBpbnB1dHNbYyAtIDFdKSB7XG4gICAgICAgICAgY2hvaWNlcyA9IGlucHV0c1tjIC0gMV0uY2hvaWNlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnb3V0cHV0JyAmJiBvdXRwdXRzW29jXSkge1xuICAgICAgICAgIGNob2ljZXMgPSBvdXRwdXRzW29jXS5jaG9pY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbHMucHVzaCh7XG4gICAgICAgICAgdmFsdWU6ICAgIHZhbHVlLFxuICAgICAgICAgIGNob2ljZXM6ICBjaG9pY2VzXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBydWxlcy5wdXNoKHtcbiAgICAgICAgY2VsbHM6IGNlbGxzXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMubW9kZWwubmFtZSA9IHRoaXMucXVlcnkoJ2gzJykudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIHRoaXMubW9kZWwuaW5wdXRzLnJlc2V0KGlucHV0cyk7XG4gICAgdGhpcy5tb2RlbC5vdXRwdXRzLnJlc2V0KG91dHB1dHMpO1xuICAgIHRoaXMubW9kZWwucnVsZXMucmVzZXQocnVsZXMpO1xuXG4gICAgcmV0dXJuIHRoaXMudG9KU09OKCk7XG4gIH0sXG5cbiAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwudG9KU09OKCk7XG4gIH0sXG5cbiAgaW5wdXRDbGF1c2VWaWV3czogW10sXG4gIG91dHB1dENsYXVzZVZpZXdzOiBbXSxcblxuICBfaGVhZGVyQ2xlYXI6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdG9BcnJheSh0aGlzLmxhYmVsc1Jvd0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nKyB0eXBlKSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHRoaXMubGFiZWxzUm93RWwucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdG9BcnJheSh0aGlzLnZhbHVlc1Jvd0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nKyB0eXBlKSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHRoaXMudmFsdWVzUm93RWwucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdG9BcnJheSh0aGlzLm1hcHBpbmdzUm93RWwucXVlcnlTZWxlY3RvckFsbCgnLicrIHR5cGUpKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgdGhpcy5tYXBwaW5nc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsKSB7XG4gICAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMucGFyc2VUYWJsZSgpO1xuICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2U6ZWwnKTtcbiAgICB9XG5cbiAgICB2YXIgdGFibGUgPSB0aGlzLm1vZGVsO1xuXG4gICAgaWYgKCF0aGlzLmhlYWRlckVsKSB7XG4gICAgICB0aGlzLmNhY2hlRWxlbWVudHMoe1xuICAgICAgICB0YWJsZUVsOiAgICAgICAgICAndGFibGUnLFxuICAgICAgICB0YWJsZU5hbWVFbDogICAgICAnaGVhZGVyIGgzJyxcbiAgICAgICAgaGVhZGVyRWw6ICAgICAgICAgJ3RoZWFkJyxcbiAgICAgICAgYm9keUVsOiAgICAgICAgICAgJ3Rib2R5JyxcbiAgICAgICAgaW5wdXRzSGVhZGVyRWw6ICAgJ3RoZWFkIHRyOm50aC1jaGlsZCgxKSB0aC5pbnB1dCcsXG4gICAgICAgIG91dHB1dHNIZWFkZXJFbDogICd0aGVhZCB0cjpudGgtY2hpbGQoMSkgdGgub3V0cHV0JyxcbiAgICAgICAgbGFiZWxzUm93RWw6ICAgICAgJ3RoZWFkIHRyLmxhYmVscycsXG4gICAgICAgIHZhbHVlc1Jvd0VsOiAgICAgICd0aGVhZCB0ci52YWx1ZXMnLFxuICAgICAgICBtYXBwaW5nc1Jvd0VsOiAgICAndGhlYWQgdHIubWFwcGluZ3MnXG4gICAgICB9KTtcblxuXG4gICAgICB0aGlzLmlucHV0c0hlYWRlckVsLmFwcGVuZENoaWxkKG1ha2VBZGRCdXR0b24oJ2lucHV0JywgdGFibGUpKTtcbiAgICAgIHRoaXMub3V0cHV0c0hlYWRlckVsLmFwcGVuZENoaWxkKG1ha2VBZGRCdXR0b24oJ291dHB1dCcsIHRhYmxlKSk7XG4gICAgfVxuXG5cbiAgICBbJ2lucHV0JywgJ291dHB1dCddLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbFt0eXBlICsgJ3MnXSwgJ2FkZCByZXNldCByZW1vdmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGNvbHMgPSB0aGlzLm1vZGVsW3R5cGUgKyAncyddLmxlbmd0aDtcbiAgICAgICAgaWYgKGNvbHMgPiAxKSB7XG4gICAgICAgICAgdGhpc1t0eXBlICsgJ3NIZWFkZXJFbCddLnNldEF0dHJpYnV0ZSgnY29sc3BhbicsIGNvbHMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXNbdHlwZSArICdzSGVhZGVyRWwnXS5yZW1vdmVBdHRyaWJ1dGUoJ2NvbHNwYW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2hlYWRlckNsZWFyKHR5cGUpO1xuICAgICAgICB0aGlzW3R5cGUgKyAnQ2xhdXNlVmlld3MnXS5mb3JFYWNoKGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgICAgdmlldy5yZW1vdmUoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5tb2RlbFt0eXBlICsgJ3MnXS5mb3JFYWNoKGZ1bmN0aW9uIChjbGF1c2UpIHtcbiAgICAgICAgICB2YXIgbGFiZWxFbCA9IG1ha2VUZCh0eXBlKTtcbiAgICAgICAgICB2YXIgdmFsdWVFbCA9IG1ha2VUZCh0eXBlKTtcbiAgICAgICAgICB2YXIgbWFwcGluZ0VsID0gbWFrZVRkKHR5cGUpO1xuXG4gICAgICAgICAgdmFyIHZpZXcgPSBuZXcgQ2xhdXNlSGVhZGVyVmlldyh7XG4gICAgICAgICAgICBsYWJlbEVsOiAgICBsYWJlbEVsLFxuICAgICAgICAgICAgdmFsdWVFbDogICAgdmFsdWVFbCxcbiAgICAgICAgICAgIG1hcHBpbmdFbDogIG1hcHBpbmdFbCxcblxuICAgICAgICAgICAgbW9kZWw6ICAgICAgY2xhdXNlLFxuICAgICAgICAgICAgcGFyZW50OiAgICAgdGhpc1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgWydsYWJlbCcsICd2YWx1ZScsICdtYXBwaW5nJ10uZm9yRWFjaChmdW5jdGlvbiAoa2luZCkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdpbnB1dCcpIHtcbiAgICAgICAgICAgICAgdGhpc1traW5kICsnc1Jvd0VsJ10uaW5zZXJ0QmVmb3JlKHZpZXdba2luZCArICdFbCddLCB0aGlzW2tpbmQgKydzUm93RWwnXS5xdWVyeVNlbGVjdG9yKCcub3V0cHV0JykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXNba2luZCArJ3NSb3dFbCddLmFwcGVuZENoaWxkKHZpZXdba2luZCArICdFbCddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuXG4gICAgICAgICAgdGhpc1t0eXBlICsgJ0NsYXVzZVZpZXdzJ10ucHVzaCh2aWV3KTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuXG4gICAgdGhpcy5ib2R5RWwuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5ydWxlc1ZpZXcgPSB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5tb2RlbC5ydWxlcywgUnVsZVZpZXcsIHRoaXMuYm9keUVsKTtcblxuICAgIGlmICghdGhpcy5mb290Vmlldykge1xuICAgICAgdmFyIGZvb3RFbCA9IHRoaXMucXVlcnkoJ3Rmb290Jyk7XG4gICAgICBpZiAoZm9vdEVsKSB7IGZvb3RFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZvb3RFbCk7IH1cblxuICAgICAgdGhpcy5mb290VmlldyA9IG5ldyBGb290Vmlldyh7XG4gICAgICAgIG1vZGVsOiB0aGlzLm1vZGVsXG4gICAgICB9KTtcbiAgICAgIHRoaXMudGFibGVFbC5hcHBlbmRDaGlsZCh0aGlzLmZvb3RWaWV3LmVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVjaXNpb25UYWJsZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cblxudmFyIERlY2lzaW9uVGFibGVWaWV3ID0gcmVxdWlyZSgnLi9kZWNpc2lvbi10YWJsZS12aWV3Jyk7XG5yZXF1aXJlKCcuL2NvbnRleHRtZW51LXZpZXcnKTtcbnJlcXVpcmUoJy4vY2xhdXNldmFsdWVzLXNldHRlci12aWV3Jyk7XG5yZXF1aXJlKCcuL2NsYXVzZWV4cHJlc3Npb24tc2V0dGVyLXZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZWNpc2lvblRhYmxlVmlldztcblxuZnVuY3Rpb24gbm9kZUxpc3RhcnJheShlbHMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZWxzKSkge1xuICAgIHJldHVybiBlbHM7XG4gIH1cbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVscy5sZW5ndGg7IGkrKykge1xuICAgIGFyci5wdXNoKGVsc1tpXSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gc2VsZWN0QWxsKHNlbGVjdG9yLCBjdHgpIHtcbiAgY3R4ID0gY3R4IHx8IGRvY3VtZW50O1xuICByZXR1cm4gbm9kZUxpc3RhcnJheShjdHgucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxud2luZG93LnNlbGVjdEFsbCA9IHNlbGVjdEFsbDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIHJlcXVpcmU6IGZhbHNlKi9cblxudmFyIENsYXVzZSA9IHJlcXVpcmUoJy4vY2xhdXNlLWRhdGEnKTtcblxudmFyIElucHV0TW9kZWwgPSBDbGF1c2UuTW9kZWwuZXh0ZW5kKHtcbiAgY2xhdXNlVHlwZTogJ2lucHV0JyxcblxuICBkZXJpdmVkOiB7XG4gICAgeDoge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbidcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZvY3VzZWQ6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAnY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQueCA9PT0gdGhpcy54O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogSW5wdXRNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ2xhdXNlLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogSW5wdXRNb2RlbFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIHJlcXVpcmU6IGZhbHNlKi9cblxudmFyIENsYXVzZSA9IHJlcXVpcmUoJy4vY2xhdXNlLWRhdGEnKTtcblxudmFyIE91dHB1dE1vZGVsID0gQ2xhdXNlLk1vZGVsLmV4dGVuZCh7XG4gIGNsYXVzZVR5cGU6ICdvdXRwdXQnLFxuXG4gIGRlcml2ZWQ6IHtcbiAgICB4OiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50JyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50LmlucHV0cydcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcykgKyB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmlucHV0cy5sZW5ndGg7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZvY3VzZWQ6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAnY29sbGVjdGlvbi5wYXJlbnQnLFxuICAgICAgICAnY29sbGVjdGlvbi5wYXJlbnQuaW5wdXRzJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0YWJsZSA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICAgIHJldHVybiB0YWJsZS54ID09PSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKSArIHRhYmxlLmlucHV0cy5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBPdXRwdXRNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ2xhdXNlLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogT3V0cHV0TW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiB0cnVlLCByZXF1aXJlOiBmYWxzZSovXG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgeyB2YXIgZGVwcyA9IHJlcXVpcmU7IH1cbmVsc2UgeyB2YXIgZGVwcyA9IHdpbmRvdy5kZXBzOyB9XG5cbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIENlbGwgPSByZXF1aXJlKCcuL2NlbGwtZGF0YScpO1xuXG52YXIgUnVsZU1vZGVsID0gU3RhdGUuZXh0ZW5kKHtcbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjZWxsczogQ2VsbC5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIHRhYmxlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmb2N1c2VkOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ3RhYmxlJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKSA9PT0gdGhpcy50YWJsZS55O1xuICAgICAgfVxuICAgIH0sXG5cblxuICAgIGRlbHRhOiB7XG4gICAgICBkZXBzOiBbJ2NvbGxlY3Rpb24nXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAxICsgdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlucHV0Q2VsbHM6IHtcbiAgICAgIGRlcHM6IFsnY2VsbHMnLCAndGFibGUuaW5wdXRzJ10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHMuc2xpY2UoMCwgdGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb3V0cHV0Q2VsbHM6IHtcbiAgICAgIGRlcHM6IFsnY2VsbHMnLCAndGFibGUuaW5wdXRzJ10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHMuc2xpY2UodGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoLCAtMSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFubm90YXRpb246IHtcbiAgICAgIGRlcHM6IFsnY2VsbHMnXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxzLm1vZGVsc1t0aGlzLmNlbGxzLmxlbmd0aCAtIDFdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBlbnN1cmVDZWxsczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjID0gdGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoICsgdGhpcy50YWJsZS5vdXRwdXRzLmxlbmd0aCArIDE7XG5cbiAgICAvLyBmaW5lXG4gICAgaWYgKHRoaXMuY2VsbHMubGVuZ3RoID09PSBjIHx8IGMgPT09IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBuZWVkcyB0byBiZSBmaWxsZWRcbiAgICBpZiAodGhpcy5jZWxscy5sZW5ndGggPCBjKSB7XG4gICAgICB3aGlsZSAodGhpcy5jZWxscy5sZW5ndGggPD0gYykge1xuICAgICAgICB0aGlzLmNlbGxzLmFkZCh7dmFsdWU6Jyd9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBuZWVkcyB0byBiZSB0cnVuY2F0ZWRcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuY2VsbHMubW9kZWxzID0gdGhpcy5jZWxscy5tb2RlbHMuc2xpY2UoMCwgYyk7XG4gICAgfVxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMudGFibGUuaW5wdXRzLCAncmVzZXQnLCB0aGlzLmVuc3VyZUNlbGxzKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMudGFibGUub3V0cHV0cywgJ3Jlc2V0JywgdGhpcy5lbnN1cmVDZWxscyk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IFJ1bGVNb2RlbCxcblxuICBDb2xsZWN0aW9uOiBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IFJ1bGVNb2RlbCxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBDZWxsVmlld3MgPSByZXF1aXJlKCcuL2NlbGwtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG52YXIgY29udGV4dFZpZXdzTWl4aW4gPSByZXF1aXJlKCcuL2NvbnRleHQtdmlld3MtbWl4aW4nKTtcblxudmFyIFJ1bGVWaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzx0cj48dGQgY2xhc3M9XCJudW1iZXJcIj48L3RkPjwvdHI+JyxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5kZWx0YSc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnLm51bWJlcidcbiAgICB9XG4gIH0sXG5cbiAgZGVyaXZlZDogbWVyZ2Uoe30sIGNvbnRleHRWaWV3c01peGluLCB7XG4gICAgaW5wdXRzOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdwYXJlbnQnLFxuICAgICAgICAncGFyZW50Lm1vZGVsJyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbC5pbnB1dHMnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm1vZGVsLmlucHV0cztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb3V0cHV0czoge1xuICAgICAgZGVwczogW1xuICAgICAgICAncGFyZW50JyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQubW9kZWwub3V0cHV0cztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYW5ub3RhdGlvbjoge1xuICAgICAgZGVwczogW1xuICAgICAgICAncGFyZW50JyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwuYW5ub3RhdGlvbnMnXG4gICAgICBdLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm1vZGVsLmFubm90YXRpb25zLmF0KDApO1xuICAgICAgfVxuICAgIH1cbiAgfSksXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NvbnRleHRtZW51IC5udW1iZXInOiAnX2hhbmRsZVJvd0NvbnRleHRNZW51J1xuICB9LFxuXG4gIF9oYW5kbGVSb3dDb250ZXh0TWVudTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBydWxlID0gdGhpcy5tb2RlbDtcbiAgICB2YXIgdGFibGUgPSBydWxlLmNvbGxlY3Rpb24ucGFyZW50O1xuXG4gICAgdGhpcy5jb250ZXh0TWVudS5vcGVuKHtcbiAgICAgIHBhcmVudDogICB0aGlzLFxuICAgICAgbGVmdDogICAgIGV2dC5wYWdlWCxcbiAgICAgIHRvcDogICAgICBldnQucGFnZVksXG4gICAgICBjb21tYW5kczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdSdWxlJyxcbiAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHJ1bGUpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHJ1bGUsIC0xKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYmVsb3cnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2JlbG93JyxcbiAgICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSBydWxlIGJlbG93IHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHJ1bGUsIDEpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgbGFiZWw6ICdjb3B5JyxcbiAgICAgICAgICAgIC8vICAgaWNvbjogJ2NvcHknLFxuICAgICAgICAgICAgLy8gICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gICAgIHRhYmxlLmNvcHlSdWxlKHJ1bGUpO1xuICAgICAgICAgICAgLy8gICB9LFxuICAgICAgICAgICAgLy8gICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgLy8gICAgIHtcbiAgICAgICAgICAgIC8vICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgICAgLy8gICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgIC8vICAgICAgIGhpbnQ6ICdDb3B5IHRoZSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gICAgICAgICB0YWJsZS5jb3B5UnVsZShydWxlLCAtMSk7XG4gICAgICAgICAgICAvLyAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAvLyAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgIC8vICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICAvLyAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdGFibGUuY29weVJ1bGUocnVsZSwgMSk7XG4gICAgICAgICAgICAvLyAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICBdXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgICAgICAgIGhpbnQ6ICdSZW1vdmUgdGhpcyBydWxlJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydWxlLmNvbGxlY3Rpb24ucmVtb3ZlKHJ1bGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2NsZWFyJyxcbiAgICAgICAgICAgICAgaWNvbjogJ2NsZWFyJyxcbiAgICAgICAgICAgICAgaGludDogJ0NsZWFyIHRoZSBmb2N1c2VkIHJ1bGUnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRhYmxlLmNsZWFyUnVsZShydWxlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG5cbiAgc2V0Rm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAodGhpcy5tb2RlbC5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3Jvdy1mb2N1c2VkJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdyb3ctZm9jdXNlZCcpO1xuICAgIH1cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRhYmxlID0gdGhpcy5tb2RlbC50YWJsZTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGFibGUsICdjaGFuZ2U6Zm9jdXMnLCB0aGlzLnNldEZvY3VzKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRhYmxlLmlucHV0cywgJ2FkZCByZW1vdmUgcmVzZXQnLCB0aGlzLnJlbmRlcik7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0YWJsZS5vdXRwdXRzLCAnYWRkIHJlbW92ZSByZXNldCcsIHRoaXMucmVuZGVyKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuXG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgIG51bWJlckVsOiAnLm51bWJlcidcbiAgICB9KTtcblxuICAgIHZhciBpO1xuICAgIHZhciBzdWJ2aWV3O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdWJ2aWV3ID0gbmV3IENlbGxWaWV3cy5JbnB1dCh7XG4gICAgICAgIG1vZGVsOiAgdGhpcy5tb2RlbC5jZWxscy5hdChpKSxcbiAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoc3Vidmlldy5yZW5kZXIoKSk7XG4gICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHN1YnZpZXcuZWwpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLm91dHB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN1YnZpZXcgPSBuZXcgQ2VsbFZpZXdzLk91dHB1dCh7XG4gICAgICAgIG1vZGVsOiAgdGhpcy5tb2RlbC5jZWxscy5hdCh0aGlzLmlucHV0cy5sZW5ndGggKyBpKSxcbiAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoc3Vidmlldy5yZW5kZXIoKSk7XG4gICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHN1YnZpZXcuZWwpO1xuICAgIH1cbiAgICBzdWJ2aWV3ID0gbmV3IENlbGxWaWV3cy5Bbm5vdGF0aW9uKHtcbiAgICAgIG1vZGVsOiAgdGhpcy5tb2RlbC5hbm5vdGF0aW9uLFxuICAgICAgcGFyZW50OiB0aGlzXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoc3Vidmlldy5yZW5kZXIoKSk7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZChzdWJ2aWV3LmVsKTtcblxuXG4gICAgdGhpcy5zZXRGb2N1cygpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSdWxlVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcblxuXG5cbnZhciBTdWdnZXN0aW9uc0NvbGxlY3Rpb24gPSBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1vZGVsOiBTdGF0ZS5leHRlbmQoe1xuICAgIHByb3BzOiB7XG4gICAgICB2YWx1ZTogJ3N0cmluZycsXG4gICAgICBodG1sOiAnc3RyaW5nJ1xuICAgIH1cbiAgfSlcbn0pO1xuXG5cblxudmFyIFN1Z2dlc3Rpb25zSXRlbVZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiAnPGxpPjwvbGk+JyxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5odG1sJzoge1xuICAgICAgdHlwZTogJ2lubmVySFRNTCdcbiAgICB9XG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgY2xpY2s6ICdfaGFuZGxlQ2xpY2snXG4gIH0sXG5cbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnBhcmVudCB8fCAhdGhpcy5wYXJlbnQucGFyZW50KSB7IHJldHVybjsgfVxuICAgIHZhciB0YXJnZXQgPSB0aGlzLnBhcmVudC5wYXJlbnQ7XG4gICAgXG4gICAgaWYgKHRhcmdldC5tb2RlbCAmJiB0eXBlb2YgdGFyZ2V0Lm1vZGVsLnZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGFyZ2V0Lm1vZGVsLnZhbHVlID0gdGhpcy5tb2RlbC52YWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGFyZ2V0LmVsKSB7XG4gICAgICB0YXJnZXQuZWwudGV4dENvbnRlbnQgPSB0aGlzLm1vZGVsLnZhbHVlO1xuICAgIH1cbiAgfVxufSk7XG5cblxuXG52YXIgU3VnZ2VzdGlvbnNWaWV3ID0gVmlldy5leHRlbmQoe1xuICBzZXNzaW9uOiB7XG4gICAgdmlzaWJsZTogJ2Jvb2xlYW4nXG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICB2aXNpYmxlOiB7XG4gICAgICB0eXBlOiAndG9nZ2xlJ1xuICAgIH1cbiAgfSxcblxuICB0ZW1wbGF0ZTogJzx1bCBjbGFzcz1cImRtbi1zdWdnZXN0aW9ucy1oZWxwZXJcIj48L3VsPicsXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgICBzdWdnZXN0aW9uczogU3VnZ2VzdGlvbnNDb2xsZWN0aW9uXG4gIH0sXG5cbiAgc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMucGFyZW50IHx8ICF0aGlzLnBhcmVudC5lbCkge1xuICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5vZGUgPSB0aGlzLnBhcmVudC5lbDtcbiAgICB2YXIgdG9wID0gbm9kZS5vZmZzZXRUb3A7XG4gICAgdmFyIGxlZnQgPSBub2RlLm9mZnNldExlZnQ7XG4gICAgdmFyIGhlbHBlciA9IHRoaXMuZWw7XG5cbiAgICB3aGlsZSAoKG5vZGUgPSBub2RlLm9mZnNldFBhcmVudCkpIHtcbiAgICAgIGlmIChub2RlLm9mZnNldFRvcCkge1xuICAgICAgICB0b3AgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRUb3AsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLm9mZnNldExlZnQpIHtcbiAgICAgICAgbGVmdCArPSBwYXJzZUludChub2RlLm9mZnNldExlZnQsIDEwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b3AgLT0gaGVscGVyLmNsaWVudEhlaWdodDtcbiAgICBoZWxwZXIuc3R5bGUudG9wID0gdG9wO1xuICAgIGhlbHBlci5zdHlsZS5sZWZ0ID0gbGVmdDtcbiAgfSxcblxuICBzaG93OiBmdW5jdGlvbiAoc3VnZ2VzdGlvbnMsIHBhcmVudCwgZm9yY2UpIHtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoc3VnZ2VzdGlvbnMpIHtcbiAgICAgIGlmIChzdWdnZXN0aW9ucy5pc0NvbGxlY3Rpb24pIHtcbiAgICAgICAgaW5zdGFuY2Uuc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5zdWdnZXN0aW9ucy5yZXNldChzdWdnZXN0aW9ucyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGluc3RhbmNlLnZpc2libGUgPSBmb3JjZSB8fCBzdWdnZXN0aW9ucy5sZW5ndGggPiAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGluc3RhbmNlLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaW5zdGFuY2UudmlzaWJsZSkge1xuICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zaG93KFtdLCB0aGlzLnBhcmVudCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5zdWdnZXN0aW9ucywgU3VnZ2VzdGlvbnNJdGVtVmlldywgdGhpcy5lbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxudmFyIGluc3RhbmNlO1xuU3VnZ2VzdGlvbnNWaWV3Lmluc3RhbmNlID0gZnVuY3Rpb24gKHN1Z2dlc3Rpb25zLCBwYXJlbnQpIHtcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIGluc3RhbmNlID0gbmV3IFN1Z2dlc3Rpb25zVmlldyh7fSk7XG4gICAgaW5zdGFuY2UucmVuZGVyKCk7XG4gIH1cblxuICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoaW5zdGFuY2UuZWwpKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnN0YW5jZS5lbCk7XG4gIH1cblxuICBpbnN0YW5jZS5zaG93KHN1Z2dlc3Rpb25zLCBwYXJlbnQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn07XG5cblxuU3VnZ2VzdGlvbnNWaWV3LkNvbGxlY3Rpb24gPSBTdWdnZXN0aW9uc0NvbGxlY3Rpb247XG5cbm1vZHVsZS5leHBvcnRzID0gU3VnZ2VzdGlvbnNWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogdHJ1ZSwgcmVxdWlyZTogZmFsc2UsIGNvbnNvbGU6IGZhbHNlKi9cblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7IHZhciBkZXBzID0gcmVxdWlyZTsgfVxuZWxzZSB7IHZhciBkZXBzID0gd2luZG93LmRlcHM7IH1cblxuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQtZGF0YScpO1xudmFyIE91dHB1dCA9IHJlcXVpcmUoJy4vb3V0cHV0LWRhdGEnKTtcblxudmFyIFJ1bGUgPSByZXF1aXJlKCcuL3J1bGUtZGF0YScpO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCdsb2Rhc2guZGVmYXVsdHMnKTtcblxudmFyIERlY2lzaW9uVGFibGVNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgaW5wdXRzOiAgIElucHV0LkNvbGxlY3Rpb24sXG4gICAgb3V0cHV0czogIE91dHB1dC5Db2xsZWN0aW9uLFxuICAgIHJ1bGVzOiAgICBSdWxlLkNvbGxlY3Rpb25cbiAgfSxcblxuICBwcm9wczoge1xuICAgIG5hbWU6ICdzdHJpbmcnXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIHg6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH0sXG5cbiAgICB5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9LFxuXG5cbiAgICBsb2dMZXZlbDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfVxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGFibGUgPSB0aGlzO1xuICAgIFtcbiAgICAgICdpbnB1dHMnLFxuICAgICAgJ291dHB1dHMnLFxuICAgICAgJ3J1bGVzJ1xuICAgIF0uZm9yRWFjaChmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUpIHtcbiAgICAgIFtcbiAgICAgICAgJ2FkZCcsXG4gICAgICAgICdyZW1vdmUnLFxuICAgICAgICAnc29ydCcsXG4gICAgICAgICdyZXNldCdcbiAgICAgIF0uZm9yRWFjaChmdW5jdGlvbiAoZXZ0TmFtZSkge1xuICAgICAgICB0YWJsZS5saXN0ZW5Ubyh0YWJsZVtjb2xsZWN0aW9uTmFtZV0sIGV2dE5hbWUsIGZ1bmN0aW9uIChhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgICAgdGFibGUudHJpZ2dlcihjb2xsZWN0aW9uTmFtZSArICc6JyArIGV2dE5hbWUsIGFyZzEsIGFyZzIsIGFyZzMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLmlucHV0cywgJ3JlbW92ZSByZXNldCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmlucHV0cy5sZW5ndGgpIHsgcmV0dXJuOyB9XG4gICAgICB0aGlzLmlucHV0cy5hZGQoe30pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLm91dHB1dHMsICdyZW1vdmUgcmVzZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5vdXRwdXRzLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICAgIHRoaXMub3V0cHV0cy5hZGQoe30pO1xuICAgIH0pO1xuICB9LFxuXG4gIGxvZzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XG4gICAgdmFyIG1ldGhvZCA9IGFyZ3Muc2hpZnQoKTtcbiAgICBhcmdzLnVuc2hpZnQodGhpcy5jaWQpO1xuICAgIGNvbnNvbGVbbWV0aG9kXS5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgfSxcblxuICBfcnVsZUNsaXBib2FyZDogbnVsbCxcblxuXG4gIGFkZFJ1bGU6IGZ1bmN0aW9uIChzY29wZUNlbGwsIGJlZm9yZUFmdGVyKSB7XG4gICAgdmFyIGNlbGxzID0gW107XG4gICAgdmFyIGM7XG5cbiAgICBmb3IgKGMgPSAwOyBjIDwgdGhpcy5pbnB1dHMubGVuZ3RoOyBjKyspIHtcbiAgICAgIGNlbGxzLnB1c2goe1xuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIC8vIGNob2ljZXM6IHRoaXMuaW5wdXRzLmF0KGMpLmNob2ljZXMsXG4gICAgICAgIGZvY3VzZWQ6IGMgPT09IDBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvciAoYyA9IDA7IGMgPCB0aGlzLm91dHB1dHMubGVuZ3RoOyBjKyspIHtcbiAgICAgIGNlbGxzLnB1c2goe1xuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIC8vIGNob2ljZXM6IHRoaXMub3V0cHV0cy5hdChjKS5jaG9pY2VzXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjZWxscy5wdXNoKHtcbiAgICAgIHZhbHVlOiAnJ1xuICAgIH0pO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICBpZiAoYmVmb3JlQWZ0ZXIpIHtcbiAgICAgIHZhciBydWxlRGVsdGEgPSB0aGlzLnJ1bGVzLmluZGV4T2Yoc2NvcGVDZWxsLmNvbGxlY3Rpb24ucGFyZW50KTtcbiAgICAgIG9wdGlvbnMuYXQgPSBydWxlRGVsdGEgKyAoYmVmb3JlQWZ0ZXIgPiAwID8gcnVsZURlbHRhIDogKHJ1bGVEZWx0YSAtIDEpKTtcbiAgICB9XG5cbiAgICB0aGlzLnJ1bGVzLmFkZCh7XG4gICAgICBjZWxsczogY2VsbHNcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZVJ1bGU6IGZ1bmN0aW9uIChzY29wZUNlbGwpIHtcbiAgICB0aGlzLnJ1bGVzLnJlbW92ZShzY29wZUNlbGwuY29sbGVjdGlvbi5wYXJlbnQpO1xuICAgIHRoaXMucnVsZXMudHJpZ2dlcigncmVzZXQnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIGNvcHlSdWxlOiBmdW5jdGlvbiAoc2NvcGVDZWxsLCB1cERvd24pIHtcbiAgICB2YXIgcnVsZSA9IHNjb3BlQ2VsbC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICBpZiAoIXJ1bGUpIHsgcmV0dXJuIHRoaXM7IH1cbiAgICB0aGlzLl9ydWxlQ2xpcGJvYXJkID0gcnVsZTtcblxuICAgIGlmICh1cERvd24pIHtcbiAgICAgIHZhciBydWxlRGVsdGEgPSB0aGlzLnJ1bGVzLmluZGV4T2YocnVsZSk7XG4gICAgICB0aGlzLnBhc3RlUnVsZShydWxlRGVsdGEgKyAodXBEb3duID4gMSA/IDAgOiAxKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICBwYXN0ZVJ1bGU6IGZ1bmN0aW9uIChkZWx0YSkge1xuICAgIGlmICghdGhpcy5fcnVsZUNsaXBib2FyZCkgeyByZXR1cm4gdGhpczsgfVxuICAgIHZhciBkYXRhID0gdGhpcy5fcnVsZUNsaXBib2FyZC50b0pTT04oKTtcbiAgICB0aGlzLnJ1bGVzLmFkZChkYXRhLCB7XG4gICAgICBhdDogZGVsdGFcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIGNsZWFyUnVsZTogZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICBydWxlLmNlbGxzLmZvckVhY2goZnVuY3Rpb24gKGNlbGwpIHtcbiAgICAgIGNlbGwudmFsdWUgPSAnJztcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIF9ydWxlc0NlbGxzOiBmdW5jdGlvbiAoYWRkZWQsIGRlbHRhKSB7XG4gICAgdGhpcy5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICBydWxlLmNlbGxzLmFkZCh7XG4gICAgICAgIC8vIGNob2ljZXM6IGFkZGVkLmNob2ljZXNcbiAgICAgIH0sIHtcbiAgICAgICAgYXQ6IGRlbHRhLFxuICAgICAgICBzaWxlbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ydWxlcy50cmlnZ2VyKCdyZXNldCcpO1xuICB9LFxuXG4gIGFkZElucHV0OiBmdW5jdGlvbiAoZGF0YSwgcG9zaXRpb24pIHtcbiAgICB2YXIgZGVsdGEgPSB0eXBlb2YgcG9zaXRpb24gIT09ICd1bmRlZmluZWQnID8gcG9zaXRpb24gOiB0aGlzLmlucHV0cy5sZW5ndGg7XG4gICAgZGVsdGEgPSBkZWx0YSA8IDAgPyAwIDogZGVsdGE7XG5cbiAgICB2YXIgaW5wdXQgPSB7fTtcbiAgICBkZWZhdWx0cyhpbnB1dCwgZGF0YSwge1xuICAgICAgbGFiZWw6ICAgIG51bGwsXG4gICAgICBjaG9pY2VzOiAgbnVsbCxcbiAgICAgIG1hcHBpbmc6ICBudWxsLFxuICAgICAgZGF0YXR5cGU6ICdzdHJpbmcnXG4gICAgfSk7XG5cbiAgICB2YXIgbmV3TW9kZWwgPSB0aGlzLmlucHV0cy5hZGQoaW5wdXQsIHtcbiAgICAgIGF0OiBkZWx0YVxuICAgIH0pO1xuXG4gICAgdGhpcy5fcnVsZXNDZWxscyhuZXdNb2RlbCwgbmV3TW9kZWwuY29sbGVjdGlvbi5pbmRleE9mKG5ld01vZGVsKSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW1vdmVJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cblxuICBhZGRPdXRwdXQ6IGZ1bmN0aW9uIChkYXRhLCBwb3NpdGlvbikge1xuICAgIHZhciBkZWx0YSA9IHR5cGVvZiBwb3NpdGlvbiAhPT0gJ3VuZGVmaW5lZCcgPyBwb3NpdGlvbiA6IHRoaXMub3V0cHV0cy5sZW5ndGg7XG4gICAgZGVsdGEgPSBkZWx0YSA8IDAgPyAwIDogZGVsdGE7XG5cbiAgICB2YXIgb3V0cHV0ID0ge307XG4gICAgZGVmYXVsdHMob3V0cHV0LCBkYXRhLCB7XG4gICAgICBsYWJlbDogICAgbnVsbCxcbiAgICAgIGNob2ljZXM6ICBudWxsLFxuICAgICAgbWFwcGluZzogIG51bGwsXG4gICAgICBkYXRhdHlwZTogJ3N0cmluZydcbiAgICB9KTtcblxuICAgIHZhciBuZXdNb2RlbCA9IHRoaXMub3V0cHV0cy5hZGQob3V0cHV0LCB7XG4gICAgICBhdDogZGVsdGFcbiAgICB9KTtcblxuICAgIHRoaXMuX3J1bGVzQ2VsbHMobmV3TW9kZWwsIG5ld01vZGVsLmNvbGxlY3Rpb24uaW5kZXhPZihuZXdNb2RlbCkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVtb3ZlT3V0cHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LkRlY2lzaW9uVGFibGVNb2RlbCA9IERlY2lzaW9uVGFibGVNb2RlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBEZWNpc2lvblRhYmxlTW9kZWxcbn07XG4iXX0=
