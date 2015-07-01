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
        if (!this.clause) { return; }
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
var contextViewsMixin = require('./context-views-mixin');


var ChoiceView = require('./choice-view');
var RuleCellView = View.extend(merge({}, ChoiceView.prototype, {
  template: '<td></td>',

  bindings: merge({}, ChoiceView.prototype.bindings, {
    'model.value': {
      type: 'text'
    },

    'model.editable': {
      type: 'booleanAttribute',
      name: 'contenteditable'
    },

    'model.spellchecked': {
      type: 'booleanAttribute',
      name: 'spellcheck'
    },

    'model.type': {
      type: 'class'
    }
  }),

  events: merge({}, ChoiceView.prototype.events, {
    'contextmenu':  '_handleContextMenu',
    'click':        '_handleClick'
  }),

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

},{"./choice-view":15,"./context-views-mixin":22}],15:[function(require,module,exports){
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
    focus: '_handleFocus'
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
    var filtered = choices
          .filter(function (choice) {
            return choice.value.indexOf(val) === 0;
          })
          .map(function (choice) {
            var chars = this.el.textContent.length;
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
    var val = this.el.textContent;

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
      this.el.textContent = matching;
    }
  }
});

module.exports = ChoiceView;

},{"./suggestions-view":30}],16:[function(require,module,exports){
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
    mapping:  'string',
    datatype: {type: 'string', default: 'string'}
  },

  session: {
    editable: {
      type: 'boolean',
      default: true
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


var LabelView = View.extend(merge({
  events: {
    'focus':        '_handleFocus',
    'input':        '_handleInput',
    'contextmenu':  '_handleContextMenu',
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
        if (document.activeElement === el) { return; }
        el.textContent = (val || '').trim();
      }
    }
  },


  _handleFocus: function () {
    this.table.x = this.model.x;
    this.table.trigger('change:focus');
  },

  _handleInput: function () {
    this.model.label = this.el.textContent.trim();
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
    this.el.setAttribute('contenteditable', true);
    this.el.textContent = (this.model.label || '').trim();
  }
}));


module.exports = LabelView;

},{"./context-views-mixin":22}],18:[function(require,module,exports){
'use strict';
/* global module: false, deps: false */

var View = deps('ampersand-view');
var merge = deps('lodash.merge');



var MappingView = View.extend(merge({
  events: {
    'input': '_handleInput',
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

  initialize: function () {
    this.el.setAttribute('contenteditable', true);
    this.el.textContent = (this.model.mapping || '').trim();
  }
}));

module.exports = MappingView;

},{}],19:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var merge = deps('lodash.merge');
var contextViewsMixin = require('./context-views-mixin');

var ValueView = View.extend(merge({
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

},{"./context-views-mixin":22}],20:[function(require,module,exports){
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
/* global module: false, deps: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');




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
  template: '<li><input tabindex="1" /></li>',

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
    'keyup input':    '_handleValueKeyup'
  },

  _handleValueChange: function (evt) {
    if (this.model.value !== evt.target.value) {
      this.model.value = evt.target.value;
    }

    this.validate();
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
      value: 'string'
    }
  })
});

var DatatypeOptionView = View.extend({
  template: '<option></option>',

  bindings: {
    'model.value': [
      {
        type: 'text'
      },
      {
        type: 'attribute',
        name: 'value'
      }
    ]
  }
});







var primitiveTypes = [
  'string',
  'date',

  // https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html
  'short',
  'int',
  'long',
  'float',
  'double',
  'boolean'
].map(function (val) {
  return { value: val };
});

var ClauseValuesView = View.extend({
  template: '<div class="dmn-clausevalues-setter">' +
              '<div class="datatype">' +
                '<label>Data type:</label>' +
                '<select></select>' +
              '</div>' +
              '<div class="allowed-values">' +
                '<label>Allowed values:</label>' +
                '<ul></ul>' +
              '</div>' +
            '</div>',

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
        var current = this.parent;
        while ((current = this.parent)) {
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
    }
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
                                  }).map(function (item) {
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
    top -= 40;
    helper.style.top = top;
    helper.style.left = left;
  },

  show: function (datatype, values, parent) {
    if (parent && this.parent !== parent) {
      this.parent = parent;
    }

    this.datatypes.reset(primitiveTypes);
    this.datatypeEl.value = datatype;

    values = values || [];
    var vals = Array.isArray(values) ? values.map(function (val) { return {value: val}; }) : values.toJSON();
    vals = vals.filter(function (item) { return item.value; });
    vals.push({ value: '' });

    this.possibleValues.reset(vals);

    instance.visible = true;
    if (this.parent && this.parent.contextMenu) {
      this.parent.contextMenu.close();
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
      datatypeEl: 'select',
      valuesEl: 'ul'
    });

    this.query('.datatype label').setAttribute('for', this.cid + '-datatype');
    this.datatypeEl.setAttribute('id', this.cid + '-datatype');

    this.renderCollection(this.datatypes, DatatypeOptionView, this.datatypeEl);
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
  window.dmnClauseValuedEditor = ClauseValuesView.instance();
}

ClauseValuesView.Collection = ValuesCollection;

module.exports = ClauseValuesView;

},{}],22:[function(require,module,exports){
'use strict';
/*global module: false*/
module.exports = {
  clauseValuesEditor: {
    cache: false,
    fn: function () {
      var current = this;
      while ((current = current.parent)) {
        if (current.clauseValuesEditor) {
          return current.clauseValuesEditor;
        }
      }
    }
  },
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
};

},{}],23:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');


var defaultCommands = [
  // {
  //   label: 'Actions',
  //   subcommands: [
  //     {
  //       label: 'undo',
  //       icon: 'undo',
  //       fn: function () {}
  //     },
  //     {
  //       label: 'redo',
  //       icon: 'redo',
  //       fn: function () {}
  //     }
  //   ]
  // },
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
    label: 'string',
    hint: 'string',
    icon: 'string',
    href: 'string',

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
    if (options.parent && options.parent.clauseValuesEditor) {
      options.parent.clauseValuesEditor.hide();
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

},{}],24:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false, console: false */

var View = deps('ampersand-view');
var DecisionTable = require('./table-data');
var RuleView = require('./rule-view');




var ClauseHeaderView = require('./clause-view');
/*
var ContextMenuView = require('./contextmenu-view');
var contextMenu = ContextMenuView.instance();

var ValuesSetterView = require('./clausevalues-setter-view');
var valuesView = ValuesSetterView.instance();
*/

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
    contextMenu:        'state',
    clauseValuesEditor: 'state',

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
    'click .add-rule a': '_handleAddRuleClick',
    'input header h3':   '_handleNameInput'
  },

  _handleAddRuleClick: function () {
    this.model.addRule();
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
              table.clearRule(this.scope);
            }
          }
        ]
      }
    ];

    var type = cellModel.type;
    var addMethod = type === 'input' ? 'addInput' : 'addOutput';

    options.commands.unshift({
      label: type === 'input' ? 'Input' : 'Output',
      icon: type,
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

    try {
      evt.preventDefault();
    } catch (e) {}
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


    if (!this.footEl) {
      var footEl = this.footEl = document.createElement('tfoot');
      footEl.className =  'rules-controls';
      footEl.innerHTML =  '<tr>' +
                            '<td class="add-rule">' +
                              '<a title="Add a rule" class="icon-dmn icon-plus"></a>' +
                            '</td>' +
                            '<td colspan="3"></td>' +
                          '</tr>';
      this.tableEl.appendChild(footEl);
    }

    var self = this;
    function makeColspan() {
      var count = 1 + Math.max(1, self.model.inputs.length) + Math.max(1, self.model.outputs.length);
      var tds = [self.query('tfoot .add-rule').outerHTML];
      for (var c = 0; c < count; c++) {
        tds.push('<td></td>');
      }
      self.footEl.innerHTML = tds.join('');
    }
    this.model.inputs.on('add remove reset', makeColspan);
    this.model.outputs.on('add remove reset', makeColspan);
    makeColspan();

    return this;
  }
});

module.exports = DecisionTableView;

},{"./clause-view":20,"./rule-view":29,"./table-data":31}],25:[function(require,module,exports){
'use strict';
/* global require: false, module: false */

var DecisionTableView = require('./decision-table-view');
require('./contextmenu-view');
require('./clausevalues-setter-view');

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

},{"./clausevalues-setter-view":21,"./contextmenu-view":23,"./decision-table-view":24}],26:[function(require,module,exports){
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

},{"./clause-data":16}],27:[function(require,module,exports){
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

},{"./clause-data":16}],28:[function(require,module,exports){
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

},{"./cell-data":13}],29:[function(require,module,exports){
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

},{"./cell-view":14,"./context-views-mixin":22}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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
    var ruleDelta = this.rules.indexOf(rule);
    this.rules.at(ruleDelta).cells.forEach(function (cell) {
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

},{"./input-data":26,"./output-data":27,"./rule-data":28,"lodash.defaults":1}]},{},[25])(25)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5kZWZhdWx0cy9ub2RlX21vZHVsZXMvbG9kYXNoLmFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWFzc2lnbi9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY29weS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRlYXNzaWduZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2guX2NyZWF0ZWFzc2lnbmVyL25vZGVfbW9kdWxlcy9sb2Rhc2guX2JpbmRjYWxsYmFjay9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5fY3JlYXRlYXNzaWduZXIvbm9kZV9tb2R1bGVzL2xvZGFzaC5faXNpdGVyYXRlZWNhbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2gua2V5cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5rZXlzL25vZGVfbW9kdWxlcy9sb2Rhc2guX2dldG5hdGl2ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZGVmYXVsdHMvbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vbm9kZV9tb2R1bGVzL2xvZGFzaC5rZXlzL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNhcmd1bWVudHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL25vZGVfbW9kdWxlcy9sb2Rhc2gua2V5cy9ub2RlX21vZHVsZXMvbG9kYXNoLmlzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlZmF1bHRzL25vZGVfbW9kdWxlcy9sb2Rhc2gucmVzdHBhcmFtL2luZGV4LmpzIiwic2NyaXB0cy9jZWxsLWRhdGEuanMiLCJzY3JpcHRzL2NlbGwtdmlldy5qcyIsInNjcmlwdHMvY2hvaWNlLXZpZXcuanMiLCJzY3JpcHRzL2NsYXVzZS1kYXRhLmpzIiwic2NyaXB0cy9jbGF1c2UtbGFiZWwtdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLW1hcHBpbmctdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLXZhbHVlLXZpZXcuanMiLCJzY3JpcHRzL2NsYXVzZS12aWV3LmpzIiwic2NyaXB0cy9jbGF1c2V2YWx1ZXMtc2V0dGVyLXZpZXcuanMiLCJzY3JpcHRzL2NvbnRleHQtdmlld3MtbWl4aW4uanMiLCJzY3JpcHRzL2NvbnRleHRtZW51LXZpZXcuanMiLCJzY3JpcHRzL2RlY2lzaW9uLXRhYmxlLXZpZXcuanMiLCJzY3JpcHRzL2luZGV4LmpzIiwic2NyaXB0cy9pbnB1dC1kYXRhLmpzIiwic2NyaXB0cy9vdXRwdXQtZGF0YS5qcyIsInNjcmlwdHMvcnVsZS1kYXRhLmpzIiwic2NyaXB0cy9ydWxlLXZpZXcuanMiLCJzY3JpcHRzL3N1Z2dlc3Rpb25zLXZpZXcuanMiLCJzY3JpcHRzL3RhYmxlLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIGxvZGFzaCAzLjEuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC5hc3NpZ24nKSxcbiAgICByZXN0UGFyYW0gPSByZXF1aXJlKCdsb2Rhc2gucmVzdHBhcmFtJyk7XG5cbi8qKlxuICogVXNlZCBieSBgXy5kZWZhdWx0c2AgdG8gY3VzdG9taXplIGl0cyBgXy5hc3NpZ25gIHVzZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBvYmplY3RWYWx1ZSBUaGUgZGVzdGluYXRpb24gb2JqZWN0IHByb3BlcnR5IHZhbHVlLlxuICogQHBhcmFtIHsqfSBzb3VyY2VWYWx1ZSBUaGUgc291cmNlIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB2YWx1ZSB0byBhc3NpZ24gdG8gdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYXNzaWduRGVmYXVsdHMob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlKSB7XG4gIHJldHVybiBvYmplY3RWYWx1ZSA9PT0gdW5kZWZpbmVkID8gc291cmNlVmFsdWUgOiBvYmplY3RWYWx1ZTtcbn1cblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdCBmb3IgYWxsIGRlc3RpbmF0aW9uIHByb3BlcnRpZXMgdGhhdCByZXNvbHZlIHRvIGB1bmRlZmluZWRgLiBPbmNlIGFcbiAqIHByb3BlcnR5IGlzIHNldCwgYWRkaXRpb25hbCB2YWx1ZXMgb2YgdGhlIHNhbWUgcHJvcGVydHkgYXJlIGlnbm9yZWQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZhdWx0cyh7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAqL1xudmFyIGRlZmF1bHRzID0gcmVzdFBhcmFtKGZ1bmN0aW9uKGFyZ3MpIHtcbiAgdmFyIG9iamVjdCA9IGFyZ3NbMF07XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgYXJncy5wdXNoKGFzc2lnbkRlZmF1bHRzKTtcbiAgcmV0dXJuIGFzc2lnbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjIuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJhc2VBc3NpZ24gPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2Vhc3NpZ24nKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJ2xvZGFzaC5fY3JlYXRlYXNzaWduZXInKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uYXNzaWduYCBmb3IgY3VzdG9taXppbmcgYXNzaWduZWQgdmFsdWVzIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLCBtdWx0aXBsZSBzb3VyY2VzLCBhbmQgYHRoaXNgIGJpbmRpbmcgYGN1c3RvbWl6ZXJgXG4gKiBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHByb3BzID0ga2V5cyhzb3VyY2UpLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgcmVzdWx0ID0gY3VzdG9taXplcih2YWx1ZSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuXG4gICAgaWYgKChyZXN1bHQgPT09IHJlc3VsdCA/IChyZXN1bHQgIT09IHZhbHVlKSA6ICh2YWx1ZSA9PT0gdmFsdWUpKSB8fFxuICAgICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgICAgb2JqZWN0W2tleV0gPSByZXN1bHQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gKiBvYmplY3QuIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqIElmIGBjdXN0b21pemVyYCBpcyBwcm92aWRlZCBpdCBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGFzc2lnbmVkIHZhbHVlcy5cbiAqIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggZml2ZSBhcmd1bWVudHM6XG4gKiAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgYmFzZWQgb25cbiAqIFtgT2JqZWN0LmFzc2lnbmBdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QuYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGV4dGVuZFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5hc3NpZ24oeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDQwIH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGRlZmF1bHRzID0gXy5wYXJ0aWFsUmlnaHQoXy5hc3NpZ24sIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICogICByZXR1cm4gXy5pc1VuZGVmaW5lZCh2YWx1ZSkgPyBvdGhlciA6IHZhbHVlO1xuICogfSk7XG4gKlxuICogZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICByZXR1cm4gY3VzdG9taXplclxuICAgID8gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcilcbiAgICA6IGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4yLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlQ29weSA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWNvcHknKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmcsXG4gKiBtdWx0aXBsZSBzb3VyY2VzLCBhbmQgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIHNvdXJjZSA9PSBudWxsXG4gICAgPyBvYmplY3RcbiAgICA6IGJhc2VDb3B5KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDb3B5KHNvdXJjZSwgcHJvcHMsIG9iamVjdCkge1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgb2JqZWN0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDb3B5O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4xLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCdsb2Rhc2guX2JpbmRjYWxsYmFjaycpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbCcpLFxuICAgIHJlc3RQYXJhbSA9IHJlcXVpcmUoJ2xvZGFzaC5yZXN0cGFyYW0nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBhc3NpZ25zIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byBhIGdpdmVuXG4gKiBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBjcmVhdGUgYF8uYXNzaWduYCwgYF8uZGVmYXVsdHNgLCBhbmQgYF8ubWVyZ2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gcmVzdFBhcmFtKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPT0gbnVsbCA/IDAgOiBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzW2xlbmd0aCAtIDJdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkLFxuICAgICAgICB0aGlzQXJnID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY3VzdG9taXplciA9IGJpbmRDYWxsYmFjayhjdXN0b21pemVyLCB0aGlzQXJnLCA1KTtcbiAgICAgIGxlbmd0aCAtPSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXN0b21pemVyID0gdHlwZW9mIHRoaXNBcmcgPT0gJ2Z1bmN0aW9uJyA/IHRoaXNBcmcgOiB1bmRlZmluZWQ7XG4gICAgICBsZW5ndGggLT0gKGN1c3RvbWl6ZXIgPyAxIDogMCk7XG4gICAgfVxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXNzaWduZXI7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUNhbGxiYWNrYCB3aGljaCBvbmx5IHN1cHBvcnRzIGB0aGlzYCBiaW5kaW5nXG4gKiBhbmQgc3BlY2lmeWluZyB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYmluZC5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcmdDb3VudF0gVGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBiaW5kQ2FsbGJhY2soZnVuYywgdGhpc0FyZywgYXJnQ291bnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHRoaXNBcmcgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmdW5jO1xuICB9XG4gIHN3aXRjaCAoYXJnQ291bnQpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSk7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfTtcbiAgICBjYXNlIDU6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIG90aGVyLCBrZXksIG9iamVjdCwgc291cmNlKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IHByb3ZpZGVkIHRvIGl0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0O1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmluZENhbGxiYWNrO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjkgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiB0aGF0IGFmZmVjdHMgU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpID8gK3ZhbHVlIDogLTE7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpKSB7XG4gICAgdmFyIG90aGVyID0gb2JqZWN0W2luZGV4XTtcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gKHZhbHVlID09PSBvdGhlcikgOiAob3RoZXIgIT09IG90aGVyKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcbiIsIi8qKlxuICogbG9kYXNoIDMuMS4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnbG9kYXNoLl9nZXRuYXRpdmUnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJ2xvZGFzaC5pc2FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXNhcnJheScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXlxcZCskLztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IGdldE5hdGl2ZShPYmplY3QsICdrZXlzJyk7XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiB0aGF0IGFmZmVjdHMgU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpID8gK3ZhbHVlIDogLTE7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBBIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIG9mIGBPYmplY3Qua2V5c2Agd2hpY2ggY3JlYXRlcyBhbiBhcnJheSBvZiB0aGVcbiAqIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBzaGltS2V5cyhvYmplY3QpIHtcbiAgdmFyIHByb3BzID0ga2V5c0luKG9iamVjdCksXG4gICAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IHByb3BzTGVuZ3RoICYmIG9iamVjdC5sZW5ndGg7XG5cbiAgdmFyIGFsbG93SW5kZXhlcyA9ICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBwcm9wc0xlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgaWYgKChhbGxvd0luZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpIHx8IGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xudmFyIGtleXMgPSAhbmF0aXZlS2V5cyA/IHNoaW1LZXlzIDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBDdG9yID0gb2JqZWN0ID09IG51bGwgPyBudWxsIDogb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBpZiAoKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUgPT09IG9iamVjdCkgfHxcbiAgICAgICh0eXBlb2Ygb2JqZWN0ICE9ICdmdW5jdGlvbicgJiYgaXNBcnJheUxpa2Uob2JqZWN0KSkpIHtcbiAgICByZXR1cm4gc2hpbUtleXMob2JqZWN0KTtcbiAgfVxuICByZXR1cm4gaXNPYmplY3Qob2JqZWN0KSA/IG5hdGl2ZUtleXMob2JqZWN0KSA6IFtdO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDtcbiAgbGVuZ3RoID0gKGxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKSAmJiBsZW5ndGgpIHx8IDA7XG5cbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgaXNQcm90byA9IHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUgPT09IG9iamVjdCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCksXG4gICAgICBza2lwSW5kZXhlcyA9IGxlbmd0aCA+IDA7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gKGluZGV4ICsgJycpO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShza2lwSW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgJiZcbiAgICAgICAgIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy45LjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgW3NwZWNpYWwgY2hhcmFjdGVyc10oaHR0cDovL3d3dy5yZWd1bGFyLWV4cHJlc3Npb25zLmluZm8vY2hhcmFjdGVycy5odG1sI3NwZWNpYWwpLlxuICogSW4gYWRkaXRpb24gdG8gc3BlY2lhbCBjaGFyYWN0ZXJzIHRoZSBmb3J3YXJkIHNsYXNoIGlzIGVzY2FwZWQgdG8gYWxsb3cgZm9yXG4gKiBlYXNpZXIgYGV2YWxgIHVzZSBhbmQgYEZ1bmN0aW9uYCBjb21waWxhdGlvbi5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhcnMgPSAvWy4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2csXG4gICAgcmVIYXNSZWdFeHBDaGFycyA9IFJlZ0V4cChyZVJlZ0V4cENoYXJzLnNvdXJjZSk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGlmIGl0J3Mgbm90IG9uZS4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkXG4gKiBmb3IgYG51bGxgIG9yIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZXNjYXBlUmVnRXhwKGZuVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIHJldHVybiBpc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBmdW5jVGFnKSB7XG4gICAgcmV0dXJuIHJlSXNOYXRpdmUudGVzdChmblRvU3RyaW5nLmNhbGwodmFsdWUpKTtcbiAgfVxuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiByZUlzSG9zdEN0b3IudGVzdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogRXNjYXBlcyB0aGUgYFJlZ0V4cGAgc3BlY2lhbCBjaGFyYWN0ZXJzIFwiXFxcIiwgXCIvXCIsIFwiXlwiLCBcIiRcIiwgXCIuXCIsIFwifFwiLCBcIj9cIixcbiAqIFwiKlwiLCBcIitcIiwgXCIoXCIsIFwiKVwiLCBcIltcIiwgXCJdXCIsIFwie1wiIGFuZCBcIn1cIiBpbiBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZXNjYXBlUmVnRXhwKCdbbG9kYXNoXShodHRwczovL2xvZGFzaC5jb20vKScpO1xuICogLy8gPT4gJ1xcW2xvZGFzaFxcXVxcKGh0dHBzOlxcL1xcL2xvZGFzaFxcLmNvbVxcL1xcKSdcbiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICBzdHJpbmcgPSBiYXNlVG9TdHJpbmcoc3RyaW5nKTtcbiAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNSZWdFeHBDaGFycy50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVJlZ0V4cENoYXJzLCAnXFxcXCQmJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMyAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXZvaWQgYSBbSklUIGJ1Z10oaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE0Mjc5MilcbiAqIHRoYXQgYWZmZWN0cyBTYWZhcmkgb24gYXQgbGVhc3QgaU9TIDguMS04LjMgQVJNNjQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBcImxlbmd0aFwiIHZhbHVlLlxuICovXG52YXIgZ2V0TGVuZ3RoID0gYmFzZVByb3BlcnR5KCdsZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4zIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBbc3BlY2lhbCBjaGFyYWN0ZXJzXShodHRwOi8vd3d3LnJlZ3VsYXItZXhwcmVzc2lvbnMuaW5mby9jaGFyYWN0ZXJzLmh0bWwjc3BlY2lhbCkuXG4gKiBJbiBhZGRpdGlvbiB0byBzcGVjaWFsIGNoYXJhY3RlcnMgdGhlIGZvcndhcmQgc2xhc2ggaXMgZXNjYXBlZCB0byBhbGxvdyBmb3JcbiAqIGVhc2llciBgZXZhbGAgdXNlIGFuZCBgRnVuY3Rpb25gIGNvbXBpbGF0aW9uLlxuICovXG52YXIgcmVSZWdFeHBDaGFycyA9IC9bLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZyxcbiAgICByZUhhc1JlZ0V4cENoYXJzID0gUmVnRXhwKHJlUmVnRXhwQ2hhcnMuc291cmNlKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkgPiA1KS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgaWYgaXQncyBub3Qgb25lLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWRcbiAqIGZvciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZm5Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBlc2NhcGVSZWdFeHAoZm5Ub1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KSlcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQXJyYXkgPSBnZXROYXRpdmUoQXJyYXksICdpc0FycmF5Jyk7XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICByZXR1cm4gaXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcnJheVRhZztcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAob2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZykge1xuICAgIHJldHVybiByZUlzTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVJc0hvc3RDdG9yLnRlc3QodmFsdWUpO1xufVxuXG4vKipcbiAqIEVzY2FwZXMgdGhlIGBSZWdFeHBgIHNwZWNpYWwgY2hhcmFjdGVycyBcIlxcXCIsIFwiL1wiLCBcIl5cIiwgXCIkXCIsIFwiLlwiLCBcInxcIiwgXCI/XCIsXG4gKiBcIipcIiwgXCIrXCIsIFwiKFwiLCBcIilcIiwgXCJbXCIsIFwiXVwiLCBcIntcIiBhbmQgXCJ9XCIgaW4gYHN0cmluZ2AuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGVzY2FwZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmVzY2FwZVJlZ0V4cCgnW2xvZGFzaF0oaHR0cHM6Ly9sb2Rhc2guY29tLyknKTtcbiAqIC8vID0+ICdcXFtsb2Rhc2hcXF1cXChodHRwczpcXC9cXC9sb2Rhc2hcXC5jb21cXC9cXCknXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHJpbmcpIHtcbiAgc3RyaW5nID0gYmFzZVRvU3RyaW5nKHN0cmluZyk7XG4gIHJldHVybiAoc3RyaW5nICYmIHJlSGFzUmVnRXhwQ2hhcnMudGVzdChzdHJpbmcpKVxuICAgID8gc3RyaW5nLnJlcGxhY2UocmVSZWdFeHBDaGFycywgJ1xcXFwkJicpXG4gICAgOiBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsIi8qKlxuICogbG9kYXNoIDMuNi4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZVxuICogY3JlYXRlZCBmdW5jdGlvbiBhbmQgYXJndW1lbnRzIGZyb20gYHN0YXJ0YCBhbmQgYmV5b25kIHByb3ZpZGVkIGFzIGFuIGFycmF5LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvbiB0aGUgW3Jlc3QgcGFyYW1ldGVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9GdW5jdGlvbnMvcmVzdF9wYXJhbWV0ZXJzKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBzYXkgPSBfLnJlc3RQYXJhbShmdW5jdGlvbih3aGF0LCBuYW1lcykge1xuICogICByZXR1cm4gd2hhdCArICcgJyArIF8uaW5pdGlhbChuYW1lcykuam9pbignLCAnKSArXG4gKiAgICAgKF8uc2l6ZShuYW1lcykgPiAxID8gJywgJiAnIDogJycpICsgXy5sYXN0KG5hbWVzKTtcbiAqIH0pO1xuICpcbiAqIHNheSgnaGVsbG8nLCAnZnJlZCcsICdiYXJuZXknLCAncGViYmxlcycpO1xuICogLy8gPT4gJ2hlbGxvIGZyZWQsIGJhcm5leSwgJiBwZWJibGVzJ1xuICovXG5mdW5jdGlvbiByZXN0UGFyYW0oZnVuYywgc3RhcnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogKCtzdGFydCB8fCAwKSwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICByZXN0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICByZXN0W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIHN3aXRjaCAoc3RhcnQpIHtcbiAgICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCByZXN0KTtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCByZXN0KTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCBhcmdzWzFdLCByZXN0KTtcbiAgICB9XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgaW5kZXggPSAtMTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSByZXN0O1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzdFBhcmFtO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogdHJ1ZSwgcmVxdWlyZTogZmFsc2UqL1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHsgdmFyIGRlcHMgPSByZXF1aXJlOyB9XG5lbHNlIHsgdmFyIGRlcHMgPSB3aW5kb3cuZGVwczsgfVxuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcblxudmFyIENlbGxNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHByb3BzOiB7XG4gICAgdmFsdWU6ICdzdHJpbmcnXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIGVkaXRhYmxlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICBydWxlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH0sXG5cblxuICAgIHRhYmxlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdydWxlLmNvbGxlY3Rpb24nLFxuICAgICAgICAncnVsZS5jb2xsZWN0aW9uLnBhcmVudCdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ydWxlLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB4OiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjZWxsID0gdGhpcztcbiAgICAgICAgdmFyIGNlbGxzID0gY2VsbC5jb2xsZWN0aW9uO1xuICAgICAgICByZXR1cm4gY2VsbHMuaW5kZXhPZihjZWxsKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgeToge1xuICAgICAgZGVwczogW1xuICAgICAgICAncnVsZScsXG4gICAgICAgICdydWxlLmNvbGxlY3Rpb24nXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5ydWxlLmNvbGxlY3Rpb247XG4gICAgICAgIHJldHVybiBydWxlcy5pbmRleE9mKHRoaXMucnVsZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZvY3VzZWQ6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ3RhYmxlLngnLFxuICAgICAgICAndGFibGUueScsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0gdGhpcy50YWJsZS54ICYmIHRoaXMueSA9PT0gdGhpcy50YWJsZS55O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGF1c2VEZWx0YToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZS5pbnB1dHMnLFxuICAgICAgICAndGFibGUub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgdmFyIGlucHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgdmFyIG91dHB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGggKyB0aGlzLnRhYmxlLm91dHB1dHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChkZWx0YSA8IGlucHV0cykge1xuICAgICAgICAgIHJldHVybiBkZWx0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YSA8IG91dHB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gZGVsdGEgLSBpbnB1dHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdHlwZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZS5pbnB1dHMnLFxuICAgICAgICAndGFibGUub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgdmFyIGlucHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgdmFyIG91dHB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGggKyB0aGlzLnRhYmxlLm91dHB1dHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChkZWx0YSA8IGlucHV0cykge1xuICAgICAgICAgIHJldHVybiAnaW5wdXQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlbHRhIDwgb3V0cHV0cykge1xuICAgICAgICAgIHJldHVybiAnb3V0cHV0JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnYW5ub3RhdGlvbic7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsYXVzZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLmxlbmd0aCcsXG4gICAgICAgICd0eXBlJyxcbiAgICAgICAgJ2NsYXVzZURlbHRhJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNsYXVzZURlbHRhIDwgMCB8fCB0aGlzLnR5cGUgPT09ICdhbm5vdGF0aW9uJykgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIGNsYXVzZSA9IHRoaXMudGFibGVbdGhpcy50eXBlICsncyddLmF0KHRoaXMuY2xhdXNlRGVsdGEpO1xuICAgICAgICByZXR1cm4gY2xhdXNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjaG9pY2VzOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICd0YWJsZScsXG4gICAgICAgICdjb2xsZWN0aW9uLmxlbmd0aCcsXG4gICAgICAgICd0eXBlJyxcbiAgICAgICAgJ2NsYXVzZScsXG4gICAgICAgICdjbGF1c2VEZWx0YSdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xhdXNlKSB7IHJldHVybjsgfVxuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UuY2hvaWNlcy5tYXAoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgIHJldHVybiB7dmFsdWU6IHZhbH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogQ2VsbE1vZGVsLFxuICBDb2xsZWN0aW9uOiBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IENlbGxNb2RlbFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG52YXIgY29udGV4dFZpZXdzTWl4aW4gPSByZXF1aXJlKCcuL2NvbnRleHQtdmlld3MtbWl4aW4nKTtcblxuXG52YXIgQ2hvaWNlVmlldyA9IHJlcXVpcmUoJy4vY2hvaWNlLXZpZXcnKTtcbnZhciBSdWxlQ2VsbFZpZXcgPSBWaWV3LmV4dGVuZChtZXJnZSh7fSwgQ2hvaWNlVmlldy5wcm90b3R5cGUsIHtcbiAgdGVtcGxhdGU6ICc8dGQ+PC90ZD4nLFxuXG4gIGJpbmRpbmdzOiBtZXJnZSh7fSwgQ2hvaWNlVmlldy5wcm90b3R5cGUuYmluZGluZ3MsIHtcbiAgICAnbW9kZWwudmFsdWUnOiB7XG4gICAgICB0eXBlOiAndGV4dCdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmVkaXRhYmxlJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2NvbnRlbnRlZGl0YWJsZSdcbiAgICB9LFxuXG4gICAgJ21vZGVsLnNwZWxsY2hlY2tlZCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdzcGVsbGNoZWNrJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwudHlwZSc6IHtcbiAgICAgIHR5cGU6ICdjbGFzcydcbiAgICB9XG4gIH0pLFxuXG4gIGV2ZW50czogbWVyZ2Uoe30sIENob2ljZVZpZXcucHJvdG90eXBlLmV2ZW50cywge1xuICAgICdjb250ZXh0bWVudSc6ICAnX2hhbmRsZUNvbnRleHRNZW51JyxcbiAgICAnY2xpY2snOiAgICAgICAgJ19oYW5kbGVDbGljaydcbiAgfSksXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgQ2hvaWNlVmlldy5wcm90b3R5cGUuX2hhbmRsZUZvY3VzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgdGFibGUgPSB0aGlzLm1vZGVsLnRhYmxlO1xuICAgIHZhciBjZWxsID0gdGhpcy5tb2RlbDtcbiAgICB2YXIgY2VsbHMgPSBjZWxsLmNvbGxlY3Rpb247XG4gICAgdmFyIHJ1bGUgPSBjZWxscy5wYXJlbnQ7XG4gICAgdmFyIHJ1bGVzID0gdGFibGUucnVsZXM7XG5cbiAgICB2YXIgeCA9IGNlbGxzLmluZGV4T2YoY2VsbCk7XG4gICAgdmFyIHkgPSBydWxlcy5pbmRleE9mKHJ1bGUpO1xuXG4gICAgaWYgKHRhYmxlLnggIT09IHggfHwgdGFibGUueSAhPT0geSkge1xuICAgICAgdGFibGUuc2V0KHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeVxuICAgICAgfSwge1xuICAgICAgICAvLyBzaWxlbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGFibGUudHJpZ2dlcignY2hhbmdlOmZvY3VzJyk7XG4gICAgfVxuXG4gICAgdGhpcy5wYXJlbnQucGFyZW50LmhpZGVDb250ZXh0TWVudSgpO1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGFyZW50LnBhcmVudC5oaWRlQ29udGV4dE1lbnUoKTtcbiAgfSxcblxuICBfaGFuZGxlQ29udGV4dE1lbnU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB0aGlzLnBhcmVudC5wYXJlbnQuc2hvd0NvbnRleHRNZW51KHRoaXMubW9kZWwsIGV2dCk7XG4gIH0sXG5cbiAgc2V0Rm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAodGhpcy5tb2RlbC5mb2N1c2VkKSB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzZWQnKTtcblxuICAgICAgaWYgKHRoaXMucGFyZW50LnBhcmVudC5jb250ZXh0TWVudSkge1xuICAgICAgICB0aGlzLnBhcmVudC5wYXJlbnQuY29udGV4dE1lbnUuY2xvc2UoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGFyZW50LnBhcmVudC5jbGF1c2VWYWx1ZXNFZGl0b3IpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQucGFyZW50LmNsYXVzZVZhbHVlc0VkaXRvci5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmb2N1c2VkJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW9kZWwueCA9PT0gdGhpcy5tb2RlbC50YWJsZS54KSB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2NvbC1mb2N1c2VkJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2wtZm9jdXNlZCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vZGVsLnkgPT09IHRoaXMubW9kZWwudGFibGUueSkge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdyb3ctZm9jdXNlZCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgncm93LWZvY3VzZWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub24oJ2NoYW5nZTplbCcsIHRoaXMuc2V0Rm9jdXMpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbC50YWJsZSwgJ2NoYW5nZTpmb2N1cycsIHRoaXMuc2V0Rm9jdXMpO1xuICB9XG59KSk7XG5cblxuXG52YXIgUnVsZUlucHV0Q2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxudmFyIFJ1bGVPdXRwdXRDZWxsVmlldyA9IFJ1bGVDZWxsVmlldy5leHRlbmQoe30pO1xuXG52YXIgUnVsZUFubm90YXRpb25DZWxsVmlldyA9IFJ1bGVDZWxsVmlldy5leHRlbmQoe30pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENlbGw6ICAgICAgIFJ1bGVDZWxsVmlldyxcbiAgSW5wdXQ6ICAgICAgUnVsZUlucHV0Q2VsbFZpZXcsXG4gIE91dHB1dDogICAgIFJ1bGVPdXRwdXRDZWxsVmlldyxcbiAgQW5ub3RhdGlvbjogUnVsZUFubm90YXRpb25DZWxsVmlld1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBkZXBzOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcblxudmFyIFN1Z2dlc3Rpb25zVmlldyA9IHJlcXVpcmUoJy4vc3VnZ2VzdGlvbnMtdmlldycpO1xuXG52YXIgc3VnZ2VzdGlvbnNWaWV3ID0gU3VnZ2VzdGlvbnNWaWV3Lmluc3RhbmNlKCk7XG5cbnZhciBzcGVjaWFsS2V5cyA9IFtcbiAgOCAvLyBiYWNrc3BhY2Vcbl07XG5cbnZhciBDaG9pY2VWaWV3ID0gVmlldy5leHRlbmQoe1xuICBjb2xsZWN0aW9uczoge1xuICAgIGNob2ljZXM6IFN1Z2dlc3Rpb25zVmlldy5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgaW5wdXQ6ICdfaGFuZGxlSW5wdXQnLFxuICAgIGZvY3VzOiAnX2hhbmRsZUZvY3VzJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICB2YWxpZDogICAgICAgICAge1xuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIH0sXG5cbiAgICBvcmlnaW5hbFZhbHVlOiAgJ3N0cmluZydcbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgaXNPcmlnaW5hbDoge1xuICAgICAgZGVwczogWydtb2RlbC52YWx1ZScsICdvcmlnaW5hbFZhbHVlJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC52YWx1ZSA9PT0gdGhpcy5vcmlnaW5hbFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSB8fCAhdmFsdWUudHJpbSgpKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnbW9kZWwuZm9jdXNlZCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2ZvY3VzZWQnXG4gICAgfSxcblxuICAgIGlzT3JpZ2luYWw6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ3VudG91Y2hlZCdcbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAodGhpcy5lbCkge1xuICAgICAgdGhpcy5lbC5jb250ZW50RWRpdGFibGUgPSB0cnVlO1xuICAgICAgdGhpcy5lbC5zcGVsbGNoZWNrID0gZmFsc2U7XG4gICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB0aGlzLnZhbHVlID0gdGhpcy5lbC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG5cblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTpjaG9pY2VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNob2ljZXMgPSB0aGlzLm1vZGVsLmNob2ljZXM7XG4gICAgICBpZiAoIXRoaXMuY2hvaWNlcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWNob2ljZXMpIHtcbiAgICAgICAgY2hvaWNlcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNob2ljZXMucmVzZXQoY2hvaWNlcy5tYXAoZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICByZXR1cm4ge3ZhbHVlOiBjaG9pY2V9O1xuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdWdnZXN0aW9ucyA9IG5ldyBTdWdnZXN0aW9uc1ZpZXcuQ29sbGVjdGlvbih7XG4gICAgICBwYXJlbnQ6IHRoaXMuY2hvaWNlc1xuICAgIH0pO1xuICB9LFxuXG4gIF9maWx0ZXI6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB2YXIgY2hvaWNlcyA9IHRoaXMubW9kZWwuY2hvaWNlcyB8fCB0aGlzLmNob2ljZXM7XG4gICAgdmFyIGZpbHRlcmVkID0gY2hvaWNlc1xuICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNob2ljZS52YWx1ZS5pbmRleE9mKHZhbCkgPT09IDA7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgICAgIHZhciBjaGFycyA9IHRoaXMuZWwudGV4dENvbnRlbnQubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHZhbCA9IGNob2ljZS5lc2NhcGUgPyBjaG9pY2UuZXNjYXBlKCd2YWx1ZScpIDogY2hvaWNlLnZhbHVlO1xuICAgICAgICAgICAgdmFyIGh0bWxTdHIgPSAnPHNwYW4gY2xhc3M9XCJoaWdobGlnaHRlZFwiPicgKyB2YWwuc2xpY2UoMCwgY2hhcnMpICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgaHRtbFN0ciArPSB2YWwuc2xpY2UoY2hhcnMpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFsdWU6IGNob2ljZS52YWx1ZSxcbiAgICAgICAgICAgICAgaHRtbDogaHRtbFN0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gZmlsdGVyZWQ7XG4gIH0sXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5faGFuZGxlSW5wdXQoKTtcbiAgfSxcblxuICBfaGFuZGxlUmVzaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsIHx8ICFzdWdnZXN0aW9uc1ZpZXcpIHsgcmV0dXJuOyB9XG4gICAgdmFyIG5vZGUgPSB0aGlzLmVsO1xuICAgIHZhciB0b3AgPSBub2RlLm9mZnNldFRvcDtcbiAgICB2YXIgbGVmdCA9IG5vZGUub2Zmc2V0TGVmdDtcbiAgICB2YXIgaGVscGVyID0gc3VnZ2VzdGlvbnNWaWV3LmVsO1xuXG4gICAgd2hpbGUgKChub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQpKSB7XG4gICAgICBpZiAobm9kZS5vZmZzZXRUb3ApIHtcbiAgICAgICAgdG9wICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0VG9wLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5vZmZzZXRMZWZ0KSB7XG4gICAgICAgIGxlZnQgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRMZWZ0LCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9wIC09IGhlbHBlci5jbGllbnRIZWlnaHQ7XG4gICAgaGVscGVyLnN0eWxlLnRvcCA9IHRvcDtcbiAgICBoZWxwZXIuc3R5bGUubGVmdCA9IGxlZnQ7XG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dCAmJiAoc3BlY2lhbEtleXMuaW5kZXhPZihldnQua2V5Q29kZSkgPiAtMSB8fCBldnQuY3RybEtleSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHZhbCA9IHRoaXMuZWwudGV4dENvbnRlbnQ7XG5cbiAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLl9maWx0ZXIodmFsKTtcbiAgICBzdWdnZXN0aW9uc1ZpZXcuc2hvdyhmaWx0ZXJlZCwgdGhpcyk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXplKCk7XG5cbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoZXZ0KSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2hpbmcgPSBmaWx0ZXJlZFswXS52YWx1ZTtcbiAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgdmFsdWU6IG1hdGNoaW5nXG4gICAgICB9LCB7XG4gICAgICAgIHNpbGVudDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gbWF0Y2hpbmc7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaG9pY2VWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogdHJ1ZSwgcmVxdWlyZTogZmFsc2UqL1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHsgdmFyIGRlcHMgPSByZXF1aXJlOyB9XG5lbHNlIHsgdmFyIGRlcHMgPSB3aW5kb3cuZGVwczsgfVxuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcblxudmFyIENsYXVzZU1vZGVsID0gU3RhdGUuZXh0ZW5kKHtcbiAgLypcbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjaG9pY2VzOiBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICB2YWx1ZTogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuICAqL1xuICBcbiAgcHJvcHM6IHtcbiAgICBsYWJlbDogICAgJ3N0cmluZycsXG4gICAgY2hvaWNlczogICdhcnJheScsXG4gICAgbWFwcGluZzogICdzdHJpbmcnLFxuICAgIGRhdGF0eXBlOiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICdzdHJpbmcnfVxuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICBlZGl0YWJsZToge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogQ2xhdXNlTW9kZWwsXG4gIENvbGxlY3Rpb246IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogQ2xhdXNlTW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBtZXJnZSA9IGRlcHMoJ2xvZGFzaC5tZXJnZScpO1xudmFyIGNvbnRleHRWaWV3c01peGluID0gcmVxdWlyZSgnLi9jb250ZXh0LXZpZXdzLW1peGluJyk7XG5cblxudmFyIExhYmVsVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2ZvY3VzJzogICAgICAgICdfaGFuZGxlRm9jdXMnLFxuICAgICdpbnB1dCc6ICAgICAgICAnX2hhbmRsZUlucHV0JyxcbiAgICAnY29udGV4dG1lbnUnOiAgJ19oYW5kbGVDb250ZXh0TWVudScsXG4gIH0sXG5cbiAgZGVyaXZlZDogbWVyZ2Uoe30sIGNvbnRleHRWaWV3c01peGluLCB7XG4gICAgdGFibGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ21vZGVsJyxcbiAgICAgICAgJ21vZGVsLmNvbGxlY3Rpb24nLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9KSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5sYWJlbCc6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbCkgeyByZXR1cm47IH1cbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSAodmFsIHx8ICcnKS50cmltKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50YWJsZS54ID0gdGhpcy5tb2RlbC54O1xuICAgIHRoaXMudGFibGUudHJpZ2dlcignY2hhbmdlOmZvY3VzJyk7XG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5sYWJlbCA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIHRoaXMuX2hhbmRsZUZvY3VzKCk7XG4gIH0sXG5cbiAgX2hhbmRsZUNvbnRleHRNZW51OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHR5cGUgPSB0aGlzLm1vZGVsLmNsYXVzZVR5cGU7XG4gICAgdmFyIHRhYmxlID0gdGhpcy50YWJsZTtcbiAgICB0aGlzLl9oYW5kbGVGb2N1cygpO1xuXG4gICAgdmFyIGFkZE1ldGhvZCA9IHR5cGUgPT09ICdpbnB1dCcgPyAnYWRkSW5wdXQnIDogJ2FkZE91dHB1dCc7XG5cbiAgICB0aGlzLmNvbnRleHRNZW51Lm9wZW4oe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgdG9wOiBldnQucGFnZVksXG4gICAgICBsZWZ0OiBldnQucGFnZVgsXG4gICAgICBjb21tYW5kczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6IHR5cGUgPT09ICdpbnB1dCcgPyAnSW5wdXQnIDogJ091dHB1dCcsXG4gICAgICAgICAgaWNvbjogdHlwZSxcbiAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbYWRkTWV0aG9kXSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdhZnRlcicsXG4gICAgICAgICAgICAgICAgICBpY29uOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbYWRkTWV0aG9kXSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdjb3B5JyxcbiAgICAgICAgICAgICAgLy8gaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge30sXG4gICAgICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAnbW92ZScsXG4gICAgICAgICAgICAgIC8vIGljb246ICdwbHVzJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYmVmb3JlJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdhZnRlcicsXG4gICAgICAgICAgICAgICAgICBpY29uOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCB0cnVlKTtcbiAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gKHRoaXMubW9kZWwubGFiZWwgfHwgJycpLnRyaW0oKTtcbiAgfVxufSkpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTGFiZWxWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBtZXJnZSA9IGRlcHMoJ2xvZGFzaC5tZXJnZScpO1xuXG5cblxudmFyIE1hcHBpbmdWaWV3ID0gVmlldy5leHRlbmQobWVyZ2Uoe1xuICBldmVudHM6IHtcbiAgICAnaW5wdXQnOiAnX2hhbmRsZUlucHV0JyxcbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgdGFibGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ21vZGVsJyxcbiAgICAgICAgJ21vZGVsLmNvbGxlY3Rpb24nLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbi5wYXJlbnQnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLm1hcHBpbmcnOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZWwpIHsgcmV0dXJuOyB9XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gKHZhbCB8fCAnJykudHJpbSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBfaGFuZGxlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLm1hcHBpbmcgPSB0aGlzLmVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIHRoaXMuZWwudGV4dENvbnRlbnQgPSAodGhpcy5tb2RlbC5tYXBwaW5nIHx8ICcnKS50cmltKCk7XG4gIH1cbn0pKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBwaW5nVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG52YXIgY29udGV4dFZpZXdzTWl4aW4gPSByZXF1aXJlKCcuL2NvbnRleHQtdmlld3MtbWl4aW4nKTtcblxudmFyIFZhbHVlVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2NvbnRleHRtZW51JzogICAgJ19oYW5kbGVDb250ZXh0TWVudSdcbiAgfSxcblxuICBkZXJpdmVkOiBtZXJnZSh7fSwgY29udGV4dFZpZXdzTWl4aW4sIHtcbiAgICB0YWJsZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAnbW9kZWwnLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbicsXG4gICAgICAgICdtb2RlbC5jb2xsZWN0aW9uLnBhcmVudCdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0pLFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmNob2ljZXMnOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyQ29udGVudChlbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICAnbW9kZWwuZGF0YXR5cGUnOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyQ29udGVudChlbCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIF9yZW5kZXJDb250ZW50OiBmdW5jdGlvbiAoZWwpIHtcbiAgICB2YXIgc3RyID0gJyc7XG4gICAgdmFyIHZhbCA9IHRoaXMubW9kZWwuY2hvaWNlcztcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGgpIHtcbiAgICAgIHN0ciA9ICcoJyArIHZhbC5qb2luKCcsICcpICsgJyknO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHN0ciA9IHRoaXMubW9kZWwuZGF0YXR5cGU7XG4gICAgfVxuICAgIGVsLnRleHRDb250ZW50ID0gc3RyO1xuICB9LFxuXG4gIF9oYW5kbGVDb250ZXh0TWVudTogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQuZGVmYXVsdFByZXZlbnRlZCkgeyByZXR1cm47IH1cbiAgICB0aGlzLmNsYXVzZVZhbHVlc0VkaXRvci5zaG93KHRoaXMubW9kZWwuZGF0YXR5cGUsIHRoaXMubW9kZWwuY2hvaWNlcywgdGhpcyk7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbn0pKTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBWYWx1ZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBMYWJlbFZpZXcgPSByZXF1aXJlKCcuL2NsYXVzZS1sYWJlbC12aWV3Jyk7XG52YXIgVmFsdWVWaWV3ID0gcmVxdWlyZSgnLi9jbGF1c2UtdmFsdWUtdmlldycpO1xudmFyIE1hcHBpbmdWaWV3ID0gcmVxdWlyZSgnLi9jbGF1c2UtbWFwcGluZy12aWV3Jyk7XG5cblxuXG5cblxudmFyIHJlcXVpcmVkRWxlbWVudCA9IHtcbiAgdHlwZTogJ2VsZW1lbnQnLFxuICByZXF1aXJlZDogdHJ1ZVxufTtcblxudmFyIENsYXVzZVZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHNlc3Npb246IHtcbiAgICBsYWJlbEVsOiAgICByZXF1aXJlZEVsZW1lbnQsXG4gICAgbWFwcGluZ0VsOiAgcmVxdWlyZWRFbGVtZW50LFxuICAgIHZhbHVlRWw6ICAgIHJlcXVpcmVkRWxlbWVudFxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICB0YWJsZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAnbW9kZWwnLFxuICAgICAgICAnbW9kZWwuY29sbGVjdGlvbicsXG4gICAgICAgICdtb2RlbC5jb2xsZWN0aW9uLnBhcmVudCdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjbGF1c2UgPSB0aGlzLm1vZGVsO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBzdWJ2aWV3cyA9IHtcbiAgICAgIGxhYmVsOiAgICBMYWJlbFZpZXcsXG4gICAgICBtYXBwaW5nOiAgTWFwcGluZ1ZpZXcsXG4gICAgICB2YWx1ZTogICAgVmFsdWVWaWV3XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKHN1YnZpZXdzKS5mb3JFYWNoKGZ1bmN0aW9uIChraW5kKSB7XG4gICAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwsICdjaGFuZ2U6JyArIGtpbmQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXNba2luZCArICdWaWV3J10pIHtcbiAgICAgICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcodGhpc1traW5kICsgJ1ZpZXcnXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzW2tpbmQgKyAnVmlldyddID0gbmV3IHN1YnZpZXdzW2tpbmRdKHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgbW9kZWw6ICBjbGF1c2UsXG4gICAgICAgICAgZWw6ICAgICB0aGlzW2tpbmQgKyAnRWwnXVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgZnVuY3Rpb24gdGFibGVDaGFuZ2VGb2N1cygpIHtcbiAgICAgIGlmIChzZWxmLm1vZGVsLmZvY3VzZWQpIHtcbiAgICAgICAgc2VsZi5sYWJlbEVsLmNsYXNzTGlzdC5hZGQoJ2NvbC1mb2N1c2VkJyk7XG4gICAgICAgIHNlbGYubWFwcGluZ0VsLmNsYXNzTGlzdC5hZGQoJ2NvbC1mb2N1c2VkJyk7XG4gICAgICAgIHNlbGYudmFsdWVFbC5jbGFzc0xpc3QuYWRkKCdjb2wtZm9jdXNlZCcpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHNlbGYubGFiZWxFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2wtZm9jdXNlZCcpO1xuICAgICAgICBzZWxmLm1hcHBpbmdFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2wtZm9jdXNlZCcpO1xuICAgICAgICBzZWxmLnZhbHVlRWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sLWZvY3VzZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy50YWJsZS5vbignY2hhbmdlOmZvY3VzJywgdGFibGVDaGFuZ2VGb2N1cyk7XG4gICAgdGFibGVDaGFuZ2VGb2N1cygpO1xuICB9XG59KTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDbGF1c2VWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xuXG5cblxuXG52YXIgVmFsdWVzQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbGFzdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsc1t0aGlzLm1vZGVscy5sZW5ndGggLSAxXTtcbiAgfSxcblxuICByZXN0cmlwZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbHMgPSB0aGlzLmZpbHRlcihmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIHJldHVybiBtb2RlbC52YWx1ZTtcbiAgICB9KTtcblxuICAgIG1vZGVscy5wdXNoKHtcbiAgICAgIHZhbHVlOiAnJ1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZXNldChtb2RlbHMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgbW9kZWw6IFN0YXRlLmV4dGVuZCh7XG4gICAgcHJvcHM6IHtcbiAgICAgIHZhbHVlOiAnc3RyaW5nJ1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm9uKCdjaGFuZ2U6dmFsdWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5yZXN0cmlwZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KVxufSk7XG5cbnZhciBWYWx1ZXNJdGVtVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8bGk+PGlucHV0IHRhYmluZGV4PVwiMVwiIC8+PC9saT4nLFxuXG4gIHNlc3Npb246IHtcbiAgICBpbnZhbGlkOiAnYm9vbGVhbidcbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBzZWxlY3RvcjogJ2lucHV0J1xuICAgIH0sXG4gICAgaW52YWxpZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBuYW1lOiAnaW52YWxpZCcsXG4gICAgICBzZWxlY3RvcjogJ2lucHV0J1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIGlucHV0JzogICAnX2hhbmRsZVZhbHVlQ2hhbmdlJyxcbiAgICAnYmx1ciBpbnB1dCc6ICAgICAnX2hhbmRsZVZhbHVlQ2hhbmdlJyxcbiAgICAna2V5dXAgaW5wdXQnOiAgICAnX2hhbmRsZVZhbHVlS2V5dXAnXG4gIH0sXG5cbiAgX2hhbmRsZVZhbHVlQ2hhbmdlOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKHRoaXMubW9kZWwudmFsdWUgIT09IGV2dC50YXJnZXQudmFsdWUpIHtcbiAgICAgIHRoaXMubW9kZWwudmFsdWUgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgfSxcblxuICBfaGFuZGxlVmFsdWVLZXl1cDogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBjb2xsZWN0aW9uID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uO1xuICAgIHZhciBsYXN0ID0gY29sbGVjdGlvbi5sYXN0KCk7XG5cbiAgICBpZiAobGFzdCA9PT0gdGhpcy5tb2RlbCAmJiBldnQudGFyZ2V0LnZhbHVlKSB7XG4gICAgICBjb2xsZWN0aW9uLmFkZCh7dmFsdWU6ICcnfSk7XG4gICAgfVxuICB9LFxuXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbCA9IHRoaXMubW9kZWwudmFsdWU7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgIHRoaXMuaW52YWxpZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIGNpZCA9IHRoaXMubW9kZWwuY2lkO1xuICAgIHZhciBzYW1lID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLmZpbHRlcihmdW5jdGlvbiAob3RoZXIpIHtcbiAgICAgIHJldHVybiBvdGhlci5jaWQgIT09IGNpZCAmJiBvdGhlci52YWx1ZSA9PT0gdmFsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbnZhbGlkID0gc2FtZS5sZW5ndGggPiAwO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxuXG5cblxuXG52YXIgRGF0YXR5cGVzQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbWFpbkluZGV4OiAndmFsdWUnLFxuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnXG4gICAgfVxuICB9KVxufSk7XG5cbnZhciBEYXRhdHlwZU9wdGlvblZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiAnPG9wdGlvbj48L29wdGlvbj4nLFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLnZhbHVlJzogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAndGV4dCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBuYW1lOiAndmFsdWUnXG4gICAgICB9XG4gICAgXVxuICB9XG59KTtcblxuXG5cblxuXG5cblxudmFyIHByaW1pdGl2ZVR5cGVzID0gW1xuICAnc3RyaW5nJyxcbiAgJ2RhdGUnLFxuXG4gIC8vIGh0dHBzOi8vZG9jcy5vcmFjbGUuY29tL2phdmFzZS90dXRvcmlhbC9qYXZhL251dHNhbmRib2x0cy9kYXRhdHlwZXMuaHRtbFxuICAnc2hvcnQnLFxuICAnaW50JyxcbiAgJ2xvbmcnLFxuICAnZmxvYXQnLFxuICAnZG91YmxlJyxcbiAgJ2Jvb2xlYW4nXG5dLm1hcChmdW5jdGlvbiAodmFsKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWwgfTtcbn0pO1xuXG52YXIgQ2xhdXNlVmFsdWVzVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiZG1uLWNsYXVzZXZhbHVlcy1zZXR0ZXJcIj4nICtcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkYXRhdHlwZVwiPicgK1xuICAgICAgICAgICAgICAgICc8bGFiZWw+RGF0YSB0eXBlOjwvbGFiZWw+JyArXG4gICAgICAgICAgICAgICAgJzxzZWxlY3Q+PC9zZWxlY3Q+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJhbGxvd2VkLXZhbHVlc1wiPicgK1xuICAgICAgICAgICAgICAgICc8bGFiZWw+QWxsb3dlZCB2YWx1ZXM6PC9sYWJlbD4nICtcbiAgICAgICAgICAgICAgICAnPHVsPjwvdWw+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgZGF0YXR5cGVzOiBEYXRhdHlwZXNDb2xsZWN0aW9uLFxuICAgIHBvc3NpYmxlVmFsdWVzOiBWYWx1ZXNDb2xsZWN0aW9uXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIHZpc2libGU6ICdib29sZWFuJyxcbiAgICBkYXRhdHlwZToge3R5cGU6ICdzdHJpbmcnLCBkZWZhdWx0OiAnc3RyaW5nJ31cbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgY29udGV4dE1lbnU6IHtcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgIHdoaWxlICgoY3VycmVudCA9IHRoaXMucGFyZW50KSkge1xuICAgICAgICAgIGlmIChjdXJyZW50LmNvbnRleHRNZW51KSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudC5jb250ZXh0TWVudTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICB2aXNpYmxlOiB7XG4gICAgICB0eXBlOiAndG9nZ2xlJ1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIHNlbGVjdCc6ICdfaGFuZGxlRGF0YXR5cGVDaGFuZ2UnXG4gIH0sXG5cbiAgX2hhbmRsZURhdGF0eXBlQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5kYXRhdHlwZSA9IHRoaXMuZGF0YXR5cGVFbC52YWx1ZTtcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gaGFzTW9kZWwoKSB7XG4gICAgICByZXR1cm4gc2VsZi5wYXJlbnQgJiYgc2VsZi5wYXJlbnQubW9kZWwgJiYgc2VsZi5wYXJlbnQubW9kZWwuZGF0YXR5cGU7XG4gICAgfVxuXG4gICAgdGhpcy5vbignY2hhbmdlOmRhdGF0eXBlJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFoYXNNb2RlbCgpKSB7IHJldHVybjsgfVxuXG4gICAgICB0aGlzLnBhcmVudC5tb2RlbC5kYXRhdHlwZSA9IHRoaXMuZGF0YXR5cGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMucG9zc2libGVWYWx1ZXMsICdhbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWhhc01vZGVsKCkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNob2ljZXMgPSB0aGlzLnBvc3NpYmxlVmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBzZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIXRoaXMucGFyZW50LmVsKSB7XG4gICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbm9kZSA9IHRoaXMucGFyZW50LmVsO1xuICAgIHZhciB0b3AgPSBub2RlLm9mZnNldFRvcDtcbiAgICB2YXIgbGVmdCA9IG5vZGUub2Zmc2V0TGVmdDtcbiAgICB2YXIgaGVscGVyID0gdGhpcy5lbDtcblxuICAgIHdoaWxlICgobm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50KSkge1xuICAgICAgaWYgKG5vZGUub2Zmc2V0VG9wKSB7XG4gICAgICAgIHRvcCArPSBwYXJzZUludChub2RlLm9mZnNldFRvcCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUub2Zmc2V0TGVmdCkge1xuICAgICAgICBsZWZ0ICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0TGVmdCwgMTApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxlZnQgKz0gdGhpcy5wYXJlbnQuZWwuY2xpZW50V2lkdGg7XG4gICAgdG9wIC09IDQwO1xuICAgIGhlbHBlci5zdHlsZS50b3AgPSB0b3A7XG4gICAgaGVscGVyLnN0eWxlLmxlZnQgPSBsZWZ0O1xuICB9LFxuXG4gIHNob3c6IGZ1bmN0aW9uIChkYXRhdHlwZSwgdmFsdWVzLCBwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50ICYmIHRoaXMucGFyZW50ICE9PSBwYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIH1cblxuICAgIHRoaXMuZGF0YXR5cGVzLnJlc2V0KHByaW1pdGl2ZVR5cGVzKTtcbiAgICB0aGlzLmRhdGF0eXBlRWwudmFsdWUgPSBkYXRhdHlwZTtcblxuICAgIHZhbHVlcyA9IHZhbHVlcyB8fCBbXTtcbiAgICB2YXIgdmFscyA9IEFycmF5LmlzQXJyYXkodmFsdWVzKSA/IHZhbHVlcy5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4ge3ZhbHVlOiB2YWx9OyB9KSA6IHZhbHVlcy50b0pTT04oKTtcbiAgICB2YWxzID0gdmFscy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW0udmFsdWU7IH0pO1xuICAgIHZhbHMucHVzaCh7IHZhbHVlOiAnJyB9KTtcblxuICAgIHRoaXMucG9zc2libGVWYWx1ZXMucmVzZXQodmFscyk7XG5cbiAgICBpbnN0YW5jZS52aXNpYmxlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuY29udGV4dE1lbnUpIHtcbiAgICAgIHRoaXMucGFyZW50LmNvbnRleHRNZW51LmNsb3NlKCk7XG4gICAgfVxuXG5cbiAgICBpZiAoaW5zdGFuY2UudmlzaWJsZSkge1xuICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuXG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgIGRhdGF0eXBlRWw6ICdzZWxlY3QnLFxuICAgICAgdmFsdWVzRWw6ICd1bCdcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcnkoJy5kYXRhdHlwZSBsYWJlbCcpLnNldEF0dHJpYnV0ZSgnZm9yJywgdGhpcy5jaWQgKyAnLWRhdGF0eXBlJyk7XG4gICAgdGhpcy5kYXRhdHlwZUVsLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmNpZCArICctZGF0YXR5cGUnKTtcblxuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmRhdGF0eXBlcywgRGF0YXR5cGVPcHRpb25WaWV3LCB0aGlzLmRhdGF0eXBlRWwpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLnBvc3NpYmxlVmFsdWVzLCBWYWx1ZXNJdGVtVmlldywgdGhpcy52YWx1ZXNFbCk7XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMucG9zc2libGVWYWx1ZXMsICdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxudmFyIGluc3RhbmNlO1xuQ2xhdXNlVmFsdWVzVmlldy5pbnN0YW5jZSA9IGZ1bmN0aW9uIChzdWdnZXN0aW9ucywgcGFyZW50KSB7XG4gIGlmICghaW5zdGFuY2UpIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBDbGF1c2VWYWx1ZXNWaWV3KHt9KTtcbiAgICBpbnN0YW5jZS5yZW5kZXIoKTtcbiAgfVxuXG4gIGlmICghZG9jdW1lbnQuYm9keS5jb250YWlucyhpbnN0YW5jZS5lbCkpIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGluc3RhbmNlLmVsKTtcbiAgfVxuXG4gIGluc3RhbmNlLnNob3coc3VnZ2VzdGlvbnMsIHBhcmVudCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LmRtbkNsYXVzZVZhbHVlZEVkaXRvciA9IENsYXVzZVZhbHVlc1ZpZXcuaW5zdGFuY2UoKTtcbn1cblxuQ2xhdXNlVmFsdWVzVmlldy5Db2xsZWN0aW9uID0gVmFsdWVzQ29sbGVjdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGF1c2VWYWx1ZXNWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2xhdXNlVmFsdWVzRWRpdG9yOiB7XG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXM7XG4gICAgICB3aGlsZSAoKGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudCkpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQuY2xhdXNlVmFsdWVzRWRpdG9yKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnQuY2xhdXNlVmFsdWVzRWRpdG9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBjb250ZXh0TWVudToge1xuICAgIGNhY2hlOiBmYWxzZSxcbiAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzO1xuICAgICAgd2hpbGUgKChjdXJyZW50ID0gY3VycmVudC5wYXJlbnQpKSB7XG4gICAgICAgIGlmIChjdXJyZW50LmNvbnRleHRNZW51KSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnQuY29udGV4dE1lbnU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xuXG5cbnZhciBkZWZhdWx0Q29tbWFuZHMgPSBbXG4gIC8vIHtcbiAgLy8gICBsYWJlbDogJ0FjdGlvbnMnLFxuICAvLyAgIHN1YmNvbW1hbmRzOiBbXG4gIC8vICAgICB7XG4gIC8vICAgICAgIGxhYmVsOiAndW5kbycsXG4gIC8vICAgICAgIGljb246ICd1bmRvJyxcbiAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gIC8vICAgICB9LFxuICAvLyAgICAge1xuICAvLyAgICAgICBsYWJlbDogJ3JlZG8nLFxuICAvLyAgICAgICBpY29uOiAncmVkbycsXG4gIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAvLyAgICAgfVxuICAvLyAgIF1cbiAgLy8gfSxcbiAge1xuICAgIGxhYmVsOiAnQ2VsbCcsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgY29udGVudCBvZiB0aGUgZm9jdXNlZCBjZWxsJyxcbiAgICAgICAgcG9zc2libGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmluZm8oJ2NsZWFyIHBvc3NpYmxlPycsIGFyZ3VtZW50cywgdGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnUnVsZScsXG4gICAgaWNvbjogJycsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdjb3B5JyxcbiAgICAgICAgaWNvbjogJ2NvcHknLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNvcHlSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICB9LFxuICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgIGhpbnQ6ICdDb3B5IHRoZSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jb3B5UnVsZSh0aGlzLnNjb3BlLCAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuY29weVJ1bGUodGhpcy5zY29wZSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgIGhpbnQ6ICdSZW1vdmUgdGhlIGZvY3VzZWQgcnVsZScsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwucmVtb3ZlUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jbGVhclJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ0lucHV0JyxcbiAgICBpY29uOiAnaW5wdXQnLFxuICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYmVmb3JlJyxcbiAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gaW5wdXQgY2xhdXNlIGJlZm9yZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgaWNvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gaW5wdXQgY2xhdXNlIGFmdGVyIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLnJlbW92ZUlucHV0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ091dHB1dCcsXG4gICAgaWNvbjogJ291dHB1dCcsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBvdXRwdXQgY2xhdXNlIGJlZm9yZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkT3V0cHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICBoaW50OiAnQWRkIGFuIG91dHB1dCBjbGF1c2UgYWZ0ZXIgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZE91dHB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLnJlbW92ZU91dHB1dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xuXG5cblxuXG5cblxuXG5cblxudmFyIENvbW1hbmRNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHByb3BzOiB7XG4gICAgbGFiZWw6ICdzdHJpbmcnLFxuICAgIGhpbnQ6ICdzdHJpbmcnLFxuICAgIGljb246ICdzdHJpbmcnLFxuICAgIGhyZWY6ICdzdHJpbmcnLFxuXG4gICAgcG9zc2libGU6IHtcbiAgICAgIHR5cGU6ICdhbnknLFxuICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZnVuY3Rpb24gKCkge307IH0sXG4gICAgICB0ZXN0OiBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiBuZXdWYWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gJ211c3QgYmUgZWl0aGVyIGEgZnVuY3Rpb24gb3IgZmFsc2UnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZuOiB7XG4gICAgICB0eXBlOiAnYW55JyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgdGVzdDogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgIT09ICdmdW5jdGlvbicgJiYgbmV3VmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuICdtdXN0IGJlIGVpdGhlciBhIGZ1bmN0aW9uIG9yIGZhbHNlJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgZGlzYWJsZWQ6IHtcbiAgICAgIGRlcHM6IFsncG9zc2libGUnXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5wb3NzaWJsZSA9PT0gJ2Z1bmN0aW9uJyA/ICF0aGlzLnBvc3NpYmxlKCkgOiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgc3ViY29tbWFuZHM6IG51bGwsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLnN1YmNvbW1hbmRzID0gbmV3IENvbW1hbmRzQ29sbGVjdGlvbihhdHRyaWJ1dGVzLnN1YmNvbW1hbmRzIHx8IFtdLCB7XG4gICAgICBwYXJlbnQ6IHRoaXNcbiAgICB9KTtcbiAgfVxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBDb21tYW5kc0NvbGxlY3Rpb24gPSBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1vZGVsOiBDb21tYW5kTW9kZWxcbn0pO1xuXG5cblxuXG5cblxuXG5cblxuXG52YXIgQ29udGV4dE1lbnVJdGVtID0gVmlldy5leHRlbmQoe1xuICBhdXRvUmVuZGVyOiB0cnVlLFxuXG4gIHRlbXBsYXRlOiAnPGxpPicgK1xuICAgICAgICAgICAgICAnPGE+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaWNvblwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJsYWJlbFwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgJzwvYT4nICtcbiAgICAgICAgICAgICAgJzx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj48L3VsPicgK1xuICAgICAgICAgICAgJzwvbGk+JyxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5sYWJlbCc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnLmxhYmVsJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuaGludCc6IHtcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ3RpdGxlJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuZm4nOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIHNlbGVjdG9yOiAnYScsXG4gICAgICBubzogJ2Rpc2FibGVkJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuZGlzYWJsZWQnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICdkaXNhYmxlZCdcbiAgICB9LFxuXG4gICAgJ21vZGVsLnN1YmNvbW1hbmRzLmxlbmd0aCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2Ryb3Bkb3duJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuaHJlZic6IHtcbiAgICAgIHNlbGVjdG9yOiAnYScsXG4gICAgICBuYW1lOiAnaHJlZicsXG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ21vZGVsLmljb24nOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9ICdpY29uICcgKyB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZWxlY3RvcjogJy5pY29uJ1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICBjbGljazogICAgICAnX2hhbmRsZUNsaWNrJyxcbiAgICBtb3VzZW92ZXI6ICAnX2hhbmRsZU1vdXNlb3ZlcicsXG4gICAgbW91c2VvdXQ6ICAgJ19oYW5kbGVNb3VzZW91dCdcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTpzdWJjb21tYW5kcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLm1vZGVsLnN1YmNvbW1hbmRzLCBDb250ZXh0TWVudUl0ZW0sIHRoaXMucXVlcnkoJ3VsJykpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmICh0aGlzLm1vZGVsLmZuKSB7XG4gICAgICB0aGlzLnBhcmVudC50cmlnZ2VyQ29tbWFuZCh0aGlzLm1vZGVsLCBldnQpO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGhpcy5tb2RlbC5ocmVmKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZU1vdXNlb3ZlcjogZnVuY3Rpb24gKCkge1xuXG4gIH0sXG5cblxuXG4gIF9oYW5kbGVNb3VzZW91dDogZnVuY3Rpb24gKCkge1xuXG4gIH0sXG5cblxuXG4gIHRyaWdnZXJDb21tYW5kOiBmdW5jdGlvbiAoY29tbWFuZCwgZXZ0KSB7XG4gICAgdGhpcy5wYXJlbnQudHJpZ2dlckNvbW1hbmQoY29tbWFuZCwgZXZ0KTtcbiAgfVxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIENvbnRleHRNZW51VmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgYXV0b1JlbmRlcjogdHJ1ZSxcblxuICB0ZW1wbGF0ZTogJzxuYXYgY2xhc3M9XCJkbW4tY29udGV4dC1tZW51XCI+JyArXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY29vcmRpbmF0ZXNcIj4nICtcbiAgICAgICAgICAgICAgICAnPGxhYmVsPkNvb3Jkczo8L2xhYmVsPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInhcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwieVwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAnPHVsPjwvdWw+JyArXG4gICAgICAgICAgICAnPC9uYXY+JyxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIGNvbW1hbmRzOiBDb21tYW5kc0NvbGxlY3Rpb25cbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgaXNPcGVuOiAnYm9vbGVhbicsXG4gICAgc2NvcGU6ICAnc3RhdGUnXG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICBpc09wZW46IHtcbiAgICAgIHR5cGU6ICd0b2dnbGUnXG4gICAgfSxcbiAgICAncGFyZW50Lm1vZGVsLngnOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJ2RpdiBzcGFuLngnXG4gICAgfSxcbiAgICAncGFyZW50Lm1vZGVsLnknOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJ2RpdiBzcGFuLnknXG4gICAgfVxuICB9LFxuXG4gIG9wZW46IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHN0eWxlID0gdGhpcy5lbC5zdHlsZTtcblxuICAgIHN0eWxlLmxlZnQgPSBvcHRpb25zLmxlZnQgKyAncHgnO1xuICAgIHN0eWxlLnRvcCA9IG9wdGlvbnMudG9wICsgJ3B4JztcblxuICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICBpZiAob3B0aW9ucy5wYXJlbnQgJiYgb3B0aW9ucy5wYXJlbnQuY2xhdXNlVmFsdWVzRWRpdG9yKSB7XG4gICAgICBvcHRpb25zLnBhcmVudC5jbGF1c2VWYWx1ZXNFZGl0b3IuaGlkZSgpO1xuICAgIH1cblxuICAgIHRoaXMuc2NvcGUgPSBvcHRpb25zLnNjb3BlO1xuICAgIHZhciBjb21tYW5kcyA9IG9wdGlvbnMuY29tbWFuZHMgfHwgZGVmYXVsdENvbW1hbmRzO1xuXG4gICAgdGhpcy5jb21tYW5kcy5yZXNldChjb21tYW5kcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdHJpZ2dlckNvbW1hbmQ6IGZ1bmN0aW9uIChjb21tYW5kLCBldnQpIHtcbiAgICBjb21tYW5kLmZuLmNhbGwodGhpcywgZXZ0KTtcbiAgICBpZiAoIWNvbW1hbmQua2VlcE9wZW4pIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgIGNvbW1hbmRzRWw6ICd1bCdcbiAgICB9KTtcbiAgICB0aGlzLmNvbW1hbmRzVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbW1hbmRzLCBDb250ZXh0TWVudUl0ZW0sIHRoaXMuY29tbWFuZHNFbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBpbnN0YW5jZTtcbkNvbnRleHRNZW51Vmlldy5pbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIGluc3RhbmNlID0gbmV3IENvbnRleHRNZW51VmlldygpO1xuICB9XG5cbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGluc3RhbmNlLmVsKSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zdGFuY2UuZWwpO1xuICB9XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5kbW5Db250ZXh0TWVudSA9IENvbnRleHRNZW51Vmlldy5pbnN0YW5jZSgpO1xufVxuXG5Db250ZXh0TWVudVZpZXcuQ29sbGVjdGlvbiA9IENvbW1hbmRzQ29sbGVjdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0TWVudVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlLCBjb25zb2xlOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgRGVjaXNpb25UYWJsZSA9IHJlcXVpcmUoJy4vdGFibGUtZGF0YScpO1xudmFyIFJ1bGVWaWV3ID0gcmVxdWlyZSgnLi9ydWxlLXZpZXcnKTtcblxuXG5cblxudmFyIENsYXVzZUhlYWRlclZpZXcgPSByZXF1aXJlKCcuL2NsYXVzZS12aWV3Jyk7XG4vKlxudmFyIENvbnRleHRNZW51VmlldyA9IHJlcXVpcmUoJy4vY29udGV4dG1lbnUtdmlldycpO1xudmFyIGNvbnRleHRNZW51ID0gQ29udGV4dE1lbnVWaWV3Lmluc3RhbmNlKCk7XG5cbnZhciBWYWx1ZXNTZXR0ZXJWaWV3ID0gcmVxdWlyZSgnLi9jbGF1c2V2YWx1ZXMtc2V0dGVyLXZpZXcnKTtcbnZhciB2YWx1ZXNWaWV3ID0gVmFsdWVzU2V0dGVyVmlldy5pbnN0YW5jZSgpO1xuKi9cblxuZnVuY3Rpb24gdG9BcnJheShlbHMpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShlbHMpO1xufVxuXG5cbmZ1bmN0aW9uIG1ha2VUZCh0eXBlKSB7XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gIGVsLmNsYXNzTmFtZSA9IHR5cGU7XG4gIHJldHVybiBlbDtcbn1cblxuXG5mdW5jdGlvbiBtYWtlQWRkQnV0dG9uKGNsYXVzZVR5cGUsIHRhYmxlKSB7XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgZWwuY2xhc3NOYW1lID0gJ2ljb24tZG1uIGljb24tcGx1cyc7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHRhYmxlW2NsYXVzZVR5cGUgPT09ICdpbnB1dCcgPyAnYWRkSW5wdXQnIDogJ2FkZE91dHB1dCddKCk7XG4gIH0pO1xuICByZXR1cm4gZWw7XG59XG5cblxuXG5cbnZhciBEZWNpc2lvblRhYmxlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgYXV0b1JlbmRlcjogdHJ1ZSxcblxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkbW4tdGFibGVcIj4nICtcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJoaW50c1wiPicgK1xuICAgICAgICAgICAgICAgICc8aSBjbGFzcz1cImljb24tZG1uIGljb24taW5mb1wiPjwvaT4gJyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGRhdGEtaG9vaz1cImhpbnRzXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8aGVhZGVyPicgK1xuICAgICAgICAgICAgICAgICc8aDMgZGF0YS1ob29rPVwidGFibGUtbmFtZVwiIGNvbnRlbnRlZGl0YWJsZT48L2gzPicgK1xuICAgICAgICAgICAgICAnPC9oZWFkZXI+JyArXG4gICAgICAgICAgICAgICc8dGFibGU+JyArXG4gICAgICAgICAgICAgICAgJzx0aGVhZD4nICtcbiAgICAgICAgICAgICAgICAgICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJoaXRcIiByb3dzcGFuPVwiNFwiPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJpbnB1dCBkb3VibGUtYm9yZGVyLXJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5JbnB1dDwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJvdXRwdXRcIiBjb2xzcGFuPVwiMlwiPk91dHB1dDwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJhbm5vdGF0aW9uXCIgcm93c3Bhbj1cIjRcIj5Bbm5vdGF0aW9uPC90aD4nICtcbiAgICAgICAgICAgICAgICAgICc8L3RyPicgK1xuICAgICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cImxhYmVsc1wiPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAnPHRyIGNsYXNzPVwidmFsdWVzXCI+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJtYXBwaW5nc1wiPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgJzwvdGhlYWQ+JyArXG4gICAgICAgICAgICAgICAgJzx0Ym9keT48L3Rib2R5PicgK1xuICAgICAgICAgICAgICAnPC90YWJsZT4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gIHNlc3Npb246IHtcbiAgICBjb250ZXh0TWVudTogICAgICAgICdzdGF0ZScsXG4gICAgY2xhdXNlVmFsdWVzRWRpdG9yOiAnc3RhdGUnLFxuXG4gICAgaGludDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnTWFrZSBhIHJpZ2h0LWNsaWNrIG9uIHRoZSB0YWJsZSdcbiAgICB9XG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubmFtZSc6IHtcbiAgICAgIGhvb2s6ICd0YWJsZS1uYW1lJyxcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgIH0sXG4gICAgaGludDoge1xuICAgICAgdHlwZTogJ2lubmVySFRNTCcsXG4gICAgICBob29rOiAnaGludHMnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgICdjbGljayAuYWRkLXJ1bGUgYSc6ICdfaGFuZGxlQWRkUnVsZUNsaWNrJyxcbiAgICAnaW5wdXQgaGVhZGVyIGgzJzogICAnX2hhbmRsZU5hbWVJbnB1dCdcbiAgfSxcblxuICBfaGFuZGxlQWRkUnVsZUNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5hZGRSdWxlKCk7XG4gIH0sXG5cbiAgX2hhbmRsZU5hbWVJbnB1dDogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciB2YWwgPSBldnQudGFyZ2V0LnRleHRDb250ZW50LnRyaW0oKTtcbiAgICBpZiAodmFsID09PSB0aGlzLm1vZGVsLm5hbWUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5tb2RlbC5uYW1lID0gdmFsO1xuICB9LFxuXG4gIGxvZzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XG4gICAgdmFyIG1ldGhvZCA9IGFyZ3Muc2hpZnQoKTtcbiAgICBhcmdzLnVuc2hpZnQodGhpcy5jaWQpO1xuICAgIGNvbnNvbGVbbWV0aG9kXS5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgfSxcblxuICBldmVudExvZzogZnVuY3Rpb24gKHNjb3BlTmFtZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgIGFyZ3MudW5zaGlmdChzY29wZU5hbWUpO1xuICAgICAgYXJncy51bnNoaWZ0KCd0cmFjZScpO1xuICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1swXSk7XG4gICAgICBzZWxmLmxvZy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9O1xuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB0aGlzLm1vZGVsID0gdGhpcy5tb2RlbCB8fCBuZXcgRGVjaXNpb25UYWJsZS5Nb2RlbCgpO1xuICB9LFxuXG4gIGhpZGVDb250ZXh0TWVudTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5jb250ZXh0TWVudSkgeyByZXR1cm47IH1cbiAgICB0aGlzLmNvbnRleHRNZW51LmNsb3NlKCk7XG4gIH0sXG5cbiAgc2hvd0NvbnRleHRNZW51OiBmdW5jdGlvbiAoY2VsbE1vZGVsLCBldnQpIHtcbiAgICBpZiAoIXRoaXMuY29udGV4dE1lbnUpIHsgcmV0dXJuOyB9XG5cbiAgICB2YXIgdGFibGUgPSB0aGlzLm1vZGVsO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBzY29wZTogIGNlbGxNb2RlbCxcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIGxlZnQ6ICAgZXZ0LnBhZ2VYLFxuICAgICAgdG9wOiAgICBldnQucGFnZVlcbiAgICB9O1xuXG4gICAgb3B0aW9ucy5jb21tYW5kcyA9IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdSdWxlJyxcbiAgICAgICAgaWNvbjogJycsXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdhYm92ZScsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHRoaXMuc2NvcGUsIC0xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgICAgICBpY29uOiAnYmVsb3cnLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSBydWxlIGJlbG93IHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlLmFkZFJ1bGUodGhpcy5zY29wZSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICAvLyB7XG4gICAgICAgICAgLy8gICBsYWJlbDogJ2NvcHknLFxuICAgICAgICAgIC8vICAgaWNvbjogJ2NvcHknLFxuICAgICAgICAgIC8vICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyAgICAgdGFibGUuY29weVJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgICAgLy8gICB9LFxuICAgICAgICAgIC8vICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgIC8vICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgIC8vICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgLy8gICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYWJvdmUgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vICAgICAgICAgdGFibGUuY29weVJ1bGUodGhpcy5zY29wZSwgLTEpO1xuICAgICAgICAgIC8vICAgICAgIH1cbiAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgIC8vICAgICAgIGxhYmVsOiAnYmVsb3cnLFxuICAgICAgICAgIC8vICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgLy8gICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYmVsb3cgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vICAgICAgICAgdGFibGUuY29weVJ1bGUodGhpcy5zY29wZSwgMSk7XG4gICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgLy8gICBdXG4gICAgICAgICAgLy8gfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICAgICAgaGludDogJ1JlbW92ZSB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRhYmxlLnJlbW92ZVJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2NsZWFyJyxcbiAgICAgICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgICAgICBoaW50OiAnQ2xlYXIgdGhlIGZvY3VzZWQgcnVsZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0YWJsZS5jbGVhclJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXTtcblxuICAgIHZhciB0eXBlID0gY2VsbE1vZGVsLnR5cGU7XG4gICAgdmFyIGFkZE1ldGhvZCA9IHR5cGUgPT09ICdpbnB1dCcgPyAnYWRkSW5wdXQnIDogJ2FkZE91dHB1dCc7XG5cbiAgICBvcHRpb25zLmNvbW1hbmRzLnVuc2hpZnQoe1xuICAgICAgbGFiZWw6IHR5cGUgPT09ICdpbnB1dCcgPyAnSW5wdXQnIDogJ091dHB1dCcsXG4gICAgICBpY29uOiB0eXBlLFxuICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhYmxlW2FkZE1ldGhvZF0oKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAnYmVmb3JlJyxcbiAgICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgICBoaW50OiAnQWRkIGFuICcgKyB0eXBlICsgJyBjbGF1c2UgYmVmb3JlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGFibGVbYWRkTWV0aG9kXSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgICAgaWNvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgaGludDogJ0FkZCBhbiAnICsgdHlwZSArICcgY2xhdXNlIGFmdGVyIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGFibGVbYWRkTWV0aG9kXSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgICAgaGludDogJ1JlbW92ZSB0aGUgJyArIHR5cGUgKyAnIGNsYXVzZScsXG4gICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjbGF1c2UgPSBjZWxsTW9kZWwuY2xhdXNlO1xuICAgICAgICAgICAgdmFyIGRlbHRhID0gY2xhdXNlLmNvbGxlY3Rpb24uaW5kZXhPZihjbGF1c2UpO1xuICAgICAgICAgICAgY2xhdXNlLmNvbGxlY3Rpb24ucmVtb3ZlKGNsYXVzZSk7XG5cbiAgICAgICAgICAgIGlmIChjbGF1c2UuY2xhdXNlVHlwZSA9PT0gJ291dHB1dCcpIHtcbiAgICAgICAgICAgICAgZGVsdGEgKz0gdGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFibGUucnVsZXMuZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgICAgICB2YXIgY2VsbCA9IHJ1bGUuY2VsbHMuYXQoZGVsdGEpO1xuICAgICAgICAgICAgICBydWxlLmNlbGxzLnJlbW92ZShjZWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGFibGUucnVsZXMudHJpZ2dlcigncmVzZXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHRoaXMuY29udGV4dE1lbnUub3BlbihvcHRpb25zKTtcblxuICAgIHRyeSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9LFxuXG5cbiAgcGFyc2VDaG9pY2VzOiBmdW5jdGlvbiAoZWwpIHtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm4gJ01JU1NJTkcnO1xuICAgIH1cbiAgICB2YXIgY29udGVudCA9IGVsLnRleHRDb250ZW50LnRyaW0oKTtcblxuICAgIGlmIChjb250ZW50WzBdID09PSAnKCcgJiYgY29udGVudC5zbGljZSgtMSkgPT09ICcpJykge1xuICAgICAgcmV0dXJuIGNvbnRlbnRcbiAgICAgICAgLnNsaWNlKDEsIC0xKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgcmV0dXJuICEhc3RyO1xuICAgICAgICB9KVxuICAgICAgICA7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9LFxuXG4gIHBhcnNlUnVsZXM6IGZ1bmN0aW9uIChydWxlRWxzKSB7XG4gICAgcmV0dXJuIHJ1bGVFbHMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgcmV0dXJuIGVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB9KTtcbiAgfSxcblxuICBwYXJzZVRhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlucHV0cyA9IFtdO1xuICAgIHZhciBvdXRwdXRzID0gW107XG4gICAgdmFyIHJ1bGVzID0gW107XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0aGVhZCAubGFiZWxzIC5pbnB1dCcpLmZvckVhY2goZnVuY3Rpb24gKGVsLCBudW0pIHtcbiAgICAgIHZhciBjaG9pY2VFbHMgPSB0aGlzLnF1ZXJ5KCd0aGVhZCAudmFsdWVzIC5pbnB1dDpudGgtY2hpbGQoJyArIChudW0gKyAxKSArICcpJyk7XG5cbiAgICAgIGlucHV0cy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICAgIGVsLnRleHRDb250ZW50LnRyaW0oKSxcbiAgICAgICAgY2hvaWNlczogIHRoaXMucGFyc2VDaG9pY2VzKGNob2ljZUVscylcbiAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5xdWVyeUFsbCgndGhlYWQgLmxhYmVscyAub3V0cHV0JykuZm9yRWFjaChmdW5jdGlvbiAoZWwsIG51bSkge1xuICAgICAgdmFyIGNob2ljZUVscyA9IHRoaXMucXVlcnkoJ3RoZWFkIC52YWx1ZXMgLm91dHB1dDpudGgtY2hpbGQoJyArIChudW0gKyBpbnB1dHMubGVuZ3RoICsgMSkgKyAnKScpO1xuXG4gICAgICBvdXRwdXRzLnB1c2goe1xuICAgICAgICBsYWJlbDogICAgZWwudGV4dENvbnRlbnQudHJpbSgpLFxuICAgICAgICBjaG9pY2VzOiAgdGhpcy5wYXJzZUNob2ljZXMoY2hvaWNlRWxzKVxuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0Ym9keSB0cicpLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xuICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICB2YXIgY2VsbEVscyA9IHJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpO1xuXG4gICAgICBmb3IgKHZhciBjID0gMTsgYyA8IGNlbGxFbHMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgdmFyIGNob2ljZXMgPSBudWxsO1xuICAgICAgICB2YXIgdmFsdWUgPSBjZWxsRWxzW2NdLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgdmFyIHR5cGUgPSBjIDw9IGlucHV0cy5sZW5ndGggPyAnaW5wdXQnIDogKGMgPCAoY2VsbEVscy5sZW5ndGggLSAxKSA/ICdvdXRwdXQnIDogJ2Fubm90YXRpb24nKTtcbiAgICAgICAgdmFyIG9jID0gYyAtIChpbnB1dHMubGVuZ3RoICsgMSk7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdpbnB1dCcgJiYgaW5wdXRzW2MgLSAxXSkge1xuICAgICAgICAgIGNob2ljZXMgPSBpbnB1dHNbYyAtIDFdLmNob2ljZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ291dHB1dCcgJiYgb3V0cHV0c1tvY10pIHtcbiAgICAgICAgICBjaG9pY2VzID0gb3V0cHV0c1tvY10uY2hvaWNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxzLnB1c2goe1xuICAgICAgICAgIHZhbHVlOiAgICB2YWx1ZSxcbiAgICAgICAgICBjaG9pY2VzOiAgY2hvaWNlc1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcnVsZXMucHVzaCh7XG4gICAgICAgIGNlbGxzOiBjZWxsc1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm1vZGVsLm5hbWUgPSB0aGlzLnF1ZXJ5KCdoMycpLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB0aGlzLm1vZGVsLmlucHV0cy5yZXNldChpbnB1dHMpO1xuICAgIHRoaXMubW9kZWwub3V0cHV0cy5yZXNldChvdXRwdXRzKTtcbiAgICB0aGlzLm1vZGVsLnJ1bGVzLnJlc2V0KHJ1bGVzKTtcblxuICAgIHJldHVybiB0aGlzLnRvSlNPTigpO1xuICB9LFxuXG4gIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLnRvSlNPTigpO1xuICB9LFxuXG4gIGlucHV0Q2xhdXNlVmlld3M6IFtdLFxuICBvdXRwdXRDbGF1c2VWaWV3czogW10sXG5cbiAgX2hlYWRlckNsZWFyOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHRvQXJyYXkodGhpcy5sYWJlbHNSb3dFbC5xdWVyeVNlbGVjdG9yQWxsKCcuJysgdHlwZSkpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLmxhYmVsc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRvQXJyYXkodGhpcy52YWx1ZXNSb3dFbC5xdWVyeVNlbGVjdG9yQWxsKCcuJysgdHlwZSkpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLnZhbHVlc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRvQXJyYXkodGhpcy5tYXBwaW5nc1Jvd0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nKyB0eXBlKSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHRoaXMubWFwcGluZ3NSb3dFbC5yZW1vdmVDaGlsZChlbCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbCkge1xuICAgICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnBhcnNlVGFibGUoKTtcbiAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlOmVsJyk7XG4gICAgfVxuXG4gICAgdmFyIHRhYmxlID0gdGhpcy5tb2RlbDtcblxuICAgIGlmICghdGhpcy5oZWFkZXJFbCkge1xuICAgICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgICAgdGFibGVFbDogICAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgdGFibGVOYW1lRWw6ICAgICAgJ2hlYWRlciBoMycsXG4gICAgICAgIGhlYWRlckVsOiAgICAgICAgICd0aGVhZCcsXG4gICAgICAgIGJvZHlFbDogICAgICAgICAgICd0Ym9keScsXG4gICAgICAgIGlucHV0c0hlYWRlckVsOiAgICd0aGVhZCB0cjpudGgtY2hpbGQoMSkgdGguaW5wdXQnLFxuICAgICAgICBvdXRwdXRzSGVhZGVyRWw6ICAndGhlYWQgdHI6bnRoLWNoaWxkKDEpIHRoLm91dHB1dCcsXG4gICAgICAgIGxhYmVsc1Jvd0VsOiAgICAgICd0aGVhZCB0ci5sYWJlbHMnLFxuICAgICAgICB2YWx1ZXNSb3dFbDogICAgICAndGhlYWQgdHIudmFsdWVzJyxcbiAgICAgICAgbWFwcGluZ3NSb3dFbDogICAgJ3RoZWFkIHRyLm1hcHBpbmdzJ1xuICAgICAgfSk7XG5cblxuICAgICAgdGhpcy5pbnB1dHNIZWFkZXJFbC5hcHBlbmRDaGlsZChtYWtlQWRkQnV0dG9uKCdpbnB1dCcsIHRhYmxlKSk7XG4gICAgICB0aGlzLm91dHB1dHNIZWFkZXJFbC5hcHBlbmRDaGlsZChtYWtlQWRkQnV0dG9uKCdvdXRwdXQnLCB0YWJsZSkpO1xuICAgIH1cblxuXG4gICAgWydpbnB1dCcsICdvdXRwdXQnXS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWxbdHlwZSArICdzJ10sICdhZGQgcmVzZXQgcmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBjb2xzID0gdGhpcy5tb2RlbFt0eXBlICsgJ3MnXS5sZW5ndGg7XG4gICAgICAgIGlmIChjb2xzID4gMSkge1xuICAgICAgICAgIHRoaXNbdHlwZSArICdzSGVhZGVyRWwnXS5zZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nLCBjb2xzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzW3R5cGUgKyAnc0hlYWRlckVsJ10ucmVtb3ZlQXR0cmlidXRlKCdjb2xzcGFuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oZWFkZXJDbGVhcih0eXBlKTtcbiAgICAgICAgdGhpc1t0eXBlICsgJ0NsYXVzZVZpZXdzJ10uZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubW9kZWxbdHlwZSArICdzJ10uZm9yRWFjaChmdW5jdGlvbiAoY2xhdXNlKSB7XG4gICAgICAgICAgdmFyIGxhYmVsRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIHZhbHVlRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIG1hcHBpbmdFbCA9IG1ha2VUZCh0eXBlKTtcblxuICAgICAgICAgIHZhciB2aWV3ID0gbmV3IENsYXVzZUhlYWRlclZpZXcoe1xuICAgICAgICAgICAgbGFiZWxFbDogICAgbGFiZWxFbCxcbiAgICAgICAgICAgIHZhbHVlRWw6ICAgIHZhbHVlRWwsXG4gICAgICAgICAgICBtYXBwaW5nRWw6ICBtYXBwaW5nRWwsXG5cbiAgICAgICAgICAgIG1vZGVsOiAgICAgIGNsYXVzZSxcbiAgICAgICAgICAgIHBhcmVudDogICAgIHRoaXNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFsnbGFiZWwnLCAndmFsdWUnLCAnbWFwcGluZyddLmZvckVhY2goZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICAgIHRoaXNba2luZCArJ3NSb3dFbCddLmluc2VydEJlZm9yZSh2aWV3W2tpbmQgKyAnRWwnXSwgdGhpc1traW5kICsnc1Jvd0VsJ10ucXVlcnlTZWxlY3RvcignLm91dHB1dCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzW2tpbmQgKydzUm93RWwnXS5hcHBlbmRDaGlsZCh2aWV3W2tpbmQgKyAnRWwnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcblxuICAgICAgICAgIHRoaXNbdHlwZSArICdDbGF1c2VWaWV3cyddLnB1c2godmlldyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cblxuICAgIHRoaXMuYm9keUVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMucnVsZXNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMubW9kZWwucnVsZXMsIFJ1bGVWaWV3LCB0aGlzLmJvZHlFbCk7XG5cblxuICAgIGlmICghdGhpcy5mb290RWwpIHtcbiAgICAgIHZhciBmb290RWwgPSB0aGlzLmZvb3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rmb290Jyk7XG4gICAgICBmb290RWwuY2xhc3NOYW1lID0gICdydWxlcy1jb250cm9scyc7XG4gICAgICBmb290RWwuaW5uZXJIVE1MID0gICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImFkZC1ydWxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGEgdGl0bGU9XCJBZGQgYSBydWxlXCIgY2xhc3M9XCJpY29uLWRtbiBpY29uLXBsdXNcIj48L2E+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvdGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBjb2xzcGFuPVwiM1wiPjwvdGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L3RyPic7XG4gICAgICB0aGlzLnRhYmxlRWwuYXBwZW5kQ2hpbGQoZm9vdEVsKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbWFrZUNvbHNwYW4oKSB7XG4gICAgICB2YXIgY291bnQgPSAxICsgTWF0aC5tYXgoMSwgc2VsZi5tb2RlbC5pbnB1dHMubGVuZ3RoKSArIE1hdGgubWF4KDEsIHNlbGYubW9kZWwub3V0cHV0cy5sZW5ndGgpO1xuICAgICAgdmFyIHRkcyA9IFtzZWxmLnF1ZXJ5KCd0Zm9vdCAuYWRkLXJ1bGUnKS5vdXRlckhUTUxdO1xuICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBjb3VudDsgYysrKSB7XG4gICAgICAgIHRkcy5wdXNoKCc8dGQ+PC90ZD4nKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuZm9vdEVsLmlubmVySFRNTCA9IHRkcy5qb2luKCcnKTtcbiAgICB9XG4gICAgdGhpcy5tb2RlbC5pbnB1dHMub24oJ2FkZCByZW1vdmUgcmVzZXQnLCBtYWtlQ29sc3Bhbik7XG4gICAgdGhpcy5tb2RlbC5vdXRwdXRzLm9uKCdhZGQgcmVtb3ZlIHJlc2V0JywgbWFrZUNvbHNwYW4pO1xuICAgIG1ha2VDb2xzcGFuKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVjaXNpb25UYWJsZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cblxudmFyIERlY2lzaW9uVGFibGVWaWV3ID0gcmVxdWlyZSgnLi9kZWNpc2lvbi10YWJsZS12aWV3Jyk7XG5yZXF1aXJlKCcuL2NvbnRleHRtZW51LXZpZXcnKTtcbnJlcXVpcmUoJy4vY2xhdXNldmFsdWVzLXNldHRlci12aWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVjaXNpb25UYWJsZVZpZXc7XG5cbmZ1bmN0aW9uIG5vZGVMaXN0YXJyYXkoZWxzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGVscykpIHtcbiAgICByZXR1cm4gZWxzO1xuICB9XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBhcnIucHVzaChlbHNbaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEFsbChzZWxlY3RvciwgY3R4KSB7XG4gIGN0eCA9IGN0eCB8fCBkb2N1bWVudDtcbiAgcmV0dXJuIG5vZGVMaXN0YXJyYXkoY3R4LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbn1cbndpbmRvdy5zZWxlY3RBbGwgPSBzZWxlY3RBbGw7XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSovXG5cbnZhciBDbGF1c2UgPSByZXF1aXJlKCcuL2NsYXVzZS1kYXRhJyk7XG5cbnZhciBJbnB1dE1vZGVsID0gQ2xhdXNlLk1vZGVsLmV4dGVuZCh7XG4gIGNsYXVzZVR5cGU6ICdpbnB1dCcsXG5cbiAgZGVyaXZlZDoge1xuICAgIHg6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2NvbGxlY3Rpb24nXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmb2N1c2VkOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnggPT09IHRoaXMueDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IElucHV0TW9kZWwsXG4gIENvbGxlY3Rpb246IENsYXVzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IElucHV0TW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSovXG5cbnZhciBDbGF1c2UgPSByZXF1aXJlKCcuL2NsYXVzZS1kYXRhJyk7XG5cbnZhciBPdXRwdXRNb2RlbCA9IENsYXVzZS5Nb2RlbC5leHRlbmQoe1xuICBjbGF1c2VUeXBlOiAnb3V0cHV0JyxcblxuICBkZXJpdmVkOiB7XG4gICAgeDoge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudCcsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudC5pbnB1dHMnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpICsgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5pbnB1dHMubGVuZ3RoO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmb2N1c2VkOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50JyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50LmlucHV0cydcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGFibGUgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgICByZXR1cm4gdGFibGUueCA9PT0gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcykgKyB0YWJsZS5pbnB1dHMubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogT3V0cHV0TW9kZWwsXG4gIENvbGxlY3Rpb246IENsYXVzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IE91dHB1dE1vZGVsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogdHJ1ZSwgcmVxdWlyZTogZmFsc2UqL1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHsgdmFyIGRlcHMgPSByZXF1aXJlOyB9XG5lbHNlIHsgdmFyIGRlcHMgPSB3aW5kb3cuZGVwczsgfVxuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcbnZhciBDZWxsID0gcmVxdWlyZSgnLi9jZWxsLWRhdGEnKTtcblxudmFyIFJ1bGVNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgY2VsbHM6IENlbGwuQ29sbGVjdGlvblxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICB0YWJsZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudCdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZm9jdXNlZDoge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZSdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcykgPT09IHRoaXMudGFibGUueTtcbiAgICAgIH1cbiAgICB9LFxuXG5cbiAgICBkZWx0YToge1xuICAgICAgZGVwczogWydjb2xsZWN0aW9uJ10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gMSArIHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbnB1dENlbGxzOiB7XG4gICAgICBkZXBzOiBbJ2NlbGxzJywgJ3RhYmxlLmlucHV0cyddLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMubW9kZWxzLnNsaWNlKDAsIHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG91dHB1dENlbGxzOiB7XG4gICAgICBkZXBzOiBbJ2NlbGxzJywgJ3RhYmxlLmlucHV0cyddLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMubW9kZWxzLnNsaWNlKHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aCwgLTEpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBhbm5vdGF0aW9uOiB7XG4gICAgICBkZXBzOiBbJ2NlbGxzJ10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHNbdGhpcy5jZWxscy5sZW5ndGggLSAxXTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZW5zdXJlQ2VsbHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aCArIHRoaXMudGFibGUub3V0cHV0cy5sZW5ndGggKyAxO1xuXG4gICAgLy8gZmluZVxuICAgIGlmICh0aGlzLmNlbGxzLmxlbmd0aCA9PT0gYyB8fCBjID09PSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gbmVlZHMgdG8gYmUgZmlsbGVkXG4gICAgaWYgKHRoaXMuY2VsbHMubGVuZ3RoIDwgYykge1xuICAgICAgd2hpbGUgKHRoaXMuY2VsbHMubGVuZ3RoIDw9IGMpIHtcbiAgICAgICAgdGhpcy5jZWxscy5hZGQoe3ZhbHVlOicnfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbmVlZHMgdG8gYmUgdHJ1bmNhdGVkXG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmNlbGxzLm1vZGVscyA9IHRoaXMuY2VsbHMubW9kZWxzLnNsaWNlKDAsIGMpO1xuICAgIH1cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnRhYmxlLmlucHV0cywgJ3Jlc2V0JywgdGhpcy5lbnN1cmVDZWxscyk7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLnRhYmxlLm91dHB1dHMsICdyZXNldCcsIHRoaXMuZW5zdXJlQ2VsbHMpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBSdWxlTW9kZWwsXG5cbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBSdWxlTW9kZWwsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgQ2VsbFZpZXdzID0gcmVxdWlyZSgnLi9jZWxsLXZpZXcnKTtcbnZhciBtZXJnZSA9IGRlcHMoJ2xvZGFzaC5tZXJnZScpO1xudmFyIGNvbnRleHRWaWV3c01peGluID0gcmVxdWlyZSgnLi9jb250ZXh0LXZpZXdzLW1peGluJyk7XG5cbnZhciBSdWxlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8dHI+PHRkIGNsYXNzPVwibnVtYmVyXCI+PC90ZD48L3RyPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuZGVsdGEnOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJy5udW1iZXInXG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IG1lcmdlKHt9LCBjb250ZXh0Vmlld3NNaXhpbiwge1xuICAgIGlucHV0czoge1xuICAgICAgZGVwczogW1xuICAgICAgICAncGFyZW50JyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwuaW5wdXRzJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5tb2RlbC5pbnB1dHM7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG91dHB1dHM6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3BhcmVudCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwnLFxuICAgICAgICAncGFyZW50Lm1vZGVsLm91dHB1dHMnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm1vZGVsLm91dHB1dHM7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFubm90YXRpb246IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3BhcmVudCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwnLFxuICAgICAgICAncGFyZW50Lm1vZGVsLmFubm90YXRpb25zJ1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5tb2RlbC5hbm5vdGF0aW9ucy5hdCgwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pLFxuXG4gIGV2ZW50czoge1xuICAgICdjb250ZXh0bWVudSAubnVtYmVyJzogJ19oYW5kbGVSb3dDb250ZXh0TWVudSdcbiAgfSxcblxuICBfaGFuZGxlUm93Q29udGV4dE1lbnU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgcnVsZSA9IHRoaXMubW9kZWw7XG4gICAgdmFyIHRhYmxlID0gcnVsZS5jb2xsZWN0aW9uLnBhcmVudDtcblxuICAgIHRoaXMuY29udGV4dE1lbnUub3Blbih7XG4gICAgICBwYXJlbnQ6ICAgdGhpcyxcbiAgICAgIGxlZnQ6ICAgICBldnQucGFnZVgsXG4gICAgICB0b3A6ICAgICAgZXZ0LnBhZ2VZLFxuICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnUnVsZScsXG4gICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZShydWxlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZShydWxlLCAtMSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZShydWxlLCAxKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgIGxhYmVsOiAnY29weScsXG4gICAgICAgICAgICAvLyAgIGljb246ICdjb3B5JyxcbiAgICAgICAgICAgIC8vICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICB0YWJsZS5jb3B5UnVsZShydWxlKTtcbiAgICAgICAgICAgIC8vICAgfSxcbiAgICAgICAgICAgIC8vICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAvLyAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAgIC8vICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgICAvLyAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdGFibGUuY29weVJ1bGUocnVsZSwgLTEpO1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgLy8gICAgICAgbGFiZWw6ICdiZWxvdycsXG4gICAgICAgICAgICAvLyAgICAgICBpY29uOiAnYmVsb3cnLFxuICAgICAgICAgICAgLy8gICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYmVsb3cgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIHRhYmxlLmNvcHlSdWxlKHJ1bGUsIDEpO1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgXVxuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoaXMgcnVsZScsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVsZS5jb2xsZWN0aW9uLnJlbW92ZShydWxlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5jbGVhclJ1bGUocnVsZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcblxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuXG4gIHNldEZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKHRoaXMubW9kZWwuZm9jdXNlZCkge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdyb3ctZm9jdXNlZCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgncm93LWZvY3VzZWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWwudGFibGU7XG5cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRhYmxlLCAnY2hhbmdlOmZvY3VzJywgdGhpcy5zZXRGb2N1cyk7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0YWJsZS5pbnB1dHMsICdhZGQgcmVtb3ZlIHJlc2V0JywgdGhpcy5yZW5kZXIpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGFibGUub3V0cHV0cywgJ2FkZCByZW1vdmUgcmVzZXQnLCB0aGlzLnJlbmRlcik7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcblxuICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICBudW1iZXJFbDogJy5udW1iZXInXG4gICAgfSk7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgc3VidmlldztcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgc3VidmlldyA9IG5ldyBDZWxsVmlld3MuSW5wdXQoe1xuICAgICAgICBtb2RlbDogIHRoaXMubW9kZWwuY2VsbHMuYXQoaSksXG4gICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZChzdWJ2aWV3LmVsKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5vdXRwdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdWJ2aWV3ID0gbmV3IENlbGxWaWV3cy5PdXRwdXQoe1xuICAgICAgICBtb2RlbDogIHRoaXMubW9kZWwuY2VsbHMuYXQodGhpcy5pbnB1dHMubGVuZ3RoICsgaSksXG4gICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZChzdWJ2aWV3LmVsKTtcbiAgICB9XG4gICAgc3VidmlldyA9IG5ldyBDZWxsVmlld3MuQW5ub3RhdGlvbih7XG4gICAgICBtb2RlbDogIHRoaXMubW9kZWwuYW5ub3RhdGlvbixcbiAgICAgIHBhcmVudDogdGhpc1xuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoc3Vidmlldy5lbCk7XG5cblxuICAgIHRoaXMuc2V0Rm9jdXMoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUnVsZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG5cblxuXG52YXIgU3VnZ2VzdGlvbnNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnLFxuICAgICAgaHRtbDogJ3N0cmluZydcbiAgICB9XG4gIH0pXG59KTtcblxuXG5cbnZhciBTdWdnZXN0aW9uc0l0ZW1WaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzxsaT48L2xpPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaHRtbCc6IHtcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAnX2hhbmRsZUNsaWNrJ1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIXRoaXMucGFyZW50LnBhcmVudCkgeyByZXR1cm47IH1cbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5wYXJlbnQucGFyZW50O1xuICAgIFxuICAgIGlmICh0YXJnZXQubW9kZWwgJiYgdHlwZW9mIHRhcmdldC5tb2RlbC52YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRhcmdldC5tb2RlbC52YWx1ZSA9IHRoaXMubW9kZWwudmFsdWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRhcmdldC5lbCkge1xuICAgICAgdGFyZ2V0LmVsLnRleHRDb250ZW50ID0gdGhpcy5tb2RlbC52YWx1ZTtcbiAgICB9XG4gIH1cbn0pO1xuXG5cblxudmFyIFN1Z2dlc3Rpb25zVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgc2Vzc2lvbjoge1xuICAgIHZpc2libGU6ICdib29sZWFuJ1xuICB9LFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgdmlzaWJsZToge1xuICAgICAgdHlwZTogJ3RvZ2dsZSdcbiAgICB9XG4gIH0sXG5cbiAgdGVtcGxhdGU6ICc8dWwgY2xhc3M9XCJkbW4tc3VnZ2VzdGlvbnMtaGVscGVyXCI+PC91bD4nLFxuXG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgc3VnZ2VzdGlvbnM6IFN1Z2dlc3Rpb25zQ29sbGVjdGlvblxuICB9LFxuXG4gIHNldFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnBhcmVudCB8fCAhdGhpcy5wYXJlbnQuZWwpIHtcbiAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBub2RlID0gdGhpcy5wYXJlbnQuZWw7XG4gICAgdmFyIHRvcCA9IG5vZGUub2Zmc2V0VG9wO1xuICAgIHZhciBsZWZ0ID0gbm9kZS5vZmZzZXRMZWZ0O1xuICAgIHZhciBoZWxwZXIgPSB0aGlzLmVsO1xuXG4gICAgd2hpbGUgKChub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQpKSB7XG4gICAgICBpZiAobm9kZS5vZmZzZXRUb3ApIHtcbiAgICAgICAgdG9wICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0VG9wLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5vZmZzZXRMZWZ0KSB7XG4gICAgICAgIGxlZnQgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRMZWZ0LCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9wIC09IGhlbHBlci5jbGllbnRIZWlnaHQ7XG4gICAgaGVscGVyLnN0eWxlLnRvcCA9IHRvcDtcbiAgICBoZWxwZXIuc3R5bGUubGVmdCA9IGxlZnQ7XG4gIH0sXG5cbiAgc2hvdzogZnVuY3Rpb24gKHN1Z2dlc3Rpb25zLCBwYXJlbnQsIGZvcmNlKSB7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKHN1Z2dlc3Rpb25zKSB7XG4gICAgICBpZiAoc3VnZ2VzdGlvbnMuaXNDb2xsZWN0aW9uKSB7XG4gICAgICAgIGluc3RhbmNlLnN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnM7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2Uuc3VnZ2VzdGlvbnMucmVzZXQoc3VnZ2VzdGlvbnMpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpbnN0YW5jZS52aXNpYmxlID0gZm9yY2UgfHwgc3VnZ2VzdGlvbnMubGVuZ3RoID4gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpbnN0YW5jZS52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGluc3RhbmNlLnZpc2libGUpIHtcbiAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hvdyhbXSwgdGhpcy5wYXJlbnQpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuc3VnZ2VzdGlvbnMsIFN1Z2dlc3Rpb25zSXRlbVZpZXcsIHRoaXMuZWwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuXG5cbnZhciBpbnN0YW5jZTtcblN1Z2dlc3Rpb25zVmlldy5pbnN0YW5jZSA9IGZ1bmN0aW9uIChzdWdnZXN0aW9ucywgcGFyZW50KSB7XG4gIGlmICghaW5zdGFuY2UpIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBTdWdnZXN0aW9uc1ZpZXcoe30pO1xuICAgIGluc3RhbmNlLnJlbmRlcigpO1xuICB9XG5cbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGluc3RhbmNlLmVsKSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zdGFuY2UuZWwpO1xuICB9XG5cbiAgaW5zdGFuY2Uuc2hvdyhzdWdnZXN0aW9ucywgcGFyZW50KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59O1xuXG5cblN1Z2dlc3Rpb25zVmlldy5Db2xsZWN0aW9uID0gU3VnZ2VzdGlvbnNDb2xsZWN0aW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1Z2dlc3Rpb25zVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IHRydWUsIHJlcXVpcmU6IGZhbHNlLCBjb25zb2xlOiBmYWxzZSovXG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgeyB2YXIgZGVwcyA9IHJlcXVpcmU7IH1cbmVsc2UgeyB2YXIgZGVwcyA9IHdpbmRvdy5kZXBzOyB9XG5cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0LWRhdGEnKTtcbnZhciBPdXRwdXQgPSByZXF1aXJlKCcuL291dHB1dC1kYXRhJyk7XG5cbnZhciBSdWxlID0gcmVxdWlyZSgnLi9ydWxlLWRhdGEnKTtcblxudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnbG9kYXNoLmRlZmF1bHRzJyk7XG5cbnZhciBEZWNpc2lvblRhYmxlTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICBjb2xsZWN0aW9uczoge1xuICAgIGlucHV0czogICBJbnB1dC5Db2xsZWN0aW9uLFxuICAgIG91dHB1dHM6ICBPdXRwdXQuQ29sbGVjdGlvbixcbiAgICBydWxlczogICAgUnVsZS5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBuYW1lOiAnc3RyaW5nJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICB4OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9LFxuXG4gICAgeToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfSxcblxuXG4gICAgbG9nTGV2ZWw6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH1cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRhYmxlID0gdGhpcztcbiAgICBbXG4gICAgICAnaW5wdXRzJyxcbiAgICAgICdvdXRwdXRzJyxcbiAgICAgICdydWxlcydcbiAgICBdLmZvckVhY2goZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gICAgICBbXG4gICAgICAgICdhZGQnLFxuICAgICAgICAncmVtb3ZlJyxcbiAgICAgICAgJ3NvcnQnLFxuICAgICAgICAncmVzZXQnXG4gICAgICBdLmZvckVhY2goZnVuY3Rpb24gKGV2dE5hbWUpIHtcbiAgICAgICAgdGFibGUubGlzdGVuVG8odGFibGVbY29sbGVjdGlvbk5hbWVdLCBldnROYW1lLCBmdW5jdGlvbiAoYXJnMSwgYXJnMiwgYXJnMykge1xuICAgICAgICAgIHRhYmxlLnRyaWdnZXIoY29sbGVjdGlvbk5hbWUgKyAnOicgKyBldnROYW1lLCBhcmcxLCBhcmcyLCBhcmczKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5pbnB1dHMsICdyZW1vdmUgcmVzZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pbnB1dHMubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgICAgdGhpcy5pbnB1dHMuYWRkKHt9KTtcbiAgICB9KTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5vdXRwdXRzLCAncmVtb3ZlIHJlc2V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMub3V0cHV0cy5sZW5ndGgpIHsgcmV0dXJuOyB9XG4gICAgICB0aGlzLm91dHB1dHMuYWRkKHt9KTtcbiAgICB9KTtcbiAgfSxcblxuICBsb2c6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO1xuICAgIHZhciBtZXRob2QgPSBhcmdzLnNoaWZ0KCk7XG4gICAgYXJncy51bnNoaWZ0KHRoaXMuY2lkKTtcbiAgICBjb25zb2xlW21ldGhvZF0uYXBwbHkoY29uc29sZSwgYXJncyk7XG4gIH0sXG5cbiAgX3J1bGVDbGlwYm9hcmQ6IG51bGwsXG5cblxuICBhZGRSdWxlOiBmdW5jdGlvbiAoc2NvcGVDZWxsLCBiZWZvcmVBZnRlcikge1xuICAgIHZhciBjZWxscyA9IFtdO1xuICAgIHZhciBjO1xuXG4gICAgZm9yIChjID0gMDsgYyA8IHRoaXMuaW5wdXRzLmxlbmd0aDsgYysrKSB7XG4gICAgICBjZWxscy5wdXNoKHtcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAvLyBjaG9pY2VzOiB0aGlzLmlucHV0cy5hdChjKS5jaG9pY2VzLFxuICAgICAgICBmb2N1c2VkOiBjID09PSAwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKGMgPSAwOyBjIDwgdGhpcy5vdXRwdXRzLmxlbmd0aDsgYysrKSB7XG4gICAgICBjZWxscy5wdXNoKHtcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAvLyBjaG9pY2VzOiB0aGlzLm91dHB1dHMuYXQoYykuY2hvaWNlc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2VsbHMucHVzaCh7XG4gICAgICB2YWx1ZTogJydcbiAgICB9KTtcblxuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgaWYgKGJlZm9yZUFmdGVyKSB7XG4gICAgICB2YXIgcnVsZURlbHRhID0gdGhpcy5ydWxlcy5pbmRleE9mKHNjb3BlQ2VsbC5jb2xsZWN0aW9uLnBhcmVudCk7XG4gICAgICBvcHRpb25zLmF0ID0gcnVsZURlbHRhICsgKGJlZm9yZUFmdGVyID4gMCA/IHJ1bGVEZWx0YSA6IChydWxlRGVsdGEgLSAxKSk7XG4gICAgfVxuXG4gICAgdGhpcy5ydWxlcy5hZGQoe1xuICAgICAgY2VsbHM6IGNlbGxzXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW1vdmVSdWxlOiBmdW5jdGlvbiAoc2NvcGVDZWxsKSB7XG4gICAgdGhpcy5ydWxlcy5yZW1vdmUoc2NvcGVDZWxsLmNvbGxlY3Rpb24ucGFyZW50KTtcbiAgICB0aGlzLnJ1bGVzLnRyaWdnZXIoJ3Jlc2V0Jyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICBjb3B5UnVsZTogZnVuY3Rpb24gKHNjb3BlQ2VsbCwgdXBEb3duKSB7XG4gICAgdmFyIHJ1bGUgPSBzY29wZUNlbGwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgaWYgKCFydWxlKSB7IHJldHVybiB0aGlzOyB9XG4gICAgdGhpcy5fcnVsZUNsaXBib2FyZCA9IHJ1bGU7XG5cbiAgICBpZiAodXBEb3duKSB7XG4gICAgICB2YXIgcnVsZURlbHRhID0gdGhpcy5ydWxlcy5pbmRleE9mKHJ1bGUpO1xuICAgICAgdGhpcy5wYXN0ZVJ1bGUocnVsZURlbHRhICsgKHVwRG93biA+IDEgPyAwIDogMSkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgcGFzdGVSdWxlOiBmdW5jdGlvbiAoZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuX3J1bGVDbGlwYm9hcmQpIHsgcmV0dXJuIHRoaXM7IH1cbiAgICB2YXIgZGF0YSA9IHRoaXMuX3J1bGVDbGlwYm9hcmQudG9KU09OKCk7XG4gICAgdGhpcy5ydWxlcy5hZGQoZGF0YSwge1xuICAgICAgYXQ6IGRlbHRhXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICBjbGVhclJ1bGU6IGZ1bmN0aW9uIChydWxlKSB7XG4gICAgdmFyIHJ1bGVEZWx0YSA9IHRoaXMucnVsZXMuaW5kZXhPZihydWxlKTtcbiAgICB0aGlzLnJ1bGVzLmF0KHJ1bGVEZWx0YSkuY2VsbHMuZm9yRWFjaChmdW5jdGlvbiAoY2VsbCkge1xuICAgICAgY2VsbC52YWx1ZSA9ICcnO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgX3J1bGVzQ2VsbHM6IGZ1bmN0aW9uIChhZGRlZCwgZGVsdGEpIHtcbiAgICB0aGlzLnJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIHJ1bGUuY2VsbHMuYWRkKHtcbiAgICAgICAgLy8gY2hvaWNlczogYWRkZWQuY2hvaWNlc1xuICAgICAgfSwge1xuICAgICAgICBhdDogZGVsdGEsXG4gICAgICAgIHNpbGVudDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJ1bGVzLnRyaWdnZXIoJ3Jlc2V0Jyk7XG4gIH0sXG5cbiAgYWRkSW5wdXQ6IGZ1bmN0aW9uIChkYXRhLCBwb3NpdGlvbikge1xuICAgIHZhciBkZWx0YSA9IHR5cGVvZiBwb3NpdGlvbiAhPT0gJ3VuZGVmaW5lZCcgPyBwb3NpdGlvbiA6IHRoaXMuaW5wdXRzLmxlbmd0aDtcbiAgICBkZWx0YSA9IGRlbHRhIDwgMCA/IDAgOiBkZWx0YTtcblxuICAgIHZhciBpbnB1dCA9IHt9O1xuICAgIGRlZmF1bHRzKGlucHV0LCBkYXRhLCB7XG4gICAgICBsYWJlbDogICAgbnVsbCxcbiAgICAgIGNob2ljZXM6ICBudWxsLFxuICAgICAgbWFwcGluZzogIG51bGwsXG4gICAgICBkYXRhdHlwZTogJ3N0cmluZydcbiAgICB9KTtcblxuICAgIHZhciBuZXdNb2RlbCA9IHRoaXMuaW5wdXRzLmFkZChpbnB1dCwge1xuICAgICAgYXQ6IGRlbHRhXG4gICAgfSk7XG5cbiAgICB0aGlzLl9ydWxlc0NlbGxzKG5ld01vZGVsLCBuZXdNb2RlbC5jb2xsZWN0aW9uLmluZGV4T2YobmV3TW9kZWwpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuXG4gIGFkZE91dHB1dDogZnVuY3Rpb24gKGRhdGEsIHBvc2l0aW9uKSB7XG4gICAgdmFyIGRlbHRhID0gdHlwZW9mIHBvc2l0aW9uICE9PSAndW5kZWZpbmVkJyA/IHBvc2l0aW9uIDogdGhpcy5vdXRwdXRzLmxlbmd0aDtcbiAgICBkZWx0YSA9IGRlbHRhIDwgMCA/IDAgOiBkZWx0YTtcblxuICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICBkZWZhdWx0cyhvdXRwdXQsIGRhdGEsIHtcbiAgICAgIGxhYmVsOiAgICBudWxsLFxuICAgICAgY2hvaWNlczogIG51bGwsXG4gICAgICBtYXBwaW5nOiAgbnVsbCxcbiAgICAgIGRhdGF0eXBlOiAnc3RyaW5nJ1xuICAgIH0pO1xuXG4gICAgdmFyIG5ld01vZGVsID0gdGhpcy5vdXRwdXRzLmFkZChvdXRwdXQsIHtcbiAgICAgIGF0OiBkZWx0YVxuICAgIH0pO1xuXG4gICAgdGhpcy5fcnVsZXNDZWxscyhuZXdNb2RlbCwgbmV3TW9kZWwuY29sbGVjdGlvbi5pbmRleE9mKG5ld01vZGVsKSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW1vdmVPdXRwdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuRGVjaXNpb25UYWJsZU1vZGVsID0gRGVjaXNpb25UYWJsZU1vZGVsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IERlY2lzaW9uVGFibGVNb2RlbFxufTtcbiJdfQ==
