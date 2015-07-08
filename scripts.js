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
    this.contextMenu.close();
    this.clauseExpressionEditor.hide();
    this.clauseValuesEditor.hide();
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
    'contextmenu': '_handleContextMenu',
    'click':       '_handleClick'
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

  _handleClick: function () {
    this.contextMenu.close();
    this.clauseExpressionEditor.hide();
    this.clauseValuesEditor.hide();
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
    'contextmenu':    '_handleContextMenu',
    'click':          '_handleClick'
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

  _handleClick: function () {
    this.contextMenu.close();
    this.clauseExpressionEditor.hide();
    this.clauseValuesEditor.hide();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5kZWZhdWx0cy9ub2RlX21vZHVsZXMvbG9kYXNoLmFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWFzc2lnbi9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY29weS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRlYXNzaWduZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZWFzc2lnbmVyL25vZGVfbW9kdWxlcy9sb2Rhc2guX2JpbmRjYWxsYmFjay9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRlYXNzaWduZXIvbm9kZV9tb2R1bGVzL2xvZGFzaC5faXNpdGVyYXRlZWNhbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2gua2V5cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5rZXlzL25vZGVfbW9kdWxlcy9sb2Rhc2guX2dldG5hdGl2ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5rZXlzL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNhcmd1bWVudHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2gua2V5cy9ub2RlX21vZHVsZXMvbG9kYXNoLmlzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2gucmVzdHBhcmFtL2luZGV4LmpzIiwic2NyaXB0cy9jZWxsLWRhdGEuanMiLCJzY3JpcHRzL2NlbGwtdmlldy5qcyIsInNjcmlwdHMvY2hvaWNlLXZpZXcuanMiLCJzY3JpcHRzL2NsYXVzZS1kYXRhLmpzIiwic2NyaXB0cy9jbGF1c2UtbGFiZWwtdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLW1hcHBpbmctdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLXZhbHVlLXZpZXcuanMiLCJzY3JpcHRzL2NsYXVzZS12aWV3LmpzIiwic2NyaXB0cy9jbGF1c2VleHByZXNzaW9uLXNldHRlci12aWV3LmpzIiwic2NyaXB0cy9jbGF1c2V2YWx1ZXMtc2V0dGVyLXZpZXcuanMiLCJzY3JpcHRzL2NvbWJvYm94LXZpZXcuanMiLCJzY3JpcHRzL2NvbnRleHQtdmlld3MtbWl4aW4uanMiLCJzY3JpcHRzL2NvbnRleHRtZW51LXZpZXcuanMiLCJzY3JpcHRzL2RlY2lzaW9uLXRhYmxlLXZpZXcuanMiLCJzY3JpcHRzL2luZGV4LmpzIiwic2NyaXB0cy9pbnB1dC1kYXRhLmpzIiwic2NyaXB0cy9vdXRwdXQtZGF0YS5qcyIsInNjcmlwdHMvcnVsZS1kYXRhLmpzIiwic2NyaXB0cy9ydWxlLXZpZXcuanMiLCJzY3JpcHRzL3N1Z2dlc3Rpb25zLXZpZXcuanMiLCJzY3JpcHRzL3RhYmxlLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogbG9kYXNoIDMuMS4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYXNzaWduID0gcmVxdWlyZSgnbG9kYXNoLmFzc2lnbicpLFxuICAgIHJlc3RQYXJhbSA9IHJlcXVpcmUoJ2xvZGFzaC5yZXN0cGFyYW0nKTtcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLmRlZmF1bHRzYCB0byBjdXN0b21pemUgaXRzIGBfLmFzc2lnbmAgdXNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IG9iamVjdFZhbHVlIFRoZSBkZXN0aW5hdGlvbiBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcGFyYW0geyp9IHNvdXJjZVZhbHVlIFRoZSBzb3VyY2Ugb2JqZWN0IHByb3BlcnR5IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHZhbHVlIHRvIGFzc2lnbiB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBhc3NpZ25EZWZhdWx0cyhvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUpIHtcbiAgcmV0dXJuIG9iamVjdFZhbHVlID09PSB1bmRlZmluZWQgPyBzb3VyY2VWYWx1ZSA6IG9iamVjdFZhbHVlO1xufVxuXG4vKipcbiAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0KHMpIHRvIHRoZSBkZXN0aW5hdGlvblxuICogb2JqZWN0IGZvciBhbGwgZGVzdGluYXRpb24gcHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAuIE9uY2UgYVxuICogcHJvcGVydHkgaXMgc2V0LCBhZGRpdGlvbmFsIHZhbHVlcyBvZiB0aGUgc2FtZSBwcm9wZXJ0eSBhcmUgaWdub3JlZC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmF1bHRzKHsgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICdhZ2UnOiAzNiB9LCB7ICd1c2VyJzogJ2ZyZWQnIH0pO1xuICogLy8gPT4geyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfVxuICovXG52YXIgZGVmYXVsdHMgPSByZXN0UGFyYW0oZnVuY3Rpb24oYXJncykge1xuICB2YXIgb2JqZWN0ID0gYXJnc1swXTtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBhcmdzLnB1c2goYXNzaWduRGVmYXVsdHMpO1xuICByZXR1cm4gYXNzaWduLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIi8qKlxuICogbG9kYXNoIDMuMi4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWFzc2lnbicpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnbG9kYXNoLl9jcmVhdGVhc3NpZ25lcicpLFxuICAgIGtleXMgPSByZXF1aXJlKCdsb2Rhc2gua2V5cycpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5hc3NpZ25gIGZvciBjdXN0b21pemluZyBhc3NpZ25lZCB2YWx1ZXMgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmcsIG11bHRpcGxlIHNvdXJjZXMsIGFuZCBgdGhpc2AgYmluZGluZyBgY3VzdG9taXplcmBcbiAqIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBhc3NpZ25XaXRoKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcHJvcHMgPSBrZXlzKHNvdXJjZSksXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdLFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICByZXN1bHQgPSBjdXN0b21pemVyKHZhbHVlLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSk7XG5cbiAgICBpZiAoKHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlc3VsdCAhPT0gdmFsdWUpIDogKHZhbHVlID09PSB2YWx1ZSkpIHx8XG4gICAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgICBvYmplY3Rba2V5XSA9IHJlc3VsdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdC4gU3Vic2VxdWVudCBzb3VyY2VzIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICogSWYgYGN1c3RvbWl6ZXJgIGlzIHByb3ZpZGVkIGl0IGlzIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgYXNzaWduZWQgdmFsdWVzLlxuICogVGhlIGBjdXN0b21pemVyYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCBmaXZlIGFyZ3VtZW50czpcbiAqIChvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgIGFuZCBpcyBiYXNlZCBvblxuICogW2BPYmplY3QuYXNzaWduYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5hc3NpZ24pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAYWxpYXMgZXh0ZW5kXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY3VzdG9taXplcmAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmFzc2lnbih7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogNDAgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCB9XG4gKlxuICogLy8gdXNpbmcgYSBjdXN0b21pemVyIGNhbGxiYWNrXG4gKiB2YXIgZGVmYXVsdHMgPSBfLnBhcnRpYWxSaWdodChfLmFzc2lnbiwgZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gKiAgIHJldHVybiBfLmlzVW5kZWZpbmVkKHZhbHVlKSA/IG90aGVyIDogdmFsdWU7XG4gKiB9KTtcbiAqXG4gKiBkZWZhdWx0cyh7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAqL1xudmFyIGFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKSB7XG4gIHJldHVybiBjdXN0b21pemVyXG4gICAgPyBhc3NpZ25XaXRoKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKVxuICAgIDogYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ247XG4iLCIvKipcbiAqIGxvZGFzaCAzLjIuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJhc2VDb3B5ID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlY29weScpLFxuICAgIGtleXMgPSByZXF1aXJlKCdsb2Rhc2gua2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZyxcbiAqIG11bHRpcGxlIHNvdXJjZXMsIGFuZCBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gc291cmNlID09IG51bGxcbiAgICA/IG9iamVjdFxuICAgIDogYmFzZUNvcHkoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUNvcHkoc291cmNlLCBwcm9wcywgb2JqZWN0KSB7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICBvYmplY3Rba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNvcHk7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjEuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJpbmRDYWxsYmFjayA9IHJlcXVpcmUoJ2xvZGFzaC5fYmluZGNhbGxiYWNrJyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCdsb2Rhc2guX2lzaXRlcmF0ZWVjYWxsJyksXG4gICAgcmVzdFBhcmFtID0gcmVxdWlyZSgnbG9kYXNoLnJlc3RwYXJhbScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGFzc2lnbnMgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0KHMpIHRvIGEgZ2l2ZW5cbiAqIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNyZWF0ZSBgXy5hc3NpZ25gLCBgXy5kZWZhdWx0c2AsIGFuZCBgXy5tZXJnZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiByZXN0UGFyYW0oZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG9iamVjdCA9PSBudWxsID8gMCA6IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbbGVuZ3RoIC0gMl0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQsXG4gICAgICAgIHRoaXNBcmcgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjdXN0b21pemVyID0gYmluZENhbGxiYWNrKGN1c3RvbWl6ZXIsIHRoaXNBcmcsIDUpO1xuICAgICAgbGVuZ3RoIC09IDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSB0eXBlb2YgdGhpc0FyZyA9PSAnZnVuY3Rpb24nID8gdGhpc0FyZyA6IHVuZGVmaW5lZDtcbiAgICAgIGxlbmd0aCAtPSAoY3VzdG9taXplciA/IDEgOiAwKTtcbiAgICB9XG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBc3NpZ25lcjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlQ2FsbGJhY2tgIHdoaWNoIG9ubHkgc3VwcG9ydHMgYHRoaXNgIGJpbmRpbmdcbiAqIGFuZCBzcGVjaWZ5aW5nIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ0NvdW50XSBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGJpbmRDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodGhpc0FyZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cbiAgc3dpdGNoIChhcmdDb3VudCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlciwga2V5LCBvYmplY3QsIHNvdXJjZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gaXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kQ2FsbGJhY2s7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuOSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXlxcZCskLztcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXZvaWQgYSBbSklUIGJ1Z10oaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE0Mjc5MilcbiAqIHRoYXQgYWZmZWN0cyBTYWZhcmkgb24gYXQgbGVhc3QgaU9TIDguMS04LjMgQVJNNjQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBcImxlbmd0aFwiIHZhbHVlLlxuICovXG52YXIgZ2V0TGVuZ3RoID0gYmFzZVByb3BlcnR5KCdsZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhbHVlID0gKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgPyArdmFsdWUgOiAtMTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdCkpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBnZXROYXRpdmUgPSByZXF1aXJlKCdsb2Rhc2guX2dldG5hdGl2ZScpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJ2xvZGFzaC5pc2FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eXFxkKyQvO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2tleXMnKTtcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXZvaWQgYSBbSklUIGJ1Z10oaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE0Mjc5MilcbiAqIHRoYXQgYWZmZWN0cyBTYWZhcmkgb24gYXQgbGVhc3QgaU9TIDguMS04LjMgQVJNNjQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBcImxlbmd0aFwiIHZhbHVlLlxuICovXG52YXIgZ2V0TGVuZ3RoID0gYmFzZVByb3BlcnR5KCdsZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhbHVlID0gKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgPyArdmFsdWUgOiAtMTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIEEgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5rZXlzYCB3aGljaCBjcmVhdGVzIGFuIGFycmF5IG9mIHRoZVxuICogb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIHNoaW1LZXlzKG9iamVjdCkge1xuICB2YXIgcHJvcHMgPSBrZXlzSW4ob2JqZWN0KSxcbiAgICAgIHByb3BzTGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gcHJvcHNMZW5ndGggJiYgb2JqZWN0Lmxlbmd0aDtcblxuICB2YXIgYWxsb3dJbmRleGVzID0gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IHByb3BzTGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICBpZiAoKGFsbG93SW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgfHwgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG52YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QgPT0gbnVsbCA/IG51bGwgOiBvYmplY3QuY29uc3RydWN0b3I7XG4gIGlmICgodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0KSB8fFxuICAgICAgKHR5cGVvZiBvYmplY3QgIT0gJ2Z1bmN0aW9uJyAmJiBpc0FycmF5TGlrZShvYmplY3QpKSkge1xuICAgIHJldHVybiBzaGltS2V5cyhvYmplY3QpO1xuICB9XG4gIHJldHVybiBpc09iamVjdChvYmplY3QpID8gbmF0aXZlS2V5cyhvYmplY3QpIDogW107XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICB9XG4gIHZhciBsZW5ndGggPSBvYmplY3QubGVuZ3RoO1xuICBsZW5ndGggPSAobGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpICYmIGxlbmd0aCkgfHwgMDtcblxuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBpc1Byb3RvID0gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0LFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgIHNraXBJbmRleGVzID0gbGVuZ3RoID4gMDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSAoaW5kZXggKyAnJyk7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKHNraXBJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSAmJlxuICAgICAgICAhKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjkuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBbc3BlY2lhbCBjaGFyYWN0ZXJzXShodHRwOi8vd3d3LnJlZ3VsYXItZXhwcmVzc2lvbnMuaW5mby9jaGFyYWN0ZXJzLmh0bWwjc3BlY2lhbCkuXG4gKiBJbiBhZGRpdGlvbiB0byBzcGVjaWFsIGNoYXJhY3RlcnMgdGhlIGZvcndhcmQgc2xhc2ggaXMgZXNjYXBlZCB0byBhbGxvdyBmb3JcbiAqIGVhc2llciBgZXZhbGAgdXNlIGFuZCBgRnVuY3Rpb25gIGNvbXBpbGF0aW9uLlxuICovXG52YXIgcmVSZWdFeHBDaGFycyA9IC9bLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZyxcbiAgICByZUhhc1JlZ0V4cENoYXJzID0gUmVnRXhwKHJlUmVnRXhwQ2hhcnMuc291cmNlKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkgPiA1KS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQncyBub3Qgb25lLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWRcbiAqIGZvciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZm5Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBlc2NhcGVSZWdFeHAoZm5Ub1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KSlcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgcmV0dXJuIGlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmF0aXZlKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmF0aXZlKF8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGZ1bmNUYWcpIHtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KGZuVG9TdHJpbmcuY2FsbCh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHJlSXNIb3N0Q3Rvci50ZXN0KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBFc2NhcGVzIHRoZSBgUmVnRXhwYCBzcGVjaWFsIGNoYXJhY3RlcnMgXCJcXFwiLCBcIi9cIiwgXCJeXCIsIFwiJFwiLCBcIi5cIiwgXCJ8XCIsIFwiP1wiLFxuICogXCIqXCIsIFwiK1wiLCBcIihcIiwgXCIpXCIsIFwiW1wiLCBcIl1cIiwgXCJ7XCIgYW5kIFwifVwiIGluIGBzdHJpbmdgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGVSZWdFeHAoJ1tsb2Rhc2hdKGh0dHBzOi8vbG9kYXNoLmNvbS8pJyk7XG4gKiAvLyA9PiAnXFxbbG9kYXNoXFxdXFwoaHR0cHM6XFwvXFwvbG9kYXNoXFwuY29tXFwvXFwpJ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gIHN0cmluZyA9IGJhc2VUb1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1JlZ0V4cENoYXJzLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlUmVnRXhwQ2hhcnMsICdcXFxcJCYnKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4zIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIFtzcGVjaWFsIGNoYXJhY3RlcnNdKGh0dHA6Ly93d3cucmVndWxhci1leHByZXNzaW9ucy5pbmZvL2NoYXJhY3RlcnMuaHRtbCNzcGVjaWFsKS5cbiAqIEluIGFkZGl0aW9uIHRvIHNwZWNpYWwgY2hhcmFjdGVycyB0aGUgZm9yd2FyZCBzbGFzaCBpcyBlc2NhcGVkIHRvIGFsbG93IGZvclxuICogZWFzaWVyIGBldmFsYCB1c2UgYW5kIGBGdW5jdGlvbmAgY29tcGlsYXRpb24uXG4gKi9cbnZhciByZVJlZ0V4cENoYXJzID0gL1suKis/XiR7fSgpfFtcXF1cXC9cXFxcXS9nLFxuICAgIHJlSGFzUmVnRXhwQ2hhcnMgPSBSZWdFeHAocmVSZWdFeHBDaGFycy5zb3VyY2UpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSA+IDUpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBpZiBpdCdzIG5vdCBvbmUuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZFxuICogZm9yIGBudWxsYCBvciBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiAodmFsdWUgKyAnJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGVzY2FwZVJlZ0V4cChmblRvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNBcnJheSA9IGdldE5hdGl2ZShBcnJheSwgJ2lzQXJyYXknKTtcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIHJldHVybiBpc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFycmF5VGFnO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBmdW5jVGFnKSB7XG4gICAgcmV0dXJuIHJlSXNOYXRpdmUudGVzdChmblRvU3RyaW5nLmNhbGwodmFsdWUpKTtcbiAgfVxuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiByZUlzSG9zdEN0b3IudGVzdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogRXNjYXBlcyB0aGUgYFJlZ0V4cGAgc3BlY2lhbCBjaGFyYWN0ZXJzIFwiXFxcIiwgXCIvXCIsIFwiXlwiLCBcIiRcIiwgXCIuXCIsIFwifFwiLCBcIj9cIixcbiAqIFwiKlwiLCBcIitcIiwgXCIoXCIsIFwiKVwiLCBcIltcIiwgXCJdXCIsIFwie1wiIGFuZCBcIn1cIiBpbiBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZXNjYXBlUmVnRXhwKCdbbG9kYXNoXShodHRwczovL2xvZGFzaC5jb20vKScpO1xuICogLy8gPT4gJ1xcW2xvZGFzaFxcXVxcKGh0dHBzOlxcL1xcL2xvZGFzaFxcLmNvbVxcL1xcKSdcbiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICBzdHJpbmcgPSBiYXNlVG9TdHJpbmcoc3RyaW5nKTtcbiAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNSZWdFeHBDaGFycy50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVJlZ0V4cENoYXJzLCAnXFxcXCQmJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy42LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlXG4gKiBjcmVhdGVkIGZ1bmN0aW9uIGFuZCBhcmd1bWVudHMgZnJvbSBgc3RhcnRgIGFuZCBiZXlvbmQgcHJvdmlkZWQgYXMgYW4gYXJyYXkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uIHRoZSBbcmVzdCBwYXJhbWV0ZXJdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0Z1bmN0aW9ucy9yZXN0X3BhcmFtZXRlcnMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHNheSA9IF8ucmVzdFBhcmFtKGZ1bmN0aW9uKHdoYXQsIG5hbWVzKSB7XG4gKiAgIHJldHVybiB3aGF0ICsgJyAnICsgXy5pbml0aWFsKG5hbWVzKS5qb2luKCcsICcpICtcbiAqICAgICAoXy5zaXplKG5hbWVzKSA+IDEgPyAnLCAmICcgOiAnJykgKyBfLmxhc3QobmFtZXMpO1xuICogfSk7XG4gKlxuICogc2F5KCdoZWxsbycsICdmcmVkJywgJ2Jhcm5leScsICdwZWJibGVzJyk7XG4gKiAvLyA9PiAnaGVsbG8gZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIHJlc3RQYXJhbShmdW5jLCBzdGFydCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiAoK3N0YXJ0IHx8IDApLCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIHJlc3QgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3RbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgc3dpdGNoIChzdGFydCkge1xuICAgICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIHJlc3QpO1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFyZ3NbMF0sIHJlc3QpO1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFyZ3NbMF0sIGFyZ3NbMV0sIHJlc3QpO1xuICAgIH1cbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICBpbmRleCA9IC0xO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHJlc3Q7XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXN0UGFyYW07XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiB0cnVlLCByZXF1aXJlOiBmYWxzZSovXG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgeyB2YXIgZGVwcyA9IHJlcXVpcmU7IH1cbmVsc2UgeyB2YXIgZGVwcyA9IHdpbmRvdy5kZXBzOyB9XG5cbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xuXG52YXIgQ2VsbE1vZGVsID0gU3RhdGUuZXh0ZW5kKHtcbiAgcHJvcHM6IHtcbiAgICB2YWx1ZTogJ3N0cmluZydcbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgZWRpdGFibGU6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9XG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIHJ1bGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAnY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICB9XG4gICAgfSxcblxuXG4gICAgdGFibGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3J1bGUuY29sbGVjdGlvbicsXG4gICAgICAgICdydWxlLmNvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGUuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHg6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2NvbGxlY3Rpb24nXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNlbGwgPSB0aGlzO1xuICAgICAgICB2YXIgY2VsbHMgPSBjZWxsLmNvbGxlY3Rpb247XG4gICAgICAgIHJldHVybiBjZWxscy5pbmRleE9mKGNlbGwpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB5OiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdydWxlJyxcbiAgICAgICAgJ3J1bGUuY29sbGVjdGlvbidcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcnVsZXMgPSB0aGlzLnJ1bGUuY29sbGVjdGlvbjtcbiAgICAgICAgcmV0dXJuIHJ1bGVzLmluZGV4T2YodGhpcy5ydWxlKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZm9jdXNlZDoge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAndGFibGUueCcsXG4gICAgICAgICd0YWJsZS55JyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ID09PSB0aGlzLnRhYmxlLnggJiYgdGhpcy55ID09PSB0aGlzLnRhYmxlLnk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsYXVzZURlbHRhOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICd0YWJsZScsXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ3RhYmxlLmlucHV0cycsXG4gICAgICAgICd0YWJsZS5vdXRwdXRzJ1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWx0YSA9IHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpO1xuICAgICAgICB2YXIgaW5wdXRzID0gdGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoO1xuICAgICAgICB2YXIgb3V0cHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aCArIHRoaXMudGFibGUub3V0cHV0cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGRlbHRhIDwgaW5wdXRzKSB7XG4gICAgICAgICAgcmV0dXJuIGRlbHRhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlbHRhIDwgb3V0cHV0cykge1xuICAgICAgICAgIHJldHVybiBkZWx0YSAtIGlucHV0cztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB0eXBlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICd0YWJsZScsXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ3RhYmxlLmlucHV0cycsXG4gICAgICAgICd0YWJsZS5vdXRwdXRzJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWx0YSA9IHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpO1xuICAgICAgICB2YXIgaW5wdXRzID0gdGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoO1xuICAgICAgICB2YXIgb3V0cHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aCArIHRoaXMudGFibGUub3V0cHV0cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGRlbHRhIDwgaW5wdXRzKSB7XG4gICAgICAgICAgcmV0dXJuICdpbnB1dCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGEgPCBvdXRwdXRzKSB7XG4gICAgICAgICAgcmV0dXJuICdvdXRwdXQnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICdhbm5vdGF0aW9uJztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xhdXNlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICd0YWJsZScsXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ubGVuZ3RoJyxcbiAgICAgICAgJ3R5cGUnLFxuICAgICAgICAnY2xhdXNlRGVsdGEnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlRGVsdGEgPCAwIHx8IHRoaXMudHlwZSA9PT0gJ2Fubm90YXRpb24nKSB7IHJldHVybjsgfVxuICAgICAgICB2YXIgY2xhdXNlID0gdGhpcy50YWJsZVt0aGlzLnR5cGUgKydzJ10uYXQodGhpcy5jbGF1c2VEZWx0YSk7XG4gICAgICAgIHJldHVybiBjbGF1c2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNob2ljZXM6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ubGVuZ3RoJyxcbiAgICAgICAgJ3R5cGUnLFxuICAgICAgICAnY2xhdXNlJyxcbiAgICAgICAgJ2NsYXVzZURlbHRhJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5jbGF1c2UgfHwgIXRoaXMuY2xhdXNlLmNob2ljZXMpIHsgcmV0dXJuOyB9XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZS5jaG9pY2VzLm1hcChmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHt2YWx1ZTogdmFsfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBDZWxsTW9kZWwsXG4gIENvbGxlY3Rpb246IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogQ2VsbE1vZGVsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgbWVyZ2UgPSBkZXBzKCdsb2Rhc2gubWVyZ2UnKTtcblxuXG52YXIgQ2hvaWNlVmlldyA9IHJlcXVpcmUoJy4vY2hvaWNlLXZpZXcnKTtcbnZhciBSdWxlQ2VsbFZpZXcgPSBWaWV3LmV4dGVuZChtZXJnZSh7fSwgQ2hvaWNlVmlldy5wcm90b3R5cGUsIHtcbiAgdGVtcGxhdGU6ICc8dGQ+PHNwYW4gY29udGVudGVkaXRhYmxlPjwvc3Bhbj48L3RkPicsXG5cbiAgYmluZGluZ3M6IG1lcmdlKHt9LCBDaG9pY2VWaWV3LnByb3RvdHlwZS5iaW5kaW5ncywge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnW2NvbnRlbnRlZGl0YWJsZV0nXG4gICAgfSxcblxuICAgICdtb2RlbC5lZGl0YWJsZSc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjb250ZW50ZWRpdGFibGUnLFxuICAgICAgc2VsZWN0b3I6ICdbY29udGVudGVkaXRhYmxlXSdcbiAgICB9LFxuXG4gICAgJ21vZGVsLnNwZWxsY2hlY2tlZCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdzcGVsbGNoZWNrJyxcbiAgICAgIHNlbGVjdG9yOiAnW2NvbnRlbnRlZGl0YWJsZV0nXG4gICAgfSxcblxuICAgICdtb2RlbC50eXBlJzoge1xuICAgICAgdHlwZTogJ2NsYXNzJ1xuICAgIH1cbiAgfSksXG5cbiAgZXZlbnRzOiBtZXJnZSh7fSwgQ2hvaWNlVmlldy5wcm90b3R5cGUuZXZlbnRzLCB7XG4gICAgJ2NvbnRleHRtZW51JzogICAgICAgICAgICAgICAgICAgICdfaGFuZGxlQ29udGV4dE1lbnUnLFxuICAgICdjb250ZXh0bWVudSBbY29udGVudGVkaXRhYmxlXSc6ICAnX2hhbmRsZUNvbnRleHRNZW51JyxcbiAgICAnY2xpY2snOiAgICAgICAgICAgICAgICAgICAgICAgICAgJ19oYW5kbGVDbGljaycsXG4gICAgJ2NsaWNrIFtjb250ZW50ZWRpdGFibGVdJzogICAgICAgICdfaGFuZGxlQ2xpY2snXG4gIH0pLFxuXG4gIF9mb2N1c1BzZXVkbzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWRpdGFibGVFbCgpO1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlbC5mb2N1cygpO1xuICB9LFxuXG4gIF9oYW5kbGVGb2N1czogZnVuY3Rpb24gKCkge1xuICAgIENob2ljZVZpZXcucHJvdG90eXBlLl9oYW5kbGVGb2N1cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdmFyIHRhYmxlID0gdGhpcy5tb2RlbC50YWJsZTtcbiAgICB2YXIgY2VsbCA9IHRoaXMubW9kZWw7XG4gICAgdmFyIGNlbGxzID0gY2VsbC5jb2xsZWN0aW9uO1xuICAgIHZhciBydWxlID0gY2VsbHMucGFyZW50O1xuICAgIHZhciBydWxlcyA9IHRhYmxlLnJ1bGVzO1xuXG4gICAgdmFyIHggPSBjZWxscy5pbmRleE9mKGNlbGwpO1xuICAgIHZhciB5ID0gcnVsZXMuaW5kZXhPZihydWxlKTtcblxuICAgIGlmICh0YWJsZS54ICE9PSB4IHx8IHRhYmxlLnkgIT09IHkpIHtcbiAgICAgIHRhYmxlLnNldCh7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHlcbiAgICAgIH0sIHtcbiAgICAgICAgLy8gc2lsZW50OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRhYmxlLnRyaWdnZXIoJ2NoYW5nZTpmb2N1cycpO1xuICAgIH1cblxuICAgIHRoaXMucGFyZW50LnBhcmVudC5oaWRlQ29udGV4dE1lbnUoKTtcbiAgfSxcblxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBhcmVudC5wYXJlbnQuaGlkZUNvbnRleHRNZW51KCk7XG4gICAgdGhpcy5fZm9jdXNQc2V1ZG8oKTtcbiAgfSxcblxuICBfaGFuZGxlQ29udGV4dE1lbnU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB0aGlzLnBhcmVudC5wYXJlbnQuc2hvd0NvbnRleHRNZW51KHRoaXMubW9kZWwsIGV2dCk7XG4gIH0sXG5cbiAgc2V0Rm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAodGhpcy5tb2RlbC5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzZWQnKTtcblxuICAgICAgaWYgKHRoaXMucGFyZW50LnBhcmVudC5jb250ZXh0TWVudSkge1xuICAgICAgICB0aGlzLnBhcmVudC5wYXJlbnQuY29udGV4dE1lbnUuY2xvc2UoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGFyZW50LnBhcmVudC5jbGF1c2VWYWx1ZXNFZGl0b3IpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQucGFyZW50LmNsYXVzZVZhbHVlc0VkaXRvci5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnBhcmVudC5wYXJlbnQuY2xhdXNlRXhwcmVzc2lvbkVkaXRvcikge1xuICAgICAgICB0aGlzLnBhcmVudC5wYXJlbnQuY2xhdXNlRXhwcmVzc2lvbkVkaXRvci5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChFbGVtZW50LnByb3RvdHlwZS5jb250YWlucyAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNvbnRhaW5zKHRoaXMuZWRpdGFibGVFbCgpKSkge1xuICAgICAgICB0aGlzLl9mb2N1c1BzZXVkbygpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXNlZCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vZGVsLnggPT09IHRoaXMubW9kZWwudGFibGUueCkge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdjb2wtZm9jdXNlZCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sLWZvY3VzZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tb2RlbC55ID09PSB0aGlzLm1vZGVsLnRhYmxlLnkpIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgncm93LWZvY3VzZWQnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Jvdy1mb2N1c2VkJyk7XG4gICAgfVxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2U6ZWwnLCB0aGlzLnNldEZvY3VzKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwudGFibGUsICdjaGFuZ2U6Zm9jdXMnLCB0aGlzLnNldEZvY3VzKTtcbiAgfVxufSkpO1xuXG5cblxudmFyIFJ1bGVJbnB1dENlbGxWaWV3ID0gUnVsZUNlbGxWaWV3LmV4dGVuZCh7fSk7XG5cbnZhciBSdWxlT3V0cHV0Q2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxudmFyIFJ1bGVBbm5vdGF0aW9uQ2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDZWxsOiAgICAgICBSdWxlQ2VsbFZpZXcsXG4gIElucHV0OiAgICAgIFJ1bGVJbnB1dENlbGxWaWV3LFxuICBPdXRwdXQ6ICAgICBSdWxlT3V0cHV0Q2VsbFZpZXcsXG4gIEFubm90YXRpb246IFJ1bGVBbm5vdGF0aW9uQ2VsbFZpZXdcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgZGVwczogZmFsc2UsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlICovXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG5cbnZhciBTdWdnZXN0aW9uc1ZpZXcgPSByZXF1aXJlKCcuL3N1Z2dlc3Rpb25zLXZpZXcnKTtcblxudmFyIHN1Z2dlc3Rpb25zVmlldyA9IFN1Z2dlc3Rpb25zVmlldy5pbnN0YW5jZSgpO1xuXG52YXIgc3BlY2lhbEtleXMgPSBbXG4gIDggLy8gYmFja3NwYWNlXG5dO1xuXG52YXIgQ2hvaWNlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjaG9pY2VzOiBTdWdnZXN0aW9uc1ZpZXcuQ29sbGVjdGlvblxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGlucHV0OiAnX2hhbmRsZUlucHV0JyxcbiAgICAnaW5wdXQgW2NvbnRlbnRlZGl0YWJsZV0nOiAnX2hhbmRsZUlucHV0JyxcbiAgICBmb2N1czogJ19oYW5kbGVGb2N1cycsXG4gICAgJ2ZvY3VzIFtjb250ZW50ZWRpdGFibGVdJzogJ19oYW5kbGVGb2N1cydcbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgdmFsaWQ6ICAgICAgICAgIHtcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICB9LFxuXG4gICAgb3JpZ2luYWxWYWx1ZTogICdzdHJpbmcnXG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGlzT3JpZ2luYWw6IHtcbiAgICAgIGRlcHM6IFsnbW9kZWwudmFsdWUnLCAnb3JpZ2luYWxWYWx1ZSddLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwudmFsdWUgPT09IHRoaXMub3JpZ2luYWxWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwudmFsdWUnOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUgfHwgIXZhbHVlLnRyaW0oKSkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5lbC50ZXh0Q29udGVudCA9IHZhbHVlLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ21vZGVsLmZvY3VzZWQnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICdmb2N1c2VkJ1xuICAgIH0sXG5cbiAgICBpc09yaWdpbmFsOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICd1bnRvdWNoZWQnXG4gICAgfVxuICB9LFxuXG4gIGVkaXRhYmxlRWw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeSgnW2NvbnRlbnRlZGl0YWJsZV0nKSB8fCB0aGlzLmVsO1xuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKHRoaXMuZWwpIHtcbiAgICAgIHRoaXMuZWwuY29udGVudEVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZWwuc3BlbGxjaGVjayA9IGZhbHNlO1xuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy52YWx1ZSA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuXG5cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwsICdjaGFuZ2U6Y2hvaWNlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjaG9pY2VzID0gdGhpcy5tb2RlbC5jaG9pY2VzO1xuICAgICAgaWYgKCF0aGlzLmNob2ljZXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFjaG9pY2VzKSB7XG4gICAgICAgIGNob2ljZXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jaG9pY2VzLnJlc2V0KGNob2ljZXMubWFwKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgcmV0dXJuIHt2YWx1ZTogY2hvaWNlfTtcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBuZXcgU3VnZ2VzdGlvbnNWaWV3LkNvbGxlY3Rpb24oe1xuICAgICAgcGFyZW50OiB0aGlzLmNob2ljZXNcbiAgICB9KTtcbiAgfSxcblxuICBfZmlsdGVyOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdmFyIGNob2ljZXMgPSB0aGlzLm1vZGVsLmNob2ljZXMgfHwgdGhpcy5jaG9pY2VzO1xuICAgIHZhciBlbCA9IHRoaXMuZWRpdGFibGVFbCgpO1xuICAgIHZhciBmaWx0ZXJlZCA9IGNob2ljZXNcbiAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBjaG9pY2UudmFsdWUuaW5kZXhPZih2YWwpID09PSAwO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoY2hvaWNlKSB7XG4gICAgICAgICAgICB2YXIgY2hhcnMgPSBlbC50ZXh0Q29udGVudC5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgdmFsID0gY2hvaWNlLmVzY2FwZSA/IGNob2ljZS5lc2NhcGUoJ3ZhbHVlJykgOiBjaG9pY2UudmFsdWU7XG4gICAgICAgICAgICB2YXIgaHRtbFN0ciA9ICc8c3BhbiBjbGFzcz1cImhpZ2hsaWdodGVkXCI+JyArIHZhbC5zbGljZSgwLCBjaGFycykgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICBodG1sU3RyICs9IHZhbC5zbGljZShjaGFycyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB2YWx1ZTogY2hvaWNlLnZhbHVlLFxuICAgICAgICAgICAgICBodG1sOiBodG1sU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgfSxcblxuICBfaGFuZGxlRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9oYW5kbGVJbnB1dCgpO1xuICB9LFxuXG4gIF9oYW5kbGVSZXNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwgfHwgIXN1Z2dlc3Rpb25zVmlldykgeyByZXR1cm47IH1cbiAgICB2YXIgbm9kZSA9IHRoaXMuZWw7XG4gICAgdmFyIHRvcCA9IG5vZGUub2Zmc2V0VG9wO1xuICAgIHZhciBsZWZ0ID0gbm9kZS5vZmZzZXRMZWZ0O1xuICAgIHZhciBoZWxwZXIgPSBzdWdnZXN0aW9uc1ZpZXcuZWw7XG5cbiAgICB3aGlsZSAoKG5vZGUgPSBub2RlLm9mZnNldFBhcmVudCkpIHtcbiAgICAgIGlmIChub2RlLm9mZnNldFRvcCkge1xuICAgICAgICB0b3AgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRUb3AsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLm9mZnNldExlZnQpIHtcbiAgICAgICAgbGVmdCArPSBwYXJzZUludChub2RlLm9mZnNldExlZnQsIDEwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b3AgLT0gaGVscGVyLmNsaWVudEhlaWdodDtcbiAgICBoZWxwZXIuc3R5bGUudG9wID0gdG9wO1xuICAgIGhlbHBlci5zdHlsZS5sZWZ0ID0gbGVmdDtcbiAgfSxcblxuICBfaGFuZGxlSW5wdXQ6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoZXZ0ICYmIChzcGVjaWFsS2V5cy5pbmRleE9mKGV2dC5rZXlDb2RlKSA+IC0xIHx8IGV2dC5jdHJsS2V5KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgZWwgPSB0aGlzLmVkaXRhYmxlRWwoKTtcbiAgICB2YXIgdmFsID0gZWwudGV4dENvbnRlbnQudHJpbSgpO1xuXG4gICAgdmFyIGZpbHRlcmVkID0gdGhpcy5fZmlsdGVyKHZhbCk7XG4gICAgc3VnZ2VzdGlvbnNWaWV3LnNob3coZmlsdGVyZWQsIHRoaXMpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6ZSgpO1xuXG4gICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGV2dCkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG1hdGNoaW5nID0gZmlsdGVyZWRbMF0udmFsdWU7XG4gICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgIHZhbHVlOiBtYXRjaGluZ1xuICAgICAgfSwge1xuICAgICAgICBzaWxlbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgZWwudGV4dENvbnRlbnQgPSBtYXRjaGluZztcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENob2ljZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiB0cnVlLCByZXF1aXJlOiBmYWxzZSovXG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgeyB2YXIgZGVwcyA9IHJlcXVpcmU7IH1cbmVsc2UgeyB2YXIgZGVwcyA9IHdpbmRvdy5kZXBzOyB9XG5cbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xuXG52YXIgQ2xhdXNlTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICAvKlxuICBjb2xsZWN0aW9uczoge1xuICAgIGNob2ljZXM6IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICAgIG1vZGVsOiBTdGF0ZS5leHRlbmQoe1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIHZhbHVlOiAnc3RyaW5nJ1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG4gICovXG5cbiAgcHJvcHM6IHtcbiAgICBsYWJlbDogICAgJ3N0cmluZycsXG4gICAgY2hvaWNlczogICdhcnJheScsXG4gICAgc291cmNlOiAgICdzdHJpbmcnLFxuICAgIGxhbmd1YWdlOiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICdDT0JPTCd9LFxuICAgIGRhdGF0eXBlOiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICdzdHJpbmcnfVxuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICBlZGl0YWJsZToge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgbWFwcGluZzoge1xuICAgICAgZGVwczogW1xuICAgICAgICAnbGFuZ3VhZ2UnLFxuICAgICAgICAnc291cmNlJ1xuICAgICAgXSxcbiAgICAgIC8vIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogQ2xhdXNlTW9kZWwsXG4gIENvbGxlY3Rpb246IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogQ2xhdXNlTW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBtZXJnZSA9IGRlcHMoJ2xvZGFzaC5tZXJnZScpO1xudmFyIGNvbnRleHRWaWV3c01peGluID0gcmVxdWlyZSgnLi9jb250ZXh0LXZpZXdzLW1peGluJyk7XG5cblxudmFyIExhYmVsVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHt9LCB7XG4gIGV2ZW50czoge1xuICAgICdmb2N1cyc6ICAgICAgICAgICAgICAgICAgICAgICAgICAnX2hhbmRsZUZvY3VzJyxcbiAgICAnZm9jdXMgW2NvbnRlbnRlZGl0YWJsZV0nOiAgICAgICAgJ19oYW5kbGVGb2N1cycsXG4gICAgJ2NsaWNrJzogICAgICAgICAgICAgICAgICAgICAgICAgICdfaGFuZGxlRm9jdXMnLFxuICAgICdjbGljayBbY29udGVudGVkaXRhYmxlXSc6ICAgICAgICAnX2hhbmRsZUZvY3VzJyxcbiAgICAnaW5wdXQnOiAgICAgICAgICAgICAgICAgICAgICAgICAgJ19oYW5kbGVJbnB1dCcsXG4gICAgJ2lucHV0IFtjb250ZW50ZWRpdGFibGVdJzogICAgICAgICdfaGFuZGxlSW5wdXQnLFxuICAgICdjb250ZXh0bWVudSc6ICAgICAgICAgICAgICAgICAgICAnX2hhbmRsZUNvbnRleHRNZW51JyxcbiAgICAnY29udGV4dG1lbnUgW2NvbnRlbnRlZGl0YWJsZV0nOiAgJ19oYW5kbGVDb250ZXh0TWVudScsXG4gIH0sXG5cbiAgZGVyaXZlZDogbWVyZ2Uoe30sIGNvbnRleHRWaWV3c01peGluLCB7XG4gICAgdGFibGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ21vZGVsJyxcbiAgICAgICAgJ21vZGVsLmNvbGxlY3Rpb24nLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9KSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5sYWJlbCc6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsKSB7XG4gICAgICAgIHZhciBlZGl0YWJsZSA9IHRoaXMuZWRpdGFibGVFbCgpO1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZWRpdGFibGUpIHsgcmV0dXJuOyB9XG4gICAgICAgIGVkaXRhYmxlLnRleHRDb250ZW50ID0gKHZhbCB8fCAnJykudHJpbSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBlZGl0YWJsZUVsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnkoJ1tjb250ZW50ZWRpdGFibGVdJykgfHwgdGhpcy5lbDtcbiAgfSxcblxuICBfaGFuZGxlRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbnRleHRNZW51LmNsb3NlKCk7XG4gICAgdGhpcy5jbGF1c2VFeHByZXNzaW9uRWRpdG9yLmhpZGUoKTtcbiAgICB0aGlzLmNsYXVzZVZhbHVlc0VkaXRvci5oaWRlKCk7XG4gICAgdGhpcy50YWJsZS54ID0gdGhpcy5tb2RlbC54O1xuICAgIHRoaXMudGFibGUudHJpZ2dlcignY2hhbmdlOmZvY3VzJyk7XG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5sYWJlbCA9IHRoaXMuZWRpdGFibGVFbCgpLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB0aGlzLl9oYW5kbGVGb2N1cygpO1xuICB9LFxuXG4gIF9oYW5kbGVDb250ZXh0TWVudTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciB0eXBlID0gdGhpcy5tb2RlbC5jbGF1c2VUeXBlO1xuICAgIHZhciB0YWJsZSA9IHRoaXMudGFibGU7XG4gICAgdGhpcy5faGFuZGxlRm9jdXMoKTtcblxuICAgIHZhciBhZGRNZXRob2QgPSB0eXBlID09PSAnaW5wdXQnID8gJ2FkZElucHV0JyA6ICdhZGRPdXRwdXQnO1xuXG4gICAgdGhpcy5jb250ZXh0TWVudS5vcGVuKHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIHRvcDogZXZ0LnBhZ2VZLFxuICAgICAgbGVmdDogZXZ0LnBhZ2VYLFxuICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiB0eXBlID09PSAnaW5wdXQnID8gJ0lucHV0JyA6ICdPdXRwdXQnLFxuICAgICAgICAgIGljb246IHR5cGUsXG4gICAgICAgICAgY2xhc3NOYW1lOiB0eXBlLFxuICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRhYmxlW2FkZE1ldGhvZF0oKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICAgICAgICBpY29uOiAnbGVmdCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2NvcHknLFxuICAgICAgICAgICAgICAvLyBpY29uOiAncGx1cycsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICAgICAgICBpY29uOiAnbGVmdCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdtb3ZlJyxcbiAgICAgICAgICAgICAgLy8gaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge30sXG4gICAgICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVkaXRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGVkaXRhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgdHJ1ZSk7XG4gICAgZWRpdGFibGUudGV4dENvbnRlbnQgPSAodGhpcy5tb2RlbC5sYWJlbCB8fCAnJykudHJpbSgpO1xuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZChlZGl0YWJsZSk7XG4gIH1cbn0pKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IExhYmVsVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG52YXIgY29udGV4dFZpZXdzTWl4aW4gPSByZXF1aXJlKCcuL2NvbnRleHQtdmlld3MtbWl4aW4nKTtcblxuXG5cbnZhciBNYXBwaW5nVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHt9LCB7XG4gIGV2ZW50czoge1xuICAgICdjb250ZXh0bWVudSc6ICdfaGFuZGxlQ29udGV4dE1lbnUnLFxuICAgICdjbGljayc6ICAgICAgICdfaGFuZGxlQ2xpY2snXG4gIH0sXG5cbiAgZGVyaXZlZDogbWVyZ2Uoe30sIGNvbnRleHRWaWV3c01peGluLCB7XG4gICAgdGFibGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ21vZGVsJyxcbiAgICAgICAgJ21vZGVsLmNvbGxlY3Rpb24nLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9KSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5tYXBwaW5nJzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWwpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGVsKSB7IHJldHVybjsgfVxuICAgICAgICBlbC50ZXh0Q29udGVudCA9ICh2YWwgfHwgJycpLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb250ZXh0TWVudS5jbG9zZSgpO1xuICAgIHRoaXMuY2xhdXNlRXhwcmVzc2lvbkVkaXRvci5oaWRlKCk7XG4gICAgdGhpcy5jbGF1c2VWYWx1ZXNFZGl0b3IuaGlkZSgpO1xuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwubWFwcGluZyA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICB9LFxuXG4gIF9oYW5kbGVDb250ZXh0TWVudTogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQuZGVmYXVsdFByZXZlbnRlZCkgeyByZXR1cm47IH1cbiAgICB0aGlzLmNsYXVzZUV4cHJlc3Npb25FZGl0b3Iuc2hvdyh0aGlzLm1vZGVsLCB0aGlzKTtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIHRoaXMuZWwudGV4dENvbnRlbnQgPSAodGhpcy5tb2RlbC5tYXBwaW5nIHx8ICcnKS50cmltKCk7XG4gIH1cbn0pKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBwaW5nVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG52YXIgY29udGV4dFZpZXdzTWl4aW4gPSByZXF1aXJlKCcuL2NvbnRleHQtdmlld3MtbWl4aW4nKTtcblxudmFyIFZhbHVlVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHt9LCB7XG4gIGV2ZW50czoge1xuICAgICdjb250ZXh0bWVudSc6ICAgICdfaGFuZGxlQ29udGV4dE1lbnUnLFxuICAgICdjbGljayc6ICAgICAgICAgICdfaGFuZGxlQ2xpY2snXG4gIH0sXG5cbiAgZGVyaXZlZDogbWVyZ2Uoe30sIGNvbnRleHRWaWV3c01peGluLCB7XG4gICAgdGFibGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ21vZGVsJyxcbiAgICAgICAgJ21vZGVsLmNvbGxlY3Rpb24nLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9KSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5jaG9pY2VzJzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlckNvbnRlbnQoZWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgJ21vZGVsLmRhdGF0eXBlJzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlckNvbnRlbnQoZWwpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbnRleHRNZW51LmNsb3NlKCk7XG4gICAgdGhpcy5jbGF1c2VFeHByZXNzaW9uRWRpdG9yLmhpZGUoKTtcbiAgICB0aGlzLmNsYXVzZVZhbHVlc0VkaXRvci5oaWRlKCk7XG4gIH0sXG5cbiAgX3JlbmRlckNvbnRlbnQ6IGZ1bmN0aW9uIChlbCkge1xuICAgIHZhciBzdHIgPSAnJztcbiAgICB2YXIgdmFsID0gdGhpcy5tb2RlbC5jaG9pY2VzO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkgJiYgdmFsLmxlbmd0aCkge1xuICAgICAgc3RyID0gJygnICsgdmFsLmpvaW4oJywgJykgKyAnKSc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc3RyID0gdGhpcy5tb2RlbC5kYXRhdHlwZTtcbiAgICB9XG4gICAgZWwudGV4dENvbnRlbnQgPSBzdHI7XG4gIH0sXG5cbiAgX2hhbmRsZUNvbnRleHRNZW51OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dC5kZWZhdWx0UHJldmVudGVkKSB7IHJldHVybjsgfVxuICAgIHRoaXMuY2xhdXNlVmFsdWVzRWRpdG9yLnNob3codGhpcy5tb2RlbC5kYXRhdHlwZSwgdGhpcy5tb2RlbC5jaG9pY2VzLCB0aGlzKTtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxufSkpO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZhbHVlVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIExhYmVsVmlldyA9IHJlcXVpcmUoJy4vY2xhdXNlLWxhYmVsLXZpZXcnKTtcbnZhciBWYWx1ZVZpZXcgPSByZXF1aXJlKCcuL2NsYXVzZS12YWx1ZS12aWV3Jyk7XG52YXIgTWFwcGluZ1ZpZXcgPSByZXF1aXJlKCcuL2NsYXVzZS1tYXBwaW5nLXZpZXcnKTtcblxuXG5cblxuXG52YXIgcmVxdWlyZWRFbGVtZW50ID0ge1xuICB0eXBlOiAnZWxlbWVudCcsXG4gIHJlcXVpcmVkOiB0cnVlXG59O1xuXG52YXIgQ2xhdXNlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgc2Vzc2lvbjoge1xuICAgIGxhYmVsRWw6ICAgIHJlcXVpcmVkRWxlbWVudCxcbiAgICBtYXBwaW5nRWw6ICByZXF1aXJlZEVsZW1lbnQsXG4gICAgdmFsdWVFbDogICAgcmVxdWlyZWRFbGVtZW50XG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIHRhYmxlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdtb2RlbCcsXG4gICAgICAgICdtb2RlbC5jb2xsZWN0aW9uJyxcbiAgICAgICAgJ21vZGVsLmNvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNsYXVzZSA9IHRoaXMubW9kZWw7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIHN1YnZpZXdzID0ge1xuICAgICAgbGFiZWw6ICAgIExhYmVsVmlldyxcbiAgICAgIG1hcHBpbmc6ICBNYXBwaW5nVmlldyxcbiAgICAgIHZhbHVlOiAgICBWYWx1ZVZpZXdcbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoc3Vidmlld3MpLmZvckVhY2goZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTonICsga2luZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpc1traW5kICsgJ1ZpZXcnXSkge1xuICAgICAgICAgIHRoaXMuc3RvcExpc3RlbmluZyh0aGlzW2tpbmQgKyAnVmlldyddKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXNba2luZCArICdWaWV3J10gPSBuZXcgc3Vidmlld3Nba2luZF0oe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICBtb2RlbDogIGNsYXVzZSxcbiAgICAgICAgICBlbDogICAgIHRoaXNba2luZCArICdFbCddXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICBmdW5jdGlvbiB0YWJsZUNoYW5nZUZvY3VzKCkge1xuICAgICAgaWYgKHNlbGYubW9kZWwuZm9jdXNlZCkge1xuICAgICAgICBzZWxmLmxhYmVsRWwuY2xhc3NMaXN0LmFkZCgnY29sLWZvY3VzZWQnKTtcbiAgICAgICAgc2VsZi5tYXBwaW5nRWwuY2xhc3NMaXN0LmFkZCgnY29sLWZvY3VzZWQnKTtcbiAgICAgICAgc2VsZi52YWx1ZUVsLmNsYXNzTGlzdC5hZGQoJ2NvbC1mb2N1c2VkJyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc2VsZi5sYWJlbEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbC1mb2N1c2VkJyk7XG4gICAgICAgIHNlbGYubWFwcGluZ0VsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbC1mb2N1c2VkJyk7XG4gICAgICAgIHNlbGYudmFsdWVFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2wtZm9jdXNlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnRhYmxlLm9uKCdjaGFuZ2U6Zm9jdXMnLCB0YWJsZUNoYW5nZUZvY3VzKTtcbiAgICB0YWJsZUNoYW5nZUZvY3VzKCk7XG4gIH1cbn0pO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXVzZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UsIHJlcXVpcmU6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xudmFyIENvbWJvQm94VmlldyA9IHJlcXVpcmUoJy4vY29tYm9ib3gtdmlldycpO1xuXG5cbmZ1bmN0aW9uIGVsQm94KGVsKSB7XG4gIHZhciBub2RlID0gZWw7XG4gIHZhciBib3ggPSB7XG4gICAgdG9wOiBlbC5vZmZzZXRUb3AsXG4gICAgbGVmdDogZWwub2Zmc2V0TGVmdCxcbiAgICB3aWR0aDogZWwub2Zmc2V0V2lkdGgsXG4gICAgaGVpZ2h0OiBlbC5vZmZzZXRIZWlnaHRcbiAgfTtcblxuICB3aGlsZSAoKG5vZGUgPSBub2RlLm9mZnNldFBhcmVudCkpIHtcbiAgICBpZiAobm9kZS5vZmZzZXRUb3ApIHtcbiAgICAgIGJveC50b3AgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRUb3AsIDEwKTtcbiAgICB9XG4gICAgaWYgKG5vZGUub2Zmc2V0TGVmdCkge1xuICAgICAgYm94LmxlZnQgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRMZWZ0LCAxMCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJveDtcbn1cblxuXG52YXIgTGFuZ3VhZ2VzQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbGFzdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsc1t0aGlzLm1vZGVscy5sZW5ndGggLSAxXTtcbiAgfSxcblxuICByZXN0cmlwZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbHMgPSB0aGlzLmZpbHRlcihmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIHJldHVybiBtb2RlbC52YWx1ZTtcbiAgICB9KTtcblxuICAgIG1vZGVscy5wdXNoKHtcbiAgICAgIHZhbHVlOiAnJ1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZXNldChtb2RlbHMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgbW9kZWw6IFN0YXRlLmV4dGVuZCh7XG4gICAgcHJvcHM6IHtcbiAgICAgIHZhbHVlOiAnc3RyaW5nJ1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm9uKCdjaGFuZ2U6dmFsdWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5yZXN0cmlwZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KVxufSk7XG5cblxuXG5cblxuXG5cblxudmFyIExhbmd1YWdlc0NvbGxlY3Rpb24gPSBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1haW5JbmRleDogJ3ZhbHVlJyxcbiAgbW9kZWw6IFN0YXRlLmV4dGVuZCh7XG4gICAgcHJvcHM6IHtcbiAgICAgIHZhbHVlOiAnc3RyaW5nJyxcbiAgICAgIHBsYWNlaG9sZGVyOiAnc3RyaW5nJ1xuICAgIH1cbiAgfSlcbn0pO1xuXG5cblxuXG52YXIgZGVmYXVsdExhbmd1YWdlID0gW1xuICB7XG4gICAgdmFsdWU6ICdGRUVMJ1xuICB9LFxuICB7XG4gICAgdmFsdWU6ICdMVUEnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ0NPQk9MJ1xuICB9LFxuICB7XG4gICAgdmFsdWU6ICdQSFAnLFxuICAgIHBsYWNlaG9sZGVyOiAncmV0dXJuICRvYmpbXFwncHJvcGVydHlOYW1lXFwnXTsnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ0xJU1AnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ1NjYWxhJ1xuICB9LFxuICB7XG4gICAgdmFsdWU6ICdDJ1xuICB9LFxuICB7XG4gICAgdmFsdWU6ICdKYXZhc2NyaXB0JyxcbiAgICBwbGFjZWhvbGRlcjogJ3JldHVybiBvYmoucHJvcGVydHlOYW1lOydcbiAgfSxcbiAge1xuICAgIHZhbHVlOiAnR3Jvb3Z5J1xuICB9LFxuICB7XG4gICAgdmFsdWU6ICdQeXRob24nXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ1BlcmwnXG4gIH1cbl07XG5cblxudmFyIENsYXVzZUV4cHJlc3Npb25WaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkbW4tY2xhdXNlZXhwcmVzc2lvbi1zZXR0ZXJcIj4nICtcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJsYW5ndWFnZVwiPjwvZGl2PicgK1xuXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic291cmNlXCI+JyArXG4gICAgICAgICAgICAgICAgJzxsYWJlbD5Tb3VyY2U6PC9sYWJlbD4nICtcbiAgICAgICAgICAgICAgICAnPHRleHRhcmVhPjwvdGV4dGFyZWE+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwidG9nZ2xlLWVkaXRvci1zaXplXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyxcblxuICBzdWJ2aWV3czoge1xuICAgIGxhbmd1YWdlVmlldzoge1xuICAgICAgY29udGFpbmVyOiAnLmxhbmd1YWdlJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgdmFyIGNvbWJvYm94VmlldyA9IG5ldyBDb21ib0JveFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogICAgIHRoaXMsXG4gICAgICAgICAgY29sbGVjdGlvbjogdGhpcy5sYW5ndWFnZXMsXG4gICAgICAgICAgdmFsdWU6ICAgICAgdGhpcy5sYW5ndWFnZSxcbiAgICAgICAgICBsYWJlbDogICAgICAnTGFuZ3VhZ2U6JyxcbiAgICAgICAgICBjbGFzc05hbWU6ICBlbC5jbGFzc05hbWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGNiRWwgPSBjb21ib2JveFZpZXcucmVuZGVyKCkuZWw7XG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNiRWwsIGVsKTtcblxuICAgICAgICB0aGlzLmxpc3RlblRvKGNvbWJvYm94VmlldywgJ2NoYW5nZTp2YWx1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLmxhbmd1YWdlID0gY29tYm9ib3hWaWV3LnZhbHVlO1xuICAgICAgICAgIHZhciBpbmZvID0gdGhpcy5sYW5ndWFnZXMuZ2V0KHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgICAgIGlmICghaW5mbykgeyByZXR1cm47IH1cbiAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyID0gaW5mby5wbGFjZWhvbGRlciB8fCAnJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vbignY2hhbmdlOnZpc2libGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgY29tYm9ib3hWaWV3LnNldFZpc2libGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb21ib2JveFZpZXcuc3VnZ2VzdGlvbnNFbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbWJvYm94VmlldztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgICBsYW5ndWFnZXM6IExhbmd1YWdlc0NvbGxlY3Rpb24sXG4gICAgcG9zc2libGVMYW5ndWFnZXM6IExhbmd1YWdlc0NvbGxlY3Rpb25cbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgdmlzaWJsZTogICAgICAnYm9vbGVhbicsXG4gICAgYmlnOiAgICAgICAgICAnYm9vbGVhbicsXG4gICAgbGFuZ3VhZ2U6ICAgICB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICdGRUVMJ30sXG4gICAgcGxhY2Vob2xkZXI6ICAnc3RyaW5nJyxcbiAgICBvcmlnaW5hbEJveDogICdhbnknXG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGNvbnRleHRNZW51OiB7XG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXM7XG4gICAgICAgIHdoaWxlICgoY3VycmVudCA9IGN1cnJlbnQucGFyZW50KSkge1xuICAgICAgICAgIGlmIChjdXJyZW50LmNvbnRleHRNZW51KSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudC5jb250ZXh0TWVudTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHRhYmxlVmlldzoge1xuICAgICAgZGVwOiBbJ3BhcmVudCddLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgICB3aGlsZSAoKHBhcmVudCA9IHBhcmVudC5wYXJlbnQpKSB7XG4gICAgICAgICAgaWYgKHBhcmVudC50YWJsZUVsIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICB2aXNpYmxlOiB7XG4gICAgICB0eXBlOiAndG9nZ2xlJ1xuICAgIH0sXG4gICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxuICAgICAgc2VsZWN0b3I6ICd0ZXh0YXJlYScsXG4gICAgICBuYW1lOiAncGxhY2Vob2xkZXInXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2Ugc2VsZWN0JzogICAgICAgICAgICAgICdfaGFuZGxlTGFuZ3VhZ2VDaGFuZ2UnLFxuICAgICdpbnB1dCB0ZXh0YXJlYSc6ICAgICAgICAgICAgICdfaGFuZGxlU291cmNlSW5wdXQnLFxuICAgICdjbGljayAudG9nZ2xlLWVkaXRvci1zaXplJzogICdfaGFuZGxlU2l6ZUNsaWNrJ1xuICB9LFxuXG4gIF9oYW5kbGVMYW5ndWFnZUNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubGFuZ3VhZ2UgPSB0aGlzLmxhbmd1YWdlRWwudmFsdWU7XG4gIH0sXG5cbiAgX2hhbmRsZVNvdXJjZUlucHV0OiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuICBfaGFuZGxlU2l6ZUNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5iaWcgPSAhdGhpcy5iaWc7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIGhhc01vZGVsKCkge1xuICAgICAgcmV0dXJuIHNlbGYucGFyZW50ICYmIHNlbGYucGFyZW50Lm1vZGVsICYmIHNlbGYucGFyZW50Lm1vZGVsLmxhbmd1YWdlO1xuICAgIH1cblxuICAgIHRoaXMub24oJ2NoYW5nZTpsYW5ndWFnZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaGFzTW9kZWwoKSkgeyByZXR1cm47IH1cblxuICAgICAgdGhpcy5wYXJlbnQubW9kZWwubGFuZ3VhZ2UgPSB0aGlzLmxhbmd1YWdlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbignY2hhbmdlOmJpZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdHlsZSA9IHRoaXMuZWwuc3R5bGU7XG4gICAgICB2YXIgYm94O1xuXG4gICAgICBpZiAodGhpcy5iaWcpIHtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdiaWcnKTtcblxuICAgICAgICBib3ggPSBlbEJveCh0aGlzLnRhYmxlVmlldy5lbCk7XG5cbiAgICAgICAgc3R5bGUud2lkdGggPSBib3gud2lkdGggKydweCc7XG4gICAgICAgIHN0eWxlLmhlaWdodCA9IGJveC5oZWlnaHQgKydweCc7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdiaWcnKTtcblxuICAgICAgICBib3ggPSB0aGlzLm9yaWdpbmFsQm94O1xuXG4gICAgICAgIHN0eWxlLndpZHRoID0gJ2F1dG8nO1xuICAgICAgICBzdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Jlc2l6ZVRleHRhcmVhKGJveCk7XG5cbiAgICAgIHN0eWxlLnRvcCA9IGJveC50b3AgKydweCc7XG4gICAgICBzdHlsZS5sZWZ0ID0gYm94LmxlZnQgKydweCc7XG4gICAgfSk7XG4gIH0sXG5cbiAgc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMucGFyZW50IHx8ICF0aGlzLnBhcmVudC5lbCkge1xuICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGhlbHBlciA9IHRoaXMuZWw7XG4gICAgdmFyIGJveCA9IGVsQm94KHRoaXMucGFyZW50LmVsKTtcblxuICAgIGJveC5sZWZ0ICs9IHRoaXMucGFyZW50LmVsLmNsaWVudFdpZHRoO1xuICAgIGJveC50b3AgLT0gMjA7XG5cbiAgICBib3gubGVmdCArPSBNYXRoLm1pbihkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gKGJveC5sZWZ0ICsgdGhpcy5lbC5jbGllbnRXaWR0aCksIDApO1xuICAgIGJveC50b3AgKz0gTWF0aC5taW4oZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSAoYm94LnRvcCArIHRoaXMuZWwuY2xpZW50SGVpZ2h0KSwgMCk7XG5cbiAgICBoZWxwZXIuc3R5bGUudG9wID0gYm94LnRvcCArJ3B4JztcbiAgICBoZWxwZXIuc3R5bGUubGVmdCA9IGJveC5sZWZ0ICsncHgnO1xuXG4gICAgaWYgKHRoaXMubGFuZ3VhZ2VWaWV3KSB7XG4gICAgICB0aGlzLmxhbmd1YWdlVmlldy5zZXRQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIHRoaXMub3JpZ2luYWxCb3ggPSBlbEJveCh0aGlzLmVsKTtcbiAgfSxcblxuICBfcmVzaXplVGV4dGFyZWE6IGZ1bmN0aW9uIChib3gpIHtcbiAgICB2YXIgbGFiZWxIZWlnaHQgPSB0aGlzLnNvdXJjZUVsLnBhcmVudE5vZGUuY2xpZW50SGVpZ2h0IC0gdGhpcy5zb3VyY2VFbC5jbGllbnRIZWlnaHQ7XG4gICAgdGhpcy5zb3VyY2VFbC5zdHlsZS5oZWlnaHQgPSAoYm94LmhlaWdodCAtICh0aGlzLmxhbmd1YWdlRWwuY2xpZW50SGVpZ2h0ICsgbGFiZWxIZWlnaHQpKSArICdweCc7XG4gIH0sXG5cbiAgc2hvdzogZnVuY3Rpb24gKG1vZGVsLCBwYXJlbnQpIHtcbiAgICBpZiAoIW1vZGVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwYXJlbnQgJiYgdGhpcy5wYXJlbnQgIT09IHBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcblxuICAgIHRoaXMubGFuZ3VhZ2VzLnJlc2V0KGRlZmF1bHRMYW5ndWFnZSk7XG5cbiAgICB0aGlzLmxhbmd1YWdlVmlldy5pbnB1dEVsLnZhbHVlID0gdGhpcy5tb2RlbC5sYW5ndWFnZSB8fCAnJztcblxuXG4gICAgaW5zdGFuY2UudmlzaWJsZSA9IHRydWU7XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBpZiAodGhpcy5wYXJlbnQuY29udGV4dE1lbnUpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuY29udGV4dE1lbnUuY2xvc2UoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhcmVudC5jbGF1c2VWYWx1ZXNFZGl0b3IpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuY2xhdXNlVmFsdWVzRWRpdG9yLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFBvc2l0aW9uKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcblxuICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICBsYW5ndWFnZUVsOiAnLmxhbmd1YWdlJyxcbiAgICAgIHNvdXJjZUVsOiAgICcuc291cmNlIHRleHRhcmVhJ1xuICAgIH0pO1xuXG4gICAgdGhpcy5zb3VyY2VFbC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5jaWQpO1xuICAgIHRoaXMucXVlcnkoJy5zb3VyY2UgbGFiZWwnKS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIHRoaXMuY2lkKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuXG5cbnZhciBpbnN0YW5jZTtcbkNsYXVzZUV4cHJlc3Npb25WaWV3Lmluc3RhbmNlID0gZnVuY3Rpb24gKHN1Z2dlc3Rpb25zLCBwYXJlbnQpIHtcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIGluc3RhbmNlID0gbmV3IENsYXVzZUV4cHJlc3Npb25WaWV3KHt9KTtcbiAgICBpbnN0YW5jZS5yZW5kZXIoKTtcbiAgfVxuXG4gIGlmICghZG9jdW1lbnQuYm9keS5jb250YWlucyhpbnN0YW5jZS5lbCkpIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGluc3RhbmNlLmVsKTtcbiAgfVxuXG4gIGluc3RhbmNlLnNob3coc3VnZ2VzdGlvbnMsIHBhcmVudCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LmRtbkNsYXVzZUV4cHJlc3Npb25FZGl0b3IgPSBDbGF1c2VFeHByZXNzaW9uVmlldy5pbnN0YW5jZSgpO1xufVxuXG5DbGF1c2VFeHByZXNzaW9uVmlldy5Db2xsZWN0aW9uID0gTGFuZ3VhZ2VzQ29sbGVjdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGF1c2VFeHByZXNzaW9uVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29tYm9Cb3hWaWV3ID0gcmVxdWlyZSgnLi9jb21ib2JveC12aWV3Jyk7XG5cblxuXG52YXIgVmFsdWVzQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbGFzdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsc1t0aGlzLm1vZGVscy5sZW5ndGggLSAxXTtcbiAgfSxcblxuICByZXN0cmlwZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbHMgPSB0aGlzLmZpbHRlcihmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIHJldHVybiBtb2RlbC52YWx1ZTtcbiAgICB9KTtcblxuICAgIG1vZGVscy5wdXNoKHtcbiAgICAgIHZhbHVlOiAnJ1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZXNldChtb2RlbHMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgbW9kZWw6IFN0YXRlLmV4dGVuZCh7XG4gICAgcHJvcHM6IHtcbiAgICAgIHZhbHVlOiAnc3RyaW5nJ1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm9uKCdjaGFuZ2U6dmFsdWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5yZXN0cmlwZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KVxufSk7XG5cbnZhciBWYWx1ZXNJdGVtVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8bGk+PGlucHV0IHRhYmluZGV4PVwiMVwiIHBsYWNlaG9sZGVyPVwiQW4gb3RoZXIgcG9zc2libGUgdmFsdWVcIiAvPjwvbGk+JyxcblxuICBzZXNzaW9uOiB7XG4gICAgaW52YWxpZDogJ2Jvb2xlYW4nXG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwudmFsdWUnOiB7XG4gICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgc2VsZWN0b3I6ICdpbnB1dCdcbiAgICB9LFxuICAgIGludmFsaWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2ludmFsaWQnLFxuICAgICAgc2VsZWN0b3I6ICdpbnB1dCdcbiAgICB9XG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBpbnB1dCc6ICAgJ19oYW5kbGVWYWx1ZUNoYW5nZScsXG4gICAgJ2JsdXIgaW5wdXQnOiAgICAgJ19oYW5kbGVWYWx1ZUNoYW5nZScsXG4gICAgJ2tleWRvd24gaW5wdXQnOiAgJ19oYW5kbGVWYWx1ZUtleWRvd24nLFxuICAgICdrZXl1cCBpbnB1dCc6ICAgICdfaGFuZGxlVmFsdWVLZXl1cCdcbiAgfSxcblxuICBfaGFuZGxlVmFsdWVDaGFuZ2U6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAodGhpcy5tb2RlbC52YWx1ZSAhPT0gZXZ0LnRhcmdldC52YWx1ZSkge1xuICAgICAgdGhpcy5tb2RlbC52YWx1ZSA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICB9LFxuXG4gIF9oYW5kbGVWYWx1ZUtleWRvd246IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgY29kZSA9IGV2dC53aGljaCB8fCBldnQua2V5Q29kZTtcblxuICAgIHZhciBjb2xsZWN0aW9uID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uO1xuICAgIHZhciBsYXN0ID0gY29sbGVjdGlvbi5sYXN0KCk7XG5cbiAgICBpZiAobGFzdCA9PT0gdGhpcy5tb2RlbCAmJiBldnQudGFyZ2V0LnZhbHVlKSB7XG4gICAgICBjb2xsZWN0aW9uLmFkZCh7dmFsdWU6ICcnfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IDkpIHtcbiAgICAgIHZhciBpbnB1dHMgPSB0aGlzLnBhcmVudC5xdWVyeUFsbCgnLmFsbG93ZWQtdmFsdWVzIGlucHV0Jyk7XG4gICAgICB2YXIgbGFzdElucHV0ID0gaW5wdXRzW2lucHV0cy5sZW5ndGggLSAxXTtcblxuICAgICAgaWYgKGlucHV0cy5pbmRleE9mKGV2dC50YXJnZXQpID09PSAoaW5wdXRzLmxlbmd0aCAtIDIpKSB7XG4gICAgICAgIGxhc3RJbnB1dC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBfaGFuZGxlVmFsdWVLZXl1cDogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBjb2xsZWN0aW9uID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uO1xuICAgIHZhciBsYXN0ID0gY29sbGVjdGlvbi5sYXN0KCk7XG5cbiAgICBpZiAobGFzdCA9PT0gdGhpcy5tb2RlbCAmJiBldnQudGFyZ2V0LnZhbHVlKSB7XG4gICAgICBjb2xsZWN0aW9uLmFkZCh7dmFsdWU6ICcnfSk7XG4gICAgfVxuICB9LFxuXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbCA9IHRoaXMubW9kZWwudmFsdWU7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgIHRoaXMuaW52YWxpZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIGNpZCA9IHRoaXMubW9kZWwuY2lkO1xuICAgIHZhciBzYW1lID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLmZpbHRlcihmdW5jdGlvbiAob3RoZXIpIHtcbiAgICAgIHJldHVybiBvdGhlci5jaWQgIT09IGNpZCAmJiBvdGhlci52YWx1ZSA9PT0gdmFsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbnZhbGlkID0gc2FtZS5sZW5ndGggPiAwO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxuXG5cblxuXG52YXIgRGF0YXR5cGVzQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbWFpbkluZGV4OiAndmFsdWUnLFxuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnLFxuICAgICAgb2ZmZXI6ICdzdHJpbmcnXG4gICAgfVxuICB9KVxufSk7XG5cblxuXG5cbnZhciBwcmltaXRpdmVUeXBlcyA9IFtcbiAge1xuICAgIHZhbHVlOiAnc3RyaW5nJyxcbiAgICBvZmZlcjogJ2Nob2ljZXMnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ2RhdGUnLFxuICAgIG9mZmVyOiAncmFuZ2UnXG4gIH0sXG5cbiAgLy8gaHR0cHM6Ly9kb2NzLm9yYWNsZS5jb20vamF2YXNlL3R1dG9yaWFsL2phdmEvbnV0c2FuZGJvbHRzL2RhdGF0eXBlcy5odG1sXG4gIHtcbiAgICB2YWx1ZTogJ3Nob3J0JyxcbiAgICBvZmZlcjogJ3JhbmdlJ1xuICB9LFxuICB7XG4gICAgdmFsdWU6ICdpbnQnLFxuICAgIG9mZmVyOiAncmFuZ2UnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ2xvbmcnLFxuICAgIG9mZmVyOiAncmFuZ2UnXG4gIH0sXG4gIHtcbiAgICB2YWx1ZTogJ2Zsb2F0JyxcbiAgICBvZmZlcjogJ3JhbmdlJ1xuICB9LFxuICB7XG4gICAgdmFsdWU6ICdkb3VibGUnLFxuICAgIG9mZmVyOiAncmFuZ2UnXG4gIH0sXG5cbiAge1xuICAgIHZhbHVlOiAnYm9vbGVhbidcbiAgfVxuXTtcblxuXG52YXIgQ2xhdXNlVmFsdWVzVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiZG1uLWNsYXVzZXZhbHVlcy1zZXR0ZXIgY2hvaWNlc1wiPicgK1xuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRhdGF0eXBlXCI+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nICtcblxuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImFsbG93ZWQtdmFsdWVzXCI+JyArXG4gICAgICAgICAgICAgICAgJzxsYWJlbD5BbGxvd2VkIHZhbHVlczo8L2xhYmVsPicgK1xuICAgICAgICAgICAgICAgICc8dWw+PC91bD4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PicgK1xuXG4gICAgICAgICAgICAgICc8dWwgY2xhc3M9XCJyYW5nZWQtdmFsdWVzXCI+JyArXG4gICAgICAgICAgICAgICAgJzxsaSBjbGFzcz1cIm1pblwiPicgK1xuICAgICAgICAgICAgICAgICAgJzxsYWJlbD5NaW46PC9sYWJlbD4nICtcbiAgICAgICAgICAgICAgICAgICc8aW5wdXQgdGFiaW5kZXg9XCIxXCIgLz4nICtcbiAgICAgICAgICAgICAgICAnPC9saT4nICtcbiAgICAgICAgICAgICAgICAnPGxpIGNsYXNzPVwibWF4XCI+JyArXG4gICAgICAgICAgICAgICAgICAnPGxhYmVsPk1heDo8L2xhYmVsPicgK1xuICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0YWJpbmRleD1cIjJcIiAvPicgK1xuICAgICAgICAgICAgICAgICc8L2xpPicgK1xuICAgICAgICAgICAgICAnPC91bD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gIHN1YnZpZXdzOiB7XG4gICAgZGF0YXR5cGVWaWV3OiB7XG4gICAgICBjb250YWluZXI6ICcuZGF0YXR5cGUnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICB2YXIgY29tYm9ib3hWaWV3ID0gbmV3IENvbWJvQm94Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiAgICAgdGhpcyxcbiAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLmRhdGF0eXBlcyxcbiAgICAgICAgICAvLyB2YWx1ZTogICAgICB0aGlzLmRhdGF0eXBlLFxuICAgICAgICAgIGxhYmVsOiAgICAgICdUeXBlOicsXG4gICAgICAgICAgY2xhc3NOYW1lOiAgZWwuY2xhc3NOYW1lXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjYkVsID0gY29tYm9ib3hWaWV3LnJlbmRlcigpLmVsO1xuICAgICAgICBlbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjYkVsLCBlbCk7XG5cbiAgICAgICAgdGhpcy5saXN0ZW5Ubyhjb21ib2JveFZpZXcsICdjaGFuZ2U6dmFsdWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5kYXRhdHlwZSA9IGNvbWJvYm94Vmlldy52YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vbignY2hhbmdlOnZpc2libGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgY29tYm9ib3hWaWV3LnNldFZpc2libGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb21ib2JveFZpZXcuc3VnZ2VzdGlvbnNFbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbWJvYm94VmlldztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgICBkYXRhdHlwZXM6IERhdGF0eXBlc0NvbGxlY3Rpb24sXG4gICAgcG9zc2libGVWYWx1ZXM6IFZhbHVlc0NvbGxlY3Rpb25cbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgdmlzaWJsZTogJ2Jvb2xlYW4nLFxuICAgIGRhdGF0eXBlOiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICdzdHJpbmcnfVxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICBjb250ZXh0TWVudToge1xuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzO1xuICAgICAgICB3aGlsZSAoKGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudCkpIHtcbiAgICAgICAgICBpZiAoY3VycmVudC5jb250ZXh0TWVudSkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQuY29udGV4dE1lbnU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgdmlzaWJsZToge1xuICAgICAgdHlwZTogJ3RvZ2dsZSdcbiAgICB9LFxuICAgIGRhdGF0eXBlOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6IGZ1bmN0aW9uKGVsLCB2YWwsIHByZXYpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuZGF0YXR5cGVzLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICAgICAgICB2YXIgdHlwZTtcblxuICAgICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgICB0eXBlID0gdGhpcy5kYXRhdHlwZXMuZ2V0KHByZXYpO1xuICAgICAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSh0eXBlLm9mZmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICB0eXBlID0gdGhpcy5kYXRhdHlwZXMuZ2V0KHZhbCk7XG4gICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKHR5cGUub2ZmZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2VsZWN0b3I6ICcubWluIGlucHV0JyxcbiAgICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWwpIHtcbiAgICAgICAgICB2YXIgYmVmb3JlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBiZWZvcmUuc2V0RnVsbFllYXIoYmVmb3JlLmdldEZ1bGxZZWFyKCkgLSAxKTtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgdmFsID09PSAnZGF0ZScgPyBiZWZvcmUudG9JU09TdHJpbmcoKS5zcGxpdCgnLicpLnNoaWZ0KCkgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHNlbGVjdG9yOiAnLm1heCBpbnB1dCcsXG4gICAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsKSB7XG4gICAgICAgICAgdmFyIGFmdGVyID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBhZnRlci5zZXRGdWxsWWVhcihhZnRlci5nZXRGdWxsWWVhcigpICsgMSk7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIHZhbCA9PT0gJ2RhdGUnID8gYWZ0ZXIudG9JU09TdHJpbmcoKS5zcGxpdCgnLicpLnNoaWZ0KCkgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBzZWxlY3QnOiAnX2hhbmRsZURhdGF0eXBlQ2hhbmdlJ1xuICB9LFxuXG4gIF9oYW5kbGVEYXRhdHlwZUNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGF0YXR5cGUgPSB0aGlzLmRhdGF0eXBlRWwudmFsdWU7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIGhhc01vZGVsKCkge1xuICAgICAgcmV0dXJuIHNlbGYucGFyZW50ICYmIHNlbGYucGFyZW50Lm1vZGVsICYmIHNlbGYucGFyZW50Lm1vZGVsLmRhdGF0eXBlO1xuICAgIH1cblxuICAgIHRoaXMub24oJ2NoYW5nZTpkYXRhdHlwZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaGFzTW9kZWwoKSkgeyByZXR1cm47IH1cblxuICAgICAgdGhpcy5wYXJlbnQubW9kZWwuZGF0YXR5cGUgPSB0aGlzLmRhdGF0eXBlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnBvc3NpYmxlVmFsdWVzLCAnYWxsJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFoYXNNb2RlbCgpKSB7IHJldHVybjsgfVxuXG4gICAgICB0aGlzLnBhcmVudC5tb2RlbC5jaG9pY2VzID0gdGhpcy5wb3NzaWJsZVZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMucGFyZW50IHx8ICF0aGlzLnBhcmVudC5lbCkge1xuICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5vZGUgPSB0aGlzLnBhcmVudC5lbDtcbiAgICB2YXIgdG9wID0gbm9kZS5vZmZzZXRUb3A7XG4gICAgdmFyIGxlZnQgPSBub2RlLm9mZnNldExlZnQ7XG4gICAgdmFyIGhlbHBlciA9IHRoaXMuZWw7XG5cbiAgICB3aGlsZSAoKG5vZGUgPSBub2RlLm9mZnNldFBhcmVudCkpIHtcbiAgICAgIGlmIChub2RlLm9mZnNldFRvcCkge1xuICAgICAgICB0b3AgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRUb3AsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLm9mZnNldExlZnQpIHtcbiAgICAgICAgbGVmdCArPSBwYXJzZUludChub2RlLm9mZnNldExlZnQsIDEwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZWZ0ICs9IHRoaXMucGFyZW50LmVsLmNsaWVudFdpZHRoO1xuICAgIHRvcCAtPSAyMDtcblxuICAgIGxlZnQgKz0gTWF0aC5taW4oZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIChsZWZ0ICsgdGhpcy5lbC5jbGllbnRXaWR0aCksIDApO1xuICAgIHRvcCArPSBNYXRoLm1pbihkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCAtICh0b3AgKyB0aGlzLmVsLmNsaWVudEhlaWdodCksIDApO1xuXG4gICAgaGVscGVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBoZWxwZXIuc3R5bGUudG9wID0gdG9wICsncHgnO1xuICAgIGhlbHBlci5zdHlsZS5sZWZ0ID0gbGVmdCArJ3B4JztcblxuXG4gICAgaWYgKHRoaXMuZGF0YXR5cGVWaWV3KSB7XG4gICAgICB0aGlzLmRhdGF0eXBlVmlldy5zZXRQb3NpdGlvbigpO1xuICAgIH1cbiAgfSxcblxuICBzaG93OiBmdW5jdGlvbiAoZGF0YXR5cGUsIHZhbHVlcywgcGFyZW50KSB7XG4gICAgaWYgKHBhcmVudCAmJiB0aGlzLnBhcmVudCAhPT0gcGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGF0eXBlcy5yZXNldChwcmltaXRpdmVUeXBlcyk7XG5cbiAgICBpZiAodGhpcy5kYXRhdHlwZSAmJiAhdGhpcy5kYXRhdHlwZVZpZXcuaW5wdXRFbC52YWx1ZSkge1xuICAgICAgdGhpcy5kYXRhdHlwZVZpZXcuaW5wdXRFbC52YWx1ZSA9IHRoaXMuZGF0YXR5cGU7XG4gICAgfVxuXG4gICAgdmFsdWVzID0gdmFsdWVzIHx8IFtdO1xuICAgIHZhciB2YWxzID0gKEFycmF5LmlzQXJyYXkodmFsdWVzKSA/IHZhbHVlcy5tYXAoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IHZhbCB9O1xuICAgIH0pIDogdmFsdWVzLnRvSlNPTigpKVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0udmFsdWU7XG4gICAgICAgIH0pO1xuICAgIHZhbHMucHVzaCh7IHZhbHVlOiAnJyB9KTtcblxuICAgIHRoaXMucG9zc2libGVWYWx1ZXMucmVzZXQodmFscyk7XG5cbiAgICBpbnN0YW5jZS52aXNpYmxlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudC5jb250ZXh0TWVudSkge1xuICAgICAgICB0aGlzLnBhcmVudC5jb250ZXh0TWVudS5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucGFyZW50LmNsYXVzZUV4cHJlc3Npb25FZGl0b3IpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuY2xhdXNlRXhwcmVzc2lvbkVkaXRvci5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGluc3RhbmNlLnZpc2libGUpIHtcbiAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcblxuICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICB2YWx1ZXNFbDogICAndWwnLFxuXG4gICAgICBtaW5MYWJlbEVsOiAnLm1pbiBsYWJlbCcsXG4gICAgICBtaW5JbnB1dEVsOiAnLm1pbiBpbnB1dCcsXG5cbiAgICAgIG1heExhYmVsRWw6ICcubWF4IGxhYmVsJyxcbiAgICAgIG1heElucHV0RWw6ICcubWF4IGlucHV0J1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMucG9zc2libGVWYWx1ZXMsIFZhbHVlc0l0ZW1WaWV3LCB0aGlzLnZhbHVlc0VsKTtcblxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5wb3NzaWJsZVZhbHVlcywgJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cblxuXG52YXIgaW5zdGFuY2U7XG5DbGF1c2VWYWx1ZXNWaWV3Lmluc3RhbmNlID0gZnVuY3Rpb24gKHN1Z2dlc3Rpb25zLCBwYXJlbnQpIHtcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIGluc3RhbmNlID0gbmV3IENsYXVzZVZhbHVlc1ZpZXcoe30pO1xuICAgIGluc3RhbmNlLnJlbmRlcigpO1xuICB9XG5cbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGluc3RhbmNlLmVsKSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zdGFuY2UuZWwpO1xuICB9XG5cbiAgaW5zdGFuY2Uuc2hvdyhzdWdnZXN0aW9ucywgcGFyZW50KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59O1xuXG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuZG1uQ2xhdXNlVmFsdWVzRWRpdG9yID0gQ2xhdXNlVmFsdWVzVmlldy5pbnN0YW5jZSgpO1xufVxuXG5DbGF1c2VWYWx1ZXNWaWV3LkNvbGxlY3Rpb24gPSBWYWx1ZXNDb2xsZWN0aW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXVzZVZhbHVlc1ZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG5cbi8vIGZ1bmN0aW9uIHRvQXJyYXkodGhpbmcpIHtcbi8vICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseSh0aGluZyk7XG4vLyB9XG5cbnZhciBTdWdnZXN0aW9uc0NvbGxlY3Rpb24gPSBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1vZGVsOiBTdGF0ZS5leHRlbmQoe1xuICAgIHByb3BzOiB7XG4gICAgICB2YWx1ZTogJ3N0cmluZycsXG4gICAgICBodG1sOiAnc3RyaW5nJ1xuICAgIH1cbiAgfSlcbn0pO1xuXG52YXIgU3VnZ2VzdGlvblZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiAnPGxpIHRhYmluZGV4PVwiMVwiPjwvbGk+JyxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICBjbGljazogICAgJ19oYW5kbGVDbGljaycsXG4gICAgZm9jdXM6ICAgICdfaGFuZGxlRm9jdXMnLFxuICAgIGtleWRvd246ICAnX2hhbmRsZUtleWRvd24nXG4gIH0sXG5cbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wYXJlbnQuaW5wdXRFbC52YWx1ZSA9IHRoaXMucGFyZW50LnZhbHVlID0gdGhpcy5tb2RlbC52YWx1ZTtcbiAgICB0aGlzLnBhcmVudC5jb2xsYXBzZSgpO1xuICB9LFxuXG4gIF9oYW5kbGVGb2N1czogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGFyZW50LmlucHV0RWwudmFsdWUgPSB0aGlzLnBhcmVudC52YWx1ZSA9IHRoaXMubW9kZWwudmFsdWU7XG4gIH0sXG5cbiAgX2hhbmRsZUtleWRvd246IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgY29kZSA9IGV2dC53aGljaCB8fCBldnQua2V5Q29kZTtcbiAgICAvLyBlbnRlclxuICAgIGlmIChjb2RlID09PSAxMykge1xuICAgICAgdGhpcy5faGFuZGxlQ2xpY2soKTtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIC8vIHRhYlxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDkpIHtcbiAgICAgIHZhciBuZXh0ID0gdGhpcy5lbFtldnQuc2hpZnRLZXkgPyAncHJldmlvdXNTaWJsaW5nJyA6ICduZXh0U2libGluZyddO1xuICAgICAgaWYgKCFuZXh0KSB7XG4gICAgICAgIG5leHQgPSB0aGlzLnBhcmVudC5pbnB1dEVsO1xuICAgICAgfVxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBuZXh0LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgLy8gZG93blxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDQwKSB7XG4gICAgICB2YXIgbmV4dCA9IHRoaXMuZWwubmV4dFNpYmxpbmc7XG4gICAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMucGFyZW50LmlucHV0RWw7XG4gICAgICB9XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG5leHQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvLyB1cFxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDM4KSB7XG4gICAgICB2YXIgbmV4dCA9IHRoaXMuZWwucHJldmlvdXNTaWJsaW5nO1xuICAgICAgaWYgKCFuZXh0KSB7XG4gICAgICAgIG5leHQgPSB0aGlzLnBhcmVudC5pbnB1dEVsO1xuICAgICAgfVxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBuZXh0LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgLy8gZXNjXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gMjcpIHtcbiAgICAgIHRoaXMuZWwucGFyZW50Tm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgfVxufSk7XG5cblxuXG52YXIgQ29tYm9Cb3hWaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkbW4tY29tYm9ib3hcIj4nICtcbiAgICAgICAgICAgICAgJzxsYWJlbD48L2xhYmVsPicgK1xuICAgICAgICAgICAgICAnPGlucHV0IHRhYmluZGV4PVwiMFwiIC8+JyArXG4gICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgJzwvZGl2PicsXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgICBzdWdnZXN0aW9uczogU3VnZ2VzdGlvbnNDb2xsZWN0aW9uXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIHZhbHVlOiAgICAgICdzdHJpbmcnLFxuICAgIGxhYmVsOiAgICAgICdzdHJpbmcnLFxuICAgIGNsYXNzTmFtZTogICdzdHJpbmcnXG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICBjbGFzc05hbWU6IHtcbiAgICAgIHR5cGU6ICdjbGFzcydcbiAgICB9LFxuXG4gICAgbGFiZWw6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnbGFiZWwnXG4gICAgfSxcblxuICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdwbGFjZWhvbGRlcicsXG4gICAgICBzZWxlY3RvcjogJ2lucHV0J1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICAnaW5wdXQgaW5wdXQnOiAgICAnX2hhbmRsZUlucHV0JyxcbiAgICAnZm9jdXMgaW5wdXQnOiAgICAnX2hhbmRsZUZvY3VzJyxcbiAgICAnYmx1ciBpbnB1dCc6ICAgICAnX2hhbmRsZUJsdXInLFxuICAgICdrZXlkb3duIGlucHV0JzogICdfaGFuZGxlS2V5ZG93bicsXG4gICAgJ2NsaWNrIC5jYXJldCc6ICAgJ19oYW5kbGVDYXJldENsaWNrJ1xuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICBleHBhbmRlZDoge1xuICAgICAgZGVwczogW10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWdnZXN0aW9uc0VsLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRQb3NpdGlvbigpO1xuXG4gICAgaWYgKCF0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdWdnZXN0aW9ucy5yZXNldCh0aGlzLmNvbGxlY3Rpb24udG9KU09OKCkpO1xuICAgIH1cbiAgfSxcblxuICBfaGFuZGxlQmx1cjogZnVuY3Rpb24gKCkge30sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRQb3NpdGlvbigpO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLmlucHV0RWwudmFsdWUudHJpbSgpO1xuICAgIHRoaXMuc3VnZ2VzdGlvbnMucmVzZXQodGhpcy5maWx0ZXIoKSk7XG4gIH0sXG5cbiAgX2hhbmRsZUtleWRvd246IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgY29kZSA9IGV2dC53aGljaCB8fCBldnQua2V5Q29kZTtcbiAgICBpZiAoY29kZSA9PT0gOSB8fCBjb2RlID09PSA0MCB8fCBjb2RlID09PSAzOCkge1xuICAgICAgdmFyIHZpZXdzID0gdGhpcy5zdWdnZXN0aW9uc1ZpZXcudmlld3M7XG4gICAgICB2YXIgdmlldyA9IHZpZXdzW2V2dC5zaGlmdEtleSB8fCBjb2RlID09PSAzOCA/IHZpZXdzLmxlbmd0aCAtIDEgOiAwXTtcbiAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgIGlmICghdGhpcy5leHBhbmRlZCkge1xuICAgICAgICAgIHRoaXMuZXhwYW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmlldy5lbC5mb2N1cygpO1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBlbnRlclxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDEzKSB7XG4gICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cblxuICAgIC8vIGVzY1xuICAgIGVsc2UgaWYgKGNvZGUgPT09IDI3KSB7XG4gICAgICB0aGlzLmNvbGxhcHNlKCk7XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVDYXJldENsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50b2dnbGUoKTtcbiAgfSxcblxuICBleHBhbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMuc3VnZ2VzdGlvbnMucmVzZXQodGhpcy5jb2xsZWN0aW9uLnRvSlNPTigpKTtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgY29sbGFwc2U6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5leHBhbmRlZCkge1xuICAgICAgdGhpcy5zdWdnZXN0aW9uc0VsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2V4cGFuZGVkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHRvZ2dsZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXNbdGhpcy5leHBhbmRlZCA/ICdjb2xsYXBzZScgOiAnZXhwYW5kJ10oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBmaWx0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLmNvbGxlY3Rpb24uZmlsdGVyKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgcmV0dXJuIG1vZGVsLnZhbHVlLmluZGV4T2YodGhpcy52YWx1ZSkgPiAtMTtcbiAgICB9LCB0aGlzKS5tYXAoZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICByZXR1cm4gbW9kZWwudG9KU09OKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbHRlcmVkO1xuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuY29sbGVjdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21ib0JveFZpZXcgcmVxdWlyZXMgYSBjb2xsZWN0aW9uIG9wdGlvbicpO1xuICAgIH1cblxuICAgIHRoaXMub24oJ2NoYW5nZTp2YWx1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5tb2RlbCB8fCB0aGlzLm1vZGVsLnZhbHVlID09PSB0aGlzLnZhbHVlKSB7IHJldHVybjsgfVxuICAgICAgdGhpcy5tb2RlbC52YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfSk7XG4gIH0sXG5cbiAgc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMucGFyZW50IHx8ICF0aGlzLnBhcmVudC5lbCkge1xuICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5vZGUgPSB0aGlzLmlucHV0RWw7XG4gICAgdmFyIHRvcCA9IG5vZGUub2Zmc2V0VG9wICsgdGhpcy5pbnB1dEVsLmNsaWVudEhlaWdodDtcbiAgICB2YXIgbGVmdCA9IG5vZGUub2Zmc2V0TGVmdDtcbiAgICB2YXIgaGVscGVyID0gdGhpcy5zdWdnZXN0aW9uc0VsO1xuXG4gICAgd2hpbGUgKChub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQpKSB7XG4gICAgICBpZiAobm9kZS5vZmZzZXRUb3ApIHtcbiAgICAgICAgdG9wICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0VG9wLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5vZmZzZXRMZWZ0KSB7XG4gICAgICAgIGxlZnQgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRMZWZ0LCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGVscGVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBoZWxwZXIuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICBoZWxwZXIuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgIGhlbHBlci5zdHlsZS53aWR0aCA9IHRoaXMuaW5wdXRFbC5jbGllbnRXaWR0aCArICdweCc7XG4gIH0sXG5cbiAgc2V0VmlzaWJsZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkaXNwbGF5ID0gJ2Jsb2NrJztcblxuICAgIGlmICh0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgIGRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuXG4gICAgdGhpcy5zdWdnZXN0aW9uc0VsLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIGlmIChkaXNwbGF5ID09PSAnbm9uZScpIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZXhwYW5kZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG5cbiAgICB0aGlzLnNldFBvc2l0aW9uKCk7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5pbnB1dEVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdWdnZXN0aW9uc1ZpZXcudmlld3MuZm9yRWFjaChmdW5jdGlvbiAodmlldywgdikge1xuICAgICAgaWYgKHYgPT09IDApIHtcbiAgICAgICAgdmlldy5lbC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnJlbmRlcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcblxuICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICBsYWJlbEVsOiAnbGFiZWwnLFxuICAgICAgaW5wdXRFbDogJ2lucHV0J1xuICAgIH0pO1xuXG4gICAgdGhpcy5sYWJlbEVsLnNldEF0dHJpYnV0ZSgnZm9yJywgdGhpcy5jaWQpO1xuICAgIHRoaXMuaW5wdXRFbC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5jaWQpO1xuXG4gICAgaWYgKHRoaXMudmFsdWUgJiYgIXRoaXMuaW5wdXRFbC52YWx1ZSkge1xuICAgICAgdGhpcy5pbnB1dEVsLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnN1Z2dlc3Rpb25zRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHRoaXMuc3VnZ2VzdGlvbnNFbC5jbGFzc05hbWUgPSAnZG1uLWNvbWJvYm94LXN1Z2dlc3Rpb25zJztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuc3VnZ2VzdGlvbnNFbCk7XG5cbiAgICB0aGlzLnN1Z2dlc3Rpb25zVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLnN1Z2dlc3Rpb25zLCBTdWdnZXN0aW9uVmlldywgdGhpcy5zdWdnZXN0aW9uc0VsKTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5zdWdnZXN0aW9ucywgJ2FsbCcsIHRoaXMuc2V0VmlzaWJsZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuc3VnZ2VzdGlvbnNFbCk7XG4gICAgVmlldy5wcm90b3R5cGUucmVtb3ZlLmFwcGx5KHRoaXMpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21ib0JveFZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlKi9cblxudmFyIG1peGlucyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbltcbiAgJ2NsYXVzZVZhbHVlc0VkaXRvcicsXG4gICdjbGF1c2VFeHByZXNzaW9uRWRpdG9yJyxcbiAgJ2NvbnRleHRNZW51J1xuXS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gIG1peGluc1tuYW1lXSA9IHtcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcztcbiAgICAgIHdoaWxlICgoY3VycmVudCA9IGN1cnJlbnQucGFyZW50KSkge1xuICAgICAgICBpZiAoY3VycmVudFtuYW1lXSkge1xuICAgICAgICAgIHJldHVybiBjdXJyZW50W25hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG5cblxudmFyIGRlZmF1bHRDb21tYW5kcyA9IFtcbiAge1xuICAgIGxhYmVsOiAnQ2VsbCcsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgY29udGVudCBvZiB0aGUgZm9jdXNlZCBjZWxsJyxcbiAgICAgICAgcG9zc2libGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmluZm8oJ2NsZWFyIHBvc3NpYmxlPycsIGFyZ3VtZW50cywgdGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnUnVsZScsXG4gICAgaWNvbjogJycsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdjb3B5JyxcbiAgICAgICAgaWNvbjogJ2NvcHknLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNvcHlSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICB9LFxuICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgIGhpbnQ6ICdDb3B5IHRoZSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jb3B5UnVsZSh0aGlzLnNjb3BlLCAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuY29weVJ1bGUodGhpcy5zY29wZSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgIGhpbnQ6ICdSZW1vdmUgdGhlIGZvY3VzZWQgcnVsZScsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwucmVtb3ZlUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jbGVhclJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ0lucHV0JyxcbiAgICBpY29uOiAnaW5wdXQnLFxuICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYmVmb3JlJyxcbiAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gaW5wdXQgY2xhdXNlIGJlZm9yZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgaWNvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gaW5wdXQgY2xhdXNlIGFmdGVyIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLnJlbW92ZUlucHV0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ091dHB1dCcsXG4gICAgaWNvbjogJ291dHB1dCcsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBvdXRwdXQgY2xhdXNlIGJlZm9yZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkT3V0cHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICBoaW50OiAnQWRkIGFuIG91dHB1dCBjbGF1c2UgYWZ0ZXIgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZE91dHB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLnJlbW92ZU91dHB1dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xuXG5cblxuXG5cblxuXG5cblxudmFyIENvbW1hbmRNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHByb3BzOiB7XG4gICAgbGFiZWw6ICAgICAgJ3N0cmluZycsXG4gICAgaGludDogICAgICAgJ3N0cmluZycsXG4gICAgaWNvbjogICAgICAgJ3N0cmluZycsXG4gICAgaHJlZjogICAgICAgJ3N0cmluZycsXG4gICAgY2xhc3NOYW1lOiAgJ3N0cmluZycsXG5cbiAgICBwb3NzaWJsZToge1xuICAgICAgdHlwZTogJ2FueScsXG4gICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBmdW5jdGlvbiAoKSB7fTsgfSxcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlICE9PSAnZnVuY3Rpb24nICYmIG5ld1ZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiAnbXVzdCBiZSBlaXRoZXIgYSBmdW5jdGlvbiBvciBmYWxzZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZm46IHtcbiAgICAgIHR5cGU6ICdhbnknLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICB0ZXN0OiBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiBuZXdWYWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gJ211c3QgYmUgZWl0aGVyIGEgZnVuY3Rpb24gb3IgZmFsc2UnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICBkaXNhYmxlZDoge1xuICAgICAgZGVwczogWydwb3NzaWJsZSddLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLnBvc3NpYmxlID09PSAnZnVuY3Rpb24nID8gIXRoaXMucG9zc2libGUoKSA6IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzdWJjb21tYW5kczogbnVsbCxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICAgIHRoaXMuc3ViY29tbWFuZHMgPSBuZXcgQ29tbWFuZHNDb2xsZWN0aW9uKGF0dHJpYnV0ZXMuc3ViY29tbWFuZHMgfHwgW10sIHtcbiAgICAgIHBhcmVudDogdGhpc1xuICAgIH0pO1xuICB9XG59KTtcblxuXG5cblxuXG5cblxuXG5cblxudmFyIENvbW1hbmRzQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbW9kZWw6IENvbW1hbmRNb2RlbFxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBDb250ZXh0TWVudUl0ZW0gPSBWaWV3LmV4dGVuZCh7XG4gIGF1dG9SZW5kZXI6IHRydWUsXG5cbiAgdGVtcGxhdGU6ICc8bGk+JyArXG4gICAgICAgICAgICAgICc8YT4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJpY29uXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxhYmVsXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAnPC9hPicgK1xuICAgICAgICAgICAgICAnPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPjwvdWw+JyArXG4gICAgICAgICAgICAnPC9saT4nLFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmxhYmVsJzoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICcubGFiZWwnXG4gICAgfSxcblxuICAgICdtb2RlbC5oaW50Jzoge1xuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAndGl0bGUnXG4gICAgfSxcblxuICAgICdtb2RlbC5mbic6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgc2VsZWN0b3I6ICdhJyxcbiAgICAgIG5vOiAnZGlzYWJsZWQnXG4gICAgfSxcblxuICAgICdtb2RlbC5kaXNhYmxlZCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2Rpc2FibGVkJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuc3ViY29tbWFuZHMubGVuZ3RoJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBuYW1lOiAnZHJvcGRvd24nXG4gICAgfSxcblxuICAgICdtb2RlbC5ocmVmJzoge1xuICAgICAgc2VsZWN0b3I6ICdhJyxcbiAgICAgIG5hbWU6ICdocmVmJyxcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnaHJlZicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnaHJlZicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAnbW9kZWwuaWNvbic6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gJ2ljb24gJyArIHZhbHVlO1xuICAgICAgfSxcbiAgICAgIHNlbGVjdG9yOiAnLmljb24nXG4gICAgfSxcblxuICAgICdtb2RlbC5jbGFzc05hbWUnOiB7XG4gICAgICB0eXBlOiAnY2xhc3MnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAgICAgICdfaGFuZGxlQ2xpY2snLFxuICAgIG1vdXNlb3ZlcjogICdfaGFuZGxlTW91c2VvdmVyJyxcbiAgICBtb3VzZW91dDogICAnX2hhbmRsZU1vdXNlb3V0J1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLm1vZGVsLCAnY2hhbmdlOnN1YmNvbW1hbmRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMubW9kZWwuc3ViY29tbWFuZHMsIENvbnRleHRNZW51SXRlbSwgdGhpcy5xdWVyeSgndWwnKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKHRoaXMubW9kZWwuZm4pIHtcbiAgICAgIHRoaXMucGFyZW50LnRyaWdnZXJDb21tYW5kKHRoaXMubW9kZWwsIGV2dCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCF0aGlzLm1vZGVsLmhyZWYpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSxcblxuICBfaGFuZGxlTW91c2VvdmVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuXG5cbiAgX2hhbmRsZU1vdXNlb3V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuXG5cbiAgdHJpZ2dlckNvbW1hbmQ6IGZ1bmN0aW9uIChjb21tYW5kLCBldnQpIHtcbiAgICB0aGlzLnBhcmVudC50cmlnZ2VyQ29tbWFuZChjb21tYW5kLCBldnQpO1xuICB9XG59KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgQ29udGV4dE1lbnVWaWV3ID0gVmlldy5leHRlbmQoe1xuICBhdXRvUmVuZGVyOiB0cnVlLFxuXG4gIHRlbXBsYXRlOiAnPG5hdiBjbGFzcz1cImRtbi1jb250ZXh0LW1lbnVcIj4nICtcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjb29yZGluYXRlc1wiPicgK1xuICAgICAgICAgICAgICAgICc8bGFiZWw+Q29vcmRzOjwvbGFiZWw+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwieFwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ5XCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8dWw+PC91bD4nICtcbiAgICAgICAgICAgICc8L25hdj4nLFxuXG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgY29tbWFuZHM6IENvbW1hbmRzQ29sbGVjdGlvblxuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICBpc09wZW46ICdib29sZWFuJyxcbiAgICBzY29wZTogICdzdGF0ZSdcbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgIGlzT3Blbjoge1xuICAgICAgdHlwZTogJ3RvZ2dsZSdcbiAgICB9LFxuICAgICdwYXJlbnQubW9kZWwueCc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnZGl2IHNwYW4ueCdcbiAgICB9LFxuICAgICdwYXJlbnQubW9kZWwueSc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnZGl2IHNwYW4ueSdcbiAgICB9XG4gIH0sXG5cbiAgb3BlbjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc3R5bGUgPSB0aGlzLmVsLnN0eWxlO1xuXG4gICAgc3R5bGUubGVmdCA9IG9wdGlvbnMubGVmdCArICdweCc7XG4gICAgc3R5bGUudG9wID0gb3B0aW9ucy50b3AgKyAncHgnO1xuXG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLnBhcmVudCkge1xuICAgICAgaWYgKG9wdGlvbnMucGFyZW50LmNsYXVzZVZhbHVlc0VkaXRvcikge1xuICAgICAgICBvcHRpb25zLnBhcmVudC5jbGF1c2VWYWx1ZXNFZGl0b3IuaGlkZSgpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMucGFyZW50LmNsYXVzZUV4cHJlc3Npb25FZGl0b3IpIHtcbiAgICAgICAgb3B0aW9ucy5wYXJlbnQuY2xhdXNlRXhwcmVzc2lvbkVkaXRvci5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zY29wZSA9IG9wdGlvbnMuc2NvcGU7XG4gICAgdmFyIGNvbW1hbmRzID0gb3B0aW9ucy5jb21tYW5kcyB8fCBkZWZhdWx0Q29tbWFuZHM7XG5cbiAgICB0aGlzLmNvbW1hbmRzLnJlc2V0KGNvbW1hbmRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB0cmlnZ2VyQ29tbWFuZDogZnVuY3Rpb24gKGNvbW1hbmQsIGV2dCkge1xuICAgIGNvbW1hbmQuZm4uY2FsbCh0aGlzLCBldnQpO1xuICAgIGlmICghY29tbWFuZC5rZWVwT3Blbikge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLmNhY2hlRWxlbWVudHMoe1xuICAgICAgY29tbWFuZHNFbDogJ3VsJ1xuICAgIH0pO1xuXG5cblxuICAgIHRoaXMuY29tbWFuZHNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29tbWFuZHMsIENvbnRleHRNZW51SXRlbSwgdGhpcy5jb21tYW5kc0VsKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIGluc3RhbmNlO1xuQ29udGV4dE1lbnVWaWV3Lmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIWluc3RhbmNlKSB7XG4gICAgaW5zdGFuY2UgPSBuZXcgQ29udGV4dE1lbnVWaWV3KCk7XG4gIH1cblxuICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoaW5zdGFuY2UuZWwpKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnN0YW5jZS5lbCk7XG4gIH1cblxuICByZXR1cm4gaW5zdGFuY2U7XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LmRtbkNvbnRleHRNZW51ID0gQ29udGV4dE1lbnVWaWV3Lmluc3RhbmNlKCk7XG59XG5cbkNvbnRleHRNZW51Vmlldy5Db2xsZWN0aW9uID0gQ29tbWFuZHNDb2xsZWN0aW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRleHRNZW51VmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UsIGNvbnNvbGU6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBEZWNpc2lvblRhYmxlID0gcmVxdWlyZSgnLi90YWJsZS1kYXRhJyk7XG52YXIgUnVsZVZpZXcgPSByZXF1aXJlKCcuL3J1bGUtdmlldycpO1xuXG5cblxuXG52YXIgQ2xhdXNlSGVhZGVyVmlldyA9IHJlcXVpcmUoJy4vY2xhdXNlLXZpZXcnKTtcblxuZnVuY3Rpb24gdG9BcnJheShlbHMpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShlbHMpO1xufVxuXG5cbmZ1bmN0aW9uIG1ha2VUZCh0eXBlKSB7XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gIGVsLmNsYXNzTmFtZSA9IHR5cGU7XG4gIHJldHVybiBlbDtcbn1cblxuXG5mdW5jdGlvbiBtYWtlQWRkQnV0dG9uKGNsYXVzZVR5cGUsIHRhYmxlKSB7XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgZWwuY2xhc3NOYW1lID0gJ2ljb24tZG1uIGljb24tcGx1cyc7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHRhYmxlW2NsYXVzZVR5cGUgPT09ICdpbnB1dCcgPyAnYWRkSW5wdXQnIDogJ2FkZE91dHB1dCddKCk7XG4gIH0pO1xuICByZXR1cm4gZWw7XG59XG5cblxudmFyIEZvb3RWaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzx0Zm9vdD48dHI+PC90cj48L3Rmb290PicsXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIC5hZGQtcnVsZSc6ICdfaGFuZGxlQWRkUnVsZUNsaWNrJ1xuICB9LFxuXG4gIF9oYW5kbGVBZGRSdWxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLmFkZFJ1bGUoKTtcbiAgfSxcblxuICBtYWtlTGlua0VsOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICB0ZC5jbGFzc05hbWUgPSAnYWRkLXJ1bGUnO1xuICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuc2V0QXR0cmlidXRlKCd0aXRsZScsICdBZGQgYSBydWxlJyk7XG4gICAgYS5jbGFzc05hbWUgPSAnaWNvbi1kbW4gaWNvbi1wbHVzJztcbiAgICB0ZC5hcHBlbmRDaGlsZChhKTtcbiAgICByZXR1cm4gdGQ7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWw7XG4gICAgdGhpcy5saXN0ZW5Ubyh0YWJsZS5pbnB1dHMsICdhbGwnLCB0aGlzLnJlbmRlcik7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0YWJsZS5vdXRwdXRzLCAnYWxsJywgdGhpcy5yZW5kZXIpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWw7XG4gICAgaWYgKHRoaXMucm93RWwpIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IFtdLnNsaWNlLmFwcGx5KHRoaXMucm93RWwuY2hpbGROb2Rlcyk7XG4gICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICB0aGlzLnJvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG4gICAgICB0aGlzLmNhY2hlRWxlbWVudHMoe1xuICAgICAgICByb3dFbDogJ3RyJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5yb3dFbC5hcHBlbmRDaGlsZCh0aGlzLm1ha2VMaW5rRWwoKSk7XG4gICAgdmFyIGNvdW50ID0gMSArIE1hdGgubWF4KDEsIHRhYmxlLmlucHV0cy5sZW5ndGgpICsgTWF0aC5tYXgoMSwgdGFibGUub3V0cHV0cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY291bnQ7IGMrKykge1xuICAgICAgdGhpcy5yb3dFbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cbnZhciBEZWNpc2lvblRhYmxlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgYXV0b1JlbmRlcjogdHJ1ZSxcblxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkbW4tdGFibGVcIj4nICtcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJoaW50c1wiPicgK1xuICAgICAgICAgICAgICAgICc8aSBjbGFzcz1cImljb24tZG1uIGljb24taW5mb1wiPjwvaT4gJyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGRhdGEtaG9vaz1cImhpbnRzXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8aGVhZGVyPicgK1xuICAgICAgICAgICAgICAgICc8aDMgZGF0YS1ob29rPVwidGFibGUtbmFtZVwiIGNvbnRlbnRlZGl0YWJsZT48L2gzPicgK1xuICAgICAgICAgICAgICAnPC9oZWFkZXI+JyArXG4gICAgICAgICAgICAgICc8dGFibGU+JyArXG4gICAgICAgICAgICAgICAgJzx0aGVhZD4nICtcbiAgICAgICAgICAgICAgICAgICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJoaXRcIiByb3dzcGFuPVwiNFwiPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJpbnB1dCBkb3VibGUtYm9yZGVyLXJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5JbnB1dDwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJvdXRwdXRcIiBjb2xzcGFuPVwiMlwiPk91dHB1dDwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJhbm5vdGF0aW9uXCIgcm93c3Bhbj1cIjRcIj5Bbm5vdGF0aW9uPC90aD4nICtcbiAgICAgICAgICAgICAgICAgICc8L3RyPicgK1xuICAgICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cImxhYmVsc1wiPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAnPHRyIGNsYXNzPVwidmFsdWVzXCI+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJtYXBwaW5nc1wiPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgJzwvdGhlYWQ+JyArXG4gICAgICAgICAgICAgICAgJzx0Ym9keT48L3Rib2R5PicgK1xuICAgICAgICAgICAgICAnPC90YWJsZT4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gIHNlc3Npb246IHtcbiAgICBjb250ZXh0TWVudTogICAgICAgICAgICAnc3RhdGUnLFxuICAgIGNsYXVzZVZhbHVlc0VkaXRvcjogICAgICdzdGF0ZScsXG4gICAgY2xhdXNlRXhwcmVzc2lvbkVkaXRvcjogJ3N0YXRlJyxcblxuICAgIGhpbnQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ01ha2UgYSByaWdodC1jbGljayBvbiB0aGUgdGFibGUnXG4gICAgfVxuICB9LFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLm5hbWUnOiB7XG4gICAgICBob29rOiAndGFibGUtbmFtZScsXG4gICAgICB0eXBlOiAndGV4dCdcbiAgICB9LFxuICAgIGhpbnQ6IHtcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnLFxuICAgICAgaG9vazogJ2hpbnRzJ1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICAnaW5wdXQgaGVhZGVyIGgzJzogICAnX2hhbmRsZU5hbWVJbnB1dCdcbiAgfSxcblxuICBfaGFuZGxlTmFtZUlucHV0OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHZhbCA9IGV2dC50YXJnZXQudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIGlmICh2YWwgPT09IHRoaXMubW9kZWwubmFtZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLm1vZGVsLm5hbWUgPSB2YWw7XG4gIH0sXG5cbiAgbG9nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcbiAgICB2YXIgbWV0aG9kID0gYXJncy5zaGlmdCgpO1xuICAgIGFyZ3MudW5zaGlmdCh0aGlzLmNpZCk7XG4gICAgY29uc29sZVttZXRob2RdLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xuICB9LFxuXG4gIGV2ZW50TG9nOiBmdW5jdGlvbiAoc2NvcGVOYW1lKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgYXJncy51bnNoaWZ0KHNjb3BlTmFtZSk7XG4gICAgICBhcmdzLnVuc2hpZnQoJ3RyYWNlJyk7XG4gICAgICBhcmdzLnB1c2goYXJndW1lbnRzWzBdKTtcbiAgICAgIHNlbGYubG9nLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH07XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMubW9kZWwgPSB0aGlzLm1vZGVsIHx8IG5ldyBEZWNpc2lvblRhYmxlLk1vZGVsKCk7XG4gIH0sXG5cbiAgaGlkZUNvbnRleHRNZW51OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRleHRNZW51KSB7IHJldHVybjsgfVxuICAgIHRoaXMuY29udGV4dE1lbnUuY2xvc2UoKTtcbiAgfSxcblxuICBzaG93Q29udGV4dE1lbnU6IGZ1bmN0aW9uIChjZWxsTW9kZWwsIGV2dCkge1xuICAgIGlmICghdGhpcy5jb250ZXh0TWVudSkgeyByZXR1cm47IH1cbiAgICBpZiAoZXZ0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB2YXIgdGFibGUgPSB0aGlzLm1vZGVsO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBzY29wZTogIGNlbGxNb2RlbCxcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIGxlZnQ6ICAgZXZ0LnBhZ2VYLFxuICAgICAgdG9wOiAgICBldnQucGFnZVlcbiAgICB9O1xuXG4gICAgb3B0aW9ucy5jb21tYW5kcyA9IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdSdWxlJyxcbiAgICAgICAgaWNvbjogJycsXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdhYm92ZScsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHRoaXMuc2NvcGUsIC0xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgICAgICBpY29uOiAnYmVsb3cnLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSBydWxlIGJlbG93IHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlLmFkZFJ1bGUodGhpcy5zY29wZSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICAvLyB7XG4gICAgICAgICAgLy8gICBsYWJlbDogJ2NvcHknLFxuICAgICAgICAgIC8vICAgaWNvbjogJ2NvcHknLFxuICAgICAgICAgIC8vICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyAgICAgdGFibGUuY29weVJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgICAgLy8gICB9LFxuICAgICAgICAgIC8vICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgIC8vICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgIC8vICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgLy8gICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYWJvdmUgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vICAgICAgICAgdGFibGUuY29weVJ1bGUodGhpcy5zY29wZSwgLTEpO1xuICAgICAgICAgIC8vICAgICAgIH1cbiAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgIC8vICAgICAgIGxhYmVsOiAnYmVsb3cnLFxuICAgICAgICAgIC8vICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgLy8gICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYmVsb3cgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vICAgICAgICAgdGFibGUuY29weVJ1bGUodGhpcy5zY29wZSwgMSk7XG4gICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgLy8gICBdXG4gICAgICAgICAgLy8gfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICAgICAgaGludDogJ1JlbW92ZSB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRhYmxlLnJlbW92ZVJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2NsZWFyJyxcbiAgICAgICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgICAgICBoaW50OiAnQ2xlYXIgdGhlIGZvY3VzZWQgcnVsZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0YWJsZS5jbGVhclJ1bGUodGhpcy5zY29wZS5ydWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdO1xuXG4gICAgdmFyIHR5cGUgPSBjZWxsTW9kZWwudHlwZTtcbiAgICB2YXIgYWRkTWV0aG9kID0gdHlwZSA9PT0gJ2lucHV0JyA/ICdhZGRJbnB1dCcgOiAnYWRkT3V0cHV0JztcbiAgICBpZiAodHlwZSAhPT0gJ2lucHV0JyAmJiB0eXBlICE9PSAnb3V0cHV0Jykge1xuICAgICAgdGhpcy5jb250ZXh0TWVudS5vcGVuKG9wdGlvbnMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wdGlvbnMuY29tbWFuZHMudW5zaGlmdCh7XG4gICAgICBsYWJlbDogdHlwZSA9PT0gJ2lucHV0JyA/ICdJbnB1dCcgOiAnT3V0cHV0JyxcbiAgICAgIGljb246IHR5cGUsXG4gICAgICBjbGFzc05hbWU6IHR5cGUsXG4gICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGFibGVbYWRkTWV0aG9kXSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgICBpY29uOiAnbGVmdCcsXG4gICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gJyArIHR5cGUgKyAnIGNsYXVzZSBiZWZvcmUgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgICBpY29uOiAncmlnaHQnLFxuICAgICAgICAgICAgICBoaW50OiAnQWRkIGFuICcgKyB0eXBlICsgJyBjbGF1c2UgYWZ0ZXIgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoZSAnICsgdHlwZSArICcgY2xhdXNlJyxcbiAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsYXVzZSA9IGNlbGxNb2RlbC5jbGF1c2U7XG4gICAgICAgICAgICB2YXIgZGVsdGEgPSBjbGF1c2UuY29sbGVjdGlvbi5pbmRleE9mKGNsYXVzZSk7XG4gICAgICAgICAgICBjbGF1c2UuY29sbGVjdGlvbi5yZW1vdmUoY2xhdXNlKTtcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5jbGF1c2VUeXBlID09PSAnb3V0cHV0Jykge1xuICAgICAgICAgICAgICBkZWx0YSArPSB0YWJsZS5pbnB1dHMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgIHZhciBjZWxsID0gcnVsZS5jZWxscy5hdChkZWx0YSk7XG4gICAgICAgICAgICAgIHJ1bGUuY2VsbHMucmVtb3ZlKGNlbGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0YWJsZS5ydWxlcy50cmlnZ2VyKCdyZXNldCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgdGhpcy5jb250ZXh0TWVudS5vcGVuKG9wdGlvbnMpO1xuICB9LFxuXG5cbiAgcGFyc2VDaG9pY2VzOiBmdW5jdGlvbiAoZWwpIHtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm4gJ01JU1NJTkcnO1xuICAgIH1cbiAgICB2YXIgY29udGVudCA9IGVsLnRleHRDb250ZW50LnRyaW0oKTtcblxuICAgIGlmIChjb250ZW50WzBdID09PSAnKCcgJiYgY29udGVudC5zbGljZSgtMSkgPT09ICcpJykge1xuICAgICAgcmV0dXJuIGNvbnRlbnRcbiAgICAgICAgLnNsaWNlKDEsIC0xKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgcmV0dXJuICEhc3RyO1xuICAgICAgICB9KVxuICAgICAgICA7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9LFxuXG4gIHBhcnNlUnVsZXM6IGZ1bmN0aW9uIChydWxlRWxzKSB7XG4gICAgcmV0dXJuIHJ1bGVFbHMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgcmV0dXJuIGVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB9KTtcbiAgfSxcblxuICBwYXJzZVRhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlucHV0cyA9IFtdO1xuICAgIHZhciBvdXRwdXRzID0gW107XG4gICAgdmFyIHJ1bGVzID0gW107XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0aGVhZCAubGFiZWxzIC5pbnB1dCcpLmZvckVhY2goZnVuY3Rpb24gKGVsLCBudW0pIHtcbiAgICAgIHZhciBjaG9pY2VFbHMgPSB0aGlzLnF1ZXJ5KCd0aGVhZCAudmFsdWVzIC5pbnB1dDpudGgtY2hpbGQoJyArIChudW0gKyAxKSArICcpJyk7XG5cbiAgICAgIGlucHV0cy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICAgIGVsLnRleHRDb250ZW50LnRyaW0oKSxcbiAgICAgICAgY2hvaWNlczogIHRoaXMucGFyc2VDaG9pY2VzKGNob2ljZUVscylcbiAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5xdWVyeUFsbCgndGhlYWQgLmxhYmVscyAub3V0cHV0JykuZm9yRWFjaChmdW5jdGlvbiAoZWwsIG51bSkge1xuICAgICAgdmFyIGNob2ljZUVscyA9IHRoaXMucXVlcnkoJ3RoZWFkIC52YWx1ZXMgLm91dHB1dDpudGgtY2hpbGQoJyArIChudW0gKyBpbnB1dHMubGVuZ3RoICsgMSkgKyAnKScpO1xuXG4gICAgICBvdXRwdXRzLnB1c2goe1xuICAgICAgICBsYWJlbDogICAgZWwudGV4dENvbnRlbnQudHJpbSgpLFxuICAgICAgICBjaG9pY2VzOiAgdGhpcy5wYXJzZUNob2ljZXMoY2hvaWNlRWxzKVxuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0Ym9keSB0cicpLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xuICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICB2YXIgY2VsbEVscyA9IHJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpO1xuXG4gICAgICBmb3IgKHZhciBjID0gMTsgYyA8IGNlbGxFbHMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgdmFyIGNob2ljZXMgPSBudWxsO1xuICAgICAgICB2YXIgdmFsdWUgPSBjZWxsRWxzW2NdLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgdmFyIHR5cGUgPSBjIDw9IGlucHV0cy5sZW5ndGggPyAnaW5wdXQnIDogKGMgPCAoY2VsbEVscy5sZW5ndGggLSAxKSA/ICdvdXRwdXQnIDogJ2Fubm90YXRpb24nKTtcbiAgICAgICAgdmFyIG9jID0gYyAtIChpbnB1dHMubGVuZ3RoICsgMSk7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdpbnB1dCcgJiYgaW5wdXRzW2MgLSAxXSkge1xuICAgICAgICAgIGNob2ljZXMgPSBpbnB1dHNbYyAtIDFdLmNob2ljZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ291dHB1dCcgJiYgb3V0cHV0c1tvY10pIHtcbiAgICAgICAgICBjaG9pY2VzID0gb3V0cHV0c1tvY10uY2hvaWNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxzLnB1c2goe1xuICAgICAgICAgIHZhbHVlOiAgICB2YWx1ZSxcbiAgICAgICAgICBjaG9pY2VzOiAgY2hvaWNlc1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcnVsZXMucHVzaCh7XG4gICAgICAgIGNlbGxzOiBjZWxsc1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm1vZGVsLm5hbWUgPSB0aGlzLnF1ZXJ5KCdoMycpLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB0aGlzLm1vZGVsLmlucHV0cy5yZXNldChpbnB1dHMpO1xuICAgIHRoaXMubW9kZWwub3V0cHV0cy5yZXNldChvdXRwdXRzKTtcbiAgICB0aGlzLm1vZGVsLnJ1bGVzLnJlc2V0KHJ1bGVzKTtcblxuICAgIHJldHVybiB0aGlzLnRvSlNPTigpO1xuICB9LFxuXG4gIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLnRvSlNPTigpO1xuICB9LFxuXG4gIGlucHV0Q2xhdXNlVmlld3M6IFtdLFxuICBvdXRwdXRDbGF1c2VWaWV3czogW10sXG5cbiAgX2hlYWRlckNsZWFyOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHRvQXJyYXkodGhpcy5sYWJlbHNSb3dFbC5xdWVyeVNlbGVjdG9yQWxsKCcuJysgdHlwZSkpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLmxhYmVsc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRvQXJyYXkodGhpcy52YWx1ZXNSb3dFbC5xdWVyeVNlbGVjdG9yQWxsKCcuJysgdHlwZSkpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLnZhbHVlc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRvQXJyYXkodGhpcy5tYXBwaW5nc1Jvd0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nKyB0eXBlKSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHRoaXMubWFwcGluZ3NSb3dFbC5yZW1vdmVDaGlsZChlbCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbCkge1xuICAgICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnBhcnNlVGFibGUoKTtcbiAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlOmVsJyk7XG4gICAgfVxuXG4gICAgdmFyIHRhYmxlID0gdGhpcy5tb2RlbDtcblxuICAgIGlmICghdGhpcy5oZWFkZXJFbCkge1xuICAgICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgICAgdGFibGVFbDogICAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgdGFibGVOYW1lRWw6ICAgICAgJ2hlYWRlciBoMycsXG4gICAgICAgIGhlYWRlckVsOiAgICAgICAgICd0aGVhZCcsXG4gICAgICAgIGJvZHlFbDogICAgICAgICAgICd0Ym9keScsXG4gICAgICAgIGlucHV0c0hlYWRlckVsOiAgICd0aGVhZCB0cjpudGgtY2hpbGQoMSkgdGguaW5wdXQnLFxuICAgICAgICBvdXRwdXRzSGVhZGVyRWw6ICAndGhlYWQgdHI6bnRoLWNoaWxkKDEpIHRoLm91dHB1dCcsXG4gICAgICAgIGxhYmVsc1Jvd0VsOiAgICAgICd0aGVhZCB0ci5sYWJlbHMnLFxuICAgICAgICB2YWx1ZXNSb3dFbDogICAgICAndGhlYWQgdHIudmFsdWVzJyxcbiAgICAgICAgbWFwcGluZ3NSb3dFbDogICAgJ3RoZWFkIHRyLm1hcHBpbmdzJ1xuICAgICAgfSk7XG5cblxuICAgICAgdGhpcy5pbnB1dHNIZWFkZXJFbC5hcHBlbmRDaGlsZChtYWtlQWRkQnV0dG9uKCdpbnB1dCcsIHRhYmxlKSk7XG4gICAgICB0aGlzLm91dHB1dHNIZWFkZXJFbC5hcHBlbmRDaGlsZChtYWtlQWRkQnV0dG9uKCdvdXRwdXQnLCB0YWJsZSkpO1xuICAgIH1cblxuXG4gICAgWydpbnB1dCcsICdvdXRwdXQnXS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWxbdHlwZSArICdzJ10sICdhZGQgcmVzZXQgcmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBjb2xzID0gdGhpcy5tb2RlbFt0eXBlICsgJ3MnXS5sZW5ndGg7XG4gICAgICAgIGlmIChjb2xzID4gMSkge1xuICAgICAgICAgIHRoaXNbdHlwZSArICdzSGVhZGVyRWwnXS5zZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nLCBjb2xzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzW3R5cGUgKyAnc0hlYWRlckVsJ10ucmVtb3ZlQXR0cmlidXRlKCdjb2xzcGFuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oZWFkZXJDbGVhcih0eXBlKTtcbiAgICAgICAgdGhpc1t0eXBlICsgJ0NsYXVzZVZpZXdzJ10uZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubW9kZWxbdHlwZSArICdzJ10uZm9yRWFjaChmdW5jdGlvbiAoY2xhdXNlKSB7XG4gICAgICAgICAgdmFyIGxhYmVsRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIHZhbHVlRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIG1hcHBpbmdFbCA9IG1ha2VUZCh0eXBlKTtcblxuICAgICAgICAgIHZhciB2aWV3ID0gbmV3IENsYXVzZUhlYWRlclZpZXcoe1xuICAgICAgICAgICAgbGFiZWxFbDogICAgbGFiZWxFbCxcbiAgICAgICAgICAgIHZhbHVlRWw6ICAgIHZhbHVlRWwsXG4gICAgICAgICAgICBtYXBwaW5nRWw6ICBtYXBwaW5nRWwsXG5cbiAgICAgICAgICAgIG1vZGVsOiAgICAgIGNsYXVzZSxcbiAgICAgICAgICAgIHBhcmVudDogICAgIHRoaXNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFsnbGFiZWwnLCAndmFsdWUnLCAnbWFwcGluZyddLmZvckVhY2goZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICAgIHRoaXNba2luZCArJ3NSb3dFbCddLmluc2VydEJlZm9yZSh2aWV3W2tpbmQgKyAnRWwnXSwgdGhpc1traW5kICsnc1Jvd0VsJ10ucXVlcnlTZWxlY3RvcignLm91dHB1dCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzW2tpbmQgKydzUm93RWwnXS5hcHBlbmRDaGlsZCh2aWV3W2tpbmQgKyAnRWwnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcblxuICAgICAgICAgIHRoaXNbdHlwZSArICdDbGF1c2VWaWV3cyddLnB1c2godmlldyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cblxuICAgIHRoaXMuYm9keUVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMucnVsZXNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMubW9kZWwucnVsZXMsIFJ1bGVWaWV3LCB0aGlzLmJvZHlFbCk7XG5cbiAgICBpZiAoIXRoaXMuZm9vdFZpZXcpIHtcbiAgICAgIHZhciBmb290RWwgPSB0aGlzLnF1ZXJ5KCd0Zm9vdCcpO1xuICAgICAgaWYgKGZvb3RFbCkgeyBmb290RWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmb290RWwpOyB9XG5cbiAgICAgIHRoaXMuZm9vdFZpZXcgPSBuZXcgRm9vdFZpZXcoe1xuICAgICAgICBtb2RlbDogdGhpcy5tb2RlbFxuICAgICAgfSk7XG4gICAgICB0aGlzLnRhYmxlRWwuYXBwZW5kQ2hpbGQodGhpcy5mb290Vmlldy5lbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlY2lzaW9uVGFibGVWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlICovXG5cbnZhciBEZWNpc2lvblRhYmxlVmlldyA9IHJlcXVpcmUoJy4vZGVjaXNpb24tdGFibGUtdmlldycpO1xucmVxdWlyZSgnLi9jb250ZXh0bWVudS12aWV3Jyk7XG5yZXF1aXJlKCcuL2NsYXVzZXZhbHVlcy1zZXR0ZXItdmlldycpO1xucmVxdWlyZSgnLi9jbGF1c2VleHByZXNzaW9uLXNldHRlci12aWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVjaXNpb25UYWJsZVZpZXc7XG5cbmZ1bmN0aW9uIG5vZGVMaXN0YXJyYXkoZWxzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGVscykpIHtcbiAgICByZXR1cm4gZWxzO1xuICB9XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBhcnIucHVzaChlbHNbaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEFsbChzZWxlY3RvciwgY3R4KSB7XG4gIGN0eCA9IGN0eCB8fCBkb2N1bWVudDtcbiAgcmV0dXJuIG5vZGVMaXN0YXJyYXkoY3R4LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbn1cbndpbmRvdy5zZWxlY3RBbGwgPSBzZWxlY3RBbGw7XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSovXG5cbnZhciBDbGF1c2UgPSByZXF1aXJlKCcuL2NsYXVzZS1kYXRhJyk7XG5cbnZhciBJbnB1dE1vZGVsID0gQ2xhdXNlLk1vZGVsLmV4dGVuZCh7XG4gIGNsYXVzZVR5cGU6ICdpbnB1dCcsXG5cbiAgZGVyaXZlZDoge1xuICAgIHg6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2NvbGxlY3Rpb24nXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmb2N1c2VkOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnggPT09IHRoaXMueDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IElucHV0TW9kZWwsXG4gIENvbGxlY3Rpb246IENsYXVzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IElucHV0TW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSovXG5cbnZhciBDbGF1c2UgPSByZXF1aXJlKCcuL2NsYXVzZS1kYXRhJyk7XG5cbnZhciBPdXRwdXRNb2RlbCA9IENsYXVzZS5Nb2RlbC5leHRlbmQoe1xuICBjbGF1c2VUeXBlOiAnb3V0cHV0JyxcblxuICBkZXJpdmVkOiB7XG4gICAgeDoge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudCcsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudC5pbnB1dHMnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpICsgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5pbnB1dHMubGVuZ3RoO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmb2N1c2VkOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50JyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50LmlucHV0cydcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGFibGUgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgICByZXR1cm4gdGFibGUueCA9PT0gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcykgKyB0YWJsZS5pbnB1dHMubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogT3V0cHV0TW9kZWwsXG4gIENvbGxlY3Rpb246IENsYXVzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IE91dHB1dE1vZGVsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogdHJ1ZSwgcmVxdWlyZTogZmFsc2UqL1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHsgdmFyIGRlcHMgPSByZXF1aXJlOyB9XG5lbHNlIHsgdmFyIGRlcHMgPSB3aW5kb3cuZGVwczsgfVxuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcbnZhciBDZWxsID0gcmVxdWlyZSgnLi9jZWxsLWRhdGEnKTtcblxudmFyIFJ1bGVNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgY2VsbHM6IENlbGwuQ29sbGVjdGlvblxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICB0YWJsZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudCdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZm9jdXNlZDoge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZSdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcykgPT09IHRoaXMudGFibGUueTtcbiAgICAgIH1cbiAgICB9LFxuXG5cbiAgICBkZWx0YToge1xuICAgICAgZGVwczogWydjb2xsZWN0aW9uJ10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gMSArIHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbnB1dENlbGxzOiB7XG4gICAgICBkZXBzOiBbJ2NlbGxzJywgJ3RhYmxlLmlucHV0cyddLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMubW9kZWxzLnNsaWNlKDAsIHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG91dHB1dENlbGxzOiB7XG4gICAgICBkZXBzOiBbJ2NlbGxzJywgJ3RhYmxlLmlucHV0cyddLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMubW9kZWxzLnNsaWNlKHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aCwgLTEpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBhbm5vdGF0aW9uOiB7XG4gICAgICBkZXBzOiBbJ2NlbGxzJ10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHNbdGhpcy5jZWxscy5sZW5ndGggLSAxXTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZW5zdXJlQ2VsbHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aCArIHRoaXMudGFibGUub3V0cHV0cy5sZW5ndGggKyAxO1xuXG4gICAgLy8gZmluZVxuICAgIGlmICh0aGlzLmNlbGxzLmxlbmd0aCA9PT0gYyB8fCBjID09PSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gbmVlZHMgdG8gYmUgZmlsbGVkXG4gICAgaWYgKHRoaXMuY2VsbHMubGVuZ3RoIDwgYykge1xuICAgICAgd2hpbGUgKHRoaXMuY2VsbHMubGVuZ3RoIDw9IGMpIHtcbiAgICAgICAgdGhpcy5jZWxscy5hZGQoe3ZhbHVlOicnfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbmVlZHMgdG8gYmUgdHJ1bmNhdGVkXG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmNlbGxzLm1vZGVscyA9IHRoaXMuY2VsbHMubW9kZWxzLnNsaWNlKDAsIGMpO1xuICAgIH1cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnRhYmxlLmlucHV0cywgJ3Jlc2V0JywgdGhpcy5lbnN1cmVDZWxscyk7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLnRhYmxlLm91dHB1dHMsICdyZXNldCcsIHRoaXMuZW5zdXJlQ2VsbHMpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBSdWxlTW9kZWwsXG5cbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBSdWxlTW9kZWwsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgQ2VsbFZpZXdzID0gcmVxdWlyZSgnLi9jZWxsLXZpZXcnKTtcbnZhciBtZXJnZSA9IGRlcHMoJ2xvZGFzaC5tZXJnZScpO1xudmFyIGNvbnRleHRWaWV3c01peGluID0gcmVxdWlyZSgnLi9jb250ZXh0LXZpZXdzLW1peGluJyk7XG5cbnZhciBSdWxlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8dHI+PHRkIGNsYXNzPVwibnVtYmVyXCI+PC90ZD48L3RyPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuZGVsdGEnOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJy5udW1iZXInXG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IG1lcmdlKHt9LCBjb250ZXh0Vmlld3NNaXhpbiwge1xuICAgIGlucHV0czoge1xuICAgICAgZGVwczogW1xuICAgICAgICAncGFyZW50JyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwuaW5wdXRzJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5tb2RlbC5pbnB1dHM7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG91dHB1dHM6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3BhcmVudCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwnLFxuICAgICAgICAncGFyZW50Lm1vZGVsLm91dHB1dHMnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm1vZGVsLm91dHB1dHM7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFubm90YXRpb246IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3BhcmVudCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwnLFxuICAgICAgICAncGFyZW50Lm1vZGVsLmFubm90YXRpb25zJ1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5tb2RlbC5hbm5vdGF0aW9ucy5hdCgwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pLFxuXG4gIGV2ZW50czoge1xuICAgICdjb250ZXh0bWVudSAubnVtYmVyJzogJ19oYW5kbGVSb3dDb250ZXh0TWVudSdcbiAgfSxcblxuICBfaGFuZGxlUm93Q29udGV4dE1lbnU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgcnVsZSA9IHRoaXMubW9kZWw7XG4gICAgdmFyIHRhYmxlID0gcnVsZS5jb2xsZWN0aW9uLnBhcmVudDtcblxuICAgIHRoaXMuY29udGV4dE1lbnUub3Blbih7XG4gICAgICBwYXJlbnQ6ICAgdGhpcyxcbiAgICAgIGxlZnQ6ICAgICBldnQucGFnZVgsXG4gICAgICB0b3A6ICAgICAgZXZ0LnBhZ2VZLFxuICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnUnVsZScsXG4gICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZShydWxlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZShydWxlLCAtMSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZShydWxlLCAxKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgIGxhYmVsOiAnY29weScsXG4gICAgICAgICAgICAvLyAgIGljb246ICdjb3B5JyxcbiAgICAgICAgICAgIC8vICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICB0YWJsZS5jb3B5UnVsZShydWxlKTtcbiAgICAgICAgICAgIC8vICAgfSxcbiAgICAgICAgICAgIC8vICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAvLyAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAgIC8vICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgICAvLyAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdGFibGUuY29weVJ1bGUocnVsZSwgLTEpO1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgLy8gICAgICAgbGFiZWw6ICdiZWxvdycsXG4gICAgICAgICAgICAvLyAgICAgICBpY29uOiAnYmVsb3cnLFxuICAgICAgICAgICAgLy8gICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYmVsb3cgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIHRhYmxlLmNvcHlSdWxlKHJ1bGUsIDEpO1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgXVxuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoaXMgcnVsZScsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVsZS5jb2xsZWN0aW9uLnJlbW92ZShydWxlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5jbGVhclJ1bGUocnVsZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcblxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuXG4gIHNldEZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKHRoaXMubW9kZWwuZm9jdXNlZCkge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdyb3ctZm9jdXNlZCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgncm93LWZvY3VzZWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWwudGFibGU7XG5cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRhYmxlLCAnY2hhbmdlOmZvY3VzJywgdGhpcy5zZXRGb2N1cyk7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0YWJsZS5pbnB1dHMsICdhZGQgcmVtb3ZlIHJlc2V0JywgdGhpcy5yZW5kZXIpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGFibGUub3V0cHV0cywgJ2FkZCByZW1vdmUgcmVzZXQnLCB0aGlzLnJlbmRlcik7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcblxuICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICBudW1iZXJFbDogJy5udW1iZXInXG4gICAgfSk7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgc3VidmlldztcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgc3VidmlldyA9IG5ldyBDZWxsVmlld3MuSW5wdXQoe1xuICAgICAgICBtb2RlbDogIHRoaXMubW9kZWwuY2VsbHMuYXQoaSksXG4gICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZChzdWJ2aWV3LmVsKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5vdXRwdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdWJ2aWV3ID0gbmV3IENlbGxWaWV3cy5PdXRwdXQoe1xuICAgICAgICBtb2RlbDogIHRoaXMubW9kZWwuY2VsbHMuYXQodGhpcy5pbnB1dHMubGVuZ3RoICsgaSksXG4gICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZChzdWJ2aWV3LmVsKTtcbiAgICB9XG4gICAgc3VidmlldyA9IG5ldyBDZWxsVmlld3MuQW5ub3RhdGlvbih7XG4gICAgICBtb2RlbDogIHRoaXMubW9kZWwuYW5ub3RhdGlvbixcbiAgICAgIHBhcmVudDogdGhpc1xuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoc3Vidmlldy5lbCk7XG5cblxuICAgIHRoaXMuc2V0Rm9jdXMoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUnVsZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG5cblxuXG52YXIgU3VnZ2VzdGlvbnNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnLFxuICAgICAgaHRtbDogJ3N0cmluZydcbiAgICB9XG4gIH0pXG59KTtcblxuXG5cbnZhciBTdWdnZXN0aW9uc0l0ZW1WaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzxsaT48L2xpPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaHRtbCc6IHtcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAnX2hhbmRsZUNsaWNrJ1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIXRoaXMucGFyZW50LnBhcmVudCkgeyByZXR1cm47IH1cbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5wYXJlbnQucGFyZW50O1xuICAgIFxuICAgIGlmICh0YXJnZXQubW9kZWwgJiYgdHlwZW9mIHRhcmdldC5tb2RlbC52YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRhcmdldC5tb2RlbC52YWx1ZSA9IHRoaXMubW9kZWwudmFsdWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRhcmdldC5lbCkge1xuICAgICAgdGFyZ2V0LmVsLnRleHRDb250ZW50ID0gdGhpcy5tb2RlbC52YWx1ZTtcbiAgICB9XG4gIH1cbn0pO1xuXG5cblxudmFyIFN1Z2dlc3Rpb25zVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgc2Vzc2lvbjoge1xuICAgIHZpc2libGU6ICdib29sZWFuJ1xuICB9LFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgdmlzaWJsZToge1xuICAgICAgdHlwZTogJ3RvZ2dsZSdcbiAgICB9XG4gIH0sXG5cbiAgdGVtcGxhdGU6ICc8dWwgY2xhc3M9XCJkbW4tc3VnZ2VzdGlvbnMtaGVscGVyXCI+PC91bD4nLFxuXG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgc3VnZ2VzdGlvbnM6IFN1Z2dlc3Rpb25zQ29sbGVjdGlvblxuICB9LFxuXG4gIHNldFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnBhcmVudCB8fCAhdGhpcy5wYXJlbnQuZWwpIHtcbiAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBub2RlID0gdGhpcy5wYXJlbnQuZWw7XG4gICAgdmFyIHRvcCA9IG5vZGUub2Zmc2V0VG9wO1xuICAgIHZhciBsZWZ0ID0gbm9kZS5vZmZzZXRMZWZ0O1xuICAgIHZhciBoZWxwZXIgPSB0aGlzLmVsO1xuXG4gICAgd2hpbGUgKChub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQpKSB7XG4gICAgICBpZiAobm9kZS5vZmZzZXRUb3ApIHtcbiAgICAgICAgdG9wICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0VG9wLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5vZmZzZXRMZWZ0KSB7XG4gICAgICAgIGxlZnQgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRMZWZ0LCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9wIC09IGhlbHBlci5jbGllbnRIZWlnaHQ7XG4gICAgaGVscGVyLnN0eWxlLnRvcCA9IHRvcDtcbiAgICBoZWxwZXIuc3R5bGUubGVmdCA9IGxlZnQ7XG4gIH0sXG5cbiAgc2hvdzogZnVuY3Rpb24gKHN1Z2dlc3Rpb25zLCBwYXJlbnQsIGZvcmNlKSB7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKHN1Z2dlc3Rpb25zKSB7XG4gICAgICBpZiAoc3VnZ2VzdGlvbnMuaXNDb2xsZWN0aW9uKSB7XG4gICAgICAgIGluc3RhbmNlLnN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnM7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2Uuc3VnZ2VzdGlvbnMucmVzZXQoc3VnZ2VzdGlvbnMpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpbnN0YW5jZS52aXNpYmxlID0gZm9yY2UgfHwgc3VnZ2VzdGlvbnMubGVuZ3RoID4gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpbnN0YW5jZS52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGluc3RhbmNlLnZpc2libGUpIHtcbiAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hvdyhbXSwgdGhpcy5wYXJlbnQpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuc3VnZ2VzdGlvbnMsIFN1Z2dlc3Rpb25zSXRlbVZpZXcsIHRoaXMuZWwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuXG5cbnZhciBpbnN0YW5jZTtcblN1Z2dlc3Rpb25zVmlldy5pbnN0YW5jZSA9IGZ1bmN0aW9uIChzdWdnZXN0aW9ucywgcGFyZW50KSB7XG4gIGlmICghaW5zdGFuY2UpIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBTdWdnZXN0aW9uc1ZpZXcoe30pO1xuICAgIGluc3RhbmNlLnJlbmRlcigpO1xuICB9XG5cbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGluc3RhbmNlLmVsKSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zdGFuY2UuZWwpO1xuICB9XG5cbiAgaW5zdGFuY2Uuc2hvdyhzdWdnZXN0aW9ucywgcGFyZW50KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59O1xuXG5cblN1Z2dlc3Rpb25zVmlldy5Db2xsZWN0aW9uID0gU3VnZ2VzdGlvbnNDb2xsZWN0aW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1Z2dlc3Rpb25zVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IHRydWUsIHJlcXVpcmU6IGZhbHNlLCBjb25zb2xlOiBmYWxzZSovXG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgeyB2YXIgZGVwcyA9IHJlcXVpcmU7IH1cbmVsc2UgeyB2YXIgZGVwcyA9IHdpbmRvdy5kZXBzOyB9XG5cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0LWRhdGEnKTtcbnZhciBPdXRwdXQgPSByZXF1aXJlKCcuL291dHB1dC1kYXRhJyk7XG5cbnZhciBSdWxlID0gcmVxdWlyZSgnLi9ydWxlLWRhdGEnKTtcblxudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnbG9kYXNoLmRlZmF1bHRzJyk7XG5cbnZhciBEZWNpc2lvblRhYmxlTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICBjb2xsZWN0aW9uczoge1xuICAgIGlucHV0czogICBJbnB1dC5Db2xsZWN0aW9uLFxuICAgIG91dHB1dHM6ICBPdXRwdXQuQ29sbGVjdGlvbixcbiAgICBydWxlczogICAgUnVsZS5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBuYW1lOiAnc3RyaW5nJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICB4OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9LFxuXG4gICAgeToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfSxcblxuXG4gICAgbG9nTGV2ZWw6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH1cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRhYmxlID0gdGhpcztcbiAgICBbXG4gICAgICAnaW5wdXRzJyxcbiAgICAgICdvdXRwdXRzJyxcbiAgICAgICdydWxlcydcbiAgICBdLmZvckVhY2goZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gICAgICBbXG4gICAgICAgICdhZGQnLFxuICAgICAgICAncmVtb3ZlJyxcbiAgICAgICAgJ3NvcnQnLFxuICAgICAgICAncmVzZXQnXG4gICAgICBdLmZvckVhY2goZnVuY3Rpb24gKGV2dE5hbWUpIHtcbiAgICAgICAgdGFibGUubGlzdGVuVG8odGFibGVbY29sbGVjdGlvbk5hbWVdLCBldnROYW1lLCBmdW5jdGlvbiAoYXJnMSwgYXJnMiwgYXJnMykge1xuICAgICAgICAgIHRhYmxlLnRyaWdnZXIoY29sbGVjdGlvbk5hbWUgKyAnOicgKyBldnROYW1lLCBhcmcxLCBhcmcyLCBhcmczKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5pbnB1dHMsICdyZW1vdmUgcmVzZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pbnB1dHMubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgICAgdGhpcy5pbnB1dHMuYWRkKHt9KTtcbiAgICB9KTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5vdXRwdXRzLCAncmVtb3ZlIHJlc2V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMub3V0cHV0cy5sZW5ndGgpIHsgcmV0dXJuOyB9XG4gICAgICB0aGlzLm91dHB1dHMuYWRkKHt9KTtcbiAgICB9KTtcbiAgfSxcblxuICBsb2c6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO1xuICAgIHZhciBtZXRob2QgPSBhcmdzLnNoaWZ0KCk7XG4gICAgYXJncy51bnNoaWZ0KHRoaXMuY2lkKTtcbiAgICBjb25zb2xlW21ldGhvZF0uYXBwbHkoY29uc29sZSwgYXJncyk7XG4gIH0sXG5cbiAgX3J1bGVDbGlwYm9hcmQ6IG51bGwsXG5cblxuICBhZGRSdWxlOiBmdW5jdGlvbiAoc2NvcGVDZWxsLCBiZWZvcmVBZnRlcikge1xuICAgIHZhciBjZWxscyA9IFtdO1xuICAgIHZhciBjO1xuXG4gICAgZm9yIChjID0gMDsgYyA8IHRoaXMuaW5wdXRzLmxlbmd0aDsgYysrKSB7XG4gICAgICBjZWxscy5wdXNoKHtcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAvLyBjaG9pY2VzOiB0aGlzLmlucHV0cy5hdChjKS5jaG9pY2VzLFxuICAgICAgICBmb2N1c2VkOiBjID09PSAwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKGMgPSAwOyBjIDwgdGhpcy5vdXRwdXRzLmxlbmd0aDsgYysrKSB7XG4gICAgICBjZWxscy5wdXNoKHtcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAvLyBjaG9pY2VzOiB0aGlzLm91dHB1dHMuYXQoYykuY2hvaWNlc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2VsbHMucHVzaCh7XG4gICAgICB2YWx1ZTogJydcbiAgICB9KTtcblxuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgaWYgKGJlZm9yZUFmdGVyKSB7XG4gICAgICB2YXIgcnVsZURlbHRhID0gdGhpcy5ydWxlcy5pbmRleE9mKHNjb3BlQ2VsbC5jb2xsZWN0aW9uLnBhcmVudCk7XG4gICAgICBvcHRpb25zLmF0ID0gcnVsZURlbHRhICsgKGJlZm9yZUFmdGVyID4gMCA/IHJ1bGVEZWx0YSA6IChydWxlRGVsdGEgLSAxKSk7XG4gICAgfVxuXG4gICAgdGhpcy5ydWxlcy5hZGQoe1xuICAgICAgY2VsbHM6IGNlbGxzXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW1vdmVSdWxlOiBmdW5jdGlvbiAoc2NvcGVDZWxsKSB7XG4gICAgdGhpcy5ydWxlcy5yZW1vdmUoc2NvcGVDZWxsLmNvbGxlY3Rpb24ucGFyZW50KTtcbiAgICB0aGlzLnJ1bGVzLnRyaWdnZXIoJ3Jlc2V0Jyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICBjb3B5UnVsZTogZnVuY3Rpb24gKHNjb3BlQ2VsbCwgdXBEb3duKSB7XG4gICAgdmFyIHJ1bGUgPSBzY29wZUNlbGwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgaWYgKCFydWxlKSB7IHJldHVybiB0aGlzOyB9XG4gICAgdGhpcy5fcnVsZUNsaXBib2FyZCA9IHJ1bGU7XG5cbiAgICBpZiAodXBEb3duKSB7XG4gICAgICB2YXIgcnVsZURlbHRhID0gdGhpcy5ydWxlcy5pbmRleE9mKHJ1bGUpO1xuICAgICAgdGhpcy5wYXN0ZVJ1bGUocnVsZURlbHRhICsgKHVwRG93biA+IDEgPyAwIDogMSkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgcGFzdGVSdWxlOiBmdW5jdGlvbiAoZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuX3J1bGVDbGlwYm9hcmQpIHsgcmV0dXJuIHRoaXM7IH1cbiAgICB2YXIgZGF0YSA9IHRoaXMuX3J1bGVDbGlwYm9hcmQudG9KU09OKCk7XG4gICAgdGhpcy5ydWxlcy5hZGQoZGF0YSwge1xuICAgICAgYXQ6IGRlbHRhXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICBjbGVhclJ1bGU6IGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcnVsZS5jZWxscy5mb3JFYWNoKGZ1bmN0aW9uIChjZWxsKSB7XG4gICAgICBjZWxsLnZhbHVlID0gJyc7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICBfcnVsZXNDZWxsczogZnVuY3Rpb24gKGFkZGVkLCBkZWx0YSkge1xuICAgIHRoaXMucnVsZXMuZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgcnVsZS5jZWxscy5hZGQoe1xuICAgICAgICAvLyBjaG9pY2VzOiBhZGRlZC5jaG9pY2VzXG4gICAgICB9LCB7XG4gICAgICAgIGF0OiBkZWx0YSxcbiAgICAgICAgc2lsZW50OiB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucnVsZXMudHJpZ2dlcigncmVzZXQnKTtcbiAgfSxcblxuICBhZGRJbnB1dDogZnVuY3Rpb24gKGRhdGEsIHBvc2l0aW9uKSB7XG4gICAgdmFyIGRlbHRhID0gdHlwZW9mIHBvc2l0aW9uICE9PSAndW5kZWZpbmVkJyA/IHBvc2l0aW9uIDogdGhpcy5pbnB1dHMubGVuZ3RoO1xuICAgIGRlbHRhID0gZGVsdGEgPCAwID8gMCA6IGRlbHRhO1xuXG4gICAgdmFyIGlucHV0ID0ge307XG4gICAgZGVmYXVsdHMoaW5wdXQsIGRhdGEsIHtcbiAgICAgIGxhYmVsOiAgICBudWxsLFxuICAgICAgY2hvaWNlczogIG51bGwsXG4gICAgICBtYXBwaW5nOiAgbnVsbCxcbiAgICAgIGRhdGF0eXBlOiAnc3RyaW5nJ1xuICAgIH0pO1xuXG4gICAgdmFyIG5ld01vZGVsID0gdGhpcy5pbnB1dHMuYWRkKGlucHV0LCB7XG4gICAgICBhdDogZGVsdGFcbiAgICB9KTtcblxuICAgIHRoaXMuX3J1bGVzQ2VsbHMobmV3TW9kZWwsIG5ld01vZGVsLmNvbGxlY3Rpb24uaW5kZXhPZihuZXdNb2RlbCkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVtb3ZlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG5cbiAgYWRkT3V0cHV0OiBmdW5jdGlvbiAoZGF0YSwgcG9zaXRpb24pIHtcbiAgICB2YXIgZGVsdGEgPSB0eXBlb2YgcG9zaXRpb24gIT09ICd1bmRlZmluZWQnID8gcG9zaXRpb24gOiB0aGlzLm91dHB1dHMubGVuZ3RoO1xuICAgIGRlbHRhID0gZGVsdGEgPCAwID8gMCA6IGRlbHRhO1xuXG4gICAgdmFyIG91dHB1dCA9IHt9O1xuICAgIGRlZmF1bHRzKG91dHB1dCwgZGF0YSwge1xuICAgICAgbGFiZWw6ICAgIG51bGwsXG4gICAgICBjaG9pY2VzOiAgbnVsbCxcbiAgICAgIG1hcHBpbmc6ICBudWxsLFxuICAgICAgZGF0YXR5cGU6ICdzdHJpbmcnXG4gICAgfSk7XG5cbiAgICB2YXIgbmV3TW9kZWwgPSB0aGlzLm91dHB1dHMuYWRkKG91dHB1dCwge1xuICAgICAgYXQ6IGRlbHRhXG4gICAgfSk7XG5cbiAgICB0aGlzLl9ydWxlc0NlbGxzKG5ld01vZGVsLCBuZXdNb2RlbC5jb2xsZWN0aW9uLmluZGV4T2YobmV3TW9kZWwpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZU91dHB1dDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5EZWNpc2lvblRhYmxlTW9kZWwgPSBEZWNpc2lvblRhYmxlTW9kZWw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogRGVjaXNpb25UYWJsZU1vZGVsXG59O1xuIl19
