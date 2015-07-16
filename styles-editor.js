/*!
 * Less - Leaner CSS v2.4.0
 * http://lesscss.org
 *
 * Copyright (c) 2009-2015, Alexis Sellier <self@cloudhead.net>
 * Licensed under the Apache v2 License.
 *
 */

 /** * @license Apache v2
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.less=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var addDataAttr = require("./utils").addDataAttr,
    browser = require("./browser");

module.exports = function(window, options) {

    // use options from the current script tag data attribues
    addDataAttr(options, browser.currentScript(window));

    if (options.isFileProtocol === undefined) {
        options.isFileProtocol = /^(file|(chrome|safari)(-extension)?|resource|qrc|app):/.test(window.location.protocol);
    }

    // Load styles asynchronously (default: false)
    //
    // This is set to `false` by default, so that the body
    // doesn't start loading before the stylesheets are parsed.
    // Setting this to `true` can result in flickering.
    //
    options.async = options.async || false;
    options.fileAsync = options.fileAsync || false;

    // Interval between watch polls
    options.poll = options.poll || (options.isFileProtocol ? 1000 : 1500);

    options.env = options.env || (window.location.hostname == '127.0.0.1' ||
        window.location.hostname == '0.0.0.0'   ||
        window.location.hostname == 'localhost' ||
        (window.location.port &&
            window.location.port.length > 0)      ||
        options.isFileProtocol                   ? 'development'
        : 'production');

    var dumpLineNumbers = /!dumpLineNumbers:(comments|mediaquery|all)/.exec(window.location.hash);
    if (dumpLineNumbers) {
        options.dumpLineNumbers = dumpLineNumbers[1];
    }

    if (options.useFileCache === undefined) {
        options.useFileCache = true;
    }

    if (options.onReady === undefined) {
        options.onReady = true;
    }

};

},{"./browser":3,"./utils":9}],2:[function(require,module,exports){
/**
 * Kicks off less and compiles any stylesheets
 * used in the browser distributed version of less
 * to kick-start less using the browser api
 */
/*global window */

// shim Promise if required
require('promise/polyfill.js');

var options = window.less || {};
require("./add-default-options")(window, options);

var less = module.exports = require("./index")(window, options);

if (options.onReady) {
    if (/!watch/.test(window.location.hash)) {
        less.watch();
    }

    less.pageLoadFinished = less.registerStylesheets().then(
        function () {
            return less.refresh(less.env === 'development');
        }
    );
}
},{"./add-default-options":1,"./index":7,"promise/polyfill.js":"promise/polyfill.js"}],3:[function(require,module,exports){
var utils = require("./utils");
module.exports = {
    createCSS: function (document, styles, sheet) {
        // Strip the query-string
        var href = sheet.href || '';

        // If there is no title set, use the filename, minus the extension
        var id = 'less:' + (sheet.title || utils.extractId(href));

        // If this has already been inserted into the DOM, we may need to replace it
        var oldStyleNode = document.getElementById(id);
        var keepOldStyleNode = false;

        // Create a new stylesheet node for insertion or (if necessary) replacement
        var styleNode = document.createElement('style');
        styleNode.setAttribute('type', 'text/css');
        if (sheet.media) {
            styleNode.setAttribute('media', sheet.media);
        }
        styleNode.id = id;

        if (!styleNode.styleSheet) {
            styleNode.appendChild(document.createTextNode(styles));

            // If new contents match contents of oldStyleNode, don't replace oldStyleNode
            keepOldStyleNode = (oldStyleNode !== null && oldStyleNode.childNodes.length > 0 && styleNode.childNodes.length > 0 &&
                oldStyleNode.firstChild.nodeValue === styleNode.firstChild.nodeValue);
        }

        var head = document.getElementsByTagName('head')[0];

        // If there is no oldStyleNode, just append; otherwise, only append if we need
        // to replace oldStyleNode with an updated stylesheet
        if (oldStyleNode === null || keepOldStyleNode === false) {
            var nextEl = sheet && sheet.nextSibling || null;
            if (nextEl) {
                nextEl.parentNode.insertBefore(styleNode, nextEl);
            } else {
                head.appendChild(styleNode);
            }
        }
        if (oldStyleNode && keepOldStyleNode === false) {
            oldStyleNode.parentNode.removeChild(oldStyleNode);
        }

        // For IE.
        // This needs to happen *after* the style element is added to the DOM, otherwise IE 7 and 8 may crash.
        // See http://social.msdn.microsoft.com/Forums/en-US/7e081b65-878a-4c22-8e68-c10d39c2ed32/internet-explorer-crashes-appending-style-element-to-head
        if (styleNode.styleSheet) {
            try {
                styleNode.styleSheet.cssText = styles;
            } catch (e) {
                throw new Error("Couldn't reassign styleSheet.cssText.");
            }
        }
    },
    currentScript: function(window) {
        var document = window.document;
        return document.currentScript || (function() {
            var scripts = document.getElementsByTagName("script");
            return scripts[scripts.length - 1];
        })();
    }
};

},{"./utils":9}],4:[function(require,module,exports){
// Cache system is a bit outdated and could do with work

module.exports = function(window, options, logger) {
    var cache = null;
    if (options.env !== 'development') {
        try {
            cache = (typeof window.localStorage === 'undefined') ? null : window.localStorage;
        } catch (_) {}
    }
    return {
        setCSS: function(path, lastModified, styles) {
            if (cache) {
                logger.info('saving ' + path + ' to cache.');
                try {
                    cache.setItem(path, styles);
                    cache.setItem(path + ':timestamp', lastModified);
                } catch(e) {
                    //TODO - could do with adding more robust error handling
                    logger.error('failed to save "' + path + '" to local storage for caching.');
                }
            }
        },
        getCSS: function(path, webInfo) {
            var css       = cache && cache.getItem(path),
                timestamp = cache && cache.getItem(path + ':timestamp');

            if (timestamp && webInfo.lastModified &&
                (new Date(webInfo.lastModified).valueOf() ===
                    new Date(timestamp).valueOf())) {
                // Use local copy
                return css;
            }
        }
    };
};

},{}],5:[function(require,module,exports){
var utils = require("./utils"),
    browser = require("./browser");

module.exports = function(window, less, options) {

    function errorHTML(e, rootHref) {
        var id = 'less-error-message:' + utils.extractId(rootHref || "");
        var template = '<li><label>{line}</label><pre class="{class}">{content}</pre></li>';
        var elem = window.document.createElement('div'), timer, content, errors = [];
        var filename = e.filename || rootHref;
        var filenameNoPath = filename.match(/([^\/]+(\?.*)?)$/)[1];

        elem.id        = id;
        elem.className = "less-error-message";

        content = '<h3>'  + (e.type || "Syntax") + "Error: " + (e.message || 'There is an error in your .less file') +
            '</h3>' + '<p>in <a href="' + filename   + '">' + filenameNoPath + "</a> ";

        var errorline = function (e, i, classname) {
            if (e.extract[i] !== undefined) {
                errors.push(template.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (i - 1))
                    .replace(/\{class\}/, classname)
                    .replace(/\{content\}/, e.extract[i]));
            }
        };

        if (e.extract) {
            errorline(e, 0, '');
            errorline(e, 1, 'line');
            errorline(e, 2, '');
            content += 'on line ' + e.line + ', column ' + (e.column + 1) + ':</p>' +
                '<ul>' + errors.join('') + '</ul>';
        }
        if (e.stack && (e.extract || options.logLevel >= 4)) {
            content += '<br/>Stack Trace</br />' + e.stack.split('\n').slice(1).join('<br/>');
        }
        elem.innerHTML = content;

        // CSS for error messages
        browser.createCSS(window.document, [
            '.less-error-message ul, .less-error-message li {',
            'list-style-type: none;',
            'margin-right: 15px;',
            'padding: 4px 0;',
            'margin: 0;',
            '}',
            '.less-error-message label {',
            'font-size: 12px;',
            'margin-right: 15px;',
            'padding: 4px 0;',
            'color: #cc7777;',
            '}',
            '.less-error-message pre {',
            'color: #dd6666;',
            'padding: 4px 0;',
            'margin: 0;',
            'display: inline-block;',
            '}',
            '.less-error-message pre.line {',
            'color: #ff0000;',
            '}',
            '.less-error-message h3 {',
            'font-size: 20px;',
            'font-weight: bold;',
            'padding: 15px 0 5px 0;',
            'margin: 0;',
            '}',
            '.less-error-message a {',
            'color: #10a',
            '}',
            '.less-error-message .error {',
            'color: red;',
            'font-weight: bold;',
            'padding-bottom: 2px;',
            'border-bottom: 1px dashed red;',
            '}'
        ].join('\n'), { title: 'error-message' });

        elem.style.cssText = [
            "font-family: Arial, sans-serif",
            "border: 1px solid #e00",
            "background-color: #eee",
            "border-radius: 5px",
            "-webkit-border-radius: 5px",
            "-moz-border-radius: 5px",
            "color: #e00",
            "padding: 15px",
            "margin-bottom: 15px"
        ].join(';');

        if (options.env === 'development') {
            timer = setInterval(function () {
                var document = window.document,
                    body = document.body;
                if (body) {
                    if (document.getElementById(id)) {
                        body.replaceChild(elem, document.getElementById(id));
                    } else {
                        body.insertBefore(elem, body.firstChild);
                    }
                    clearInterval(timer);
                }
            }, 10);
        }
    }

    function error(e, rootHref) {
        if (!options.errorReporting || options.errorReporting === "html") {
            errorHTML(e, rootHref);
        } else if (options.errorReporting === "console") {
            errorConsole(e, rootHref);
        } else if (typeof options.errorReporting === 'function') {
            options.errorReporting("add", e, rootHref);
        }
    }

    function removeErrorHTML(path) {
        var node = window.document.getElementById('less-error-message:' + utils.extractId(path));
        if (node) {
            node.parentNode.removeChild(node);
        }
    }

    function removeErrorConsole(path) {
        //no action
    }

    function removeError(path) {
        if (!options.errorReporting || options.errorReporting === "html") {
            removeErrorHTML(path);
        } else if (options.errorReporting === "console") {
            removeErrorConsole(path);
        } else if (typeof options.errorReporting === 'function') {
            options.errorReporting("remove", path);
        }
    }

    function errorConsole(e, rootHref) {
        var template = '{line} {content}';
        var filename = e.filename || rootHref;
        var errors = [];
        var content = (e.type || "Syntax") + "Error: " + (e.message || 'There is an error in your .less file') +
            " in " + filename + " ";

        var errorline = function (e, i, classname) {
            if (e.extract[i] !== undefined) {
                errors.push(template.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (i - 1))
                    .replace(/\{class\}/, classname)
                    .replace(/\{content\}/, e.extract[i]));
            }
        };

        if (e.extract) {
            errorline(e, 0, '');
            errorline(e, 1, 'line');
            errorline(e, 2, '');
            content += 'on line ' + e.line + ', column ' + (e.column + 1) + ':\n' +
                errors.join('\n');
        }
        if (e.stack && (e.extract || options.logLevel >= 4)) {
            content += '\nStack Trace\n' + e.stack;
        }
        less.logger.error(content);
    }

    return {
        add: error,
        remove: removeError
    };
};

},{"./browser":3,"./utils":9}],6:[function(require,module,exports){
/*global window, XMLHttpRequest */

module.exports = function(options, logger) {

    var AbstractFileManager = require("../less/environment/abstract-file-manager.js");

    var fileCache = {};

    //TODOS - move log somewhere. pathDiff and doing something similar in node. use pathDiff in the other browser file for the initial load

    function getXMLHttpRequest() {
        if (window.XMLHttpRequest && (window.location.protocol !== "file:" || !("ActiveXObject" in window))) {
            return new XMLHttpRequest();
        } else {
            try {
                /*global ActiveXObject */
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                logger.error("browser doesn't support AJAX.");
                return null;
            }
        }
    }

    var FileManager = function() {
    };

    FileManager.prototype = new AbstractFileManager();

    FileManager.prototype.alwaysMakePathsAbsolute = function alwaysMakePathsAbsolute() {
        return true;
    };
    FileManager.prototype.join = function join(basePath, laterPath) {
        if (!basePath) {
            return laterPath;
        }
        return this.extractUrlParts(laterPath, basePath).path;
    };
    FileManager.prototype.doXHR = function doXHR(url, type, callback, errback) {

        var xhr = getXMLHttpRequest();
        var async = options.isFileProtocol ? options.fileAsync : options.async;

        if (typeof xhr.overrideMimeType === 'function') {
            xhr.overrideMimeType('text/css');
        }
        logger.debug("XHR: Getting '" + url + "'");
        xhr.open('GET', url, async);
        xhr.setRequestHeader('Accept', type || 'text/x-less, text/css; q=0.9, */*; q=0.5');
        xhr.send(null);

        function handleResponse(xhr, callback, errback) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(xhr.responseText,
                    xhr.getResponseHeader("Last-Modified"));
            } else if (typeof errback === 'function') {
                errback(xhr.status, url);
            }
        }

        if (options.isFileProtocol && !options.fileAsync) {
            if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
                callback(xhr.responseText);
            } else {
                errback(xhr.status, url);
            }
        } else if (async) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    handleResponse(xhr, callback, errback);
                }
            };
        } else {
            handleResponse(xhr, callback, errback);
        }
    };
    FileManager.prototype.supports = function(filename, currentDirectory, options, environment) {
        return true;
    };

    FileManager.prototype.clearFileCache = function() {
        fileCache = {};
    };

    FileManager.prototype.loadFile = function loadFile(filename, currentDirectory, options, environment, callback) {
        if (currentDirectory && !this.isPathAbsolute(filename)) {
            filename = currentDirectory + filename;
        }

        options = options || {};

        // sheet may be set to the stylesheet for the initial load or a collection of properties including
        // some context variables for imports
        var hrefParts = this.extractUrlParts(filename, window.location.href);
        var href      = hrefParts.url;

        if (options.useFileCache && fileCache[href]) {
            try {
                var lessText = fileCache[href];
                callback(null, { contents: lessText, filename: href, webInfo: { lastModified: new Date() }});
            } catch (e) {
                callback({filename: href, message: "Error loading file " + href + " error was " + e.message});
            }
            return;
        }

        this.doXHR(href, options.mime, function doXHRCallback(data, lastModified) {
            // per file cache
            fileCache[href] = data;

            // Use remote copy (re-parse)
            callback(null, { contents: data, filename: href, webInfo: { lastModified: lastModified }});
        }, function doXHRError(status, url) {
            callback({ type: 'File', message: "'" + url + "' wasn't found (" + status + ")", href: href });
        });
    };

    return FileManager;
};

},{"../less/environment/abstract-file-manager.js":14}],7:[function(require,module,exports){
//
// index.js
// Should expose the additional browser functions on to the less object
//
var addDataAttr = require("./utils").addDataAttr,
    browser = require("./browser");

module.exports = function(window, options) {
    var document = window.document;
    var less = require('../less')();
    //module.exports = less;
    less.options = options;
    var environment = less.environment,
        FileManager = require("./file-manager")(options, less.logger),
        fileManager = new FileManager();
    environment.addFileManager(fileManager);
    less.FileManager = FileManager;

    require("./log-listener")(less, options);
    var errors = require("./error-reporting")(window, less, options);
    var cache = less.cache = options.cache || require("./cache")(window, options, less.logger);

    //Setup user functions
    if (options.functions) {
        less.functions.functionRegistry.addMultiple(options.functions);
    }

    var typePattern = /^text\/(x-)?less$/;

    function postProcessCSS(styles) {
        if (options.postProcessor && typeof options.postProcessor === 'function') {
            styles = options.postProcessor.call(styles, styles) || styles;
        }
        return styles;
    }

    function clone(obj) {
        var cloned = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                cloned[prop] = obj[prop];
            }
        }
        return cloned;
    }

    // only really needed for phantom
    function bind(func, thisArg) {
        var curryArgs = Array.prototype.slice.call(arguments, 2);
        return function() {
            var args = curryArgs.concat(Array.prototype.slice.call(arguments, 0));
            return func.apply(thisArg, args);
        };
    }

    function loadStyles(modifyVars) {
        var styles = document.getElementsByTagName('style'),
            style;

        for (var i = 0; i < styles.length; i++) {
            style = styles[i];
            if (style.type.match(typePattern)) {
                var instanceOptions = clone(options);
                instanceOptions.modifyVars = modifyVars;
                var lessText = style.innerHTML || '';
                instanceOptions.filename = document.location.href.replace(/#.*$/, '');

                /*jshint loopfunc:true */
                // use closure to store current style
                less.render(lessText, instanceOptions,
                        bind(function(style, e, result) {
                            if (e) {
                                errors.add(e, "inline");
                            } else {
                                style.type = 'text/css';
                                if (style.styleSheet) {
                                    style.styleSheet.cssText = result.css;
                                } else {
                                    style.innerHTML = result.css;
                                }
                            }
                        }, null, style));
            }
        }
    }

    function loadStyleSheet(sheet, callback, reload, remaining, modifyVars) {

        var instanceOptions = clone(options);
        addDataAttr(instanceOptions, sheet);
        instanceOptions.mime = sheet.type;

        if (modifyVars) {
            instanceOptions.modifyVars = modifyVars;
        }

        function loadInitialFileCallback(loadedFile) {

            var data = loadedFile.contents,
                path = loadedFile.filename,
                webInfo = loadedFile.webInfo;

            var newFileInfo = {
                currentDirectory: fileManager.getPath(path),
                filename: path,
                rootFilename: path,
                relativeUrls: instanceOptions.relativeUrls};

            newFileInfo.entryPath = newFileInfo.currentDirectory;
            newFileInfo.rootpath = instanceOptions.rootpath || newFileInfo.currentDirectory;

            if (webInfo) {
                webInfo.remaining = remaining;

                if (!instanceOptions.modifyVars) {
                    var css = cache.getCSS(path, webInfo);
                    if (!reload && css) {
                        webInfo.local = true;
                        callback(null, css, data, sheet, webInfo, path);
                        return;
                    }
                }
            }

            //TODO add tests around how this behaves when reloading
            errors.remove(path);

            instanceOptions.rootFileInfo = newFileInfo;
            less.render(data, instanceOptions, function(e, result) {
                if (e) {
                    e.href = path;
                    callback(e);
                } else {
                    result.css = postProcessCSS(result.css);
                    if (!instanceOptions.modifyVars) {
                        cache.setCSS(sheet.href, webInfo.lastModified, result.css);
                    }
                    callback(null, result.css, data, sheet, webInfo, path);
                }
            });
        }

        fileManager.loadFile(sheet.href, null, instanceOptions, environment, function(e, loadedFile) {
            if (e) {
                callback(e);
                return;
            }
            loadInitialFileCallback(loadedFile);
        });
    }

    function loadStyleSheets(callback, reload, modifyVars) {
        for (var i = 0; i < less.sheets.length; i++) {
            loadStyleSheet(less.sheets[i], callback, reload, less.sheets.length - (i + 1), modifyVars);
        }
    }

    function initRunningMode() {
        if (less.env === 'development') {
            less.watchTimer = setInterval(function () {
                if (less.watchMode) {
                    fileManager.clearFileCache();
                    loadStyleSheets(function (e, css, _, sheet, webInfo) {
                        if (e) {
                            errors.add(e, e.href || sheet.href);
                        } else if (css) {
                            browser.createCSS(window.document, css, sheet);
                        }
                    });
                }
            }, options.poll);
        }
    }

    //
    // Watch mode
    //
    less.watch   = function () {
        if (!less.watchMode ) {
            less.env = 'development';
            initRunningMode();
        }
        this.watchMode = true;
        return true;
    };

    less.unwatch = function () {clearInterval(less.watchTimer); this.watchMode = false; return false; };

    //
    // Get all <link> tags with the 'rel' attribute set to "stylesheet/less"
    //
    less.registerStylesheets = function() {
        return new Promise(function(resolve, reject) {
            var links = document.getElementsByTagName('link');
            less.sheets = [];

            for (var i = 0; i < links.length; i++) {
                if (links[i].rel === 'stylesheet/less' || (links[i].rel.match(/stylesheet/) &&
                    (links[i].type.match(typePattern)))) {
                    less.sheets.push(links[i]);
                }
            }

            resolve();
        });
    };

    //
    // With this function, it's possible to alter variables and re-render
    // CSS without reloading less-files
    //
    less.modifyVars = function(record) {
        return less.refresh(true, record, false);
    };

    less.refresh = function (reload, modifyVars, clearFileCache) {
        if ((reload || clearFileCache) && clearFileCache !== false) {
            fileManager.clearFileCache();
        }
        return new Promise(function (resolve, reject) {
            var startTime, endTime, totalMilliseconds;
            startTime = endTime = new Date();

            loadStyleSheets(function (e, css, _, sheet, webInfo) {
                if (e) {
                    errors.add(e, e.href || sheet.href);
                    reject(e);
                    return;
                }
                if (webInfo.local) {
                    less.logger.info("loading " + sheet.href + " from cache.");
                } else {
                    less.logger.info("rendered " + sheet.href + " successfully.");
                }
                browser.createCSS(window.document, css, sheet);
                less.logger.info("css for " + sheet.href + " generated in " + (new Date() - endTime) + 'ms');
                if (webInfo.remaining === 0) {
                    totalMilliseconds = new Date() - startTime;
                    less.logger.info("less has finished. css generated in " + totalMilliseconds + 'ms');
                    resolve({
                        startTime: startTime,
                        endTime: endTime,
                        totalMilliseconds: totalMilliseconds,
                        sheets: less.sheets.length
                    });
                }
                endTime = new Date();
            }, reload, modifyVars);

            loadStyles(modifyVars);
        });
    };

    less.refreshStyles = loadStyles;
    return less;
};

},{"../less":29,"./browser":3,"./cache":4,"./error-reporting":5,"./file-manager":6,"./log-listener":8,"./utils":9}],8:[function(require,module,exports){
module.exports = function(less, options) {

    var logLevel_debug = 4,
        logLevel_info = 3,
        logLevel_warn = 2,
        logLevel_error = 1;

    // The amount of logging in the javascript console.
    // 3 - Debug, information and errors
    // 2 - Information and errors
    // 1 - Errors
    // 0 - None
    // Defaults to 2
    options.logLevel = typeof options.logLevel !== 'undefined' ? options.logLevel : (options.env === 'development' ?  logLevel_info : logLevel_error);

    if (!options.loggers) {
        options.loggers = [{
            debug: function(msg) {
                if (options.logLevel >= logLevel_debug) {
                    console.log(msg);
                }
            },
            info: function(msg) {
                if (options.logLevel >= logLevel_info) {
                    console.log(msg);
                }
            },
            warn: function(msg) {
                if (options.logLevel >= logLevel_warn) {
                    console.warn(msg);
                }
            },
            error: function(msg) {
                if (options.logLevel >= logLevel_error) {
                    console.error(msg);
                }
            }
        }];
    }
    for (var i = 0; i < options.loggers.length; i++) {
        less.logger.addListener(options.loggers[i]);
    }
};

},{}],9:[function(require,module,exports){
module.exports = {
    extractId: function(href) {
        return href.replace(/^[a-z-]+:\/+?[^\/]+/, '')  // Remove protocol & domain
            .replace(/[\?\&]livereload=\w+/, '')        // Remove LiveReload cachebuster
            .replace(/^\//, '')                         // Remove root /
            .replace(/\.[a-zA-Z]+$/, '')                // Remove simple extension
            .replace(/[^\.\w-]+/g, '-')                 // Replace illegal characters
            .replace(/\./g, ':');                       // Replace dots with colons(for valid id)
    },
    addDataAttr: function(options, tag) {
        for (var opt in tag.dataset) {
            if (tag.dataset.hasOwnProperty(opt)) {
                if (opt === "env" || opt === "dumpLineNumbers" || opt === "rootpath" || opt === "errorReporting") {
                    options[opt] = tag.dataset[opt];
                } else {
                    try {
                        options[opt] = JSON.parse(tag.dataset[opt]);
                    }
                    catch(_) {}
                }
            }
        }
    }
};

},{}],10:[function(require,module,exports){
var contexts = {};
module.exports = contexts;

var copyFromOriginal = function copyFromOriginal(original, destination, propertiesToCopy) {
    if (!original) { return; }

    for (var i = 0; i < propertiesToCopy.length; i++) {
        if (original.hasOwnProperty(propertiesToCopy[i])) {
            destination[propertiesToCopy[i]] = original[propertiesToCopy[i]];
        }
    }
};

/*
 parse is used whilst parsing
 */
var parseCopyProperties = [
    // options
    'paths',            // option - unmodified - paths to search for imports on
    'relativeUrls',     // option - whether to adjust URL's to be relative
    'rootpath',         // option - rootpath to append to URL's
    'strictImports',    // option -
    'insecure',         // option - whether to allow imports from insecure ssl hosts
    'dumpLineNumbers',  // option - whether to dump line numbers
    'compress',         // option - whether to compress
    'syncImport',       // option - whether to import synchronously
    'chunkInput',       // option - whether to chunk input. more performant but causes parse issues.
    'mime',             // browser only - mime type for sheet import
    'useFileCache',     // browser only - whether to use the per file session cache
    // context
    'processImports',   // option & context - whether to process imports. if false then imports will not be imported.
                        // Used by the import manager to stop multiple import visitors being created.
    'reference',        // Used to indicate that the contents are imported by reference
    'pluginManager'     // Used as the plugin manager for the session
];

contexts.Parse = function(options) {
    copyFromOriginal(options, this, parseCopyProperties);

    if (typeof this.paths === "string") { this.paths = [this.paths]; }
};

var evalCopyProperties = [
    'paths',          // additional include paths
    'compress',       // whether to compress
    'ieCompat',       // whether to enforce IE compatibility (IE8 data-uri)
    'strictMath',     // whether math has to be within parenthesis
    'strictUnits',    // whether units need to evaluate correctly
    'sourceMap',      // whether to output a source map
    'importMultiple', // whether we are currently importing multiple copies
    'urlArgs',        // whether to add args into url tokens
    'javascriptEnabled',// option - whether JavaScript is enabled. if undefined, defaults to true
    'pluginManager',  // Used as the plugin manager for the session
    'importantScope'  // used to bubble up !important statements
    ];

contexts.Eval = function(options, frames) {
    copyFromOriginal(options, this, evalCopyProperties);

    this.frames = frames || [];
    this.importantScope = this.importantScope || [];
};

contexts.Eval.prototype.inParenthesis = function () {
    if (!this.parensStack) {
        this.parensStack = [];
    }
    this.parensStack.push(true);
};

contexts.Eval.prototype.outOfParenthesis = function () {
    this.parensStack.pop();
};

contexts.Eval.prototype.isMathOn = function () {
    return this.strictMath ? (this.parensStack && this.parensStack.length) : true;
};

contexts.Eval.prototype.isPathRelative = function (path) {
    return !/^(?:[a-z-]+:|\/|#)/i.test(path);
};

contexts.Eval.prototype.normalizePath = function( path ) {
    var
      segments = path.split("/").reverse(),
      segment;

    path = [];
    while (segments.length !== 0 ) {
        segment = segments.pop();
        switch( segment ) {
            case ".":
                break;
            case "..":
                if ((path.length === 0) || (path[path.length - 1] === "..")) {
                    path.push( segment );
                } else {
                    path.pop();
                }
                break;
            default:
                path.push( segment );
                break;
        }
    }

    return path.join("/");
};

//todo - do the same for the toCSS ?

},{}],11:[function(require,module,exports){
module.exports = {
    'aliceblue':'#f0f8ff',
    'antiquewhite':'#faebd7',
    'aqua':'#00ffff',
    'aquamarine':'#7fffd4',
    'azure':'#f0ffff',
    'beige':'#f5f5dc',
    'bisque':'#ffe4c4',
    'black':'#000000',
    'blanchedalmond':'#ffebcd',
    'blue':'#0000ff',
    'blueviolet':'#8a2be2',
    'brown':'#a52a2a',
    'burlywood':'#deb887',
    'cadetblue':'#5f9ea0',
    'chartreuse':'#7fff00',
    'chocolate':'#d2691e',
    'coral':'#ff7f50',
    'cornflowerblue':'#6495ed',
    'cornsilk':'#fff8dc',
    'crimson':'#dc143c',
    'cyan':'#00ffff',
    'darkblue':'#00008b',
    'darkcyan':'#008b8b',
    'darkgoldenrod':'#b8860b',
    'darkgray':'#a9a9a9',
    'darkgrey':'#a9a9a9',
    'darkgreen':'#006400',
    'darkkhaki':'#bdb76b',
    'darkmagenta':'#8b008b',
    'darkolivegreen':'#556b2f',
    'darkorange':'#ff8c00',
    'darkorchid':'#9932cc',
    'darkred':'#8b0000',
    'darksalmon':'#e9967a',
    'darkseagreen':'#8fbc8f',
    'darkslateblue':'#483d8b',
    'darkslategray':'#2f4f4f',
    'darkslategrey':'#2f4f4f',
    'darkturquoise':'#00ced1',
    'darkviolet':'#9400d3',
    'deeppink':'#ff1493',
    'deepskyblue':'#00bfff',
    'dimgray':'#696969',
    'dimgrey':'#696969',
    'dodgerblue':'#1e90ff',
    'firebrick':'#b22222',
    'floralwhite':'#fffaf0',
    'forestgreen':'#228b22',
    'fuchsia':'#ff00ff',
    'gainsboro':'#dcdcdc',
    'ghostwhite':'#f8f8ff',
    'gold':'#ffd700',
    'goldenrod':'#daa520',
    'gray':'#808080',
    'grey':'#808080',
    'green':'#008000',
    'greenyellow':'#adff2f',
    'honeydew':'#f0fff0',
    'hotpink':'#ff69b4',
    'indianred':'#cd5c5c',
    'indigo':'#4b0082',
    'ivory':'#fffff0',
    'khaki':'#f0e68c',
    'lavender':'#e6e6fa',
    'lavenderblush':'#fff0f5',
    'lawngreen':'#7cfc00',
    'lemonchiffon':'#fffacd',
    'lightblue':'#add8e6',
    'lightcoral':'#f08080',
    'lightcyan':'#e0ffff',
    'lightgoldenrodyellow':'#fafad2',
    'lightgray':'#d3d3d3',
    'lightgrey':'#d3d3d3',
    'lightgreen':'#90ee90',
    'lightpink':'#ffb6c1',
    'lightsalmon':'#ffa07a',
    'lightseagreen':'#20b2aa',
    'lightskyblue':'#87cefa',
    'lightslategray':'#778899',
    'lightslategrey':'#778899',
    'lightsteelblue':'#b0c4de',
    'lightyellow':'#ffffe0',
    'lime':'#00ff00',
    'limegreen':'#32cd32',
    'linen':'#faf0e6',
    'magenta':'#ff00ff',
    'maroon':'#800000',
    'mediumaquamarine':'#66cdaa',
    'mediumblue':'#0000cd',
    'mediumorchid':'#ba55d3',
    'mediumpurple':'#9370d8',
    'mediumseagreen':'#3cb371',
    'mediumslateblue':'#7b68ee',
    'mediumspringgreen':'#00fa9a',
    'mediumturquoise':'#48d1cc',
    'mediumvioletred':'#c71585',
    'midnightblue':'#191970',
    'mintcream':'#f5fffa',
    'mistyrose':'#ffe4e1',
    'moccasin':'#ffe4b5',
    'navajowhite':'#ffdead',
    'navy':'#000080',
    'oldlace':'#fdf5e6',
    'olive':'#808000',
    'olivedrab':'#6b8e23',
    'orange':'#ffa500',
    'orangered':'#ff4500',
    'orchid':'#da70d6',
    'palegoldenrod':'#eee8aa',
    'palegreen':'#98fb98',
    'paleturquoise':'#afeeee',
    'palevioletred':'#d87093',
    'papayawhip':'#ffefd5',
    'peachpuff':'#ffdab9',
    'peru':'#cd853f',
    'pink':'#ffc0cb',
    'plum':'#dda0dd',
    'powderblue':'#b0e0e6',
    'purple':'#800080',
    'rebeccapurple':'#663399',
    'red':'#ff0000',
    'rosybrown':'#bc8f8f',
    'royalblue':'#4169e1',
    'saddlebrown':'#8b4513',
    'salmon':'#fa8072',
    'sandybrown':'#f4a460',
    'seagreen':'#2e8b57',
    'seashell':'#fff5ee',
    'sienna':'#a0522d',
    'silver':'#c0c0c0',
    'skyblue':'#87ceeb',
    'slateblue':'#6a5acd',
    'slategray':'#708090',
    'slategrey':'#708090',
    'snow':'#fffafa',
    'springgreen':'#00ff7f',
    'steelblue':'#4682b4',
    'tan':'#d2b48c',
    'teal':'#008080',
    'thistle':'#d8bfd8',
    'tomato':'#ff6347',
    'turquoise':'#40e0d0',
    'violet':'#ee82ee',
    'wheat':'#f5deb3',
    'white':'#ffffff',
    'whitesmoke':'#f5f5f5',
    'yellow':'#ffff00',
    'yellowgreen':'#9acd32'
};
},{}],12:[function(require,module,exports){
module.exports = {
    colors: require("./colors"),
    unitConversions: require("./unit-conversions")
};

},{"./colors":11,"./unit-conversions":13}],13:[function(require,module,exports){
module.exports = {
    length: {
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'px': 0.0254 / 96,
        'pt': 0.0254 / 72,
        'pc': 0.0254 / 72 * 12
    },
    duration: {
        's': 1,
        'ms': 0.001
    },
    angle: {
        'rad': 1 / (2 * Math.PI),
        'deg': 1 / 360,
        'grad': 1 / 400,
        'turn': 1
    }
};
},{}],14:[function(require,module,exports){
var abstractFileManager = function() {
};

abstractFileManager.prototype.getPath = function (filename) {
    var j = filename.lastIndexOf('?');
    if (j > 0) {
        filename = filename.slice(0, j);
    }
    j = filename.lastIndexOf('/');
    if (j < 0) {
        j = filename.lastIndexOf('\\');
    }
    if (j < 0) {
        return "";
    }
    return filename.slice(0, j + 1);
};

abstractFileManager.prototype.tryAppendLessExtension = function(path) {
    return /(\.[a-z]*$)|([\?;].*)$/.test(path) ? path : path + '.less';
};

abstractFileManager.prototype.supportsSync = function() {
    return false;
};

abstractFileManager.prototype.alwaysMakePathsAbsolute = function() {
    return false;
};

abstractFileManager.prototype.isPathAbsolute = function(filename) {
    return (/^(?:[a-z-]+:|\/|\\|#)/i).test(filename);
};

abstractFileManager.prototype.join = function(basePath, laterPath) {
    if (!basePath) {
        return laterPath;
    }
    return basePath + laterPath;
};
abstractFileManager.prototype.pathDiff = function pathDiff(url, baseUrl) {
    // diff between two paths to create a relative path

    var urlParts = this.extractUrlParts(url),
        baseUrlParts = this.extractUrlParts(baseUrl),
        i, max, urlDirectories, baseUrlDirectories, diff = "";
    if (urlParts.hostPart !== baseUrlParts.hostPart) {
        return "";
    }
    max = Math.max(baseUrlParts.directories.length, urlParts.directories.length);
    for (i = 0; i < max; i++) {
        if (baseUrlParts.directories[i] !== urlParts.directories[i]) { break; }
    }
    baseUrlDirectories = baseUrlParts.directories.slice(i);
    urlDirectories = urlParts.directories.slice(i);
    for (i = 0; i < baseUrlDirectories.length - 1; i++) {
        diff += "../";
    }
    for (i = 0; i < urlDirectories.length - 1; i++) {
        diff += urlDirectories[i] + "/";
    }
    return diff;
};
// helper function, not part of API
abstractFileManager.prototype.extractUrlParts = function extractUrlParts(url, baseUrl) {
    // urlParts[1] = protocol&hostname || /
    // urlParts[2] = / if path relative to host base
    // urlParts[3] = directories
    // urlParts[4] = filename
    // urlParts[5] = parameters

    var urlPartsRegex = /^((?:[a-z-]+:)?\/+?(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/i,
        urlParts = url.match(urlPartsRegex),
        returner = {}, directories = [], i, baseUrlParts;

    if (!urlParts) {
        throw new Error("Could not parse sheet href - '" + url + "'");
    }

    // Stylesheets in IE don't always return the full path
    if (baseUrl && (!urlParts[1] || urlParts[2])) {
        baseUrlParts = baseUrl.match(urlPartsRegex);
        if (!baseUrlParts) {
            throw new Error("Could not parse page url - '" + baseUrl + "'");
        }
        urlParts[1] = urlParts[1] || baseUrlParts[1] || "";
        if (!urlParts[2]) {
            urlParts[3] = baseUrlParts[3] + urlParts[3];
        }
    }

    if (urlParts[3]) {
        directories = urlParts[3].replace(/\\/g, "/").split("/");

        // extract out . before .. so .. doesn't absorb a non-directory
        for (i = 0; i < directories.length; i++) {
            if (directories[i] === ".") {
                directories.splice(i, 1);
                i -= 1;
            }
        }

        for (i = 0; i < directories.length; i++) {
            if (directories[i] === ".." && i > 0) {
                directories.splice(i - 1, 2);
                i -= 2;
            }
        }
    }

    returner.hostPart = urlParts[1];
    returner.directories = directories;
    returner.path = (urlParts[1] || "") + directories.join("/");
    returner.fileUrl = returner.path + (urlParts[4] || "");
    returner.url = returner.fileUrl + (urlParts[5] || "");
    return returner;
};

module.exports = abstractFileManager;

},{}],15:[function(require,module,exports){
var logger = require("../logger");
var environment = function(externalEnvironment, fileManagers) {
    this.fileManagers = fileManagers || [];
    externalEnvironment = externalEnvironment || {};

    var optionalFunctions = ["encodeBase64", "mimeLookup", "charsetLookup", "getSourceMapGenerator"],
        requiredFunctions = [],
        functions = requiredFunctions.concat(optionalFunctions);

    for (var i = 0; i < functions.length; i++) {
        var propName = functions[i],
            environmentFunc = externalEnvironment[propName];
        if (environmentFunc) {
            this[propName] = environmentFunc.bind(externalEnvironment);
        } else if (i < requiredFunctions.length) {
            this.warn("missing required function in environment - " + propName);
        }
    }
};

environment.prototype.getFileManager = function (filename, currentDirectory, options, environment, isSync) {

    if (!filename) {
        logger.warn("getFileManager called with no filename.. Please report this issue. continuing.");
    }
    if (currentDirectory == null) {
        logger.warn("getFileManager called with null directory.. Please report this issue. continuing.");
    }

    var fileManagers = this.fileManagers;
    if (options.pluginManager) {
        fileManagers = [].concat(fileManagers).concat(options.pluginManager.getFileManagers());
    }
    for (var i = fileManagers.length - 1; i >= 0 ; i--) {
        var fileManager = fileManagers[i];
        if (fileManager[isSync ? "supportsSync" : "supports"](filename, currentDirectory, options, environment)) {
            return fileManager;
        }
    }
    return null;
};

environment.prototype.addFileManager = function (fileManager) {
    this.fileManagers.push(fileManager);
};

environment.prototype.clearFileManagers = function () {
    this.fileManagers = [];
};

module.exports = environment;

},{"../logger":31}],16:[function(require,module,exports){
var Color = require("../tree/color"),
    functionRegistry = require("./function-registry");

// Color Blending
// ref: http://www.w3.org/TR/compositing-1

function colorBlend(mode, color1, color2) {
    var ab = color1.alpha, cb, // backdrop
        as = color2.alpha, cs, // source
        ar, cr, r = [];        // result

    ar = as + ab * (1 - as);
    for (var i = 0; i < 3; i++) {
        cb = color1.rgb[i] / 255;
        cs = color2.rgb[i] / 255;
        cr = mode(cb, cs);
        if (ar) {
            cr = (as * cs + ab * (cb -
                  as * (cb + cs - cr))) / ar;
        }
        r[i] = cr * 255;
    }

    return new Color(r, ar);
}

var colorBlendModeFunctions = {
    multiply: function(cb, cs) {
        return cb * cs;
    },
    screen: function(cb, cs) {
        return cb + cs - cb * cs;
    },
    overlay: function(cb, cs) {
        cb *= 2;
        return (cb <= 1) ?
            colorBlendModeFunctions.multiply(cb, cs) :
            colorBlendModeFunctions.screen(cb - 1, cs);
    },
    softlight: function(cb, cs) {
        var d = 1, e = cb;
        if (cs > 0.5) {
            e = 1;
            d = (cb > 0.25) ? Math.sqrt(cb)
                : ((16 * cb - 12) * cb + 4) * cb;
        }
        return cb - (1 - 2 * cs) * e * (d - cb);
    },
    hardlight: function(cb, cs) {
        return colorBlendModeFunctions.overlay(cs, cb);
    },
    difference: function(cb, cs) {
        return Math.abs(cb - cs);
    },
    exclusion: function(cb, cs) {
        return cb + cs - 2 * cb * cs;
    },

    // non-w3c functions:
    average: function(cb, cs) {
        return (cb + cs) / 2;
    },
    negation: function(cb, cs) {
        return 1 - Math.abs(cb + cs - 1);
    }
};

for (var f in colorBlendModeFunctions) {
    if (colorBlendModeFunctions.hasOwnProperty(f)) {
        colorBlend[f] = colorBlend.bind(null, colorBlendModeFunctions[f]);
    }
}

functionRegistry.addMultiple(colorBlend);

},{"../tree/color":47,"./function-registry":21}],17:[function(require,module,exports){
var Dimension = require("../tree/dimension"),
    Color = require("../tree/color"),
    Quoted = require("../tree/quoted"),
    Anonymous = require("../tree/anonymous"),
    functionRegistry = require("./function-registry"),
    colorFunctions;

function clamp(val) {
    return Math.min(1, Math.max(0, val));
}
function hsla(color) {
    return colorFunctions.hsla(color.h, color.s, color.l, color.a);
}
function number(n) {
    if (n instanceof Dimension) {
        return parseFloat(n.unit.is('%') ? n.value / 100 : n.value);
    } else if (typeof n === 'number') {
        return n;
    } else {
        throw {
            type: "Argument",
            message: "color functions take numbers as parameters"
        };
    }
}
function scaled(n, size) {
    if (n instanceof Dimension && n.unit.is('%')) {
        return parseFloat(n.value * size / 100);
    } else {
        return number(n);
    }
}
colorFunctions = {
    rgb: function (r, g, b) {
        return colorFunctions.rgba(r, g, b, 1.0);
    },
    rgba: function (r, g, b, a) {
        var rgb = [r, g, b].map(function (c) { return scaled(c, 255); });
        a = number(a);
        return new Color(rgb, a);
    },
    hsl: function (h, s, l) {
        return colorFunctions.hsla(h, s, l, 1.0);
    },
    hsla: function (h, s, l, a) {
        function hue(h) {
            h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
            if (h * 6 < 1) {
                return m1 + (m2 - m1) * h * 6;
            }
            else if (h * 2 < 1) {
                return m2;
            }
            else if (h * 3 < 2) {
                return m1 + (m2 - m1) * (2 / 3 - h) * 6;
            }
            else {
                return m1;
            }
        }

        h = (number(h) % 360) / 360;
        s = clamp(number(s)); l = clamp(number(l)); a = clamp(number(a));

        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        var m1 = l * 2 - m2;

        return colorFunctions.rgba(hue(h + 1 / 3) * 255,
            hue(h)       * 255,
            hue(h - 1 / 3) * 255,
            a);
    },

    hsv: function(h, s, v) {
        return colorFunctions.hsva(h, s, v, 1.0);
    },

    hsva: function(h, s, v, a) {
        h = ((number(h) % 360) / 360) * 360;
        s = number(s); v = number(v); a = number(a);

        var i, f;
        i = Math.floor((h / 60) % 6);
        f = (h / 60) - i;

        var vs = [v,
            v * (1 - s),
            v * (1 - f * s),
            v * (1 - (1 - f) * s)];
        var perm = [[0, 3, 1],
            [2, 0, 1],
            [1, 0, 3],
            [1, 2, 0],
            [3, 1, 0],
            [0, 1, 2]];

        return colorFunctions.rgba(vs[perm[i][0]] * 255,
            vs[perm[i][1]] * 255,
            vs[perm[i][2]] * 255,
            a);
    },

    hue: function (color) {
        return new Dimension(color.toHSL().h);
    },
    saturation: function (color) {
        return new Dimension(color.toHSL().s * 100, '%');
    },
    lightness: function (color) {
        return new Dimension(color.toHSL().l * 100, '%');
    },
    hsvhue: function(color) {
        return new Dimension(color.toHSV().h);
    },
    hsvsaturation: function (color) {
        return new Dimension(color.toHSV().s * 100, '%');
    },
    hsvvalue: function (color) {
        return new Dimension(color.toHSV().v * 100, '%');
    },
    red: function (color) {
        return new Dimension(color.rgb[0]);
    },
    green: function (color) {
        return new Dimension(color.rgb[1]);
    },
    blue: function (color) {
        return new Dimension(color.rgb[2]);
    },
    alpha: function (color) {
        return new Dimension(color.toHSL().a);
    },
    luma: function (color) {
        return new Dimension(color.luma() * color.alpha * 100, '%');
    },
    luminance: function (color) {
        var luminance =
            (0.2126 * color.rgb[0] / 255) +
                (0.7152 * color.rgb[1] / 255) +
                (0.0722 * color.rgb[2] / 255);

        return new Dimension(luminance * color.alpha * 100, '%');
    },
    saturate: function (color, amount) {
        // filter: saturate(3.2);
        // should be kept as is, so check for color
        if (!color.rgb) {
            return null;
        }
        var hsl = color.toHSL();

        hsl.s += amount.value / 100;
        hsl.s = clamp(hsl.s);
        return hsla(hsl);
    },
    desaturate: function (color, amount) {
        var hsl = color.toHSL();

        hsl.s -= amount.value / 100;
        hsl.s = clamp(hsl.s);
        return hsla(hsl);
    },
    lighten: function (color, amount) {
        var hsl = color.toHSL();

        hsl.l += amount.value / 100;
        hsl.l = clamp(hsl.l);
        return hsla(hsl);
    },
    darken: function (color, amount) {
        var hsl = color.toHSL();

        hsl.l -= amount.value / 100;
        hsl.l = clamp(hsl.l);
        return hsla(hsl);
    },
    fadein: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a += amount.value / 100;
        hsl.a = clamp(hsl.a);
        return hsla(hsl);
    },
    fadeout: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a -= amount.value / 100;
        hsl.a = clamp(hsl.a);
        return hsla(hsl);
    },
    fade: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a = amount.value / 100;
        hsl.a = clamp(hsl.a);
        return hsla(hsl);
    },
    spin: function (color, amount) {
        var hsl = color.toHSL();
        var hue = (hsl.h + amount.value) % 360;

        hsl.h = hue < 0 ? 360 + hue : hue;

        return hsla(hsl);
    },
    //
    // Copyright (c) 2006-2009 Hampton Catlin, Nathan Weizenbaum, and Chris Eppstein
    // http://sass-lang.com
    //
    mix: function (color1, color2, weight) {
        if (!weight) {
            weight = new Dimension(50);
        }
        var p = weight.value / 100.0;
        var w = p * 2 - 1;
        var a = color1.toHSL().a - color2.toHSL().a;

        var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;

        var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2,
            color1.rgb[1] * w1 + color2.rgb[1] * w2,
            color1.rgb[2] * w1 + color2.rgb[2] * w2];

        var alpha = color1.alpha * p + color2.alpha * (1 - p);

        return new Color(rgb, alpha);
    },
    greyscale: function (color) {
        return colorFunctions.desaturate(color, new Dimension(100));
    },
    contrast: function (color, dark, light, threshold) {
        // filter: contrast(3.2);
        // should be kept as is, so check for color
        if (!color.rgb) {
            return null;
        }
        if (typeof light === 'undefined') {
            light = colorFunctions.rgba(255, 255, 255, 1.0);
        }
        if (typeof dark === 'undefined') {
            dark = colorFunctions.rgba(0, 0, 0, 1.0);
        }
        //Figure out which is actually light and dark!
        if (dark.luma() > light.luma()) {
            var t = light;
            light = dark;
            dark = t;
        }
        if (typeof threshold === 'undefined') {
            threshold = 0.43;
        } else {
            threshold = number(threshold);
        }
        if (color.luma() < threshold) {
            return light;
        } else {
            return dark;
        }
    },
    argb: function (color) {
        return new Anonymous(color.toARGB());
    },
    color: function(c) {
        if ((c instanceof Quoted) &&
            (/^#([a-f0-9]{6}|[a-f0-9]{3})$/i.test(c.value))) {
            return new Color(c.value.slice(1));
        }
        if ((c instanceof Color) || (c = Color.fromKeyword(c.value))) {
            c.value = undefined;
            return c;
        }
        throw {
            type:    "Argument",
            message: "argument must be a color keyword or 3/6 digit hex e.g. #FFF"
        };
    },
    tint: function(color, amount) {
        return colorFunctions.mix(colorFunctions.rgb(255, 255, 255), color, amount);
    },
    shade: function(color, amount) {
        return colorFunctions.mix(colorFunctions.rgb(0, 0, 0), color, amount);
    }
};
functionRegistry.addMultiple(colorFunctions);

},{"../tree/anonymous":43,"../tree/color":47,"../tree/dimension":53,"../tree/quoted":70,"./function-registry":21}],18:[function(require,module,exports){
module.exports = function(environment) {
    var Quoted = require("../tree/quoted"),
        URL = require("../tree/url"),
        functionRegistry = require("./function-registry"),
        fallback = function(functionThis, node) {
            return new URL(node, functionThis.index, functionThis.currentFileInfo).eval(functionThis.context);
        },
        logger = require('../logger');

    functionRegistry.add("data-uri", function(mimetypeNode, filePathNode) {

        if (!filePathNode) {
            filePathNode = mimetypeNode;
            mimetypeNode = null;
        }

        var mimetype = mimetypeNode && mimetypeNode.value;
        var filePath = filePathNode.value;
        var currentFileInfo = this.currentFileInfo;
        var currentDirectory = currentFileInfo.relativeUrls ?
            currentFileInfo.currentDirectory : currentFileInfo.entryPath;

        var fragmentStart = filePath.indexOf('#');
        var fragment = '';
        if (fragmentStart !== -1) {
            fragment = filePath.slice(fragmentStart);
            filePath = filePath.slice(0, fragmentStart);
        }

        var fileManager = environment.getFileManager(filePath, currentDirectory, this.context, environment, true);

        if (!fileManager) {
            return fallback(this, filePathNode);
        }

        var useBase64 = false;

        // detect the mimetype if not given
        if (!mimetypeNode) {

            mimetype = environment.mimeLookup(filePath);

            if (mimetype === "image/svg+xml") {
                useBase64 = false;
            } else {
                // use base 64 unless it's an ASCII or UTF-8 format
                var charset = environment.charsetLookup(mimetype);
                useBase64 = ['US-ASCII', 'UTF-8'].indexOf(charset) < 0;
            }
            if (useBase64) { mimetype += ';base64'; }
        }
        else {
            useBase64 = /;base64$/.test(mimetype);
        }

        var fileSync = fileManager.loadFileSync(filePath, currentDirectory, this.context, environment);
        if (!fileSync.contents) {
            logger.warn("Skipped data-uri embedding of " + filePath + " because file not found");
            return fallback(this, filePathNode || mimetypeNode);
        }
        var buf = fileSync.contents;
        if (useBase64 && !environment.encodeBase64) {
            return fallback(this, filePathNode);
        }

        buf = useBase64 ? environment.encodeBase64(buf) : encodeURIComponent(buf);

        var uri = "data:" + mimetype + ',' + buf + fragment;

        // IE8 cannot handle a data-uri larger than 32,768 characters. If this is exceeded
        // and the --ieCompat flag is enabled, return a normal url() instead.
        var DATA_URI_MAX = 32768;
        if (uri.length >= DATA_URI_MAX) {

            if (this.context.ieCompat !== false) {
                logger.warn("Skipped data-uri embedding of " + filePath + " because its size (" + uri.length +
                    " characters) exceeds IE8-safe " + DATA_URI_MAX + " characters!");

                return fallback(this, filePathNode || mimetypeNode);
            }
        }

        return new URL(new Quoted('"' + uri + '"', uri, false, this.index, this.currentFileInfo), this.index, this.currentFileInfo);
    });
};

},{"../logger":31,"../tree/quoted":70,"../tree/url":77,"./function-registry":21}],19:[function(require,module,exports){
var Keyword = require("../tree/keyword"),
    functionRegistry = require("./function-registry");

var defaultFunc = {
    eval: function () {
        var v = this.value_, e = this.error_;
        if (e) {
            throw e;
        }
        if (v != null) {
            return v ? Keyword.True : Keyword.False;
        }
    },
    value: function (v) {
        this.value_ = v;
    },
    error: function (e) {
        this.error_ = e;
    },
    reset: function () {
        this.value_ = this.error_ = null;
    }
};

functionRegistry.add("default", defaultFunc.eval.bind(defaultFunc));

module.exports = defaultFunc;

},{"../tree/keyword":62,"./function-registry":21}],20:[function(require,module,exports){
var functionRegistry = require("./function-registry");

var functionCaller = function(name, context, index, currentFileInfo) {
    this.name = name.toLowerCase();
    this.func = functionRegistry.get(this.name);
    this.index = index;
    this.context = context;
    this.currentFileInfo = currentFileInfo;
};
functionCaller.prototype.isValid = function() {
    return Boolean(this.func);
};
functionCaller.prototype.call = function(args) {
    return this.func.apply(this, args);
};

module.exports = functionCaller;

},{"./function-registry":21}],21:[function(require,module,exports){
module.exports = {
    _data: {},
    add: function(name, func) {
        if (this._data.hasOwnProperty(name)) {
            //TODO warn
        }
        this._data[name] = func;
    },
    addMultiple: function(functions) {
        Object.keys(functions).forEach(
            function(name) {
                this.add(name, functions[name]);
            }.bind(this));
    },
    get: function(name) {
        return this._data[name];
    }
};

},{}],22:[function(require,module,exports){
module.exports = function(environment) {
    var functions = {
        functionRegistry: require("./function-registry"),
        functionCaller: require("./function-caller")
    };

    //register functions
    require("./default");
    require("./color");
    require("./color-blending");
    require("./data-uri")(environment);
    require("./math");
    require("./number");
    require("./string");
    require("./svg")(environment);
    require("./types");

    return functions;
};

},{"./color":17,"./color-blending":16,"./data-uri":18,"./default":19,"./function-caller":20,"./function-registry":21,"./math":23,"./number":24,"./string":25,"./svg":26,"./types":27}],23:[function(require,module,exports){
var Dimension = require("../tree/dimension"),
    functionRegistry = require("./function-registry");

var mathFunctions = {
    // name,  unit
    ceil:  null,
    floor: null,
    sqrt:  null,
    abs:   null,
    tan:   "",
    sin:   "",
    cos:   "",
    atan:  "rad",
    asin:  "rad",
    acos:  "rad"
};

function _math(fn, unit, n) {
    if (!(n instanceof Dimension)) {
        throw { type: "Argument", message: "argument must be a number" };
    }
    if (unit == null) {
        unit = n.unit;
    } else {
        n = n.unify();
    }
    return new Dimension(fn(parseFloat(n.value)), unit);
}

for (var f in mathFunctions) {
    if (mathFunctions.hasOwnProperty(f)) {
        mathFunctions[f] = _math.bind(null, Math[f], mathFunctions[f]);
    }
}

mathFunctions.round = function (n, f) {
    var fraction = typeof f === "undefined" ? 0 : f.value;
    return _math(function(num) { return num.toFixed(fraction); }, null, n);
};

functionRegistry.addMultiple(mathFunctions);

},{"../tree/dimension":53,"./function-registry":21}],24:[function(require,module,exports){
var Dimension = require("../tree/dimension"),
    Anonymous = require("../tree/anonymous"),
    functionRegistry = require("./function-registry");

var minMax = function (isMin, args) {
    args = Array.prototype.slice.call(args);
    switch(args.length) {
        case 0: throw { type: "Argument", message: "one or more arguments required" };
    }
    var i, j, current, currentUnified, referenceUnified, unit, unitStatic, unitClone,
        order  = [], // elems only contains original argument values.
        values = {}; // key is the unit.toString() for unified Dimension values,
    // value is the index into the order array.
    for (i = 0; i < args.length; i++) {
        current = args[i];
        if (!(current instanceof Dimension)) {
            if (Array.isArray(args[i].value)) {
                Array.prototype.push.apply(args, Array.prototype.slice.call(args[i].value));
            }
            continue;
        }
        currentUnified = current.unit.toString() === "" && unitClone !== undefined ? new Dimension(current.value, unitClone).unify() : current.unify();
        unit = currentUnified.unit.toString() === "" && unitStatic !== undefined ? unitStatic : currentUnified.unit.toString();
        unitStatic = unit !== "" && unitStatic === undefined || unit !== "" && order[0].unify().unit.toString() === "" ? unit : unitStatic;
        unitClone = unit !== "" && unitClone === undefined ? current.unit.toString() : unitClone;
        j = values[""] !== undefined && unit !== "" && unit === unitStatic ? values[""] : values[unit];
        if (j === undefined) {
            if (unitStatic !== undefined && unit !== unitStatic) {
                throw{ type: "Argument", message: "incompatible types" };
            }
            values[unit] = order.length;
            order.push(current);
            continue;
        }
        referenceUnified = order[j].unit.toString() === "" && unitClone !== undefined ? new Dimension(order[j].value, unitClone).unify() : order[j].unify();
        if ( isMin && currentUnified.value < referenceUnified.value ||
            !isMin && currentUnified.value > referenceUnified.value) {
            order[j] = current;
        }
    }
    if (order.length == 1) {
        return order[0];
    }
    args = order.map(function (a) { return a.toCSS(this.context); }).join(this.context.compress ? "," : ", ");
    return new Anonymous((isMin ? "min" : "max") + "(" + args + ")");
};
functionRegistry.addMultiple({
    min: function () {
        return minMax(true, arguments);
    },
    max: function () {
        return minMax(false, arguments);
    },
    convert: function (val, unit) {
        return val.convertTo(unit.value);
    },
    pi: function () {
        return new Dimension(Math.PI);
    },
    mod: function(a, b) {
        return new Dimension(a.value % b.value, a.unit);
    },
    pow: function(x, y) {
        if (typeof x === "number" && typeof y === "number") {
            x = new Dimension(x);
            y = new Dimension(y);
        } else if (!(x instanceof Dimension) || !(y instanceof Dimension)) {
            throw { type: "Argument", message: "arguments must be numbers" };
        }

        return new Dimension(Math.pow(x.value, y.value), x.unit);
    },
    percentage: function (n) {
        return new Dimension(n.value * 100, '%');
    }
});

},{"../tree/anonymous":43,"../tree/dimension":53,"./function-registry":21}],25:[function(require,module,exports){
var Quoted = require("../tree/quoted"),
    Anonymous = require("../tree/anonymous"),
    JavaScript = require("../tree/javascript"),
    functionRegistry = require("./function-registry");

functionRegistry.addMultiple({
    e: function (str) {
        return new Anonymous(str instanceof JavaScript ? str.evaluated : str.value);
    },
    escape: function (str) {
        return new Anonymous(
            encodeURI(str.value).replace(/=/g, "%3D").replace(/:/g, "%3A").replace(/#/g, "%23").replace(/;/g, "%3B")
                .replace(/\(/g, "%28").replace(/\)/g, "%29"));
    },
    replace: function (string, pattern, replacement, flags) {
        var result = string.value;

        result = result.replace(new RegExp(pattern.value, flags ? flags.value : ''), replacement.value);
        return new Quoted(string.quote || '', result, string.escaped);
    },
    '%': function (string /* arg, arg, ...*/) {
        var args = Array.prototype.slice.call(arguments, 1),
            result = string.value;

        for (var i = 0; i < args.length; i++) {
            /*jshint loopfunc:true */
            result = result.replace(/%[sda]/i, function(token) {
                var value = token.match(/s/i) ? args[i].value : args[i].toCSS();
                return token.match(/[A-Z]$/) ? encodeURIComponent(value) : value;
            });
        }
        result = result.replace(/%%/g, '%');
        return new Quoted(string.quote || '', result, string.escaped);
    }
});

},{"../tree/anonymous":43,"../tree/javascript":60,"../tree/quoted":70,"./function-registry":21}],26:[function(require,module,exports){
module.exports = function(environment) {
    var Dimension = require("../tree/dimension"),
        Color = require("../tree/color"),
        Expression = require("../tree/expression"),
        Quoted = require("../tree/quoted"),
        URL = require("../tree/url"),
        functionRegistry = require("./function-registry");

    functionRegistry.add("svg-gradient", function(direction) {

        function throwArgumentDescriptor() {
            throw { type: "Argument",
                message: "svg-gradient expects direction, start_color [start_position], [color position,]...," +
                    " end_color [end_position]" };
        }

        if (arguments.length < 3) {
            throwArgumentDescriptor();
        }
        var stops = Array.prototype.slice.call(arguments, 1),
            gradientDirectionSvg,
            gradientType = "linear",
            rectangleDimension = 'x="0" y="0" width="1" height="1"',
            renderEnv = {compress: false},
            returner,
            directionValue = direction.toCSS(renderEnv),
            i, color, position, positionValue, alpha;

        switch (directionValue) {
            case "to bottom":
                gradientDirectionSvg = 'x1="0%" y1="0%" x2="0%" y2="100%"';
                break;
            case "to right":
                gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="0%"';
                break;
            case "to bottom right":
                gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="100%"';
                break;
            case "to top right":
                gradientDirectionSvg = 'x1="0%" y1="100%" x2="100%" y2="0%"';
                break;
            case "ellipse":
            case "ellipse at center":
                gradientType = "radial";
                gradientDirectionSvg = 'cx="50%" cy="50%" r="75%"';
                rectangleDimension = 'x="-50" y="-50" width="101" height="101"';
                break;
            default:
                throw { type: "Argument", message: "svg-gradient direction must be 'to bottom', 'to right'," +
                    " 'to bottom right', 'to top right' or 'ellipse at center'" };
        }
        returner = '<?xml version="1.0" ?>' +
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">' +
            '<' + gradientType + 'Gradient id="gradient" gradientUnits="userSpaceOnUse" ' + gradientDirectionSvg + '>';

        for (i = 0; i < stops.length; i+= 1) {
            if (stops[i] instanceof Expression) {
                color = stops[i].value[0];
                position = stops[i].value[1];
            } else {
                color = stops[i];
                position = undefined;
            }

            if (!(color instanceof Color) || (!((i === 0 || i + 1 === stops.length) && position === undefined) && !(position instanceof Dimension))) {
                throwArgumentDescriptor();
            }
            positionValue = position ? position.toCSS(renderEnv) : i === 0 ? "0%" : "100%";
            alpha = color.alpha;
            returner += '<stop offset="' + positionValue + '" stop-color="' + color.toRGB() + '"' + (alpha < 1 ? ' stop-opacity="' + alpha + '"' : '') + '/>';
        }
        returner += '</' + gradientType + 'Gradient>' +
            '<rect ' + rectangleDimension + ' fill="url(#gradient)" /></svg>';

        returner = encodeURIComponent(returner);

        returner = "data:image/svg+xml," + returner;
        return new URL(new Quoted("'" + returner + "'", returner, false, this.index, this.currentFileInfo), this.index, this.currentFileInfo);
    });
};

},{"../tree/color":47,"../tree/dimension":53,"../tree/expression":56,"../tree/quoted":70,"../tree/url":77,"./function-registry":21}],27:[function(require,module,exports){
var Keyword = require("../tree/keyword"),
    DetachedRuleset = require("../tree/detached-ruleset"),
    Dimension = require("../tree/dimension"),
    Color = require("../tree/color"),
    Quoted = require("../tree/quoted"),
    Anonymous = require("../tree/anonymous"),
    URL = require("../tree/url"),
    Operation = require("../tree/operation"),
    functionRegistry = require("./function-registry");

var isa = function (n, Type) {
        return (n instanceof Type) ? Keyword.True : Keyword.False;
    },
    isunit = function (n, unit) {
        if (unit === undefined) {
            throw { type: "Argument", message: "missing the required second argument to isunit." };
        }
        unit = typeof unit.value === "string" ? unit.value : unit;
        if (typeof unit !== "string") {
            throw { type: "Argument", message: "Second argument to isunit should be a unit or a string." };
        }
        return (n instanceof Dimension) && n.unit.is(unit) ? Keyword.True : Keyword.False;
    },
    getItemsFromNode = function(node) {
        // handle non-array values as an array of length 1
        // return 'undefined' if index is invalid
        var items = Array.isArray(node.value) ?
            node.value : Array(node);

        return items.filter(function(item) {
            if (item.type === "Comment") {
                return false;
            }
            return true;
        });
    };
functionRegistry.addMultiple({
    isruleset: function (n) {
        return isa(n, DetachedRuleset);
    },
    iscolor: function (n) {
        return isa(n, Color);
    },
    isnumber: function (n) {
        return isa(n, Dimension);
    },
    isstring: function (n) {
        return isa(n, Quoted);
    },
    iskeyword: function (n) {
        return isa(n, Keyword);
    },
    isurl: function (n) {
        return isa(n, URL);
    },
    ispixel: function (n) {
        return isunit(n, 'px');
    },
    ispercentage: function (n) {
        return isunit(n, '%');
    },
    isem: function (n) {
        return isunit(n, 'em');
    },
    isunit: isunit,
    unit: function (val, unit) {
        if (!(val instanceof Dimension)) {
            throw { type: "Argument",
                message: "the first argument to unit must be a number" +
                    (val instanceof Operation ? ". Have you forgotten parenthesis?" : "") };
        }
        if (unit) {
            if (unit instanceof Keyword) {
                unit = unit.value;
            } else {
                unit = unit.toCSS();
            }
        } else {
            unit = "";
        }
        return new Dimension(val.value, unit);
    },
    "get-unit": function (n) {
        return new Anonymous(n.unit);
    },
    extract: function(values, index) {
        index = index.value - 1; // (1-based index)

        return getItemsFromNode(values)[index];
    },
    length: function(values) {
        return new Dimension(getItemsFromNode(values).length);
    }
});

},{"../tree/anonymous":43,"../tree/color":47,"../tree/detached-ruleset":52,"../tree/dimension":53,"../tree/keyword":62,"../tree/operation":68,"../tree/quoted":70,"../tree/url":77,"./function-registry":21}],28:[function(require,module,exports){
var contexts = require("./contexts"),
    Parser = require('./parser/parser');

module.exports = function(environment) {

    // FileInfo = {
    //  'relativeUrls' - option - whether to adjust URL's to be relative
    //  'filename' - full resolved filename of current file
    //  'rootpath' - path to append to normal URLs for this node
    //  'currentDirectory' - path to the current file, absolute
    //  'rootFilename' - filename of the base file
    //  'entryPath' - absolute path to the entry file
    //  'reference' - whether the file should not be output and only output parts that are referenced

    var ImportManager = function(context, rootFileInfo) {
        this.rootFilename = rootFileInfo.filename;
        this.paths = context.paths || [];  // Search paths, when importing
        this.contents = {};             // map - filename to contents of all the files
        this.contentsIgnoredChars = {}; // map - filename to lines at the beginning of each file to ignore
        this.mime = context.mime;
        this.error = null;
        this.context = context;
        // Deprecated? Unused outside of here, could be useful.
        this.queue = [];        // Files which haven't been imported yet
        this.files = {};        // Holds the imported parse trees.
    };
    /**
     * Add an import to be imported
     * @param path - the raw path
     * @param tryAppendLessExtension - whether to try appending the less extension (if the path has no extension)
     * @param currentFileInfo - the current file info (used for instance to work out relative paths)
     * @param importOptions - import options
     * @param callback - callback for when it is imported
     */
    ImportManager.prototype.push = function (path, tryAppendLessExtension, currentFileInfo, importOptions, callback) {
        var importManager = this;
        this.queue.push(path);

        var fileParsedFunc = function (e, root, fullPath) {
            importManager.queue.splice(importManager.queue.indexOf(path), 1); // Remove the path from the queue

            var importedEqualsRoot = fullPath === importManager.rootFilename;
            if (importOptions.optional && e) {
                callback(null, {rules:[]}, false, null);
            }
            else {
                importManager.files[fullPath] = root;
                if (e && !importManager.error) { importManager.error = e; }
                callback(e, root, importedEqualsRoot, fullPath);
            }
        };

        var newFileInfo = {
            relativeUrls: this.context.relativeUrls,
            entryPath: currentFileInfo.entryPath,
            rootpath: currentFileInfo.rootpath,
            rootFilename: currentFileInfo.rootFilename
        };

        var fileManager = environment.getFileManager(path, currentFileInfo.currentDirectory, this.context, environment);

        if (!fileManager) {
            fileParsedFunc({ message: "Could not find a file-manager for " + path });
            return;
        }

        if (tryAppendLessExtension) {
            path = fileManager.tryAppendLessExtension(path);
        }

        var loadFileCallback = function(loadedFile) {
            var resolvedFilename = loadedFile.filename,
                contents = loadedFile.contents.replace(/^\uFEFF/, '');

            // Pass on an updated rootpath if path of imported file is relative and file
            // is in a (sub|sup) directory
            //
            // Examples:
            // - If path of imported file is 'module/nav/nav.less' and rootpath is 'less/',
            //   then rootpath should become 'less/module/nav/'
            // - If path of imported file is '../mixins.less' and rootpath is 'less/',
            //   then rootpath should become 'less/../'
            newFileInfo.currentDirectory = fileManager.getPath(resolvedFilename);
            if (newFileInfo.relativeUrls) {
                newFileInfo.rootpath = fileManager.join(
                    (importManager.context.rootpath || ""),
                    fileManager.pathDiff(newFileInfo.currentDirectory, newFileInfo.entryPath));

                if (!fileManager.isPathAbsolute(newFileInfo.rootpath) && fileManager.alwaysMakePathsAbsolute()) {
                    newFileInfo.rootpath = fileManager.join(newFileInfo.entryPath, newFileInfo.rootpath);
                }
            }
            newFileInfo.filename = resolvedFilename;

            var newEnv = new contexts.Parse(importManager.context);

            newEnv.processImports = false;
            importManager.contents[resolvedFilename] = contents;

            if (currentFileInfo.reference || importOptions.reference) {
                newFileInfo.reference = true;
            }

            if (importOptions.inline) {
                fileParsedFunc(null, contents, resolvedFilename);
            } else {
                new Parser(newEnv, importManager, newFileInfo).parse(contents, function (e, root) {
                    fileParsedFunc(e, root, resolvedFilename);
                });
            }
        };

        var promise = fileManager.loadFile(path, currentFileInfo.currentDirectory, this.context, environment,
            function(err, loadedFile) {
            if (err) {
                fileParsedFunc(err);
            } else {
                loadFileCallback(loadedFile);
            }
        });
        if (promise) {
            promise.then(loadFileCallback, fileParsedFunc);
        }
    };
    return ImportManager;
};

},{"./contexts":10,"./parser/parser":36}],29:[function(require,module,exports){
module.exports = function(environment, fileManagers) {
    var SourceMapOutput, SourceMapBuilder, ParseTree, ImportManager, Environment;

    var less = {
        version: [2, 4, 0],
        data: require('./data'),
        tree: require('./tree'),
        Environment: (Environment = require("./environment/environment")),
        AbstractFileManager: require("./environment/abstract-file-manager"),
        environment: (environment = new Environment(environment, fileManagers)),
        visitors: require('./visitors'),
        Parser: require('./parser/parser'),
        functions: require('./functions')(environment),
        contexts: require("./contexts"),
        SourceMapOutput: (SourceMapOutput = require('./source-map-output')(environment)),
        SourceMapBuilder: (SourceMapBuilder = require('./source-map-builder')(SourceMapOutput, environment)),
        ParseTree: (ParseTree = require('./parse-tree')(SourceMapBuilder)),
        ImportManager: (ImportManager = require('./import-manager')(environment)),
        render: require("./render")(environment, ParseTree, ImportManager),
        parse: require("./parse")(environment, ParseTree, ImportManager),
        LessError: require('./less-error'),
        transformTree: require('./transform-tree'),
        utils: require('./utils'),
        PluginManager: require('./plugin-manager'),
        logger: require('./logger')
    };

    return less;
};

},{"./contexts":10,"./data":12,"./environment/abstract-file-manager":14,"./environment/environment":15,"./functions":22,"./import-manager":28,"./less-error":30,"./logger":31,"./parse":33,"./parse-tree":32,"./parser/parser":36,"./plugin-manager":37,"./render":38,"./source-map-builder":39,"./source-map-output":40,"./transform-tree":41,"./tree":59,"./utils":80,"./visitors":84}],30:[function(require,module,exports){
var utils = require("./utils");

var LessError = module.exports = function LessError(e, importManager, currentFilename) {

    Error.call(this);

    var filename = e.filename || currentFilename;

    if (importManager && filename) {
        var input = importManager.contents[filename],
            loc = utils.getLocation(e.index, input),
            line = loc.line,
            col  = loc.column,
            callLine = e.call && utils.getLocation(e.call, input).line,
            lines = input.split('\n');

        this.type = e.type || 'Syntax';
        this.filename = filename;
        this.index = e.index;
        this.line = typeof line === 'number' ? line + 1 : null;
        this.callLine = callLine + 1;
        this.callExtract = lines[callLine];
        this.column = col;
        this.extract = [
            lines[line - 1],
            lines[line],
            lines[line + 1]
        ];
    }
    this.message = e.message;
    this.stack = e.stack;
};

if (typeof Object.create === 'undefined') {
    var F = function () {};
    F.prototype = Error.prototype;
    LessError.prototype = new F();
} else {
    LessError.prototype = Object.create(Error.prototype);
}

LessError.prototype.constructor = LessError;

},{"./utils":80}],31:[function(require,module,exports){
module.exports = {
    error: function(msg) {
        this._fireEvent("error", msg);
    },
    warn: function(msg) {
        this._fireEvent("warn", msg);
    },
    info: function(msg) {
        this._fireEvent("info", msg);
    },
    debug: function(msg) {
        this._fireEvent("debug", msg);
    },
    addListener: function(listener) {
        this._listeners.push(listener);
    },
    removeListener: function(listener) {
        for (var i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i] === listener) {
                this._listeners.splice(i, 1);
                return;
            }
        }
    },
    _fireEvent: function(type, msg) {
        for (var i = 0; i < this._listeners.length; i++) {
            var logFunction = this._listeners[i][type];
            if (logFunction) {
                logFunction(msg);
            }
        }
    },
    _listeners: []
};

},{}],32:[function(require,module,exports){
var LessError = require('./less-error'),
    transformTree = require("./transform-tree"),
    logger = require("./logger");

module.exports = function(SourceMapBuilder) {
    var ParseTree = function(root, imports) {
        this.root = root;
        this.imports = imports;
    };

    ParseTree.prototype.toCSS = function(options) {
        var evaldRoot, result = {}, sourceMapBuilder;
        try {
            evaldRoot = transformTree(this.root, options);
        } catch (e) {
            throw new LessError(e, this.imports);
        }

        try {
            var compress = Boolean(options.compress);
            if (compress) {
                logger.warn("The compress option has been deprecated. We recommend you use a dedicated css minifier, for instance see less-plugin-clean-css.");
            }

            var toCSSOptions = {
                compress: compress,
                dumpLineNumbers: options.dumpLineNumbers,
                strictUnits: Boolean(options.strictUnits),
                numPrecision: 8};

            if (options.sourceMap) {
                sourceMapBuilder = new SourceMapBuilder(options.sourceMap);
                result.css = sourceMapBuilder.toCSS(evaldRoot, toCSSOptions, this.imports);
            } else {
                result.css = evaldRoot.toCSS(toCSSOptions);
            }
        } catch (e) {
            throw new LessError(e, this.imports);
        }

        if (options.pluginManager) {
            var postProcessors = options.pluginManager.getPostProcessors();
            for (var i = 0; i < postProcessors.length; i++) {
                result.css = postProcessors[i].process(result.css, { sourceMap: sourceMapBuilder, options: options, imports: this.imports });
            }
        }
        if (options.sourceMap) {
            result.map = sourceMapBuilder.getExternalSourceMap();
        }

        result.imports = [];
        for (var file in this.imports.files) {
            if (this.imports.files.hasOwnProperty(file) && file !== this.imports.rootFilename) {
                result.imports.push(file);
            }
        }
        return result;
    };
    return ParseTree;
};

},{"./less-error":30,"./logger":31,"./transform-tree":41}],33:[function(require,module,exports){
var PromiseConstructor,
    contexts = require("./contexts"),
    Parser = require('./parser/parser'),
    PluginManager = require('./plugin-manager');

module.exports = function(environment, ParseTree, ImportManager) {
    var parse = function (input, options, callback) {
        options = options || {};

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (!callback) {
            if (!PromiseConstructor) {
                PromiseConstructor = typeof Promise === 'undefined' ? require('promise') : Promise;
            }
            var self = this;
            return new PromiseConstructor(function (resolve, reject) {
                parse.call(self, input, options, function(err, output) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(output);
                    }
                });
            });
        } else {
            var context,
                rootFileInfo,
                pluginManager = new PluginManager(this);

            pluginManager.addPlugins(options.plugins);
            options.pluginManager = pluginManager;

            context = new contexts.Parse(options);

            if (options.rootFileInfo) {
                rootFileInfo = options.rootFileInfo;
            } else {
                var filename = options.filename || "input";
                var entryPath = filename.replace(/[^\/\\]*$/, "");
                rootFileInfo = {
                    filename: filename,
                    relativeUrls: context.relativeUrls,
                    rootpath: context.rootpath || "",
                    currentDirectory: entryPath,
                    entryPath: entryPath,
                    rootFilename: filename
                };
                // add in a missing trailing slash
                if (rootFileInfo.rootpath && rootFileInfo.rootpath.slice(-1) !== "/") {
                    rootFileInfo.rootpath += "/";
                }
            }

            var imports = new ImportManager(context, rootFileInfo);

            new Parser(context, imports, rootFileInfo)
                .parse(input, function (e, root) {
                if (e) { return callback(e); }
                callback(null, root, imports, options);
            }, options);
        }
    };
    return parse;
};

},{"./contexts":10,"./parser/parser":36,"./plugin-manager":37,"promise":undefined}],34:[function(require,module,exports){
// Split the input into chunks.
module.exports = function (input, fail) {
    var len = input.length, level = 0, parenLevel = 0,
        lastOpening, lastOpeningParen, lastMultiComment, lastMultiCommentEndBrace,
        chunks = [], emitFrom = 0,
        chunkerCurrentIndex, currentChunkStartIndex, cc, cc2, matched;

    function emitChunk(force) {
        var len = chunkerCurrentIndex - emitFrom;
        if (((len < 512) && !force) || !len) {
            return;
        }
        chunks.push(input.slice(emitFrom, chunkerCurrentIndex + 1));
        emitFrom = chunkerCurrentIndex + 1;
    }

    for (chunkerCurrentIndex = 0; chunkerCurrentIndex < len; chunkerCurrentIndex++) {
        cc = input.charCodeAt(chunkerCurrentIndex);
        if (((cc >= 97) && (cc <= 122)) || (cc < 34)) {
            // a-z or whitespace
            continue;
        }

        switch (cc) {
            case 40:                        // (
                parenLevel++;
                lastOpeningParen = chunkerCurrentIndex;
                continue;
            case 41:                        // )
                if (--parenLevel < 0) {
                    return fail("missing opening `(`", chunkerCurrentIndex);
                }
                continue;
            case 59:                        // ;
                if (!parenLevel) { emitChunk(); }
                continue;
            case 123:                       // {
                level++;
                lastOpening = chunkerCurrentIndex;
                continue;
            case 125:                       // }
                if (--level < 0) {
                    return fail("missing opening `{`", chunkerCurrentIndex);
                }
                if (!level && !parenLevel) { emitChunk(); }
                continue;
            case 92:                        // \
                if (chunkerCurrentIndex < len - 1) { chunkerCurrentIndex++; continue; }
                return fail("unescaped `\\`", chunkerCurrentIndex);
            case 34:
            case 39:
            case 96:                        // ", ' and `
                matched = 0;
                currentChunkStartIndex = chunkerCurrentIndex;
                for (chunkerCurrentIndex = chunkerCurrentIndex + 1; chunkerCurrentIndex < len; chunkerCurrentIndex++) {
                    cc2 = input.charCodeAt(chunkerCurrentIndex);
                    if (cc2 > 96) { continue; }
                    if (cc2 == cc) { matched = 1; break; }
                    if (cc2 == 92) {        // \
                        if (chunkerCurrentIndex == len - 1) {
                            return fail("unescaped `\\`", chunkerCurrentIndex);
                        }
                        chunkerCurrentIndex++;
                    }
                }
                if (matched) { continue; }
                return fail("unmatched `" + String.fromCharCode(cc) + "`", currentChunkStartIndex);
            case 47:                        // /, check for comment
                if (parenLevel || (chunkerCurrentIndex == len - 1)) { continue; }
                cc2 = input.charCodeAt(chunkerCurrentIndex + 1);
                if (cc2 == 47) {
                    // //, find lnfeed
                    for (chunkerCurrentIndex = chunkerCurrentIndex + 2; chunkerCurrentIndex < len; chunkerCurrentIndex++) {
                        cc2 = input.charCodeAt(chunkerCurrentIndex);
                        if ((cc2 <= 13) && ((cc2 == 10) || (cc2 == 13))) { break; }
                    }
                } else if (cc2 == 42) {
                    // /*, find */
                    lastMultiComment = currentChunkStartIndex = chunkerCurrentIndex;
                    for (chunkerCurrentIndex = chunkerCurrentIndex + 2; chunkerCurrentIndex < len - 1; chunkerCurrentIndex++) {
                        cc2 = input.charCodeAt(chunkerCurrentIndex);
                        if (cc2 == 125) { lastMultiCommentEndBrace = chunkerCurrentIndex; }
                        if (cc2 != 42) { continue; }
                        if (input.charCodeAt(chunkerCurrentIndex + 1) == 47) { break; }
                    }
                    if (chunkerCurrentIndex == len - 1) {
                        return fail("missing closing `*/`", currentChunkStartIndex);
                    }
                    chunkerCurrentIndex++;
                }
                continue;
            case 42:                       // *, check for unmatched */
                if ((chunkerCurrentIndex < len - 1) && (input.charCodeAt(chunkerCurrentIndex + 1) == 47)) {
                    return fail("unmatched `/*`", chunkerCurrentIndex);
                }
                continue;
        }
    }

    if (level !== 0) {
        if ((lastMultiComment > lastOpening) && (lastMultiCommentEndBrace > lastMultiComment)) {
            return fail("missing closing `}` or `*/`", lastOpening);
        } else {
            return fail("missing closing `}`", lastOpening);
        }
    } else if (parenLevel !== 0) {
        return fail("missing closing `)`", lastOpeningParen);
    }

    emitChunk(true);
    return chunks;
};

},{}],35:[function(require,module,exports){
var chunker = require('./chunker');

module.exports = function() {
    var input,       // LeSS input string
        j,           // current chunk
        saveStack = [],   // holds state for backtracking
        furthest,    // furthest index the parser has gone to
        furthestPossibleErrorMessage,// if this is furthest we got to, this is the probably cause
        chunks,      // chunkified input
        current,     // current chunk
        currentPos,  // index of current chunk, in `input`
        parserInput = {};

    parserInput.save = function() {
        currentPos = parserInput.i;
        saveStack.push( { current: current, i: parserInput.i, j: j });
    };
    parserInput.restore = function(possibleErrorMessage) {

        if (parserInput.i > furthest || (parserInput.i === furthest && possibleErrorMessage && !furthestPossibleErrorMessage)) {
            furthest = parserInput.i;
            furthestPossibleErrorMessage = possibleErrorMessage;
        }
        var state = saveStack.pop();
        current = state.current;
        currentPos = parserInput.i = state.i;
        j = state.j;
    };
    parserInput.forget = function() {
        saveStack.pop();
    };
    function sync() {
        if (parserInput.i > currentPos) {
            current = current.slice(parserInput.i - currentPos);
            currentPos = parserInput.i;
        }
    }
    parserInput.isWhitespace = function (offset) {
        var pos = parserInput.i + (offset || 0),
            code = input.charCodeAt(pos);
        return (code === CHARCODE_SPACE || code === CHARCODE_CR || code === CHARCODE_TAB || code === CHARCODE_LF);
    };
    //
    // Parse from a token, regexp or string, and move forward if match
    //
    parserInput.$ = function(tok) {
        var tokType = typeof tok,
            match, length;

        // Either match a single character in the input,
        // or match a regexp in the current chunk (`current`).
        //
        if (tokType === "string") {
            if (input.charAt(parserInput.i) !== tok) {
                return null;
            }
            skipWhitespace(1);
            return tok;
        }

        // regexp
        sync();
        if (! (match = tok.exec(current))) {
            return null;
        }

        length = match[0].length;

        // The match is confirmed, add the match length to `i`,
        // and consume any extra white-space characters (' ' || '\n')
        // which come after that. The reason for this is that LeSS's
        // grammar is mostly white-space insensitive.
        //
        skipWhitespace(length);

        if (typeof match === 'string') {
            return match;
        } else {
            return match.length === 1 ? match[0] : match;
        }
    };

    // Specialization of $(tok)
    parserInput.$re = function(tok) {
        if (parserInput.i > currentPos) {
            current = current.slice(parserInput.i - currentPos);
            currentPos = parserInput.i;
        }
        var m = tok.exec(current);
        if (!m) {
            return null;
        }

        skipWhitespace(m[0].length);
        if (typeof m === "string") {
            return m;
        }

        return m.length === 1 ? m[0] : m;
    };

    // Specialization of $(tok)
    parserInput.$char = function(tok) {
        if (input.charAt(parserInput.i) !== tok) {
            return null;
        }
        skipWhitespace(1);
        return tok;
    };

    var CHARCODE_SPACE = 32,
        CHARCODE_TAB = 9,
        CHARCODE_LF = 10,
        CHARCODE_CR = 13,
        CHARCODE_PLUS = 43,
        CHARCODE_COMMA = 44,
        CHARCODE_FORWARD_SLASH = 47,
        CHARCODE_9 = 57;

    parserInput.autoCommentAbsorb = true;
    parserInput.commentStore = [];
    parserInput.finished = false;

    var skipWhitespace = function(length) {
        var oldi = parserInput.i, oldj = j,
            curr = parserInput.i - currentPos,
            endIndex = parserInput.i + current.length - curr,
            mem = (parserInput.i += length),
            inp = input,
            c, nextChar, comment;

        for (; parserInput.i < endIndex; parserInput.i++) {
            c = inp.charCodeAt(parserInput.i);

            if (parserInput.autoCommentAbsorb && c === CHARCODE_FORWARD_SLASH) {
                nextChar = inp.charAt(parserInput.i + 1);
                if (nextChar === '/') {
                    comment = {index: parserInput.i, isLineComment: true};
                    var nextNewLine = inp.indexOf("\n", parserInput.i + 1);
                    if (nextNewLine < 0) {
                        nextNewLine = endIndex;
                    }
                    parserInput.i = nextNewLine;
                    comment.text = inp.substr(comment.i, parserInput.i - comment.i);
                    parserInput.commentStore.push(comment);
                    continue;
                } else if (nextChar === '*') {
                    var haystack = inp.substr(parserInput.i);
                    var comment_search_result = haystack.match(/^\/\*(?:[^*]|\*+[^\/*])*\*+\//);
                    if (comment_search_result) {
                        comment = {
                            index: parserInput.i,
                            text: comment_search_result[0],
                            isLineComment: false
                        };
                        parserInput.i += comment.text.length - 1;
                        parserInput.commentStore.push(comment);
                        continue;
                    }
                }
                break;
            }

            if ((c !== CHARCODE_SPACE) && (c !== CHARCODE_LF) && (c !== CHARCODE_TAB) && (c !== CHARCODE_CR)) {
                break;
            }
        }

        current = current.slice(length + parserInput.i - mem + curr);
        currentPos = parserInput.i;

        if (!current.length) {
            if (j < chunks.length - 1)
            {
                current = chunks[++j];
                skipWhitespace(0); // skip space at the beginning of a chunk
                return true; // things changed
            }
            parserInput.finished = true;
        }

        return oldi !== parserInput.i || oldj !== j;
    };

    // Same as $(), but don't change the state of the parser,
    // just return the match.
    parserInput.peek = function(tok) {
        if (typeof tok === 'string') {
            return input.charAt(parserInput.i) === tok;
        } else {
            return tok.test(current);
        }
    };

    // Specialization of peek()
    // TODO remove or change some currentChar calls to peekChar
    parserInput.peekChar = function(tok) {
        return input.charAt(parserInput.i) === tok;
    };

    parserInput.currentChar = function() {
        return input.charAt(parserInput.i);
    };

    parserInput.getInput = function() {
        return input;
    };

    parserInput.peekNotNumeric = function() {
        var c = input.charCodeAt(parserInput.i);
        //Is the first char of the dimension 0-9, '.', '+' or '-'
        return (c > CHARCODE_9 || c < CHARCODE_PLUS) || c === CHARCODE_FORWARD_SLASH || c === CHARCODE_COMMA;
    };

    parserInput.start = function(str, chunkInput, failFunction) {
        input = str;
        parserInput.i = j = currentPos = furthest = 0;

        // chunking apparantly makes things quicker (but my tests indicate
        // it might actually make things slower in node at least)
        // and it is a non-perfect parse - it can't recognise
        // unquoted urls, meaning it can't distinguish comments
        // meaning comments with quotes or {}() in them get 'counted'
        // and then lead to parse errors.
        // In addition if the chunking chunks in the wrong place we might
        // not be able to parse a parser statement in one go
        // this is officially deprecated but can be switched on via an option
        // in the case it causes too much performance issues.
        if (chunkInput) {
            chunks = chunker(str, failFunction);
        } else {
            chunks = [str];
        }

        current = chunks[0];

        skipWhitespace(0);
    };

    parserInput.end = function() {
        var message,
            isFinished = parserInput.i >= input.length;

        if (parserInput.i < furthest) {
            message = furthestPossibleErrorMessage;
            parserInput.i = furthest;
        }
        return {
            isFinished: isFinished,
            furthest: parserInput.i,
            furthestPossibleErrorMessage: message,
            furthestReachedEnd: parserInput.i >= input.length - 1,
            furthestChar: input[parserInput.i]
        };
    };

    return parserInput;
};

},{"./chunker":34}],36:[function(require,module,exports){
var LessError = require('../less-error'),
    tree = require("../tree"),
    visitors = require("../visitors"),
    getParserInput = require("./parser-input"),
    utils = require("../utils");

//
// less.js - parser
//
//    A relatively straight-forward predictive parser.
//    There is no tokenization/lexing stage, the input is parsed
//    in one sweep.
//
//    To make the parser fast enough to run in the browser, several
//    optimization had to be made:
//
//    - Matching and slicing on a huge input is often cause of slowdowns.
//      The solution is to chunkify the input into smaller strings.
//      The chunks are stored in the `chunks` var,
//      `j` holds the current chunk index, and `currentPos` holds
//      the index of the current chunk in relation to `input`.
//      This gives us an almost 4x speed-up.
//
//    - In many cases, we don't need to match individual tokens;
//      for example, if a value doesn't hold any variables, operations
//      or dynamic references, the parser can effectively 'skip' it,
//      treating it as a literal.
//      An example would be '1px solid #000' - which evaluates to itself,
//      we don't need to know what the individual components are.
//      The drawback, of course is that you don't get the benefits of
//      syntax-checking on the CSS. This gives us a 50% speed-up in the parser,
//      and a smaller speed-up in the code-gen.
//
//
//    Token matching is done with the `$` function, which either takes
//    a terminal string or regexp, or a non-terminal function to call.
//    It also takes care of moving all the indices forwards.
//
//
var Parser = function Parser(context, imports, fileInfo) {
    var parsers,
        parserInput = getParserInput();

    function expect(arg, msg, index) {
        // some older browsers return typeof 'function' for RegExp
        var result = (Object.prototype.toString.call(arg) === '[object Function]') ? arg.call(parsers) : parserInput.$(arg);
        if (result) {
            return result;
        }
        error(msg || (typeof arg === 'string' ? "expected '" + arg + "' got '" + parserInput.currentChar() + "'"
                                               : "unexpected token"));
    }

    // Specialization of expect()
    function expectChar(arg, msg) {
        if (parserInput.$char(arg)) {
            return arg;
        }
        error(msg || "expected '" + arg + "' got '" + parserInput.currentChar() + "'");
    }

    function error(msg, type) {
        throw new LessError(
            {
                index: parserInput.i,
                filename: fileInfo.filename,
                type: type || 'Syntax',
                message: msg
            },
            imports
        );
    }

    function getDebugInfo(index) {
        var filename = fileInfo.filename;

        return {
            lineNumber: utils.getLocation(index, parserInput.getInput()).line + 1,
            fileName: filename
        };
    }

    //
    // The Parser
    //
    return {

        //
        // Parse an input string into an abstract syntax tree,
        // @param str A string containing 'less' markup
        // @param callback call `callback` when done.
        // @param [additionalData] An optional map which can contains vars - a map (key, value) of variables to apply
        //
        parse: function (str, callback, additionalData) {
            var root, error = null, globalVars, modifyVars, ignored, preText = "";

            globalVars = (additionalData && additionalData.globalVars) ? Parser.serializeVars(additionalData.globalVars) + '\n' : '';
            modifyVars = (additionalData && additionalData.modifyVars) ? '\n' + Parser.serializeVars(additionalData.modifyVars) : '';

            if (context.pluginManager) {
                var preProcessors = context.pluginManager.getPreProcessors();
                for (var i = 0; i < preProcessors.length; i++) {
                    str = preProcessors[i].process(str, { context: context, imports: imports, fileInfo: fileInfo });
                }
            }

            if (globalVars || (additionalData && additionalData.banner)) {
                preText = ((additionalData && additionalData.banner) ? additionalData.banner : "") + globalVars;
                ignored = imports.contentsIgnoredChars;
                ignored[fileInfo.filename] = ignored[fileInfo.filename] || 0;
                ignored[fileInfo.filename] += preText.length;
            }

            str = str.replace(/\r\n?/g, '\n');
            // Remove potential UTF Byte Order Mark
            str = preText + str.replace(/^\uFEFF/, '') + modifyVars;
            imports.contents[fileInfo.filename] = str;

            // Start with the primary rule.
            // The whole syntax tree is held under a Ruleset node,
            // with the `root` property set to true, so no `{}` are
            // output. The callback is called when the input is parsed.
            try {
                parserInput.start(str, context.chunkInput, function fail(msg, index) {
                    throw LessError({
                        index: index,
                        type: 'Parse',
                        message: msg,
                        filename: fileInfo.filename
                    }, imports);
                });

                root = new(tree.Ruleset)(null, this.parsers.primary());
                root.root = true;
                root.firstRoot = true;
            } catch (e) {
                return callback(new LessError(e, imports, fileInfo.filename));
            }

            // If `i` is smaller than the `input.length - 1`,
            // it means the parser wasn't able to parse the whole
            // string, so we've got a parsing error.
            //
            // We try to extract a \n delimited string,
            // showing the line where the parse error occurred.
            // We split it up into two parts (the part which parsed,
            // and the part which didn't), so we can color them differently.
            var endInfo = parserInput.end();
            if (!endInfo.isFinished) {

                var message = endInfo.furthestPossibleErrorMessage;

                if (!message) {
                    message = "Unrecognised input";
                    if (endInfo.furthestChar === '}') {
                        message += ". Possibly missing opening '{'";
                    } else if (endInfo.furthestChar === ')') {
                        message += ". Possibly missing opening '('";
                    } else if (endInfo.furthestReachedEnd) {
                        message += ". Possibly missing something";
                    }
                }

                error = new LessError({
                    type: "Parse",
                    message: message,
                    index: endInfo.furthest,
                    filename: fileInfo.filename
                }, imports);
            }

            var finish = function (e) {
                e = error || e || imports.error;

                if (e) {
                    if (!(e instanceof LessError)) {
                        e = new LessError(e, imports, fileInfo.filename);
                    }

                    return callback(e);
                }
                else {
                    return callback(null, root);
                }
            };

            if (context.processImports !== false) {
                new visitors.ImportVisitor(imports, finish)
                    .run(root);
            } else {
                return finish();
            }
        },

        //
        // Here in, the parsing rules/functions
        //
        // The basic structure of the syntax tree generated is as follows:
        //
        //   Ruleset ->  Rule -> Value -> Expression -> Entity
        //
        // Here's some Less code:
        //
        //    .class {
        //      color: #fff;
        //      border: 1px solid #000;
        //      width: @w + 4px;
        //      > .child {...}
        //    }
        //
        // And here's what the parse tree might look like:
        //
        //     Ruleset (Selector '.class', [
        //         Rule ("color",  Value ([Expression [Color #fff]]))
        //         Rule ("border", Value ([Expression [Dimension 1px][Keyword "solid"][Color #000]]))
        //         Rule ("width",  Value ([Expression [Operation " + " [Variable "@w"][Dimension 4px]]]))
        //         Ruleset (Selector [Element '>', '.child'], [...])
        //     ])
        //
        //  In general, most rules will try to parse a token with the `$()` function, and if the return
        //  value is truly, will return a new node, of the relevant type. Sometimes, we need to check
        //  first, before parsing, that's when we use `peek()`.
        //
        parsers: parsers = {
            //
            // The `primary` rule is the *entry* and *exit* point of the parser.
            // The rules here can appear at any level of the parse tree.
            //
            // The recursive nature of the grammar is an interplay between the `block`
            // rule, which represents `{ ... }`, the `ruleset` rule, and this `primary` rule,
            // as represented by this simplified grammar:
            //
            //     primary  →  (ruleset | rule)+
            //     ruleset  →  selector+ block
            //     block    →  '{' primary '}'
            //
            // Only at one point is the primary rule not called from the
            // block rule: at the root level.
            //
            primary: function () {
                var mixin = this.mixin, root = [], node;

                while (true)
                {
                    while (true) {
                        node = this.comment();
                        if (!node) { break; }
                        root.push(node);
                    }
                    // always process comments before deciding if finished
                    if (parserInput.finished) {
                        break;
                    }
                    if (parserInput.peek('}')) {
                        break;
                    }

                    node = this.extendRule();
                    if (node) {
                        root = root.concat(node);
                        continue;
                    }

                    node = mixin.definition() || this.rule() || this.ruleset() ||
                        mixin.call() || this.rulesetCall() || this.directive();
                    if (node) {
                        root.push(node);
                    } else {
                        if (!(parserInput.$re(/^[\s\n]+/) || parserInput.$re(/^;+/))) {
                            break;
                        }
                    }
                }

                return root;
            },

            // comments are collected by the main parsing mechanism and then assigned to nodes
            // where the current structure allows it
            comment: function () {
                if (parserInput.commentStore.length) {
                    var comment = parserInput.commentStore.shift();
                    return new(tree.Comment)(comment.text, comment.isLineComment, comment.index, fileInfo);
                }
            },

            //
            // Entities are tokens which can be found inside an Expression
            //
            entities: {
                //
                // A string, which supports escaping " and '
                //
                //     "milky way" 'he\'s the one!'
                //
                quoted: function () {
                    var str, index = parserInput.i;

                    str = parserInput.$re(/^(~)?("((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)')/);
                    if (str) {
                        return new(tree.Quoted)(str[2], str[3] || str[4], Boolean(str[1]), index, fileInfo);
                    }
                },

                //
                // A catch-all word, such as:
                //
                //     black border-collapse
                //
                keyword: function () {
                    var k = parserInput.$re(/^%|^[_A-Za-z-][_A-Za-z0-9-]*/);
                    if (k) {
                        return tree.Color.fromKeyword(k) || new(tree.Keyword)(k);
                    }
                },

                //
                // A function call
                //
                //     rgb(255, 0, 255)
                //
                // We also try to catch IE's `alpha()`, but let the `alpha` parser
                // deal with the details.
                //
                // The arguments are parsed with the `entities.arguments` parser.
                //
                call: function () {
                    var name, nameLC, args, alpha, index = parserInput.i;

                    if (parserInput.peek(/^url\(/i)) {
                        return;
                    }

                    parserInput.save();

                    name = parserInput.$re(/^([\w-]+|%|progid:[\w\.]+)\(/);
                    if (!name) { parserInput.forget(); return; }

                    name = name[1];
                    nameLC = name.toLowerCase();

                    if (nameLC === 'alpha') {
                        alpha = parsers.alpha();
                        if (alpha) {
                            return alpha;
                        }
                    }

                    args = this.arguments();

                    if (! parserInput.$char(')')) {
                        parserInput.restore("Could not parse call arguments or missing ')'");
                        return;
                    }

                    parserInput.forget();
                    return new(tree.Call)(name, args, index, fileInfo);
                },
                arguments: function () {
                    var args = [], arg;

                    while (true) {
                        arg = this.assignment() || parsers.expression();
                        if (!arg) {
                            break;
                        }
                        args.push(arg);
                        if (! parserInput.$char(',')) {
                            break;
                        }
                    }
                    return args;
                },
                literal: function () {
                    return this.dimension() ||
                           this.color() ||
                           this.quoted() ||
                           this.unicodeDescriptor();
                },

                // Assignments are argument entities for calls.
                // They are present in ie filter properties as shown below.
                //
                //     filter: progid:DXImageTransform.Microsoft.Alpha( *opacity=50* )
                //

                assignment: function () {
                    var key, value;
                    key = parserInput.$re(/^\w+(?=\s?=)/i);
                    if (!key) {
                        return;
                    }
                    if (!parserInput.$char('=')) {
                        return;
                    }
                    value = parsers.entity();
                    if (value) {
                        return new(tree.Assignment)(key, value);
                    }
                },

                //
                // Parse url() tokens
                //
                // We use a specific rule for urls, because they don't really behave like
                // standard function calls. The difference is that the argument doesn't have
                // to be enclosed within a string, so it can't be parsed as an Expression.
                //
                url: function () {
                    var value, index = parserInput.i;

                    parserInput.autoCommentAbsorb = false;

                    if (parserInput.currentChar() !== 'u' || !parserInput.$re(/^url\(/)) {
                        parserInput.autoCommentAbsorb = true;
                        return;
                    }

                    value = this.quoted() || this.variable() ||
                            parserInput.$re(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/) || "";

                    parserInput.autoCommentAbsorb = true;

                    expectChar(')');

                    return new(tree.URL)((value.value != null || value instanceof tree.Variable) ?
                                        value : new(tree.Anonymous)(value), index, fileInfo);
                },

                //
                // A Variable entity, such as `@fink`, in
                //
                //     width: @fink + 2px
                //
                // We use a different parser for variable definitions,
                // see `parsers.variable`.
                //
                variable: function () {
                    var name, index = parserInput.i;

                    if (parserInput.currentChar() === '@' && (name = parserInput.$re(/^@@?[\w-]+/))) {
                        return new(tree.Variable)(name, index, fileInfo);
                    }
                },

                // A variable entity useing the protective {} e.g. @{var}
                variableCurly: function () {
                    var curly, index = parserInput.i;

                    if (parserInput.currentChar() === '@' && (curly = parserInput.$re(/^@\{([\w-]+)\}/))) {
                        return new(tree.Variable)("@" + curly[1], index, fileInfo);
                    }
                },

                //
                // A Hexadecimal color
                //
                //     #4F3C2F
                //
                // `rgb` and `hsl` colors are parsed through the `entities.call` parser.
                //
                color: function () {
                    var rgb;

                    if (parserInput.currentChar() === '#' && (rgb = parserInput.$re(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))) {
                        // strip colons, brackets, whitespaces and other characters that should not
                        // definitely be part of color string
                        var colorCandidateString = rgb.input.match(/^#([\w]+).*/);
                        colorCandidateString = colorCandidateString[1];
                        if (!colorCandidateString.match(/^[A-Fa-f0-9]+$/)) { // verify if candidate consists only of allowed HEX characters
                            error("Invalid HEX color code");
                        }
                        return new(tree.Color)(rgb[1]);
                    }
                },

                //
                // A Dimension, that is, a number and a unit
                //
                //     0.5em 95%
                //
                dimension: function () {
                    if (parserInput.peekNotNumeric()) {
                        return;
                    }

                    var value = parserInput.$re(/^([+-]?\d*\.?\d+)(%|[a-z]+)?/i);
                    if (value) {
                        return new(tree.Dimension)(value[1], value[2]);
                    }
                },

                //
                // A unicode descriptor, as is used in unicode-range
                //
                // U+0??  or U+00A1-00A9
                //
                unicodeDescriptor: function () {
                    var ud;

                    ud = parserInput.$re(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/);
                    if (ud) {
                        return new(tree.UnicodeDescriptor)(ud[0]);
                    }
                },

                //
                // JavaScript code to be evaluated
                //
                //     `window.location.href`
                //
                javascript: function () {
                    var js, index = parserInput.i;

                    js = parserInput.$re(/^(~)?`([^`]*)`/);
                    if (js) {
                        return new(tree.JavaScript)(js[2], Boolean(js[1]), index, fileInfo);
                    }
                }
            },

            //
            // The variable part of a variable definition. Used in the `rule` parser
            //
            //     @fink:
            //
            variable: function () {
                var name;

                if (parserInput.currentChar() === '@' && (name = parserInput.$re(/^(@[\w-]+)\s*:/))) { return name[1]; }
            },

            //
            // The variable part of a variable definition. Used in the `rule` parser
            //
            //     @fink();
            //
            rulesetCall: function () {
                var name;

                if (parserInput.currentChar() === '@' && (name = parserInput.$re(/^(@[\w-]+)\s*\(\s*\)\s*;/))) {
                    return new tree.RulesetCall(name[1]);
                }
            },

            //
            // extend syntax - used to extend selectors
            //
            extend: function(isRule) {
                var elements, e, index = parserInput.i, option, extendList, extend;

                if (!(isRule ? parserInput.$re(/^&:extend\(/) : parserInput.$re(/^:extend\(/))) { return; }

                do {
                    option = null;
                    elements = null;
                    while (! (option = parserInput.$re(/^(all)(?=\s*(\)|,))/))) {
                        e = this.element();
                        if (!e) {
                            break;
                        }
                        if (elements) {
                            elements.push(e);
                        } else {
                            elements = [ e ];
                        }
                    }

                    option = option && option[1];
                    if (!elements) {
                        error("Missing target selector for :extend().");
                    }
                    extend = new(tree.Extend)(new(tree.Selector)(elements), option, index);
                    if (extendList) {
                        extendList.push(extend);
                    } else {
                        extendList = [ extend ];
                    }
                } while (parserInput.$char(","));

                expect(/^\)/);

                if (isRule) {
                    expect(/^;/);
                }

                return extendList;
            },

            //
            // extendRule - used in a rule to extend all the parent selectors
            //
            extendRule: function() {
                return this.extend(true);
            },

            //
            // Mixins
            //
            mixin: {
                //
                // A Mixin call, with an optional argument list
                //
                //     #mixins > .square(#fff);
                //     .rounded(4px, black);
                //     .button;
                //
                // The `while` loop is there because mixins can be
                // namespaced, but we only support the child and descendant
                // selector for now.
                //
                call: function () {
                    var s = parserInput.currentChar(), important = false, index = parserInput.i, elemIndex,
                        elements, elem, e, c, args;

                    if (s !== '.' && s !== '#') { return; }

                    parserInput.save(); // stop us absorbing part of an invalid selector

                    while (true) {
                        elemIndex = parserInput.i;
                        e = parserInput.$re(/^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/);
                        if (!e) {
                            break;
                        }
                        elem = new(tree.Element)(c, e, elemIndex, fileInfo);
                        if (elements) {
                            elements.push(elem);
                        } else {
                            elements = [ elem ];
                        }
                        c = parserInput.$char('>');
                    }

                    if (elements) {
                        if (parserInput.$char('(')) {
                            args = this.args(true).args;
                            expectChar(')');
                        }

                        if (parsers.important()) {
                            important = true;
                        }

                        if (parsers.end()) {
                            parserInput.forget();
                            return new(tree.mixin.Call)(elements, args, index, fileInfo, important);
                        }
                    }

                    parserInput.restore();
                },
                args: function (isCall) {
                    var entities = parsers.entities,
                        returner = { args:null, variadic: false },
                        expressions = [], argsSemiColon = [], argsComma = [],
                        isSemiColonSeparated, expressionContainsNamed, name, nameLoop, value, arg;

                    parserInput.save();

                    while (true) {
                        if (isCall) {
                            arg = parsers.detachedRuleset() || parsers.expression();
                        } else {
                            parserInput.commentStore.length = 0;
                            if (parserInput.currentChar() === '.' && parserInput.$re(/^\.{3}/)) {
                                returner.variadic = true;
                                if (parserInput.$char(";") && !isSemiColonSeparated) {
                                    isSemiColonSeparated = true;
                                }
                                (isSemiColonSeparated ? argsSemiColon : argsComma)
                                    .push({ variadic: true });
                                break;
                            }
                            arg = entities.variable() || entities.literal() || entities.keyword();
                        }

                        if (!arg) {
                            break;
                        }

                        nameLoop = null;
                        if (arg.throwAwayComments) {
                            arg.throwAwayComments();
                        }
                        value = arg;
                        var val = null;

                        if (isCall) {
                            // Variable
                            if (arg.value && arg.value.length == 1) {
                                val = arg.value[0];
                            }
                        } else {
                            val = arg;
                        }

                        if (val && val instanceof tree.Variable) {
                            if (parserInput.$char(':')) {
                                if (expressions.length > 0) {
                                    if (isSemiColonSeparated) {
                                        error("Cannot mix ; and , as delimiter types");
                                    }
                                    expressionContainsNamed = true;
                                }

                                // we do not support setting a ruleset as a default variable - it doesn't make sense
                                // However if we do want to add it, there is nothing blocking it, just don't error
                                // and remove isCall dependency below
                                value = (isCall && parsers.detachedRuleset()) || parsers.expression();

                                if (!value) {
                                    if (isCall) {
                                        error("could not understand value for named argument");
                                    } else {
                                        parserInput.restore();
                                        returner.args = [];
                                        return returner;
                                    }
                                }
                                nameLoop = (name = val.name);
                            } else if (!isCall && parserInput.$re(/^\.{3}/)) {
                                returner.variadic = true;
                                if (parserInput.$char(";") && !isSemiColonSeparated) {
                                    isSemiColonSeparated = true;
                                }
                                (isSemiColonSeparated ? argsSemiColon : argsComma)
                                    .push({ name: arg.name, variadic: true });
                                break;
                            } else if (!isCall) {
                                name = nameLoop = val.name;
                                value = null;
                            }
                        }

                        if (value) {
                            expressions.push(value);
                        }

                        argsComma.push({ name:nameLoop, value:value });

                        if (parserInput.$char(',')) {
                            continue;
                        }

                        if (parserInput.$char(';') || isSemiColonSeparated) {

                            if (expressionContainsNamed) {
                                error("Cannot mix ; and , as delimiter types");
                            }

                            isSemiColonSeparated = true;

                            if (expressions.length > 1) {
                                value = new(tree.Value)(expressions);
                            }
                            argsSemiColon.push({ name:name, value:value });

                            name = null;
                            expressions = [];
                            expressionContainsNamed = false;
                        }
                    }

                    parserInput.forget();
                    returner.args = isSemiColonSeparated ? argsSemiColon : argsComma;
                    return returner;
                },
                //
                // A Mixin definition, with a list of parameters
                //
                //     .rounded (@radius: 2px, @color) {
                //        ...
                //     }
                //
                // Until we have a finer grained state-machine, we have to
                // do a look-ahead, to make sure we don't have a mixin call.
                // See the `rule` function for more information.
                //
                // We start by matching `.rounded (`, and then proceed on to
                // the argument list, which has optional default values.
                // We store the parameters in `params`, with a `value` key,
                // if there is a value, such as in the case of `@radius`.
                //
                // Once we've got our params list, and a closing `)`, we parse
                // the `{...}` block.
                //
                definition: function () {
                    var name, params = [], match, ruleset, cond, variadic = false;
                    if ((parserInput.currentChar() !== '.' && parserInput.currentChar() !== '#') ||
                        parserInput.peek(/^[^{]*\}/)) {
                        return;
                    }

                    parserInput.save();

                    match = parserInput.$re(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/);
                    if (match) {
                        name = match[1];

                        var argInfo = this.args(false);
                        params = argInfo.args;
                        variadic = argInfo.variadic;

                        // .mixincall("@{a}");
                        // looks a bit like a mixin definition..
                        // also
                        // .mixincall(@a: {rule: set;});
                        // so we have to be nice and restore
                        if (!parserInput.$char(')')) {
                            parserInput.restore("Missing closing ')'");
                            return;
                        }

                        parserInput.commentStore.length = 0;

                        if (parserInput.$re(/^when/)) { // Guard
                            cond = expect(parsers.conditions, 'expected condition');
                        }

                        ruleset = parsers.block();

                        if (ruleset) {
                            parserInput.forget();
                            return new(tree.mixin.Definition)(name, params, ruleset, cond, variadic);
                        } else {
                            parserInput.restore();
                        }
                    } else {
                        parserInput.forget();
                    }
                }
            },

            //
            // Entities are the smallest recognized token,
            // and can be found inside a rule's value.
            //
            entity: function () {
                var entities = this.entities;

                return this.comment() || entities.literal() || entities.variable() || entities.url() ||
                       entities.call()    || entities.keyword()  || entities.javascript();
            },

            //
            // A Rule terminator. Note that we use `peek()` to check for '}',
            // because the `block` rule will be expecting it, but we still need to make sure
            // it's there, if ';' was ommitted.
            //
            end: function () {
                return parserInput.$char(';') || parserInput.peek('}');
            },

            //
            // IE's alpha function
            //
            //     alpha(opacity=88)
            //
            alpha: function () {
                var value;

                if (! parserInput.$re(/^opacity=/i)) { return; }
                value = parserInput.$re(/^\d+/);
                if (!value) {
                    value = expect(this.entities.variable, "Could not parse alpha");
                }
                expectChar(')');
                return new(tree.Alpha)(value);
            },

            //
            // A Selector Element
            //
            //     div
            //     + h1
            //     #socks
            //     input[type="text"]
            //
            // Elements are the building blocks for Selectors,
            // they are made out of a `Combinator` (see combinator rule),
            // and an element name, such as a tag a class, or `*`.
            //
            element: function () {
                var e, c, v, index = parserInput.i;

                c = this.combinator();

                e = parserInput.$re(/^(?:\d+\.\d+|\d+)%/) ||
                    parserInput.$re(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/) ||
                    parserInput.$char('*') || parserInput.$char('&') || this.attribute() ||
                    parserInput.$re(/^\([^&()@]+\)/) ||  parserInput.$re(/^[\.#:](?=@)/) ||
                    this.entities.variableCurly();

                if (! e) {
                    parserInput.save();
                    if (parserInput.$char('(')) {
                        if ((v = this.selector()) && parserInput.$char(')')) {
                            e = new(tree.Paren)(v);
                            parserInput.forget();
                        } else {
                            parserInput.restore("Missing closing ')'");
                        }
                    } else {
                        parserInput.forget();
                    }
                }

                if (e) { return new(tree.Element)(c, e, index, fileInfo); }
            },

            //
            // Combinators combine elements together, in a Selector.
            //
            // Because our parser isn't white-space sensitive, special care
            // has to be taken, when parsing the descendant combinator, ` `,
            // as it's an empty space. We have to check the previous character
            // in the input, to see if it's a ` ` character. More info on how
            // we deal with this in *combinator.js*.
            //
            combinator: function () {
                var c = parserInput.currentChar();

                if (c === '/') {
                    parserInput.save();
                    var slashedCombinator = parserInput.$re(/^\/[a-z]+\//i);
                    if (slashedCombinator) {
                        parserInput.forget();
                        return new(tree.Combinator)(slashedCombinator);
                    }
                    parserInput.restore();
                }

                if (c === '>' || c === '+' || c === '~' || c === '|' || c === '^') {
                    parserInput.i++;
                    if (c === '^' && parserInput.currentChar() === '^') {
                        c = '^^';
                        parserInput.i++;
                    }
                    while (parserInput.isWhitespace()) { parserInput.i++; }
                    return new(tree.Combinator)(c);
                } else if (parserInput.isWhitespace(-1)) {
                    return new(tree.Combinator)(" ");
                } else {
                    return new(tree.Combinator)(null);
                }
            },
            //
            // A CSS selector (see selector below)
            // with less extensions e.g. the ability to extend and guard
            //
            lessSelector: function () {
                return this.selector(true);
            },
            //
            // A CSS Selector
            //
            //     .class > div + h1
            //     li a:hover
            //
            // Selectors are made out of one or more Elements, see above.
            //
            selector: function (isLess) {
                var index = parserInput.i, elements, extendList, c, e, allExtends, when, condition;

                while ((isLess && (extendList = this.extend())) || (isLess && (when = parserInput.$re(/^when/))) || (e = this.element())) {
                    if (when) {
                        condition = expect(this.conditions, 'expected condition');
                    } else if (condition) {
                        error("CSS guard can only be used at the end of selector");
                    } else if (extendList) {
                        if (allExtends) {
                            allExtends = allExtends.concat(extendList);
                        } else {
                            allExtends = extendList;
                        }
                    } else {
                        if (allExtends) { error("Extend can only be used at the end of selector"); }
                        c = parserInput.currentChar();
                        if (elements) {
                            elements.push(e);
                        } else {
                            elements = [ e ];
                        }
                        e = null;
                    }
                    if (c === '{' || c === '}' || c === ';' || c === ',' || c === ')') {
                        break;
                    }
                }

                if (elements) { return new(tree.Selector)(elements, allExtends, condition, index, fileInfo); }
                if (allExtends) { error("Extend must be used to extend a selector, it cannot be used on its own"); }
            },
            attribute: function () {
                if (! parserInput.$char('[')) { return; }

                var entities = this.entities,
                    key, val, op;

                if (!(key = entities.variableCurly())) {
                    key = expect(/^(?:[_A-Za-z0-9-\*]*\|)?(?:[_A-Za-z0-9-]|\\.)+/);
                }

                op = parserInput.$re(/^[|~*$^]?=/);
                if (op) {
                    val = entities.quoted() || parserInput.$re(/^[0-9]+%/) || parserInput.$re(/^[\w-]+/) || entities.variableCurly();
                }

                expectChar(']');

                return new(tree.Attribute)(key, op, val);
            },

            //
            // The `block` rule is used by `ruleset` and `mixin.definition`.
            // It's a wrapper around the `primary` rule, with added `{}`.
            //
            block: function () {
                var content;
                if (parserInput.$char('{') && (content = this.primary()) && parserInput.$char('}')) {
                    return content;
                }
            },

            blockRuleset: function() {
                var block = this.block();

                if (block) {
                    block = new tree.Ruleset(null, block);
                }
                return block;
            },

            detachedRuleset: function() {
                var blockRuleset = this.blockRuleset();
                if (blockRuleset) {
                    return new tree.DetachedRuleset(blockRuleset);
                }
            },

            //
            // div, .class, body > p {...}
            //
            ruleset: function () {
                var selectors, s, rules, debugInfo;

                parserInput.save();

                if (context.dumpLineNumbers) {
                    debugInfo = getDebugInfo(parserInput.i);
                }

                while (true) {
                    s = this.lessSelector();
                    if (!s) {
                        break;
                    }
                    if (selectors) {
                        selectors.push(s);
                    } else {
                        selectors = [ s ];
                    }
                    parserInput.commentStore.length = 0;
                    if (s.condition && selectors.length > 1) {
                        error("Guards are only currently allowed on a single selector.");
                    }
                    if (! parserInput.$char(',')) { break; }
                    if (s.condition) {
                        error("Guards are only currently allowed on a single selector.");
                    }
                    parserInput.commentStore.length = 0;
                }

                if (selectors && (rules = this.block())) {
                    parserInput.forget();
                    var ruleset = new(tree.Ruleset)(selectors, rules, context.strictImports);
                    if (context.dumpLineNumbers) {
                        ruleset.debugInfo = debugInfo;
                    }
                    return ruleset;
                } else {
                    parserInput.restore();
                }
            },
            rule: function (tryAnonymous) {
                var name, value, startOfRule = parserInput.i, c = parserInput.currentChar(), important, merge, isVariable;

                if (c === '.' || c === '#' || c === '&') { return; }

                parserInput.save();

                name = this.variable() || this.ruleProperty();
                if (name) {
                    isVariable = typeof name === "string";

                    if (isVariable) {
                        value = this.detachedRuleset();
                    }

                    parserInput.commentStore.length = 0;
                    if (!value) {
                        // a name returned by this.ruleProperty() is always an array of the form:
                        // [string-1, ..., string-n, ""] or [string-1, ..., string-n, "+"]
                        // where each item is a tree.Keyword or tree.Variable
                        merge = !isVariable && name.pop().value;

                        // prefer to try to parse first if its a variable or we are compressing
                        // but always fallback on the other one
                        var tryValueFirst = !tryAnonymous && (context.compress || isVariable);

                        if (tryValueFirst) {
                            value = this.value();
                        }
                        if (!value) {
                            value = this.anonymousValue();
                            if (value) {
                                parserInput.forget();
                                // anonymous values absorb the end ';' which is reequired for them to work
                                return new (tree.Rule)(name, value, false, merge, startOfRule, fileInfo);
                            }
                        }
                        if (!tryValueFirst && !value) {
                            value = this.value();
                        }

                        important = this.important();
                    }

                    if (value && this.end()) {
                        parserInput.forget();
                        return new (tree.Rule)(name, value, important, merge, startOfRule, fileInfo);
                    } else {
                        parserInput.restore();
                        if (value && !tryAnonymous) {
                            return this.rule(true);
                        }
                    }
                } else {
                    parserInput.forget();
                }
            },
            anonymousValue: function () {
                var match = parserInput.$re(/^([^@+\/'"*`(;{}-]*);/);
                if (match) {
                    return new(tree.Anonymous)(match[1]);
                }
            },

            //
            // An @import directive
            //
            //     @import "lib";
            //
            // Depending on our environment, importing is done differently:
            // In the browser, it's an XHR request, in Node, it would be a
            // file-system operation. The function used for importing is
            // stored in `import`, which we pass to the Import constructor.
            //
            "import": function () {
                var path, features, index = parserInput.i;

                var dir = parserInput.$re(/^@import?\s+/);

                if (dir) {
                    var options = (dir ? this.importOptions() : null) || {};

                    if ((path = this.entities.quoted() || this.entities.url())) {
                        features = this.mediaFeatures();

                        if (!parserInput.$(';')) {
                            parserInput.i = index;
                            error("missing semi-colon or unrecognised media features on import");
                        }
                        features = features && new(tree.Value)(features);
                        return new(tree.Import)(path, features, options, index, fileInfo);
                    }
                    else
                    {
                        parserInput.i = index;
                        error("malformed import statement");
                    }
                }
            },

            importOptions: function() {
                var o, options = {}, optionName, value;

                // list of options, surrounded by parens
                if (! parserInput.$char('(')) { return null; }
                do {
                    o = this.importOption();
                    if (o) {
                        optionName = o;
                        value = true;
                        switch(optionName) {
                            case "css":
                                optionName = "less";
                                value = false;
                                break;
                            case "once":
                                optionName = "multiple";
                                value = false;
                                break;
                        }
                        options[optionName] = value;
                        if (! parserInput.$char(',')) { break; }
                    }
                } while (o);
                expectChar(')');
                return options;
            },

            importOption: function() {
                var opt = parserInput.$re(/^(less|css|multiple|once|inline|reference|optional)/);
                if (opt) {
                    return opt[1];
                }
            },

            mediaFeature: function () {
                var entities = this.entities, nodes = [], e, p;
                parserInput.save();
                do {
                    e = entities.keyword() || entities.variable();
                    if (e) {
                        nodes.push(e);
                    } else if (parserInput.$char('(')) {
                        p = this.property();
                        e = this.value();
                        if (parserInput.$char(')')) {
                            if (p && e) {
                                nodes.push(new(tree.Paren)(new(tree.Rule)(p, e, null, null, parserInput.i, fileInfo, true)));
                            } else if (e) {
                                nodes.push(new(tree.Paren)(e));
                            } else {
                                parserInput.restore("badly formed media feature definition");
                                return null;
                            }
                        } else {
                            parserInput.restore("Missing closing ')'");
                            return null;
                        }
                    }
                } while (e);

                parserInput.forget();
                if (nodes.length > 0) {
                    return new(tree.Expression)(nodes);
                }
            },

            mediaFeatures: function () {
                var entities = this.entities, features = [], e;
                do {
                    e = this.mediaFeature();
                    if (e) {
                        features.push(e);
                        if (! parserInput.$char(',')) { break; }
                    } else {
                        e = entities.variable();
                        if (e) {
                            features.push(e);
                            if (! parserInput.$char(',')) { break; }
                        }
                    }
                } while (e);

                return features.length > 0 ? features : null;
            },

            media: function () {
                var features, rules, media, debugInfo;

                if (context.dumpLineNumbers) {
                    debugInfo = getDebugInfo(parserInput.i);
                }

                if (parserInput.$re(/^@media/)) {
                    features = this.mediaFeatures();

                    rules = this.block();
                    if (rules) {
                        media = new(tree.Media)(rules, features, parserInput.i, fileInfo);
                        if (context.dumpLineNumbers) {
                            media.debugInfo = debugInfo;
                        }
                        return media;
                    }
                }
            },

            //
            // A CSS Directive
            //
            //     @charset "utf-8";
            //
            directive: function () {
                var index = parserInput.i, name, value, rules, nonVendorSpecificName,
                    hasIdentifier, hasExpression, hasUnknown, hasBlock = true;

                if (parserInput.currentChar() !== '@') { return; }

                value = this['import']() || this.media();
                if (value) {
                    return value;
                }

                parserInput.save();

                name = parserInput.$re(/^@[a-z-]+/);

                if (!name) { return; }

                nonVendorSpecificName = name;
                if (name.charAt(1) == '-' && name.indexOf('-', 2) > 0) {
                    nonVendorSpecificName = "@" + name.slice(name.indexOf('-', 2) + 1);
                }

                switch(nonVendorSpecificName) {
                    /*
                    case "@font-face":
                    case "@viewport":
                    case "@top-left":
                    case "@top-left-corner":
                    case "@top-center":
                    case "@top-right":
                    case "@top-right-corner":
                    case "@bottom-left":
                    case "@bottom-left-corner":
                    case "@bottom-center":
                    case "@bottom-right":
                    case "@bottom-right-corner":
                    case "@left-top":
                    case "@left-middle":
                    case "@left-bottom":
                    case "@right-top":
                    case "@right-middle":
                    case "@right-bottom":
                        hasBlock = true;
                        break;
                    */
                    case "@counter-style":
                        hasIdentifier = true;
                        hasBlock = true;
                        break;
                    case "@charset":
                        hasIdentifier = true;
                        hasBlock = false;
                        break;
                    case "@namespace":
                        hasExpression = true;
                        hasBlock = false;
                        break;
                    case "@keyframes":
                        hasIdentifier = true;
                        break;
                    case "@host":
                    case "@page":
                    case "@document":
                    case "@supports":
                        hasUnknown = true;
                        break;
                }

                parserInput.commentStore.length = 0;

                if (hasIdentifier) {
                    value = this.entity();
                    if (!value) {
                        error("expected " + name + " identifier");
                    }
                } else if (hasExpression) {
                    value = this.expression();
                    if (!value) {
                        error("expected " + name + " expression");
                    }
                } else if (hasUnknown) {
                    value = (parserInput.$re(/^[^{;]+/) || '').trim();
                    if (value) {
                        value = new(tree.Anonymous)(value);
                    }
                }

                if (hasBlock) {
                    rules = this.blockRuleset();
                }

                if (rules || (!hasBlock && value && parserInput.$char(';'))) {
                    parserInput.forget();
                    return new(tree.Directive)(name, value, rules, index, fileInfo,
                        context.dumpLineNumbers ? getDebugInfo(index) : null);
                }

                parserInput.restore("directive options not recognised");
            },

            //
            // A Value is a comma-delimited list of Expressions
            //
            //     font-family: Baskerville, Georgia, serif;
            //
            // In a Rule, a Value represents everything after the `:`,
            // and before the `;`.
            //
            value: function () {
                var e, expressions = [];

                do {
                    e = this.expression();
                    if (e) {
                        expressions.push(e);
                        if (! parserInput.$char(',')) { break; }
                    }
                } while (e);

                if (expressions.length > 0) {
                    return new(tree.Value)(expressions);
                }
            },
            important: function () {
                if (parserInput.currentChar() === '!') {
                    return parserInput.$re(/^! *important/);
                }
            },
            sub: function () {
                var a, e;

                parserInput.save();
                if (parserInput.$char('(')) {
                    a = this.addition();
                    if (a && parserInput.$char(')')) {
                        parserInput.forget();
                        e = new(tree.Expression)([a]);
                        e.parens = true;
                        return e;
                    }
                    parserInput.restore("Expected ')'");
                    return;
                }
                parserInput.restore();
            },
            multiplication: function () {
                var m, a, op, operation, isSpaced;
                m = this.operand();
                if (m) {
                    isSpaced = parserInput.isWhitespace(-1);
                    while (true) {
                        if (parserInput.peek(/^\/[*\/]/)) {
                            break;
                        }

                        parserInput.save();

                        op = parserInput.$char('/') || parserInput.$char('*');

                        if (!op) { parserInput.forget(); break; }

                        a = this.operand();

                        if (!a) { parserInput.restore(); break; }
                        parserInput.forget();

                        m.parensInOp = true;
                        a.parensInOp = true;
                        operation = new(tree.Operation)(op, [operation || m, a], isSpaced);
                        isSpaced = parserInput.isWhitespace(-1);
                    }
                    return operation || m;
                }
            },
            addition: function () {
                var m, a, op, operation, isSpaced;
                m = this.multiplication();
                if (m) {
                    isSpaced = parserInput.isWhitespace(-1);
                    while (true) {
                        op = parserInput.$re(/^[-+]\s+/) || (!isSpaced && (parserInput.$char('+') || parserInput.$char('-')));
                        if (!op) {
                            break;
                        }
                        a = this.multiplication();
                        if (!a) {
                            break;
                        }

                        m.parensInOp = true;
                        a.parensInOp = true;
                        operation = new(tree.Operation)(op, [operation || m, a], isSpaced);
                        isSpaced = parserInput.isWhitespace(-1);
                    }
                    return operation || m;
                }
            },
            conditions: function () {
                var a, b, index = parserInput.i, condition;

                a = this.condition();
                if (a) {
                    while (true) {
                        if (!parserInput.peek(/^,\s*(not\s*)?\(/) || !parserInput.$char(',')) {
                            break;
                        }
                        b = this.condition();
                        if (!b) {
                            break;
                        }
                        condition = new(tree.Condition)('or', condition || a, b, index);
                    }
                    return condition || a;
                }
            },
            condition: function () {
                var entities = this.entities, index = parserInput.i, negate = false,
                    a, b, c, op;

                if (parserInput.$re(/^not/)) { negate = true; }
                expectChar('(');
                a = this.addition() || entities.keyword() || entities.quoted();
                if (a) {
                    op = parserInput.$re(/^(?:>=|<=|=<|[<=>])/);
                    if (op) {
                        b = this.addition() || entities.keyword() || entities.quoted();
                        if (b) {
                            c = new(tree.Condition)(op, a, b, index, negate);
                        } else {
                            error('expected expression');
                        }
                    } else {
                        c = new(tree.Condition)('=', a, new(tree.Keyword)('true'), index, negate);
                    }
                    expectChar(')');
                    return parserInput.$re(/^and/) ? new(tree.Condition)('and', c, this.condition()) : c;
                }
            },

            //
            // An operand is anything that can be part of an operation,
            // such as a Color, or a Variable
            //
            operand: function () {
                var entities = this.entities, negate;

                if (parserInput.peek(/^-[@\(]/)) {
                    negate = parserInput.$char('-');
                }

                var o = this.sub() || entities.dimension() ||
                        entities.color() || entities.variable() ||
                        entities.call();

                if (negate) {
                    o.parensInOp = true;
                    o = new(tree.Negative)(o);
                }

                return o;
            },

            //
            // Expressions either represent mathematical operations,
            // or white-space delimited Entities.
            //
            //     1px solid black
            //     @var * 2
            //
            expression: function () {
                var entities = [], e, delim;

                do {
                    e = this.comment();
                    if (e) {
                        entities.push(e);
                        continue;
                    }
                    e = this.addition() || this.entity();
                    if (e) {
                        entities.push(e);
                        // operations do not allow keyword "/" dimension (e.g. small/20px) so we support that here
                        if (!parserInput.peek(/^\/[\/*]/)) {
                            delim = parserInput.$char('/');
                            if (delim) {
                                entities.push(new(tree.Anonymous)(delim));
                            }
                        }
                    }
                } while (e);
                if (entities.length > 0) {
                    return new(tree.Expression)(entities);
                }
            },
            property: function () {
                var name = parserInput.$re(/^(\*?-?[_a-zA-Z0-9-]+)\s*:/);
                if (name) {
                    return name[1];
                }
            },
            ruleProperty: function () {
                var name = [], index = [], s, k;

                parserInput.save();

                function match(re) {
                    var i = parserInput.i,
                        chunk = parserInput.$re(re);
                    if (chunk) {
                        index.push(i);
                        return name.push(chunk[1]);
                    }
                }

                match(/^(\*?)/);
                while (true) {
                    if (!match(/^((?:[\w-]+)|(?:@\{[\w-]+\}))/)) {
                        break;
                    }
                }

                if ((name.length > 1) && match(/^((?:\+_|\+)?)\s*:/)) {
                    parserInput.forget();

                    // at last, we have the complete match now. move forward,
                    // convert name particles to tree objects and return:
                    if (name[0] === '') {
                        name.shift();
                        index.shift();
                    }
                    for (k = 0; k < name.length; k++) {
                        s = name[k];
                        name[k] = (s.charAt(0) !== '@') ?
                            new(tree.Keyword)(s) :
                            new(tree.Variable)('@' + s.slice(2, -1),
                                index[k], fileInfo);
                    }
                    return name;
                }
                parserInput.restore();
            }
        }
    };
};
Parser.serializeVars = function(vars) {
    var s = '';

    for (var name in vars) {
        if (Object.hasOwnProperty.call(vars, name)) {
            var value = vars[name];
            s += ((name[0] === '@') ? '' : '@') + name + ': ' + value +
                ((String(value).slice(-1) === ';') ? '' : ';');
        }
    }

    return s;
};

module.exports = Parser;

},{"../less-error":30,"../tree":59,"../utils":80,"../visitors":84,"./parser-input":35}],37:[function(require,module,exports){
/**
 * Plugin Manager
 */
var PluginManager = function(less) {
    this.less = less;
    this.visitors = [];
    this.preProcessors = [];
    this.postProcessors = [];
    this.installedPlugins = [];
    this.fileManagers = [];
};
/**
 * Adds all the plugins in the array
 * @param {Array} plugins
 */
PluginManager.prototype.addPlugins = function(plugins) {
    if (plugins) {
        for (var i = 0; i < plugins.length; i++) {
            this.addPlugin(plugins[i]);
        }
    }
};
/**
 *
 * @param plugin
 */
PluginManager.prototype.addPlugin = function(plugin) {
    this.installedPlugins.push(plugin);
    plugin.install(this.less, this);
};
/**
 * Adds a visitor. The visitor object has options on itself to determine
 * when it should run.
 * @param visitor
 */
PluginManager.prototype.addVisitor = function(visitor) {
    this.visitors.push(visitor);
};
/**
 * Adds a pre processor object
 * @param {object} preProcessor
 * @param {number} priority - guidelines 1 = before import, 1000 = import, 2000 = after import
 */
PluginManager.prototype.addPreProcessor = function(preProcessor, priority) {
    var indexToInsertAt;
    for (indexToInsertAt = 0; indexToInsertAt < this.preProcessors.length; indexToInsertAt++) {
        if (this.preProcessors[indexToInsertAt].priority >= priority) {
            break;
        }
    }
    this.preProcessors.splice(indexToInsertAt, 0, {preProcessor: preProcessor, priority: priority});
};
/**
 * Adds a post processor object
 * @param {object} postProcessor
 * @param {number} priority - guidelines 1 = before compression, 1000 = compression, 2000 = after compression
 */
PluginManager.prototype.addPostProcessor = function(postProcessor, priority) {
    var indexToInsertAt;
    for (indexToInsertAt = 0; indexToInsertAt < this.postProcessors.length; indexToInsertAt++) {
        if (this.postProcessors[indexToInsertAt].priority >= priority) {
            break;
        }
    }
    this.postProcessors.splice(indexToInsertAt, 0, {postProcessor: postProcessor, priority: priority});
};
/**
 *
 * @param manager
 */
PluginManager.prototype.addFileManager = function(manager) {
    this.fileManagers.push(manager);
};
/**
 *
 * @returns {Array}
 * @private
 */
PluginManager.prototype.getPreProcessors = function() {
    var preProcessors = [];
    for (var i = 0; i < this.preProcessors.length; i++) {
        preProcessors.push(this.preProcessors[i].preProcessor);
    }
    return preProcessors;
};
/**
 *
 * @returns {Array}
 * @private
 */
PluginManager.prototype.getPostProcessors = function() {
    var postProcessors = [];
    for (var i = 0; i < this.postProcessors.length; i++) {
        postProcessors.push(this.postProcessors[i].postProcessor);
    }
    return postProcessors;
};
/**
 *
 * @returns {Array}
 * @private
 */
PluginManager.prototype.getVisitors = function() {
    return this.visitors;
};
/**
 *
 * @returns {Array}
 * @private
 */
PluginManager.prototype.getFileManagers = function() {
    return this.fileManagers;
};
module.exports = PluginManager;

},{}],38:[function(require,module,exports){
var PromiseConstructor;

module.exports = function(environment, ParseTree, ImportManager) {
    var render = function (input, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (!callback) {
            if (!PromiseConstructor) {
                PromiseConstructor = typeof Promise === 'undefined' ? require('promise') : Promise;
            }
            var self = this;
            return new PromiseConstructor(function (resolve, reject) {
                render.call(self, input, options, function(err, output) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(output);
                    }
                });
            });
        } else {
            this.parse(input, options, function(err, root, imports, options) {
                if (err) { return callback(err); }

                var result;
                try {
                    var parseTree = new ParseTree(root, imports);
                    result = parseTree.toCSS(options);
                }
                catch (err) { return callback(err); }

                callback(null, result);
            });
        }
    };

    return render;
};

},{"promise":undefined}],39:[function(require,module,exports){
module.exports = function (SourceMapOutput, environment) {

    var SourceMapBuilder = function (options) {
        this.options = options;
    };

    SourceMapBuilder.prototype.toCSS = function(rootNode, options, imports) {
        var sourceMapOutput = new SourceMapOutput(
            {
                contentsIgnoredCharsMap: imports.contentsIgnoredChars,
                rootNode: rootNode,
                contentsMap: imports.contents,
                sourceMapFilename: this.options.sourceMapFilename,
                sourceMapURL: this.options.sourceMapURL,
                outputFilename: this.options.sourceMapOutputFilename,
                sourceMapBasepath: this.options.sourceMapBasepath,
                sourceMapRootpath: this.options.sourceMapRootpath,
                outputSourceFiles: this.options.outputSourceFiles,
                sourceMapGenerator: this.options.sourceMapGenerator,
                sourceMapFileInline: this.options.sourceMapFileInline
            });

        var css = sourceMapOutput.toCSS(options);
        this.sourceMap = sourceMapOutput.sourceMap;
        this.sourceMapURL = sourceMapOutput.sourceMapURL;
        if (this.options.sourceMapInputFilename) {
            this.sourceMapInputFilename = sourceMapOutput.normalizeFilename(this.options.sourceMapInputFilename);
        }
        return css + this.getCSSAppendage();
    };

    SourceMapBuilder.prototype.getCSSAppendage = function() {

        var sourceMapURL = this.sourceMapURL;
        if (this.options.sourceMapFileInline) {
            if (this.sourceMap === undefined) {
                return "";
            }
            sourceMapURL = "data:application/json;base64," + environment.encodeBase64(this.sourceMap);
        }

        if (sourceMapURL) {
            return "/*# sourceMappingURL=" + sourceMapURL + " */";
        }
        return "";
    };

    SourceMapBuilder.prototype.getExternalSourceMap = function() {
        return this.sourceMap;
    };
    SourceMapBuilder.prototype.setExternalSourceMap = function(sourceMap) {
        this.sourceMap = sourceMap;
    };

    SourceMapBuilder.prototype.isInline = function() {
        return this.options.sourceMapFileInline;
    };
    SourceMapBuilder.prototype.getSourceMapURL = function() {
        return this.sourceMapURL;
    };
    SourceMapBuilder.prototype.getOutputFilename = function() {
        return this.options.sourceMapOutputFilename;
    };
    SourceMapBuilder.prototype.getInputFilename = function() {
        return this.sourceMapInputFilename;
    };

    return SourceMapBuilder;
};

},{}],40:[function(require,module,exports){
module.exports = function (environment) {

    var SourceMapOutput = function (options) {
        this._css = [];
        this._rootNode = options.rootNode;
        this._contentsMap = options.contentsMap;
        this._contentsIgnoredCharsMap = options.contentsIgnoredCharsMap;
        if (options.sourceMapFilename) {
            this._sourceMapFilename = options.sourceMapFilename.replace(/\\/g, '/');
        }
        this._outputFilename = options.outputFilename;
        this.sourceMapURL = options.sourceMapURL;
        if (options.sourceMapBasepath) {
            this._sourceMapBasepath = options.sourceMapBasepath.replace(/\\/g, '/');
        }
        if (options.sourceMapRootpath) {
            this._sourceMapRootpath = options.sourceMapRootpath.replace(/\\/g, '/');
            if (this._sourceMapRootpath.charAt(this._sourceMapRootpath.length - 1) !== '/') {
                this._sourceMapRootpath += '/';
            }
        } else {
            this._sourceMapRootpath = "";
        }
        this._outputSourceFiles = options.outputSourceFiles;
        this._sourceMapGeneratorConstructor = environment.getSourceMapGenerator();

        this._lineNumber = 0;
        this._column = 0;
    };

    SourceMapOutput.prototype.normalizeFilename = function(filename) {
        filename = filename.replace(/\\/g, '/');

        if (this._sourceMapBasepath && filename.indexOf(this._sourceMapBasepath) === 0) {
            filename = filename.substring(this._sourceMapBasepath.length);
            if (filename.charAt(0) === '\\' || filename.charAt(0) === '/') {
                filename = filename.substring(1);
            }
        }
        return (this._sourceMapRootpath || "") + filename;
    };

    SourceMapOutput.prototype.add = function(chunk, fileInfo, index, mapLines) {

        //ignore adding empty strings
        if (!chunk) {
            return;
        }

        var lines,
            sourceLines,
            columns,
            sourceColumns,
            i;

        if (fileInfo) {
            var inputSource = this._contentsMap[fileInfo.filename];

            // remove vars/banner added to the top of the file
            if (this._contentsIgnoredCharsMap[fileInfo.filename]) {
                // adjust the index
                index -= this._contentsIgnoredCharsMap[fileInfo.filename];
                if (index < 0) { index = 0; }
                // adjust the source
                inputSource = inputSource.slice(this._contentsIgnoredCharsMap[fileInfo.filename]);
            }
            inputSource = inputSource.substring(0, index);
            sourceLines = inputSource.split("\n");
            sourceColumns = sourceLines[sourceLines.length - 1];
        }

        lines = chunk.split("\n");
        columns = lines[lines.length - 1];

        if (fileInfo) {
            if (!mapLines) {
                this._sourceMapGenerator.addMapping({ generated: { line: this._lineNumber + 1, column: this._column},
                    original: { line: sourceLines.length, column: sourceColumns.length},
                    source: this.normalizeFilename(fileInfo.filename)});
            } else {
                for (i = 0; i < lines.length; i++) {
                    this._sourceMapGenerator.addMapping({ generated: { line: this._lineNumber + i + 1, column: i === 0 ? this._column : 0},
                        original: { line: sourceLines.length + i, column: i === 0 ? sourceColumns.length : 0},
                        source: this.normalizeFilename(fileInfo.filename)});
                }
            }
        }

        if (lines.length === 1) {
            this._column += columns.length;
        } else {
            this._lineNumber += lines.length - 1;
            this._column = columns.length;
        }

        this._css.push(chunk);
    };

    SourceMapOutput.prototype.isEmpty = function() {
        return this._css.length === 0;
    };

    SourceMapOutput.prototype.toCSS = function(context) {
        this._sourceMapGenerator = new this._sourceMapGeneratorConstructor({ file: this._outputFilename, sourceRoot: null });

        if (this._outputSourceFiles) {
            for (var filename in this._contentsMap) {
                if (this._contentsMap.hasOwnProperty(filename))
                {
                    var source = this._contentsMap[filename];
                    if (this._contentsIgnoredCharsMap[filename]) {
                        source = source.slice(this._contentsIgnoredCharsMap[filename]);
                    }
                    this._sourceMapGenerator.setSourceContent(this.normalizeFilename(filename), source);
                }
            }
        }

        this._rootNode.genCSS(context, this);

        if (this._css.length > 0) {
            var sourceMapURL,
                sourceMapContent = JSON.stringify(this._sourceMapGenerator.toJSON());

            if (this.sourceMapURL) {
                sourceMapURL = this.sourceMapURL;
            } else if (this._sourceMapFilename) {
                sourceMapURL = this._sourceMapFilename;
            }
            this.sourceMapURL = sourceMapURL;

            this.sourceMap = sourceMapContent;
        }

        return this._css.join('');
    };

    return SourceMapOutput;
};

},{}],41:[function(require,module,exports){
var contexts = require("./contexts"),
    visitor = require("./visitors"),
    tree = require("./tree");

module.exports = function(root, options) {
    options = options || {};
    var evaldRoot,
        variables = options.variables,
        evalEnv = new contexts.Eval(options);

    //
    // Allows setting variables with a hash, so:
    //
    //   `{ color: new tree.Color('#f01') }` will become:
    //
    //   new tree.Rule('@color',
    //     new tree.Value([
    //       new tree.Expression([
    //         new tree.Color('#f01')
    //       ])
    //     ])
    //   )
    //
    if (typeof variables === 'object' && !Array.isArray(variables)) {
        variables = Object.keys(variables).map(function (k) {
            var value = variables[k];

            if (! (value instanceof tree.Value)) {
                if (! (value instanceof tree.Expression)) {
                    value = new tree.Expression([value]);
                }
                value = new tree.Value([value]);
            }
            return new tree.Rule('@' + k, value, false, null, 0);
        });
        evalEnv.frames = [new tree.Ruleset(null, variables)];
    }

    var preEvalVisitors = [],
        visitors = [
            new visitor.JoinSelectorVisitor(),
            new visitor.ExtendVisitor(),
            new visitor.ToCSSVisitor({compress: Boolean(options.compress)})
        ], i;

    if (options.pluginManager) {
        var pluginVisitors = options.pluginManager.getVisitors();
        for (i = 0; i < pluginVisitors.length; i++) {
            var pluginVisitor = pluginVisitors[i];
            if (pluginVisitor.isPreEvalVisitor) {
                preEvalVisitors.push(pluginVisitor);
            } else {
                if (pluginVisitor.isPreVisitor) {
                    visitors.splice(0, 0, pluginVisitor);
                } else {
                    visitors.push(pluginVisitor);
                }
            }
        }
    }

    for (i = 0; i < preEvalVisitors.length; i++) {
        preEvalVisitors[i].run(root);
    }

    evaldRoot = root.eval(evalEnv);

    for (i = 0; i < visitors.length; i++) {
        visitors[i].run(evaldRoot);
    }

    return evaldRoot;
};

},{"./contexts":10,"./tree":59,"./visitors":84}],42:[function(require,module,exports){
var Node = require("./node");

var Alpha = function (val) {
    this.value = val;
};
Alpha.prototype = new Node();
Alpha.prototype.type = "Alpha";

Alpha.prototype.accept = function (visitor) {
    this.value = visitor.visit(this.value);
};
Alpha.prototype.eval = function (context) {
    if (this.value.eval) { return new Alpha(this.value.eval(context)); }
    return this;
};
Alpha.prototype.genCSS = function (context, output) {
    output.add("alpha(opacity=");

    if (this.value.genCSS) {
        this.value.genCSS(context, output);
    } else {
        output.add(this.value);
    }

    output.add(")");
};

module.exports = Alpha;

},{"./node":67}],43:[function(require,module,exports){
var Node = require("./node");

var Anonymous = function (value, index, currentFileInfo, mapLines, rulesetLike) {
    this.value = value;
    this.index = index;
    this.mapLines = mapLines;
    this.currentFileInfo = currentFileInfo;
    this.rulesetLike = (typeof rulesetLike === 'undefined') ? false : rulesetLike;
};
Anonymous.prototype = new Node();
Anonymous.prototype.type = "Anonymous";
Anonymous.prototype.eval = function () {
    return new Anonymous(this.value, this.index, this.currentFileInfo, this.mapLines, this.rulesetLike);
};
Anonymous.prototype.compare = function (other) {
    return other.toCSS && this.toCSS() === other.toCSS() ? 0 : undefined;
};
Anonymous.prototype.isRulesetLike = function() {
    return this.rulesetLike;
};
Anonymous.prototype.genCSS = function (context, output) {
    output.add(this.value, this.currentFileInfo, this.index, this.mapLines);
};
module.exports = Anonymous;

},{"./node":67}],44:[function(require,module,exports){
var Node = require("./node");

var Assignment = function (key, val) {
    this.key = key;
    this.value = val;
};

Assignment.prototype = new Node();
Assignment.prototype.type = "Assignment";
Assignment.prototype.accept = function (visitor) {
    this.value = visitor.visit(this.value);
};
Assignment.prototype.eval = function (context) {
    if (this.value.eval) {
        return new Assignment(this.key, this.value.eval(context));
    }
    return this;
};
Assignment.prototype.genCSS = function (context, output) {
    output.add(this.key + '=');
    if (this.value.genCSS) {
        this.value.genCSS(context, output);
    } else {
        output.add(this.value);
    }
};
module.exports = Assignment;

},{"./node":67}],45:[function(require,module,exports){
var Node = require("./node");

var Attribute = function (key, op, value) {
    this.key = key;
    this.op = op;
    this.value = value;
};
Attribute.prototype = new Node();
Attribute.prototype.type = "Attribute";
Attribute.prototype.eval = function (context) {
    return new Attribute(this.key.eval ? this.key.eval(context) : this.key,
        this.op, (this.value && this.value.eval) ? this.value.eval(context) : this.value);
};
Attribute.prototype.genCSS = function (context, output) {
    output.add(this.toCSS(context));
};
Attribute.prototype.toCSS = function (context) {
    var value = this.key.toCSS ? this.key.toCSS(context) : this.key;

    if (this.op) {
        value += this.op;
        value += (this.value.toCSS ? this.value.toCSS(context) : this.value);
    }

    return '[' + value + ']';
};
module.exports = Attribute;

},{"./node":67}],46:[function(require,module,exports){
var Node = require("./node"),
    FunctionCaller = require("../functions/function-caller");
//
// A function call node.
//
var Call = function (name, args, index, currentFileInfo) {
    this.name = name;
    this.args = args;
    this.index = index;
    this.currentFileInfo = currentFileInfo;
};
Call.prototype = new Node();
Call.prototype.type = "Call";
Call.prototype.accept = function (visitor) {
    if (this.args) {
        this.args = visitor.visitArray(this.args);
    }
};
//
// When evaluating a function call,
// we either find the function in the functionRegistry,
// in which case we call it, passing the  evaluated arguments,
// if this returns null or we cannot find the function, we
// simply print it out as it appeared originally [2].
//
// The reason why we evaluate the arguments, is in the case where
// we try to pass a variable to a function, like: `saturate(@color)`.
// The function should receive the value, not the variable.
//
Call.prototype.eval = function (context) {
    var args = this.args.map(function (a) { return a.eval(context); }),
        result, funcCaller = new FunctionCaller(this.name, context, this.index, this.currentFileInfo);

    if (funcCaller.isValid()) { // 1.
        try {
            result = funcCaller.call(args);
            if (result != null) {
                return result;
            }
        } catch (e) {
            throw { type: e.type || "Runtime",
                    message: "error evaluating function `" + this.name + "`" +
                             (e.message ? ': ' + e.message : ''),
                    index: this.index, filename: this.currentFileInfo.filename };
        }
    }

    return new Call(this.name, args, this.index, this.currentFileInfo);
};
Call.prototype.genCSS = function (context, output) {
    output.add(this.name + "(", this.currentFileInfo, this.index);

    for (var i = 0; i < this.args.length; i++) {
        this.args[i].genCSS(context, output);
        if (i + 1 < this.args.length) {
            output.add(", ");
        }
    }

    output.add(")");
};
module.exports = Call;

},{"../functions/function-caller":20,"./node":67}],47:[function(require,module,exports){
var Node = require("./node"),
    colors = require("../data/colors");

//
// RGB Colors - #ff0014, #eee
//
var Color = function (rgb, a) {
    //
    // The end goal here, is to parse the arguments
    // into an integer triplet, such as `128, 255, 0`
    //
    // This facilitates operations and conversions.
    //
    if (Array.isArray(rgb)) {
        this.rgb = rgb;
    } else if (rgb.length == 6) {
        this.rgb = rgb.match(/.{2}/g).map(function (c) {
            return parseInt(c, 16);
        });
    } else {
        this.rgb = rgb.split('').map(function (c) {
            return parseInt(c + c, 16);
        });
    }
    this.alpha = typeof a === 'number' ? a : 1;
};

Color.prototype = new Node();
Color.prototype.type = "Color";

function clamp(v, max) {
    return Math.min(Math.max(v, 0), max);
}

function toHex(v) {
    return '#' + v.map(function (c) {
        c = clamp(Math.round(c), 255);
        return (c < 16 ? '0' : '') + c.toString(16);
    }).join('');
}

Color.prototype.luma = function () {
    var r = this.rgb[0] / 255,
        g = this.rgb[1] / 255,
        b = this.rgb[2] / 255;

    r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
    g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
    b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
Color.prototype.genCSS = function (context, output) {
    output.add(this.toCSS(context));
};
Color.prototype.toCSS = function (context, doNotCompress) {
    var compress = context && context.compress && !doNotCompress, color, alpha;

    // `value` is set if this color was originally
    // converted from a named color string so we need
    // to respect this and try to output named color too.
    if (this.value) {
        return this.value;
    }

    // If we have some transparency, the only way to represent it
    // is via `rgba`. Otherwise, we use the hex representation,
    // which has better compatibility with older browsers.
    // Values are capped between `0` and `255`, rounded and zero-padded.
    alpha = this.fround(context, this.alpha);
    if (alpha < 1) {
        return "rgba(" + this.rgb.map(function (c) {
            return clamp(Math.round(c), 255);
        }).concat(clamp(alpha, 1))
            .join(',' + (compress ? '' : ' ')) + ")";
    }

    color = this.toRGB();

    if (compress) {
        var splitcolor = color.split('');

        // Convert color to short format
        if (splitcolor[1] === splitcolor[2] && splitcolor[3] === splitcolor[4] && splitcolor[5] === splitcolor[6]) {
            color = '#' + splitcolor[1] + splitcolor[3] + splitcolor[5];
        }
    }

    return color;
};

//
// Operations have to be done per-channel, if not,
// channels will spill onto each other. Once we have
// our result, in the form of an integer triplet,
// we create a new Color node to hold the result.
//
Color.prototype.operate = function (context, op, other) {
    var rgb = [];
    var alpha = this.alpha * (1 - other.alpha) + other.alpha;
    for (var c = 0; c < 3; c++) {
        rgb[c] = this._operate(context, op, this.rgb[c], other.rgb[c]);
    }
    return new Color(rgb, alpha);
};
Color.prototype.toRGB = function () {
    return toHex(this.rgb);
};
Color.prototype.toHSL = function () {
    var r = this.rgb[0] / 255,
        g = this.rgb[1] / 255,
        b = this.rgb[2] / 255,
        a = this.alpha;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2, d = max - min;

    if (max === min) {
        h = s = 0;
    } else {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2;               break;
            case b: h = (r - g) / d + 4;               break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s, l: l, a: a };
};
//Adapted from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
Color.prototype.toHSV = function () {
    var r = this.rgb[0] / 255,
        g = this.rgb[1] / 255,
        b = this.rgb[2] / 255,
        a = this.alpha;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    if (max === 0) {
        s = 0;
    } else {
        s = d / max;
    }

    if (max === min) {
        h = 0;
    } else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s, v: v, a: a };
};
Color.prototype.toARGB = function () {
    return toHex([this.alpha * 255].concat(this.rgb));
};
Color.prototype.compare = function (x) {
    return (x.rgb &&
        x.rgb[0] === this.rgb[0] &&
        x.rgb[1] === this.rgb[1] &&
        x.rgb[2] === this.rgb[2] &&
        x.alpha  === this.alpha) ? 0 : undefined;
};

Color.fromKeyword = function(keyword) {
    var c, key = keyword.toLowerCase();
    if (colors.hasOwnProperty(key)) {
        c = new Color(colors[key].slice(1));
    }
    else if (key === "transparent") {
        c = new Color([0, 0, 0], 0);
    }

    if (c) {
        c.value = keyword;
        return c;
    }
};
module.exports = Color;

},{"../data/colors":11,"./node":67}],48:[function(require,module,exports){
var Node = require("./node");

var Combinator = function (value) {
    if (value === ' ') {
        this.value = ' ';
        this.emptyOrWhitespace = true;
    } else {
        this.value = value ? value.trim() : "";
        this.emptyOrWhitespace = this.value === "";
    }
};
Combinator.prototype = new Node();
Combinator.prototype.type = "Combinator";
var _noSpaceCombinators = {
    '': true,
    ' ': true,
    '|': true
};
Combinator.prototype.genCSS = function (context, output) {
    var spaceOrEmpty = (context.compress || _noSpaceCombinators[this.value]) ? '' : ' ';
    output.add(spaceOrEmpty + this.value + spaceOrEmpty);
};
module.exports = Combinator;

},{"./node":67}],49:[function(require,module,exports){
var Node = require("./node"),
    getDebugInfo = require("./debug-info");

var Comment = function (value, isLineComment, index, currentFileInfo) {
    this.value = value;
    this.isLineComment = isLineComment;
    this.currentFileInfo = currentFileInfo;
};
Comment.prototype = new Node();
Comment.prototype.type = "Comment";
Comment.prototype.genCSS = function (context, output) {
    if (this.debugInfo) {
        output.add(getDebugInfo(context, this), this.currentFileInfo, this.index);
    }
    output.add(this.value);
};
Comment.prototype.isSilent = function(context) {
    var isReference = (this.currentFileInfo && this.currentFileInfo.reference && !this.isReferenced),
        isCompressed = context.compress && this.value[2] !== "!";
    return this.isLineComment || isReference || isCompressed;
};
Comment.prototype.markReferenced = function () {
    this.isReferenced = true;
};
Comment.prototype.isRulesetLike = function(root) {
    return Boolean(root);
};
module.exports = Comment;

},{"./debug-info":51,"./node":67}],50:[function(require,module,exports){
var Node = require("./node");

var Condition = function (op, l, r, i, negate) {
    this.op = op.trim();
    this.lvalue = l;
    this.rvalue = r;
    this.index = i;
    this.negate = negate;
};
Condition.prototype = new Node();
Condition.prototype.type = "Condition";
Condition.prototype.accept = function (visitor) {
    this.lvalue = visitor.visit(this.lvalue);
    this.rvalue = visitor.visit(this.rvalue);
};
Condition.prototype.eval = function (context) {
    var result = (function (op, a, b) {
        switch (op) {
            case 'and': return a && b;
            case 'or':  return a || b;
            default:
                switch (Node.compare(a, b)) {
                    case -1:
                        return op === '<' || op === '=<' || op === '<=';
                    case 0:
                        return op === '=' || op === '>=' || op === '=<' || op === '<=';
                    case 1:
                        return op === '>' || op === '>=';
                    default:
                        return false;
                }
        }
    })(this.op, this.lvalue.eval(context), this.rvalue.eval(context));

    return this.negate ? !result : result;
};
module.exports = Condition;

},{"./node":67}],51:[function(require,module,exports){
var debugInfo = function(context, ctx, lineSeparator) {
    var result = "";
    if (context.dumpLineNumbers && !context.compress) {
        switch(context.dumpLineNumbers) {
            case 'comments':
                result = debugInfo.asComment(ctx);
                break;
            case 'mediaquery':
                result = debugInfo.asMediaQuery(ctx);
                break;
            case 'all':
                result = debugInfo.asComment(ctx) + (lineSeparator || "") + debugInfo.asMediaQuery(ctx);
                break;
        }
    }
    return result;
};

debugInfo.asComment = function(ctx) {
    return '/* line ' + ctx.debugInfo.lineNumber + ', ' + ctx.debugInfo.fileName + ' */\n';
};

debugInfo.asMediaQuery = function(ctx) {
    var filenameWithProtocol = ctx.debugInfo.fileName;
    if (!/^[a-z]+:\/\//i.test(filenameWithProtocol)) {
        filenameWithProtocol = 'file://' + filenameWithProtocol;
    }
    return '@media -sass-debug-info{filename{font-family:' +
        filenameWithProtocol.replace(/([.:\/\\])/g, function (a) {
            if (a == '\\') {
                a = '\/';
            }
            return '\\' + a;
        }) +
        '}line{font-family:\\00003' + ctx.debugInfo.lineNumber + '}}\n';
};

module.exports = debugInfo;

},{}],52:[function(require,module,exports){
var Node = require("./node"),
    contexts = require("../contexts");

var DetachedRuleset = function (ruleset, frames) {
    this.ruleset = ruleset;
    this.frames = frames;
};
DetachedRuleset.prototype = new Node();
DetachedRuleset.prototype.type = "DetachedRuleset";
DetachedRuleset.prototype.evalFirst = true;
DetachedRuleset.prototype.accept = function (visitor) {
    this.ruleset = visitor.visit(this.ruleset);
};
DetachedRuleset.prototype.eval = function (context) {
    var frames = this.frames || context.frames.slice(0);
    return new DetachedRuleset(this.ruleset, frames);
};
DetachedRuleset.prototype.callEval = function (context) {
    return this.ruleset.eval(this.frames ? new contexts.Eval(context, this.frames.concat(context.frames)) : context);
};
module.exports = DetachedRuleset;

},{"../contexts":10,"./node":67}],53:[function(require,module,exports){
var Node = require("./node"),
    unitConversions = require("../data/unit-conversions"),
    Unit = require("./unit"),
    Color = require("./color");

//
// A number with a unit
//
var Dimension = function (value, unit) {
    this.value = parseFloat(value);
    this.unit = (unit && unit instanceof Unit) ? unit :
      new Unit(unit ? [unit] : undefined);
};

Dimension.prototype = new Node();
Dimension.prototype.type = "Dimension";
Dimension.prototype.accept = function (visitor) {
    this.unit = visitor.visit(this.unit);
};
Dimension.prototype.eval = function (context) {
    return this;
};
Dimension.prototype.toColor = function () {
    return new Color([this.value, this.value, this.value]);
};
Dimension.prototype.genCSS = function (context, output) {
    if ((context && context.strictUnits) && !this.unit.isSingular()) {
        throw new Error("Multiple units in dimension. Correct the units or use the unit function. Bad unit: " + this.unit.toString());
    }

    var value = this.fround(context, this.value),
        strValue = String(value);

    if (value !== 0 && value < 0.000001 && value > -0.000001) {
        // would be output 1e-6 etc.
        strValue = value.toFixed(20).replace(/0+$/, "");
    }

    if (context && context.compress) {
        // Zero values doesn't need a unit
        if (value === 0 && this.unit.isLength()) {
            output.add(strValue);
            return;
        }

        // Float values doesn't need a leading zero
        if (value > 0 && value < 1) {
            strValue = (strValue).substr(1);
        }
    }

    output.add(strValue);
    this.unit.genCSS(context, output);
};

// In an operation between two Dimensions,
// we default to the first Dimension's unit,
// so `1px + 2` will yield `3px`.
Dimension.prototype.operate = function (context, op, other) {
    /*jshint noempty:false */
    var value = this._operate(context, op, this.value, other.value),
        unit = this.unit.clone();

    if (op === '+' || op === '-') {
        if (unit.numerator.length === 0 && unit.denominator.length === 0) {
            unit.numerator = other.unit.numerator.slice(0);
            unit.denominator = other.unit.denominator.slice(0);
        } else if (other.unit.numerator.length === 0 && unit.denominator.length === 0) {
            // do nothing
        } else {
            other = other.convertTo(this.unit.usedUnits());

            if (context.strictUnits && other.unit.toString() !== unit.toString()) {
                throw new Error("Incompatible units. Change the units or use the unit function. Bad units: '" + unit.toString() +
                    "' and '" + other.unit.toString() + "'.");
            }

            value = this._operate(context, op, this.value, other.value);
        }
    } else if (op === '*') {
        unit.numerator = unit.numerator.concat(other.unit.numerator).sort();
        unit.denominator = unit.denominator.concat(other.unit.denominator).sort();
        unit.cancel();
    } else if (op === '/') {
        unit.numerator = unit.numerator.concat(other.unit.denominator).sort();
        unit.denominator = unit.denominator.concat(other.unit.numerator).sort();
        unit.cancel();
    }
    return new Dimension(value, unit);
};
Dimension.prototype.compare = function (other) {
    var a, b;

    if (!(other instanceof Dimension)) {
        return undefined;
    }

    if (this.unit.isEmpty() || other.unit.isEmpty()) {
        a = this;
        b = other;
    } else {
        a = this.unify();
        b = other.unify();
        if (a.unit.compare(b.unit) !== 0) {
            return undefined;
        }
    }

    return Node.numericCompare(a.value, b.value);
};
Dimension.prototype.unify = function () {
    return this.convertTo({ length: 'px', duration: 's', angle: 'rad' });
};
Dimension.prototype.convertTo = function (conversions) {
    var value = this.value, unit = this.unit.clone(),
        i, groupName, group, targetUnit, derivedConversions = {}, applyUnit;

    if (typeof conversions === 'string') {
        for (i in unitConversions) {
            if (unitConversions[i].hasOwnProperty(conversions)) {
                derivedConversions = {};
                derivedConversions[i] = conversions;
            }
        }
        conversions = derivedConversions;
    }
    applyUnit = function (atomicUnit, denominator) {
      /*jshint loopfunc:true */
        if (group.hasOwnProperty(atomicUnit)) {
            if (denominator) {
                value = value / (group[atomicUnit] / group[targetUnit]);
            } else {
                value = value * (group[atomicUnit] / group[targetUnit]);
            }

            return targetUnit;
        }

        return atomicUnit;
    };

    for (groupName in conversions) {
        if (conversions.hasOwnProperty(groupName)) {
            targetUnit = conversions[groupName];
            group = unitConversions[groupName];

            unit.map(applyUnit);
        }
    }

    unit.cancel();

    return new Dimension(value, unit);
};
module.exports = Dimension;

},{"../data/unit-conversions":13,"./color":47,"./node":67,"./unit":76}],54:[function(require,module,exports){
var Node = require("./node"),
    Ruleset = require("./ruleset");

var Directive = function (name, value, rules, index, currentFileInfo, debugInfo, isReferenced) {
    this.name  = name;
    this.value = value;
    if (rules) {
        this.rules = rules;
        this.rules.allowImports = true;
    }
    this.index = index;
    this.currentFileInfo = currentFileInfo;
    this.debugInfo = debugInfo;
    this.isReferenced = isReferenced;
};

Directive.prototype = new Node();
Directive.prototype.type = "Directive";
Directive.prototype.accept = function (visitor) {
    var value = this.value, rules = this.rules;
    if (rules) {
        this.rules = visitor.visit(rules);
    }
    if (value) {
        this.value = visitor.visit(value);
    }
};
Directive.prototype.isRulesetLike = function() {
    return this.rules || !this.isCharset();
};
Directive.prototype.isCharset = function() {
    return "@charset" === this.name;
};
Directive.prototype.genCSS = function (context, output) {
    var value = this.value, rules = this.rules;
    output.add(this.name, this.currentFileInfo, this.index);
    if (value) {
        output.add(' ');
        value.genCSS(context, output);
    }
    if (rules) {
        if (rules.type === "Ruleset") {
            rules = [rules];
        }
        this.outputRuleset(context, output, rules);
    } else {
        output.add(';');
    }
};
Directive.prototype.eval = function (context) {
    var value = this.value, rules = this.rules;
    if (value) {
        value = value.eval(context);
    }
    if (rules) {
        rules = rules.eval(context);
        rules.root = true;
    }
    return new Directive(this.name, value, rules,
        this.index, this.currentFileInfo, this.debugInfo, this.isReferenced);
};
Directive.prototype.variable = function (name) {
    if (this.rules) {
        return Ruleset.prototype.variable.call(this.rules, name);
    }
};
Directive.prototype.find = function () {
    if (this.rules) {
        return Ruleset.prototype.find.apply(this.rules, arguments);
    }
};
Directive.prototype.rulesets = function () {
    if (this.rules) {
        return Ruleset.prototype.rulesets.apply(this.rules);
    }
};
Directive.prototype.markReferenced = function () {
    var i, rules;
    this.isReferenced = true;
    if (this.rules) {
        rules = this.rules.rules;
        for (i = 0; i < rules.length; i++) {
            if (rules[i].markReferenced) {
                rules[i].markReferenced();
            }
        }
    }
};
Directive.prototype.getIsReferenced = function () {
    return !this.currentFileInfo || !this.currentFileInfo.reference || this.isReferenced;
};
Directive.prototype.outputRuleset = function (context, output, rules) {
    var ruleCnt = rules.length, i;
    context.tabLevel = (context.tabLevel | 0) + 1;

    // Compressed
    if (context.compress) {
        output.add('{');
        for (i = 0; i < ruleCnt; i++) {
            rules[i].genCSS(context, output);
        }
        output.add('}');
        context.tabLevel--;
        return;
    }

    // Non-compressed
    var tabSetStr = '\n' + Array(context.tabLevel).join("  "), tabRuleStr = tabSetStr + "  ";
    if (!ruleCnt) {
        output.add(" {" + tabSetStr + '}');
    } else {
        output.add(" {" + tabRuleStr);
        rules[0].genCSS(context, output);
        for (i = 1; i < ruleCnt; i++) {
            output.add(tabRuleStr);
            rules[i].genCSS(context, output);
        }
        output.add(tabSetStr + '}');
    }

    context.tabLevel--;
};
module.exports = Directive;

},{"./node":67,"./ruleset":73}],55:[function(require,module,exports){
var Node = require("./node"),
    Paren = require("./paren"),
    Combinator = require("./combinator");

var Element = function (combinator, value, index, currentFileInfo) {
    this.combinator = combinator instanceof Combinator ?
                      combinator : new Combinator(combinator);

    if (typeof value === 'string') {
        this.value = value.trim();
    } else if (value) {
        this.value = value;
    } else {
        this.value = "";
    }
    this.index = index;
    this.currentFileInfo = currentFileInfo;
};
Element.prototype = new Node();
Element.prototype.type = "Element";
Element.prototype.accept = function (visitor) {
    var value = this.value;
    this.combinator = visitor.visit(this.combinator);
    if (typeof value === "object") {
        this.value = visitor.visit(value);
    }
};
Element.prototype.eval = function (context) {
    return new Element(this.combinator,
                             this.value.eval ? this.value.eval(context) : this.value,
                             this.index,
                             this.currentFileInfo);
};
Element.prototype.genCSS = function (context, output) {
    output.add(this.toCSS(context), this.currentFileInfo, this.index);
};
Element.prototype.toCSS = function (context) {
    context = context || {};
    var value = this.value, firstSelector = context.firstSelector;
    if (value instanceof Paren) {
        // selector in parens should not be affected by outer selector
        // flags (breaks only interpolated selectors - see #1973)
        context.firstSelector = true;
    }
    value = value.toCSS ? value.toCSS(context) : value;
    context.firstSelector = firstSelector;
    if (value === '' && this.combinator.value.charAt(0) === '&') {
        return '';
    } else {
        return this.combinator.toCSS(context) + value;
    }
};
module.exports = Element;

},{"./combinator":48,"./node":67,"./paren":69}],56:[function(require,module,exports){
var Node = require("./node"),
    Paren = require("./paren"),
    Comment = require("./comment");

var Expression = function (value) {
    this.value = value;
    if (!value) {
        throw new Error("Expression requires an array parameter");
    }
};
Expression.prototype = new Node();
Expression.prototype.type = "Expression";
Expression.prototype.accept = function (visitor) {
    this.value = visitor.visitArray(this.value);
};
Expression.prototype.eval = function (context) {
    var returnValue,
        inParenthesis = this.parens && !this.parensInOp,
        doubleParen = false;
    if (inParenthesis) {
        context.inParenthesis();
    }
    if (this.value.length > 1) {
        returnValue = new Expression(this.value.map(function (e) {
            return e.eval(context);
        }));
    } else if (this.value.length === 1) {
        if (this.value[0].parens && !this.value[0].parensInOp) {
            doubleParen = true;
        }
        returnValue = this.value[0].eval(context);
    } else {
        returnValue = this;
    }
    if (inParenthesis) {
        context.outOfParenthesis();
    }
    if (this.parens && this.parensInOp && !(context.isMathOn()) && !doubleParen) {
        returnValue = new Paren(returnValue);
    }
    return returnValue;
};
Expression.prototype.genCSS = function (context, output) {
    for (var i = 0; i < this.value.length; i++) {
        this.value[i].genCSS(context, output);
        if (i + 1 < this.value.length) {
            output.add(" ");
        }
    }
};
Expression.prototype.throwAwayComments = function () {
    this.value = this.value.filter(function(v) {
        return !(v instanceof Comment);
    });
};
module.exports = Expression;

},{"./comment":49,"./node":67,"./paren":69}],57:[function(require,module,exports){
var Node = require("./node");

var Extend = function Extend(selector, option, index) {
    this.selector = selector;
    this.option = option;
    this.index = index;
    this.object_id = Extend.next_id++;
    this.parent_ids = [this.object_id];

    switch(option) {
        case "all":
            this.allowBefore = true;
            this.allowAfter = true;
            break;
        default:
            this.allowBefore = false;
            this.allowAfter = false;
            break;
    }
};
Extend.next_id = 0;

Extend.prototype = new Node();
Extend.prototype.type = "Extend";
Extend.prototype.accept = function (visitor) {
    this.selector = visitor.visit(this.selector);
};
Extend.prototype.eval = function (context) {
    return new Extend(this.selector.eval(context), this.option, this.index);
};
Extend.prototype.clone = function (context) {
    return new Extend(this.selector, this.option, this.index);
};
Extend.prototype.findSelfSelectors = function (selectors) {
    var selfElements = [],
        i,
        selectorElements;

    for (i = 0; i < selectors.length; i++) {
        selectorElements = selectors[i].elements;
        // duplicate the logic in genCSS function inside the selector node.
        // future TODO - move both logics into the selector joiner visitor
        if (i > 0 && selectorElements.length && selectorElements[0].combinator.value === "") {
            selectorElements[0].combinator.value = ' ';
        }
        selfElements = selfElements.concat(selectors[i].elements);
    }

    this.selfSelectors = [{ elements: selfElements }];
};
module.exports = Extend;

},{"./node":67}],58:[function(require,module,exports){
var Node = require("./node"),
    Media = require("./media"),
    URL = require("./url"),
    Quoted = require("./quoted"),
    Ruleset = require("./ruleset"),
    Anonymous = require("./anonymous");

//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
var Import = function (path, features, options, index, currentFileInfo) {
    this.options = options;
    this.index = index;
    this.path = path;
    this.features = features;
    this.currentFileInfo = currentFileInfo;

    if (this.options.less !== undefined || this.options.inline) {
        this.css = !this.options.less || this.options.inline;
    } else {
        var pathValue = this.getPath();
        if (pathValue && /[#\.\&\?\/]css([\?;].*)?$/.test(pathValue)) {
            this.css = true;
        }
    }
};

//
// The actual import node doesn't return anything, when converted to CSS.
// The reason is that it's used at the evaluation stage, so that the rules
// it imports can be treated like any other rules.
//
// In `eval`, we make sure all Import nodes get evaluated, recursively, so
// we end up with a flat structure, which can easily be imported in the parent
// ruleset.
//
Import.prototype = new Node();
Import.prototype.type = "Import";
Import.prototype.accept = function (visitor) {
    if (this.features) {
        this.features = visitor.visit(this.features);
    }
    this.path = visitor.visit(this.path);
    if (!this.options.inline && this.root) {
        this.root = visitor.visit(this.root);
    }
};
Import.prototype.genCSS = function (context, output) {
    if (this.css) {
        output.add("@import ", this.currentFileInfo, this.index);
        this.path.genCSS(context, output);
        if (this.features) {
            output.add(" ");
            this.features.genCSS(context, output);
        }
        output.add(';');
    }
};
Import.prototype.getPath = function () {
    if (this.path instanceof Quoted) {
        return this.path.value;
    } else if (this.path instanceof URL) {
        return this.path.value.value;
    }
    return null;
};
Import.prototype.isVariableImport = function () {
    var path = this.path;
    if (path instanceof URL) {
        path = path.value;
    }
    if (path instanceof Quoted) {
        return path.containsVariables();
    }

    return true;
};
Import.prototype.evalForImport = function (context) {
    var path = this.path;
    if (path instanceof URL) {
        path = path.value;
    }
    return new Import(path.eval(context), this.features, this.options, this.index, this.currentFileInfo);
};
Import.prototype.evalPath = function (context) {
    var path = this.path.eval(context);
    var rootpath = this.currentFileInfo && this.currentFileInfo.rootpath;

    if (!(path instanceof URL)) {
        if (rootpath) {
            var pathValue = path.value;
            // Add the base path if the import is relative
            if (pathValue && context.isPathRelative(pathValue)) {
                path.value = rootpath + pathValue;
            }
        }
        path.value = context.normalizePath(path.value);
    }

    return path;
};
Import.prototype.eval = function (context) {
    var ruleset, features = this.features && this.features.eval(context);

    if (this.skip) {
        if (typeof this.skip === "function") {
            this.skip = this.skip();
        }
        if (this.skip) {
            return [];
        }
    }

    if (this.options.inline) {
        var contents = new Anonymous(this.root, 0, {filename: this.importedFilename}, true, true);
        return this.features ? new Media([contents], this.features.value) : [contents];
    } else if (this.css) {
        var newImport = new Import(this.evalPath(context), features, this.options, this.index);
        if (!newImport.css && this.error) {
            throw this.error;
        }
        return newImport;
    } else {
        ruleset = new Ruleset(null, this.root.rules.slice(0));

        ruleset.evalImports(context);

        return this.features ? new Media(ruleset.rules, this.features.value) : ruleset.rules;
    }
};
module.exports = Import;

},{"./anonymous":43,"./media":63,"./node":67,"./quoted":70,"./ruleset":73,"./url":77}],59:[function(require,module,exports){
var tree = {};

tree.Node = require('./node');
tree.Alpha = require('./alpha');
tree.Color = require('./color');
tree.Directive = require('./directive');
tree.DetachedRuleset = require('./detached-ruleset');
tree.Operation = require('./operation');
tree.Dimension = require('./dimension');
tree.Unit = require('./unit');
tree.Keyword = require('./keyword');
tree.Variable = require('./variable');
tree.Ruleset = require('./ruleset');
tree.Element = require('./element');
tree.Attribute = require('./attribute');
tree.Combinator = require('./combinator');
tree.Selector = require('./selector');
tree.Quoted = require('./quoted');
tree.Expression = require('./expression');
tree.Rule = require('./rule');
tree.Call = require('./call');
tree.URL = require('./url');
tree.Import = require('./import');
tree.mixin = {
    Call: require('./mixin-call'),
    Definition: require('./mixin-definition')
};
tree.Comment = require('./comment');
tree.Anonymous = require('./anonymous');
tree.Value = require('./value');
tree.JavaScript = require('./javascript');
tree.Assignment = require('./assignment');
tree.Condition = require('./condition');
tree.Paren = require('./paren');
tree.Media = require('./media');
tree.UnicodeDescriptor = require('./unicode-descriptor');
tree.Negative = require('./negative');
tree.Extend = require('./extend');
tree.RulesetCall = require('./ruleset-call');

module.exports = tree;

},{"./alpha":42,"./anonymous":43,"./assignment":44,"./attribute":45,"./call":46,"./color":47,"./combinator":48,"./comment":49,"./condition":50,"./detached-ruleset":52,"./dimension":53,"./directive":54,"./element":55,"./expression":56,"./extend":57,"./import":58,"./javascript":60,"./keyword":62,"./media":63,"./mixin-call":64,"./mixin-definition":65,"./negative":66,"./node":67,"./operation":68,"./paren":69,"./quoted":70,"./rule":71,"./ruleset":73,"./ruleset-call":72,"./selector":74,"./unicode-descriptor":75,"./unit":76,"./url":77,"./value":78,"./variable":79}],60:[function(require,module,exports){
var JsEvalNode = require("./js-eval-node"),
    Dimension = require("./dimension"),
    Quoted = require("./quoted"),
    Anonymous = require("./anonymous");

var JavaScript = function (string, escaped, index, currentFileInfo) {
    this.escaped = escaped;
    this.expression = string;
    this.index = index;
    this.currentFileInfo = currentFileInfo;
};
JavaScript.prototype = new JsEvalNode();
JavaScript.prototype.type = "JavaScript";
JavaScript.prototype.eval = function(context) {
    var result = this.evaluateJavaScript(this.expression, context);

    if (typeof result === 'number') {
        return new Dimension(result);
    } else if (typeof result === 'string') {
        return new Quoted('"' + result + '"', result, this.escaped, this.index);
    } else if (Array.isArray(result)) {
        return new Anonymous(result.join(', '));
    } else {
        return new Anonymous(result);
    }
};

module.exports = JavaScript;

},{"./anonymous":43,"./dimension":53,"./js-eval-node":61,"./quoted":70}],61:[function(require,module,exports){
var Node = require("./node"),
    Variable = require("./variable");

var JsEvalNode = function() {
};
JsEvalNode.prototype = new Node();

JsEvalNode.prototype.evaluateJavaScript = function (expression, context) {
    var result,
        that = this,
        evalContext = {};

    if (context.javascriptEnabled !== undefined && !context.javascriptEnabled) {
        throw { message: "You are using JavaScript, which has been disabled.",
            filename: this.currentFileInfo.filename,
            index: this.index };
    }

    expression = expression.replace(/@\{([\w-]+)\}/g, function (_, name) {
        return that.jsify(new Variable('@' + name, that.index, that.currentFileInfo).eval(context));
    });

    try {
        expression = new Function('return (' + expression + ')');
    } catch (e) {
        throw { message: "JavaScript evaluation error: " + e.message + " from `" + expression + "`" ,
            filename: this.currentFileInfo.filename,
            index: this.index };
    }

    var variables = context.frames[0].variables();
    for (var k in variables) {
        if (variables.hasOwnProperty(k)) {
            /*jshint loopfunc:true */
            evalContext[k.slice(1)] = {
                value: variables[k].value,
                toJS: function () {
                    return this.value.eval(context).toCSS();
                }
            };
        }
    }

    try {
        result = expression.call(evalContext);
    } catch (e) {
        throw { message: "JavaScript evaluation error: '" + e.name + ': ' + e.message.replace(/["]/g, "'") + "'" ,
            filename: this.currentFileInfo.filename,
            index: this.index };
    }
    return result;
};
JsEvalNode.prototype.jsify = function (obj) {
    if (Array.isArray(obj.value) && (obj.value.length > 1)) {
        return '[' + obj.value.map(function (v) { return v.toCSS(); }).join(', ') + ']';
    } else {
        return obj.toCSS();
    }
};

module.exports = JsEvalNode;

},{"./node":67,"./variable":79}],62:[function(require,module,exports){
var Node = require("./node");

var Keyword = function (value) { this.value = value; };
Keyword.prototype = new Node();
Keyword.prototype.type = "Keyword";
Keyword.prototype.genCSS = function (context, output) {
    if (this.value === '%') { throw { type: "Syntax", message: "Invalid % without number" }; }
    output.add(this.value);
};

Keyword.True = new Keyword('true');
Keyword.False = new Keyword('false');

module.exports = Keyword;

},{"./node":67}],63:[function(require,module,exports){
var Ruleset = require("./ruleset"),
    Value = require("./value"),
    Element = require("./element"),
    Selector = require("./selector"),
    Anonymous = require("./anonymous"),
    Expression = require("./expression"),
    Directive = require("./directive");

var Media = function (value, features, index, currentFileInfo) {
    this.index = index;
    this.currentFileInfo = currentFileInfo;

    var selectors = this.emptySelectors();

    this.features = new Value(features);
    this.rules = [new Ruleset(selectors, value)];
    this.rules[0].allowImports = true;
};
Media.prototype = new Directive();
Media.prototype.type = "Media";
Media.prototype.isRulesetLike = true;
Media.prototype.accept = function (visitor) {
    if (this.features) {
        this.features = visitor.visit(this.features);
    }
    if (this.rules) {
        this.rules = visitor.visitArray(this.rules);
    }
};
Media.prototype.genCSS = function (context, output) {
    output.add('@media ', this.currentFileInfo, this.index);
    this.features.genCSS(context, output);
    this.outputRuleset(context, output, this.rules);
};
Media.prototype.eval = function (context) {
    if (!context.mediaBlocks) {
        context.mediaBlocks = [];
        context.mediaPath = [];
    }

    var media = new Media(null, [], this.index, this.currentFileInfo);
    if (this.debugInfo) {
        this.rules[0].debugInfo = this.debugInfo;
        media.debugInfo = this.debugInfo;
    }
    var strictMathBypass = false;
    if (!context.strictMath) {
        strictMathBypass = true;
        context.strictMath = true;
    }
    try {
        media.features = this.features.eval(context);
    }
    finally {
        if (strictMathBypass) {
            context.strictMath = false;
        }
    }

    context.mediaPath.push(media);
    context.mediaBlocks.push(media);

    context.frames.unshift(this.rules[0]);
    media.rules = [this.rules[0].eval(context)];
    context.frames.shift();

    context.mediaPath.pop();

    return context.mediaPath.length === 0 ? media.evalTop(context) :
                media.evalNested(context);
};
//TODO merge with directive
Media.prototype.variable = function (name) { return Ruleset.prototype.variable.call(this.rules[0], name); };
Media.prototype.find = function () { return Ruleset.prototype.find.apply(this.rules[0], arguments); };
Media.prototype.rulesets = function () { return Ruleset.prototype.rulesets.apply(this.rules[0]); };
Media.prototype.emptySelectors = function() {
    var el = new Element('', '&', this.index, this.currentFileInfo),
        sels = [new Selector([el], null, null, this.index, this.currentFileInfo)];
    sels[0].mediaEmpty = true;
    return sels;
};
Media.prototype.markReferenced = function () {
    var i, rules = this.rules[0].rules;
    this.rules[0].markReferenced();
    this.isReferenced = true;
    for (i = 0; i < rules.length; i++) {
        if (rules[i].markReferenced) {
            rules[i].markReferenced();
        }
    }
};
Media.prototype.evalTop = function (context) {
    var result = this;

    // Render all dependent Media blocks.
    if (context.mediaBlocks.length > 1) {
        var selectors = this.emptySelectors();
        result = new Ruleset(selectors, context.mediaBlocks);
        result.multiMedia = true;
    }

    delete context.mediaBlocks;
    delete context.mediaPath;

    return result;
};
Media.prototype.evalNested = function (context) {
    var i, value,
        path = context.mediaPath.concat([this]);

    // Extract the media-query conditions separated with `,` (OR).
    for (i = 0; i < path.length; i++) {
        value = path[i].features instanceof Value ?
                    path[i].features.value : path[i].features;
        path[i] = Array.isArray(value) ? value : [value];
    }

    // Trace all permutations to generate the resulting media-query.
    //
    // (a, b and c) with nested (d, e) ->
    //    a and d
    //    a and e
    //    b and c and d
    //    b and c and e
    this.features = new Value(this.permute(path).map(function (path) {
        path = path.map(function (fragment) {
            return fragment.toCSS ? fragment : new Anonymous(fragment);
        });

        for (i = path.length - 1; i > 0; i--) {
            path.splice(i, 0, new Anonymous("and"));
        }

        return new Expression(path);
    }));

    // Fake a tree-node that doesn't output anything.
    return new Ruleset([], []);
};
Media.prototype.permute = function (arr) {
    if (arr.length === 0) {
        return [];
    } else if (arr.length === 1) {
        return arr[0];
    } else {
        var result = [];
        var rest = this.permute(arr.slice(1));
        for (var i = 0; i < rest.length; i++) {
            for (var j = 0; j < arr[0].length; j++) {
                result.push([arr[0][j]].concat(rest[i]));
            }
        }
        return result;
    }
};
Media.prototype.bubbleSelectors = function (selectors) {
    if (!selectors) {
        return;
    }
    this.rules = [new Ruleset(selectors.slice(0), [this.rules[0]])];
};
module.exports = Media;

},{"./anonymous":43,"./directive":54,"./element":55,"./expression":56,"./ruleset":73,"./selector":74,"./value":78}],64:[function(require,module,exports){
var Node = require("./node"),
    Selector = require("./selector"),
    MixinDefinition = require("./mixin-definition"),
    defaultFunc = require("../functions/default");

var MixinCall = function (elements, args, index, currentFileInfo, important) {
    this.selector = new Selector(elements);
    this.arguments = (args && args.length) ? args : null;
    this.index = index;
    this.currentFileInfo = currentFileInfo;
    this.important = important;
};
MixinCall.prototype = new Node();
MixinCall.prototype.type = "MixinCall";
MixinCall.prototype.accept = function (visitor) {
    if (this.selector) {
        this.selector = visitor.visit(this.selector);
    }
    if (this.arguments) {
        this.arguments = visitor.visitArray(this.arguments);
    }
};
MixinCall.prototype.eval = function (context) {
    var mixins, mixin, mixinPath, args, rules = [], match = false, i, m, f, isRecursive, isOneFound, rule,
        candidates = [], candidate, conditionResult = [], defaultResult, defFalseEitherCase = -1,
        defNone = 0, defTrue = 1, defFalse = 2, count, originalRuleset, noArgumentsFilter;

    function calcDefGroup(mixin, mixinPath) {
        var p, namespace;

        for (f = 0; f < 2; f++) {
            conditionResult[f] = true;
            defaultFunc.value(f);
            for (p = 0; p < mixinPath.length && conditionResult[f]; p++) {
                namespace = mixinPath[p];
                if (namespace.matchCondition) {
                    conditionResult[f] = conditionResult[f] && namespace.matchCondition(null, context);
                }
            }
            if (mixin.matchCondition) {
                conditionResult[f] = conditionResult[f] && mixin.matchCondition(args, context);
            }
        }
        if (conditionResult[0] || conditionResult[1]) {
            if (conditionResult[0] != conditionResult[1]) {
                return conditionResult[1] ?
                    defTrue : defFalse;
            }

            return defNone;
        }
        return defFalseEitherCase;
    }

    args = this.arguments && this.arguments.map(function (a) {
        return { name: a.name, value: a.value.eval(context) };
    });

    noArgumentsFilter = function(rule) {return rule.matchArgs(null, context);};

    for (i = 0; i < context.frames.length; i++) {
        if ((mixins = context.frames[i].find(this.selector, null, noArgumentsFilter)).length > 0) {
            isOneFound = true;

            // To make `default()` function independent of definition order we have two "subpasses" here.
            // At first we evaluate each guard *twice* (with `default() == true` and `default() == false`),
            // and build candidate list with corresponding flags. Then, when we know all possible matches,
            // we make a final decision.

            for (m = 0; m < mixins.length; m++) {
                mixin = mixins[m].rule;
                mixinPath = mixins[m].path;
                isRecursive = false;
                for (f = 0; f < context.frames.length; f++) {
                    if ((!(mixin instanceof MixinDefinition)) && mixin === (context.frames[f].originalRuleset || context.frames[f])) {
                        isRecursive = true;
                        break;
                    }
                }
                if (isRecursive) {
                    continue;
                }

                if (mixin.matchArgs(args, context)) {
                    candidate = {mixin: mixin, group: calcDefGroup(mixin, mixinPath)};

                    if (candidate.group !== defFalseEitherCase) {
                        candidates.push(candidate);
                    }

                    match = true;
                }
            }

            defaultFunc.reset();

            count = [0, 0, 0];
            for (m = 0; m < candidates.length; m++) {
                count[candidates[m].group]++;
            }

            if (count[defNone] > 0) {
                defaultResult = defFalse;
            } else {
                defaultResult = defTrue;
                if ((count[defTrue] + count[defFalse]) > 1) {
                    throw { type: 'Runtime',
                        message: 'Ambiguous use of `default()` found when matching for `' + this.format(args) + '`',
                        index: this.index, filename: this.currentFileInfo.filename };
                }
            }

            for (m = 0; m < candidates.length; m++) {
                candidate = candidates[m].group;
                if ((candidate === defNone) || (candidate === defaultResult)) {
                    try {
                        mixin = candidates[m].mixin;
                        if (!(mixin instanceof MixinDefinition)) {
                            originalRuleset = mixin.originalRuleset || mixin;
                            mixin = new MixinDefinition("", [], mixin.rules, null, false);
                            mixin.originalRuleset = originalRuleset;
                        }
                        Array.prototype.push.apply(
                            rules, mixin.evalCall(context, args, this.important).rules);
                    } catch (e) {
                        throw { message: e.message, index: this.index, filename: this.currentFileInfo.filename, stack: e.stack };
                    }
                }
            }

            if (match) {
                if (!this.currentFileInfo || !this.currentFileInfo.reference) {
                    for (i = 0; i < rules.length; i++) {
                        rule = rules[i];
                        if (rule.markReferenced) {
                            rule.markReferenced();
                        }
                    }
                }
                return rules;
            }
        }
    }
    if (isOneFound) {
        throw { type:    'Runtime',
            message: 'No matching definition was found for `' + this.format(args) + '`',
            index:   this.index, filename: this.currentFileInfo.filename };
    } else {
        throw { type:    'Name',
            message: this.selector.toCSS().trim() + " is undefined",
            index:   this.index, filename: this.currentFileInfo.filename };
    }
};
MixinCall.prototype.format = function (args) {
    return this.selector.toCSS().trim() + '(' +
        (args ? args.map(function (a) {
            var argValue = "";
            if (a.name) {
                argValue += a.name + ":";
            }
            if (a.value.toCSS) {
                argValue += a.value.toCSS();
            } else {
                argValue += "???";
            }
            return argValue;
        }).join(', ') : "") + ")";
};
module.exports = MixinCall;

},{"../functions/default":19,"./mixin-definition":65,"./node":67,"./selector":74}],65:[function(require,module,exports){
var Selector = require("./selector"),
    Element = require("./element"),
    Ruleset = require("./ruleset"),
    Rule = require("./rule"),
    Expression = require("./expression"),
    contexts = require("../contexts");

var Definition = function (name, params, rules, condition, variadic, frames) {
    this.name = name;
    this.selectors = [new Selector([new Element(null, name, this.index, this.currentFileInfo)])];
    this.params = params;
    this.condition = condition;
    this.variadic = variadic;
    this.arity = params.length;
    this.rules = rules;
    this._lookups = {};
    this.required = params.reduce(function (count, p) {
        if (!p.name || (p.name && !p.value)) {
            return count + 1;
        }
        else {
            return count;
        }
    }, 0);
    this.frames = frames;
};
Definition.prototype = new Ruleset();
Definition.prototype.type = "MixinDefinition";
Definition.prototype.evalFirst = true;
Definition.prototype.accept = function (visitor) {
    if (this.params && this.params.length) {
        this.params = visitor.visitArray(this.params);
    }
    this.rules = visitor.visitArray(this.rules);
    if (this.condition) {
        this.condition = visitor.visit(this.condition);
    }
};
Definition.prototype.evalParams = function (context, mixinEnv, args, evaldArguments) {
    /*jshint boss:true */
    var frame = new Ruleset(null, null),
        varargs, arg,
        params = this.params.slice(0),
        i, j, val, name, isNamedFound, argIndex, argsLength = 0;

    mixinEnv = new contexts.Eval(mixinEnv, [frame].concat(mixinEnv.frames));

    if (args) {
        args = args.slice(0);
        argsLength = args.length;

        for (i = 0; i < argsLength; i++) {
            arg = args[i];
            if (name = (arg && arg.name)) {
                isNamedFound = false;
                for (j = 0; j < params.length; j++) {
                    if (!evaldArguments[j] && name === params[j].name) {
                        evaldArguments[j] = arg.value.eval(context);
                        frame.prependRule(new Rule(name, arg.value.eval(context)));
                        isNamedFound = true;
                        break;
                    }
                }
                if (isNamedFound) {
                    args.splice(i, 1);
                    i--;
                    continue;
                } else {
                    throw { type: 'Runtime', message: "Named argument for " + this.name +
                        ' ' + args[i].name + ' not found' };
                }
            }
        }
    }
    argIndex = 0;
    for (i = 0; i < params.length; i++) {
        if (evaldArguments[i]) { continue; }

        arg = args && args[argIndex];

        if (name = params[i].name) {
            if (params[i].variadic) {
                varargs = [];
                for (j = argIndex; j < argsLength; j++) {
                    varargs.push(args[j].value.eval(context));
                }
                frame.prependRule(new Rule(name, new Expression(varargs).eval(context)));
            } else {
                val = arg && arg.value;
                if (val) {
                    val = val.eval(context);
                } else if (params[i].value) {
                    val = params[i].value.eval(mixinEnv);
                    frame.resetCache();
                } else {
                    throw { type: 'Runtime', message: "wrong number of arguments for " + this.name +
                        ' (' + argsLength + ' for ' + this.arity + ')' };
                }

                frame.prependRule(new Rule(name, val));
                evaldArguments[i] = val;
            }
        }

        if (params[i].variadic && args) {
            for (j = argIndex; j < argsLength; j++) {
                evaldArguments[j] = args[j].value.eval(context);
            }
        }
        argIndex++;
    }

    return frame;
};
Definition.prototype.makeImportant = function() {
    var rules = !this.rules ? this.rules : this.rules.map(function (r) {
        if (r.makeImportant) {
            return r.makeImportant(true);
        } else {
            return r;
        }
    });
    var result = new Definition (this.name, this.params, rules, this.condition, this.variadic, this.frames);
    return result;
};
Definition.prototype.eval = function (context) {
    return new Definition(this.name, this.params, this.rules, this.condition, this.variadic, this.frames || context.frames.slice(0));
};
Definition.prototype.evalCall = function (context, args, important) {
    var _arguments = [],
        mixinFrames = this.frames ? this.frames.concat(context.frames) : context.frames,
        frame = this.evalParams(context, new contexts.Eval(context, mixinFrames), args, _arguments),
        rules, ruleset;

    frame.prependRule(new Rule('@arguments', new Expression(_arguments).eval(context)));

    rules = this.rules.slice(0);

    ruleset = new Ruleset(null, rules);
    ruleset.originalRuleset = this;
    ruleset = ruleset.eval(new contexts.Eval(context, [this, frame].concat(mixinFrames)));
    if (important) {
        ruleset = ruleset.makeImportant();
    }
    return ruleset;
};
Definition.prototype.matchCondition = function (args, context) {
    if (this.condition && !this.condition.eval(
        new contexts.Eval(context,
            [this.evalParams(context, /* the parameter variables*/
                new contexts.Eval(context, this.frames ? this.frames.concat(context.frames) : context.frames), args, [])]
            .concat(this.frames) // the parent namespace/mixin frames
            .concat(context.frames)))) { // the current environment frames
        return false;
    }
    return true;
};
Definition.prototype.matchArgs = function (args, context) {
    var argsLength = (args && args.length) || 0, len;

    if (! this.variadic) {
        if (argsLength < this.required) {
            return false;
        }
        if (argsLength > this.params.length) {
            return false;
        }
    } else {
        if (argsLength < (this.required - 1)) {
            return false;
        }
    }

    len = Math.min(argsLength, this.arity);

    for (var i = 0; i < len; i++) {
        if (!this.params[i].name && !this.params[i].variadic) {
            if (args[i].value.eval(context).toCSS() != this.params[i].value.eval(context).toCSS()) {
                return false;
            }
        }
    }
    return true;
};
module.exports = Definition;

},{"../contexts":10,"./element":55,"./expression":56,"./rule":71,"./ruleset":73,"./selector":74}],66:[function(require,module,exports){
var Node = require("./node"),
    Operation = require("./operation"),
    Dimension = require("./dimension");

var Negative = function (node) {
    this.value = node;
};
Negative.prototype = new Node();
Negative.prototype.type = "Negative";
Negative.prototype.genCSS = function (context, output) {
    output.add('-');
    this.value.genCSS(context, output);
};
Negative.prototype.eval = function (context) {
    if (context.isMathOn()) {
        return (new Operation('*', [new Dimension(-1), this.value])).eval(context);
    }
    return new Negative(this.value.eval(context));
};
module.exports = Negative;

},{"./dimension":53,"./node":67,"./operation":68}],67:[function(require,module,exports){
var Node = function() {
};
Node.prototype.toCSS = function (context) {
    var strs = [];
    this.genCSS(context, {
        add: function(chunk, fileInfo, index) {
            strs.push(chunk);
        },
        isEmpty: function () {
            return strs.length === 0;
        }
    });
    return strs.join('');
};
Node.prototype.genCSS = function (context, output) {
    output.add(this.value);
};
Node.prototype.accept = function (visitor) {
    this.value = visitor.visit(this.value);
};
Node.prototype.eval = function () { return this; };
Node.prototype._operate = function (context, op, a, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
    }
};
Node.prototype.fround = function(context, value) {
    var precision = context && context.numPrecision;
    //add "epsilon" to ensure numbers like 1.000000005 (represented as 1.000000004999....) are properly rounded...
    return (precision == null) ? value : Number((value + 2e-16).toFixed(precision));
};
Node.compare = function (a, b) {
    /* returns:
     -1: a < b
     0: a = b
     1: a > b
     and *any* other value for a != b (e.g. undefined, NaN, -2 etc.) */

    if ((a.compare) &&
        // for "symmetric results" force toCSS-based comparison
        // of Quoted or Anonymous if either value is one of those
        !(b.type === "Quoted" || b.type === "Anonymous")) {
        return a.compare(b);
    } else if (b.compare) {
        return -b.compare(a);
    } else if (a.type !== b.type) {
        return undefined;
    }

    a = a.value;
    b = b.value;
    if (!Array.isArray(a)) {
        return a === b ? 0 : undefined;
    }
    if (a.length !== b.length) {
        return undefined;
    }
    for (var i = 0; i < a.length; i++) {
        if (Node.compare(a[i], b[i]) !== 0) {
            return undefined;
        }
    }
    return 0;
};

Node.numericCompare = function (a, b) {
    return a  <  b ? -1
        : a === b ?  0
        : a  >  b ?  1 : undefined;
};
module.exports = Node;

},{}],68:[function(require,module,exports){
var Node = require("./node"),
    Color = require("./color"),
    Dimension = require("./dimension");

var Operation = function (op, operands, isSpaced) {
    this.op = op.trim();
    this.operands = operands;
    this.isSpaced = isSpaced;
};
Operation.prototype = new Node();
Operation.prototype.type = "Operation";
Operation.prototype.accept = function (visitor) {
    this.operands = visitor.visit(this.operands);
};
Operation.prototype.eval = function (context) {
    var a = this.operands[0].eval(context),
        b = this.operands[1].eval(context);

    if (context.isMathOn()) {
        if (a instanceof Dimension && b instanceof Color) {
            a = a.toColor();
        }
        if (b instanceof Dimension && a instanceof Color) {
            b = b.toColor();
        }
        if (!a.operate) {
            throw { type: "Operation",
                    message: "Operation on an invalid type" };
        }

        return a.operate(context, this.op, b);
    } else {
        return new Operation(this.op, [a, b], this.isSpaced);
    }
};
Operation.prototype.genCSS = function (context, output) {
    this.operands[0].genCSS(context, output);
    if (this.isSpaced) {
        output.add(" ");
    }
    output.add(this.op);
    if (this.isSpaced) {
        output.add(" ");
    }
    this.operands[1].genCSS(context, output);
};

module.exports = Operation;

},{"./color":47,"./dimension":53,"./node":67}],69:[function(require,module,exports){
var Node = require("./node");

var Paren = function (node) {
    this.value = node;
};
Paren.prototype = new Node();
Paren.prototype.type = "Paren";
Paren.prototype.genCSS = function (context, output) {
    output.add('(');
    this.value.genCSS(context, output);
    output.add(')');
};
Paren.prototype.eval = function (context) {
    return new Paren(this.value.eval(context));
};
module.exports = Paren;

},{"./node":67}],70:[function(require,module,exports){
var Node = require("./node"),
    JsEvalNode = require("./js-eval-node"),
    Variable = require("./variable");

var Quoted = function (str, content, escaped, index, currentFileInfo) {
    this.escaped = (escaped == null) ? true : escaped;
    this.value = content || '';
    this.quote = str.charAt(0);
    this.index = index;
    this.currentFileInfo = currentFileInfo;
};
Quoted.prototype = new JsEvalNode();
Quoted.prototype.type = "Quoted";
Quoted.prototype.genCSS = function (context, output) {
    if (!this.escaped) {
        output.add(this.quote, this.currentFileInfo, this.index);
    }
    output.add(this.value);
    if (!this.escaped) {
        output.add(this.quote);
    }
};
Quoted.prototype.containsVariables = function() {
    return this.value.match(/(`([^`]+)`)|@\{([\w-]+)\}/);
};
Quoted.prototype.eval = function (context) {
    var that = this, value = this.value;
    var javascriptReplacement = function (_, exp) {
        return String(that.evaluateJavaScript(exp, context));
    };
    var interpolationReplacement = function (_, name) {
        var v = new Variable('@' + name, that.index, that.currentFileInfo).eval(context, true);
        return (v instanceof Quoted) ? v.value : v.toCSS();
    };
    function iterativeReplace(value, regexp, replacementFnc) {
        var evaluatedValue = value;
        do {
            value = evaluatedValue;
            evaluatedValue = value.replace(regexp, replacementFnc);
        } while (value !== evaluatedValue);
        return evaluatedValue;
    }
    value = iterativeReplace(value, /`([^`]+)`/g, javascriptReplacement);
    value = iterativeReplace(value, /@\{([\w-]+)\}/g, interpolationReplacement);
    return new Quoted(this.quote + value + this.quote, value, this.escaped, this.index, this.currentFileInfo);
};
Quoted.prototype.compare = function (other) {
    // when comparing quoted strings allow the quote to differ
    if (other.type === "Quoted" && !this.escaped && !other.escaped) {
        return Node.numericCompare(this.value, other.value);
    } else {
        return other.toCSS && this.toCSS() === other.toCSS() ? 0 : undefined;
    }
};
module.exports = Quoted;

},{"./js-eval-node":61,"./node":67,"./variable":79}],71:[function(require,module,exports){
var Node = require("./node"),
    Value = require("./value"),
    Keyword = require("./keyword");

var Rule = function (name, value, important, merge, index, currentFileInfo, inline, variable) {
    this.name = name;
    this.value = (value instanceof Node) ? value : new Value([value]); //value instanceof tree.Value || value instanceof tree.Ruleset ??
    this.important = important ? ' ' + important.trim() : '';
    this.merge = merge;
    this.index = index;
    this.currentFileInfo = currentFileInfo;
    this.inline = inline || false;
    this.variable = (variable !== undefined) ? variable
        : (name.charAt && (name.charAt(0) === '@'));
};

function evalName(context, name) {
    var value = "", i, n = name.length,
        output = {add: function (s) {value += s;}};
    for (i = 0; i < n; i++) {
        name[i].eval(context).genCSS(context, output);
    }
    return value;
}

Rule.prototype = new Node();
Rule.prototype.type = "Rule";
Rule.prototype.genCSS = function (context, output) {
    output.add(this.name + (context.compress ? ':' : ': '), this.currentFileInfo, this.index);
    try {
        this.value.genCSS(context, output);
    }
    catch(e) {
        e.index = this.index;
        e.filename = this.currentFileInfo.filename;
        throw e;
    }
    output.add(this.important + ((this.inline || (context.lastRule && context.compress)) ? "" : ";"), this.currentFileInfo, this.index);
};
Rule.prototype.eval = function (context) {
    var strictMathBypass = false, name = this.name, evaldValue, variable = this.variable;
    if (typeof name !== "string") {
        // expand 'primitive' name directly to get
        // things faster (~10% for benchmark.less):
        name = (name.length === 1) && (name[0] instanceof Keyword) ?
                name[0].value : evalName(context, name);
        variable = false; // never treat expanded interpolation as new variable name
    }
    if (name === "font" && !context.strictMath) {
        strictMathBypass = true;
        context.strictMath = true;
    }
    try {
        context.importantScope.push({});
        evaldValue = this.value.eval(context);

        if (!this.variable && evaldValue.type === "DetachedRuleset") {
            throw { message: "Rulesets cannot be evaluated on a property.",
                    index: this.index, filename: this.currentFileInfo.filename };
        }
        var important = this.important,
            importantResult = context.importantScope.pop();
        if (!important && importantResult.important) {
            important = importantResult.important;
        }

        return new Rule(name,
                          evaldValue,
                          important,
                          this.merge,
                          this.index, this.currentFileInfo, this.inline,
                              variable);
    }
    catch(e) {
        if (typeof e.index !== 'number') {
            e.index = this.index;
            e.filename = this.currentFileInfo.filename;
        }
        throw e;
    }
    finally {
        if (strictMathBypass) {
            context.strictMath = false;
        }
    }
};
Rule.prototype.makeImportant = function () {
    return new Rule(this.name,
                          this.value,
                          "!important",
                          this.merge,
                          this.index, this.currentFileInfo, this.inline);
};

module.exports = Rule;

},{"./keyword":62,"./node":67,"./value":78}],72:[function(require,module,exports){
var Node = require("./node"),
    Variable = require("./variable");

var RulesetCall = function (variable) {
    this.variable = variable;
};
RulesetCall.prototype = new Node();
RulesetCall.prototype.type = "RulesetCall";
RulesetCall.prototype.eval = function (context) {
    var detachedRuleset = new Variable(this.variable).eval(context);
    return detachedRuleset.callEval(context);
};
module.exports = RulesetCall;

},{"./node":67,"./variable":79}],73:[function(require,module,exports){
var Node = require("./node"),
    Rule = require("./rule"),
    Selector = require("./selector"),
    Element = require("./element"),
    Paren = require("./paren"),
    contexts = require("../contexts"),
    defaultFunc = require("../functions/default"),
    getDebugInfo = require("./debug-info");

var Ruleset = function (selectors, rules, strictImports) {
    this.selectors = selectors;
    this.rules = rules;
    this._lookups = {};
    this.strictImports = strictImports;
};
Ruleset.prototype = new Node();
Ruleset.prototype.type = "Ruleset";
Ruleset.prototype.isRuleset = true;
Ruleset.prototype.isRulesetLike = true;
Ruleset.prototype.accept = function (visitor) {
    if (this.paths) {
        visitor.visitArray(this.paths, true);
    } else if (this.selectors) {
        this.selectors = visitor.visitArray(this.selectors);
    }
    if (this.rules && this.rules.length) {
        this.rules = visitor.visitArray(this.rules);
    }
};
Ruleset.prototype.eval = function (context) {
    var thisSelectors = this.selectors, selectors,
        selCnt, selector, i, hasOnePassingSelector = false;

    if (thisSelectors && (selCnt = thisSelectors.length)) {
        selectors = [];
        defaultFunc.error({
            type: "Syntax",
            message: "it is currently only allowed in parametric mixin guards,"
        });
        for (i = 0; i < selCnt; i++) {
            selector = thisSelectors[i].eval(context);
            selectors.push(selector);
            if (selector.evaldCondition) {
                hasOnePassingSelector = true;
            }
        }
        defaultFunc.reset();
    } else {
        hasOnePassingSelector = true;
    }

    var rules = this.rules ? this.rules.slice(0) : null,
        ruleset = new Ruleset(selectors, rules, this.strictImports),
        rule, subRule;

    ruleset.originalRuleset = this;
    ruleset.root = this.root;
    ruleset.firstRoot = this.firstRoot;
    ruleset.allowImports = this.allowImports;

    if (this.debugInfo) {
        ruleset.debugInfo = this.debugInfo;
    }

    if (!hasOnePassingSelector) {
        rules.length = 0;
    }

    // push the current ruleset to the frames stack
    var ctxFrames = context.frames;
    ctxFrames.unshift(ruleset);

    // currrent selectors
    var ctxSelectors = context.selectors;
    if (!ctxSelectors) {
        context.selectors = ctxSelectors = [];
    }
    ctxSelectors.unshift(this.selectors);

    // Evaluate imports
    if (ruleset.root || ruleset.allowImports || !ruleset.strictImports) {
        ruleset.evalImports(context);
    }

    // Store the frames around mixin definitions,
    // so they can be evaluated like closures when the time comes.
    var rsRules = ruleset.rules, rsRuleCnt = rsRules ? rsRules.length : 0;
    for (i = 0; i < rsRuleCnt; i++) {
        if (rsRules[i].evalFirst) {
            rsRules[i] = rsRules[i].eval(context);
        }
    }

    var mediaBlockCount = (context.mediaBlocks && context.mediaBlocks.length) || 0;

    // Evaluate mixin calls.
    for (i = 0; i < rsRuleCnt; i++) {
        if (rsRules[i].type === "MixinCall") {
            /*jshint loopfunc:true */
            rules = rsRules[i].eval(context).filter(function(r) {
                if ((r instanceof Rule) && r.variable) {
                    // do not pollute the scope if the variable is
                    // already there. consider returning false here
                    // but we need a way to "return" variable from mixins
                    return !(ruleset.variable(r.name));
                }
                return true;
            });
            rsRules.splice.apply(rsRules, [i, 1].concat(rules));
            rsRuleCnt += rules.length - 1;
            i += rules.length - 1;
            ruleset.resetCache();
        } else if (rsRules[i].type === "RulesetCall") {
            /*jshint loopfunc:true */
            rules = rsRules[i].eval(context).rules.filter(function(r) {
                if ((r instanceof Rule) && r.variable) {
                    // do not pollute the scope at all
                    return false;
                }
                return true;
            });
            rsRules.splice.apply(rsRules, [i, 1].concat(rules));
            rsRuleCnt += rules.length - 1;
            i += rules.length - 1;
            ruleset.resetCache();
        }
    }

    // Evaluate everything else
    for (i = 0; i < rsRules.length; i++) {
        rule = rsRules[i];
        if (!rule.evalFirst) {
            rsRules[i] = rule = rule.eval ? rule.eval(context) : rule;
        }
    }

    // Evaluate everything else
    for (i = 0; i < rsRules.length; i++) {
        rule = rsRules[i];
        // for rulesets, check if it is a css guard and can be removed
        if (rule instanceof Ruleset && rule.selectors && rule.selectors.length === 1) {
            // check if it can be folded in (e.g. & where)
            if (rule.selectors[0].isJustParentSelector()) {
                rsRules.splice(i--, 1);

                for (var j = 0; j < rule.rules.length; j++) {
                    subRule = rule.rules[j];
                    if (!(subRule instanceof Rule) || !subRule.variable) {
                        rsRules.splice(++i, 0, subRule);
                    }
                }
            }
        }
    }

    // Pop the stack
    ctxFrames.shift();
    ctxSelectors.shift();

    if (context.mediaBlocks) {
        for (i = mediaBlockCount; i < context.mediaBlocks.length; i++) {
            context.mediaBlocks[i].bubbleSelectors(selectors);
        }
    }

    return ruleset;
};
Ruleset.prototype.evalImports = function(context) {
    var rules = this.rules, i, importRules;
    if (!rules) { return; }

    for (i = 0; i < rules.length; i++) {
        if (rules[i].type === "Import") {
            importRules = rules[i].eval(context);
            if (importRules && importRules.length) {
                rules.splice.apply(rules, [i, 1].concat(importRules));
                i+= importRules.length - 1;
            } else {
                rules.splice(i, 1, importRules);
            }
            this.resetCache();
        }
    }
};
Ruleset.prototype.makeImportant = function() {
    var result = new Ruleset(this.selectors, this.rules.map(function (r) {
        if (r.makeImportant) {
            return r.makeImportant();
        } else {
            return r;
        }
    }), this.strictImports);

    return result;
};
Ruleset.prototype.matchArgs = function (args) {
    return !args || args.length === 0;
};
// lets you call a css selector with a guard
Ruleset.prototype.matchCondition = function (args, context) {
    var lastSelector = this.selectors[this.selectors.length - 1];
    if (!lastSelector.evaldCondition) {
        return false;
    }
    if (lastSelector.condition &&
        !lastSelector.condition.eval(
            new contexts.Eval(context,
                context.frames))) {
        return false;
    }
    return true;
};
Ruleset.prototype.resetCache = function () {
    this._rulesets = null;
    this._variables = null;
    this._lookups = {};
};
Ruleset.prototype.variables = function () {
    if (!this._variables) {
        this._variables = !this.rules ? {} : this.rules.reduce(function (hash, r) {
            if (r instanceof Rule && r.variable === true) {
                hash[r.name] = r;
            }
            // when evaluating variables in an import statement, imports have not been eval'd
            // so we need to go inside import statements.
            // guard against root being a string (in the case of inlined less)
            if (r.type === "Import" && r.root && r.root.variables) {
                var vars = r.root.variables();
                for (var name in vars) {
                    if (vars.hasOwnProperty(name)) {
                        hash[name] = vars[name];
                    }
                }
            }
            return hash;
        }, {});
    }
    return this._variables;
};
Ruleset.prototype.variable = function (name) {
    return this.variables()[name];
};
Ruleset.prototype.rulesets = function () {
    if (!this.rules) { return null; }

    var filtRules = [], rules = this.rules, cnt = rules.length,
        i, rule;

    for (i = 0; i < cnt; i++) {
        rule = rules[i];
        if (rule.isRuleset) {
            filtRules.push(rule);
        }
    }

    return filtRules;
};
Ruleset.prototype.prependRule = function (rule) {
    var rules = this.rules;
    if (rules) {
        rules.unshift(rule);
    } else {
        this.rules = [ rule ];
    }
};
Ruleset.prototype.find = function (selector, self, filter) {
    self = self || this;
    var rules = [], match, foundMixins,
        key = selector.toCSS();

    if (key in this._lookups) { return this._lookups[key]; }

    this.rulesets().forEach(function (rule) {
        if (rule !== self) {
            for (var j = 0; j < rule.selectors.length; j++) {
                match = selector.match(rule.selectors[j]);
                if (match) {
                    if (selector.elements.length > match) {
                        if (!filter || filter(rule)) {
                            foundMixins = rule.find(new Selector(selector.elements.slice(match)), self, filter);
                            for (var i = 0; i < foundMixins.length; ++i) {
                                foundMixins[i].path.push(rule);
                            }
                            Array.prototype.push.apply(rules, foundMixins);
                        }
                    } else {
                        rules.push({ rule: rule, path: []});
                    }
                    break;
                }
            }
        }
    });
    this._lookups[key] = rules;
    return rules;
};
Ruleset.prototype.genCSS = function (context, output) {
    var i, j,
        charsetRuleNodes = [],
        ruleNodes = [],
        rulesetNodes = [],
        rulesetNodeCnt,
        debugInfo,     // Line number debugging
        rule,
        path;

    context.tabLevel = (context.tabLevel || 0);

    if (!this.root) {
        context.tabLevel++;
    }

    var tabRuleStr = context.compress ? '' : Array(context.tabLevel + 1).join("  "),
        tabSetStr = context.compress ? '' : Array(context.tabLevel).join("  "),
        sep;

    function isRulesetLikeNode(rule, root) {
        // if it has nested rules, then it should be treated like a ruleset
        // medias and comments do not have nested rules, but should be treated like rulesets anyway
        // some directives and anonymous nodes are ruleset like, others are not
        if (typeof rule.isRulesetLike === "boolean") {
            return rule.isRulesetLike;
        } else if (typeof rule.isRulesetLike === "function") {
            return rule.isRulesetLike(root);
        }

        //anything else is assumed to be a rule
        return false;
    }

    for (i = 0; i < this.rules.length; i++) {
        rule = this.rules[i];
        if (isRulesetLikeNode(rule, this.root)) {
            rulesetNodes.push(rule);
        } else {
            //charsets should float on top of everything
            if (rule.isCharset && rule.isCharset()) {
                charsetRuleNodes.push(rule);
            } else {
                ruleNodes.push(rule);
            }
        }
    }
    ruleNodes = charsetRuleNodes.concat(ruleNodes);

    // If this is the root node, we don't render
    // a selector, or {}.
    if (!this.root) {
        debugInfo = getDebugInfo(context, this, tabSetStr);

        if (debugInfo) {
            output.add(debugInfo);
            output.add(tabSetStr);
        }

        var paths = this.paths, pathCnt = paths.length,
            pathSubCnt;

        sep = context.compress ? ',' : (',\n' + tabSetStr);

        for (i = 0; i < pathCnt; i++) {
            path = paths[i];
            if (!(pathSubCnt = path.length)) { continue; }
            if (i > 0) { output.add(sep); }

            context.firstSelector = true;
            path[0].genCSS(context, output);

            context.firstSelector = false;
            for (j = 1; j < pathSubCnt; j++) {
                path[j].genCSS(context, output);
            }
        }

        output.add((context.compress ? '{' : ' {\n') + tabRuleStr);
    }

    // Compile rules and rulesets
    for (i = 0; i < ruleNodes.length; i++) {
        rule = ruleNodes[i];

        // @page{ directive ends up with root elements inside it, a mix of rules and rulesets
        // In this instance we do not know whether it is the last property
        if (i + 1 === ruleNodes.length && (!this.root || rulesetNodes.length === 0 || this.firstRoot)) {
            context.lastRule = true;
        }

        if (rule.genCSS) {
            rule.genCSS(context, output);
        } else if (rule.value) {
            output.add(rule.value.toString());
        }

        if (!context.lastRule) {
            output.add(context.compress ? '' : ('\n' + tabRuleStr));
        } else {
            context.lastRule = false;
        }
    }

    if (!this.root) {
        output.add((context.compress ? '}' : '\n' + tabSetStr + '}'));
        context.tabLevel--;
    }

    sep = (context.compress ? "" : "\n") + (this.root ? tabRuleStr : tabSetStr);
    rulesetNodeCnt = rulesetNodes.length;
    if (rulesetNodeCnt) {
        if (ruleNodes.length && sep) { output.add(sep); }
        rulesetNodes[0].genCSS(context, output);
        for (i = 1; i < rulesetNodeCnt; i++) {
            if (sep) { output.add(sep); }
            rulesetNodes[i].genCSS(context, output);
        }
    }

    if (!output.isEmpty() && !context.compress && this.firstRoot) {
        output.add('\n');
    }
};
Ruleset.prototype.markReferenced = function () {
    var s;
    if (this.selectors) {
        for (s = 0; s < this.selectors.length; s++) {
            this.selectors[s].markReferenced();
        }
    }

    if (this.rules) {
        for (s = 0; s < this.rules.length; s++) {
            if (this.rules[s].markReferenced) {
                this.rules[s].markReferenced();
            }
        }
    }
};
Ruleset.prototype.getIsReferenced = function() {
    var i, j, path, selector;

    if (this.paths) {
        for (i = 0; i < this.paths.length; i++) {
            path = this.paths[i];
            for (j = 0; j < path.length; j++) {
                if (path[j].getIsReferenced && path[j].getIsReferenced()) {
                    return true;
                }
            }
        }
    }

    if (this.selectors) {
        for (i = 0; i < this.selectors.length; i++) {
            selector = this.selectors[i];
            if (selector.getIsReferenced && selector.getIsReferenced()) {
                return true;
            }
        }
    }
    return false;
};

Ruleset.prototype.joinSelectors = function (paths, context, selectors) {
    for (var s = 0; s < selectors.length; s++) {
        this.joinSelector(paths, context, selectors[s]);
    }
};

Ruleset.prototype.joinSelector = function (paths, context, selector) {

    function createParenthesis(elementsToPak, originalElement) {
        var replacementParen, j;
        if (elementsToPak.length === 0) {
            replacementParen = new Paren(elementsToPak[0]);
        } else {
            var insideParent = [];
            for (j = 0; j < elementsToPak.length; j++) {
                insideParent.push(new Element(null, elementsToPak[j], originalElement.index, originalElement.currentFileInfo));
            }
            replacementParen = new Paren(new Selector(insideParent));
        }
        return replacementParen;
    }

    function createSelector(containedElement, originalElement) {
        var element, selector;
        element = new Element(null, containedElement, originalElement.index, originalElement.currentFileInfo);
        selector = new Selector([element]);
        return selector;
    }

    // replace all parent selectors inside `inSelector` by content of `context` array
    // resulting selectors are returned inside `paths` array
    // returns true if `inSelector` contained at least one parent selector
    function replaceParentSelector(paths, context, inSelector) {
        // The paths are [[Selector]]
        // The first list is a list of comma separated selectors
        // The inner list is a list of inheritance separated selectors
        // e.g.
        // .a, .b {
        //   .c {
        //   }
        // }
        // == [[.a] [.c]] [[.b] [.c]]
        //
        var i, j, k, currentElements, newSelectors, selectorsMultiplied, sel, el, hadParentSelector = false, length, lastSelector;
        function findNestedSelector(element) {
            var maybeSelector;
            if (element.value.type !== 'Paren') {
                return null;
            }

            maybeSelector = element.value.value;
            if (maybeSelector.type !== 'Selector') {
                return null;
            }

            return maybeSelector;
        }

        // the elements from the current selector so far
        currentElements = [];
        // the current list of new selectors to add to the path.
        // We will build it up. We initiate it with one empty selector as we "multiply" the new selectors
        // by the parents
        newSelectors = [
            []
        ];

        for (i = 0; i < inSelector.elements.length; i++) {
            el = inSelector.elements[i];
            // non parent reference elements just get added
            if (el.value !== "&") {
                var nestedSelector = findNestedSelector(el);
                if (nestedSelector != null) {
                    // merge the current list of non parent selector elements
                    // on to the current list of selectors to add
                    mergeElementsOnToSelectors(currentElements, newSelectors);

                    var nestedPaths = [], replaced, replacedNewSelectors = [];
                    replaced = replaceParentSelector(nestedPaths, context, nestedSelector);
                    hadParentSelector = hadParentSelector || replaced;
                    //the nestedPaths array should have only one member - replaceParentSelector does not multiply selectors
                    for (k = 0; k < nestedPaths.length; k++) {
                        var replacementSelector = createSelector(createParenthesis(nestedPaths[k], el), el);
                        addAllReplacementsIntoPath(newSelectors, [replacementSelector], el, inSelector, replacedNewSelectors);
                    }
                    newSelectors = replacedNewSelectors;
                    currentElements = [];

                } else {
                    currentElements.push(el);
                }

            } else {
                hadParentSelector = true;
                // the new list of selectors to add
                selectorsMultiplied = [];

                // merge the current list of non parent selector elements
                // on to the current list of selectors to add
                mergeElementsOnToSelectors(currentElements, newSelectors);

                // loop through our current selectors
                for (j = 0; j < newSelectors.length; j++) {
                    sel = newSelectors[j];
                    // if we don't have any parent paths, the & might be in a mixin so that it can be used
                    // whether there are parents or not
                    if (context.length === 0) {
                        // the combinator used on el should now be applied to the next element instead so that
                        // it is not lost
                        if (sel.length > 0) {
                            sel[0].elements.push(new Element(el.combinator, '', el.index, el.currentFileInfo));
                        }
                        selectorsMultiplied.push(sel);
                    }
                    else {
                        // and the parent selectors
                        for (k = 0; k < context.length; k++) {
                            // We need to put the current selectors
                            // then join the last selector's elements on to the parents selectors
                            var newSelectorPath = addReplacementIntoPath(sel, context[k], el, inSelector);
                            // add that to our new set of selectors
                            selectorsMultiplied.push(newSelectorPath);
                        }
                    }
                }

                // our new selectors has been multiplied, so reset the state
                newSelectors = selectorsMultiplied;
                currentElements = [];
            }
        }

        // if we have any elements left over (e.g. .a& .b == .b)
        // add them on to all the current selectors
        mergeElementsOnToSelectors(currentElements, newSelectors);

        for (i = 0; i < newSelectors.length; i++) {
            length = newSelectors[i].length;
            if (length > 0) {
                paths.push(newSelectors[i]);
                lastSelector = newSelectors[i][length - 1];
                newSelectors[i][length - 1] = lastSelector.createDerived(lastSelector.elements, inSelector.extendList);
            }
        }

        return hadParentSelector;
    }

    // joins selector path from `beginningPath` with selector path in `addPath`
    // `replacedElement` contains element that is being replaced by `addPath`
    // returns concatenated path
    function addReplacementIntoPath(beginningPath, addPath, replacedElement, originalSelector) {
        var newSelectorPath, lastSelector, newJoinedSelector;
        // our new selector path
        newSelectorPath = [];

        //construct the joined selector - if & is the first thing this will be empty,
        // if not newJoinedSelector will be the last set of elements in the selector
        if (beginningPath.length > 0) {
            newSelectorPath = beginningPath.slice(0);
            lastSelector = newSelectorPath.pop();
            newJoinedSelector = originalSelector.createDerived(lastSelector.elements.slice(0));
        }
        else {
            newJoinedSelector = originalSelector.createDerived([]);
        }

        if (addPath.length > 0) {
            // /deep/ is a combinator that is valid without anything in front of it
            // so if the & does not have a combinator that is "" or " " then
            // and there is a combinator on the parent, then grab that.
            // this also allows + a { & .b { .a & { ... though not sure why you would want to do that
            var combinator = replacedElement.combinator, parentEl = addPath[0].elements[0];
            if (combinator.emptyOrWhitespace && !parentEl.combinator.emptyOrWhitespace) {
                combinator = parentEl.combinator;
            }
            // join the elements so far with the first part of the parent
            newJoinedSelector.elements.push(new Element(combinator, parentEl.value, replacedElement.index, replacedElement.currentFileInfo));
            newJoinedSelector.elements = newJoinedSelector.elements.concat(addPath[0].elements.slice(1));
        }

        // now add the joined selector - but only if it is not empty
        if (newJoinedSelector.elements.length !== 0) {
            newSelectorPath.push(newJoinedSelector);
        }

        //put together the parent selectors after the join (e.g. the rest of the parent)
        if (addPath.length > 1) {
            newSelectorPath = newSelectorPath.concat(addPath.slice(1));
        }
        return newSelectorPath;
    }

    // joins selector path from `beginningPath` with every selector path in `addPaths` array
    // `replacedElement` contains element that is being replaced by `addPath`
    // returns array with all concatenated paths
    function addAllReplacementsIntoPath( beginningPath, addPaths, replacedElement, originalSelector, result) {
        var j;
        for (j = 0; j < beginningPath.length; j++) {
            var newSelectorPath = addReplacementIntoPath(beginningPath[j], addPaths, replacedElement, originalSelector);
            result.push(newSelectorPath);
        }
        return result;
    }

    function mergeElementsOnToSelectors(elements, selectors) {
        var i, sel;

        if (elements.length === 0) {
            return ;
        }
        if (selectors.length === 0) {
            selectors.push([ new Selector(elements) ]);
            return;
        }

        for (i = 0; i < selectors.length; i++) {
            sel = selectors[i];

            // if the previous thing in sel is a parent this needs to join on to it
            if (sel.length > 0) {
                sel[sel.length - 1] = sel[sel.length - 1].createDerived(sel[sel.length - 1].elements.concat(elements));
            }
            else {
                sel.push(new Selector(elements));
            }
        }
    }

    // joinSelector code follows
    var i, newPaths, hadParentSelector;

    newPaths = [];
    hadParentSelector = replaceParentSelector(newPaths, context, selector);

    if (!hadParentSelector) {
        if (context.length > 0) {
            newPaths = [];
            for (i = 0; i < context.length; i++) {
                newPaths.push(context[i].concat(selector));
            }
        }
        else {
            newPaths = [[selector]];
        }
    }

    for (i = 0; i < newPaths.length; i++) {
        paths.push(newPaths[i]);
    }

};
module.exports = Ruleset;

},{"../contexts":10,"../functions/default":19,"./debug-info":51,"./element":55,"./node":67,"./paren":69,"./rule":71,"./selector":74}],74:[function(require,module,exports){
var Node = require("./node");

var Selector = function (elements, extendList, condition, index, currentFileInfo, isReferenced) {
    this.elements = elements;
    this.extendList = extendList;
    this.condition = condition;
    this.currentFileInfo = currentFileInfo || {};
    this.isReferenced = isReferenced;
    if (!condition) {
        this.evaldCondition = true;
    }
};
Selector.prototype = new Node();
Selector.prototype.type = "Selector";
Selector.prototype.accept = function (visitor) {
    if (this.elements) {
        this.elements = visitor.visitArray(this.elements);
    }
    if (this.extendList) {
        this.extendList = visitor.visitArray(this.extendList);
    }
    if (this.condition) {
        this.condition = visitor.visit(this.condition);
    }
};
Selector.prototype.createDerived = function(elements, extendList, evaldCondition) {
    evaldCondition = (evaldCondition != null) ? evaldCondition : this.evaldCondition;
    var newSelector = new Selector(elements, extendList || this.extendList, null, this.index, this.currentFileInfo, this.isReferenced);
    newSelector.evaldCondition = evaldCondition;
    newSelector.mediaEmpty = this.mediaEmpty;
    return newSelector;
};
Selector.prototype.match = function (other) {
    var elements = this.elements,
        len = elements.length,
        olen, i;

    other.CacheElements();

    olen = other._elements.length;
    if (olen === 0 || len < olen) {
        return 0;
    } else {
        for (i = 0; i < olen; i++) {
            if (elements[i].value !== other._elements[i]) {
                return 0;
            }
        }
    }

    return olen; // return number of matched elements
};
Selector.prototype.CacheElements = function() {
    if (this._elements) {
        return;
    }

    var elements = this.elements.map( function(v) {
        return v.combinator.value + (v.value.value || v.value);
    }).join("").match(/[,&#\*\.\w-]([\w-]|(\\.))*/g);

    if (elements) {
        if (elements[0] === "&") {
            elements.shift();
        }
    } else {
        elements = [];
    }

    this._elements = elements;
};
Selector.prototype.isJustParentSelector = function() {
    return !this.mediaEmpty &&
        this.elements.length === 1 &&
        this.elements[0].value === '&' &&
        (this.elements[0].combinator.value === ' ' || this.elements[0].combinator.value === '');
};
Selector.prototype.eval = function (context) {
    var evaldCondition = this.condition && this.condition.eval(context),
        elements = this.elements, extendList = this.extendList;

    elements = elements && elements.map(function (e) { return e.eval(context); });
    extendList = extendList && extendList.map(function(extend) { return extend.eval(context); });

    return this.createDerived(elements, extendList, evaldCondition);
};
Selector.prototype.genCSS = function (context, output) {
    var i, element;
    if ((!context || !context.firstSelector) && this.elements[0].combinator.value === "") {
        output.add(' ', this.currentFileInfo, this.index);
    }
    if (!this._css) {
        //TODO caching? speed comparison?
        for (i = 0; i < this.elements.length; i++) {
            element = this.elements[i];
            element.genCSS(context, output);
        }
    }
};
Selector.prototype.markReferenced = function () {
    this.isReferenced = true;
};
Selector.prototype.getIsReferenced = function() {
    return !this.currentFileInfo.reference || this.isReferenced;
};
Selector.prototype.getIsOutput = function() {
    return this.evaldCondition;
};
module.exports = Selector;

},{"./node":67}],75:[function(require,module,exports){
var Node = require("./node");

var UnicodeDescriptor = function (value) {
    this.value = value;
};
UnicodeDescriptor.prototype = new Node();
UnicodeDescriptor.prototype.type = "UnicodeDescriptor";

module.exports = UnicodeDescriptor;

},{"./node":67}],76:[function(require,module,exports){
var Node = require("./node"),
    unitConversions = require("../data/unit-conversions");

var Unit = function (numerator, denominator, backupUnit) {
    this.numerator = numerator ? numerator.slice(0).sort() : [];
    this.denominator = denominator ? denominator.slice(0).sort() : [];
    if (backupUnit) {
        this.backupUnit = backupUnit;
    } else if (numerator && numerator.length) {
        this.backupUnit = numerator[0];
    }
};

Unit.prototype = new Node();
Unit.prototype.type = "Unit";
Unit.prototype.clone = function () {
    return new Unit(this.numerator.slice(0), this.denominator.slice(0), this.backupUnit);
};
Unit.prototype.genCSS = function (context, output) {
    // Dimension checks the unit is singular and throws an error if in strict math mode.
    var strictUnits = context && context.strictUnits;
    if (this.numerator.length === 1) {
        output.add(this.numerator[0]); // the ideal situation
    } else if (!strictUnits && this.backupUnit) {
        output.add(this.backupUnit);
    } else if (!strictUnits && this.denominator.length) {
        output.add(this.denominator[0]);
    }
};
Unit.prototype.toString = function () {
    var i, returnStr = this.numerator.join("*");
    for (i = 0; i < this.denominator.length; i++) {
        returnStr += "/" + this.denominator[i];
    }
    return returnStr;
};
Unit.prototype.compare = function (other) {
    return this.is(other.toString()) ? 0 : undefined;
};
Unit.prototype.is = function (unitString) {
    return this.toString().toUpperCase() === unitString.toUpperCase();
};
Unit.prototype.isLength = function () {
    return Boolean(this.toCSS().match(/px|em|%|in|cm|mm|pc|pt|ex/));
};
Unit.prototype.isEmpty = function () {
    return this.numerator.length === 0 && this.denominator.length === 0;
};
Unit.prototype.isSingular = function() {
    return this.numerator.length <= 1 && this.denominator.length === 0;
};
Unit.prototype.map = function(callback) {
    var i;

    for (i = 0; i < this.numerator.length; i++) {
        this.numerator[i] = callback(this.numerator[i], false);
    }

    for (i = 0; i < this.denominator.length; i++) {
        this.denominator[i] = callback(this.denominator[i], true);
    }
};
Unit.prototype.usedUnits = function() {
    var group, result = {}, mapUnit;

    mapUnit = function (atomicUnit) {
        /*jshint loopfunc:true */
        if (group.hasOwnProperty(atomicUnit) && !result[groupName]) {
            result[groupName] = atomicUnit;
        }

        return atomicUnit;
    };

    for (var groupName in unitConversions) {
        if (unitConversions.hasOwnProperty(groupName)) {
            group = unitConversions[groupName];

            this.map(mapUnit);
        }
    }

    return result;
};
Unit.prototype.cancel = function () {
    var counter = {}, atomicUnit, i;

    for (i = 0; i < this.numerator.length; i++) {
        atomicUnit = this.numerator[i];
        counter[atomicUnit] = (counter[atomicUnit] || 0) + 1;
    }

    for (i = 0; i < this.denominator.length; i++) {
        atomicUnit = this.denominator[i];
        counter[atomicUnit] = (counter[atomicUnit] || 0) - 1;
    }

    this.numerator = [];
    this.denominator = [];

    for (atomicUnit in counter) {
        if (counter.hasOwnProperty(atomicUnit)) {
            var count = counter[atomicUnit];

            if (count > 0) {
                for (i = 0; i < count; i++) {
                    this.numerator.push(atomicUnit);
                }
            } else if (count < 0) {
                for (i = 0; i < -count; i++) {
                    this.denominator.push(atomicUnit);
                }
            }
        }
    }

    this.numerator.sort();
    this.denominator.sort();
};
module.exports = Unit;

},{"../data/unit-conversions":13,"./node":67}],77:[function(require,module,exports){
var Node = require("./node");

var URL = function (val, index, currentFileInfo, isEvald) {
    this.value = val;
    this.currentFileInfo = currentFileInfo;
    this.index = index;
    this.isEvald = isEvald;
};
URL.prototype = new Node();
URL.prototype.type = "Url";
URL.prototype.accept = function (visitor) {
    this.value = visitor.visit(this.value);
};
URL.prototype.genCSS = function (context, output) {
    output.add("url(");
    this.value.genCSS(context, output);
    output.add(")");
};
URL.prototype.eval = function (context) {
    var val = this.value.eval(context),
        rootpath;

    if (!this.isEvald) {
        // Add the base path if the URL is relative
        rootpath = this.currentFileInfo && this.currentFileInfo.rootpath;
        if (rootpath &&
            typeof val.value === "string" &&
            context.isPathRelative(val.value)) {

            if (!val.quote) {
                rootpath = rootpath.replace(/[\(\)'"\s]/g, function(match) { return "\\" + match; });
            }
            val.value = rootpath + val.value;
        }

        val.value = context.normalizePath(val.value);

        // Add url args if enabled
        if (context.urlArgs) {
            if (!val.value.match(/^\s*data:/)) {
                var delimiter = val.value.indexOf('?') === -1 ? '?' : '&';
                var urlArgs = delimiter + context.urlArgs;
                if (val.value.indexOf('#') !== -1) {
                    val.value = val.value.replace('#', urlArgs + '#');
                } else {
                    val.value += urlArgs;
                }
            }
        }
    }

    return new URL(val, this.index, this.currentFileInfo, true);
};
module.exports = URL;

},{"./node":67}],78:[function(require,module,exports){
var Node = require("./node");

var Value = function (value) {
    this.value = value;
    if (!value) {
        throw new Error("Value requires an array argument");
    }
};
Value.prototype = new Node();
Value.prototype.type = "Value";
Value.prototype.accept = function (visitor) {
    if (this.value) {
        this.value = visitor.visitArray(this.value);
    }
};
Value.prototype.eval = function (context) {
    if (this.value.length === 1) {
        return this.value[0].eval(context);
    } else {
        return new Value(this.value.map(function (v) {
            return v.eval(context);
        }));
    }
};
Value.prototype.genCSS = function (context, output) {
    var i;
    for (i = 0; i < this.value.length; i++) {
        this.value[i].genCSS(context, output);
        if (i + 1 < this.value.length) {
            output.add((context && context.compress) ? ',' : ', ');
        }
    }
};
module.exports = Value;

},{"./node":67}],79:[function(require,module,exports){
var Node = require("./node");

var Variable = function (name, index, currentFileInfo) {
    this.name = name;
    this.index = index;
    this.currentFileInfo = currentFileInfo || {};
};
Variable.prototype = new Node();
Variable.prototype.type = "Variable";
Variable.prototype.eval = function (context) {
    var variable, name = this.name;

    if (name.indexOf('@@') === 0) {
        name = '@' + new Variable(name.slice(1), this.index, this.currentFileInfo).eval(context).value;
    }

    if (this.evaluating) {
        throw { type: 'Name',
                message: "Recursive variable definition for " + name,
                filename: this.currentFileInfo.filename,
                index: this.index };
    }

    this.evaluating = true;

    variable = this.find(context.frames, function (frame) {
        var v = frame.variable(name);
        if (v) {
            if (v.important) {
                var importantScope = context.importantScope[context.importantScope.length - 1];
                importantScope.important = v.important;
            }
            return v.value.eval(context);
        }
    });
    if (variable) {
        this.evaluating = false;
        return variable;
    } else {
        throw { type: 'Name',
                message: "variable " + name + " is undefined",
                filename: this.currentFileInfo.filename,
                index: this.index };
    }
};
Variable.prototype.find = function (obj, fun) {
    for (var i = 0, r; i < obj.length; i++) {
        r = fun.call(obj, obj[i]);
        if (r) { return r; }
    }
    return null;
};
module.exports = Variable;

},{"./node":67}],80:[function(require,module,exports){
module.exports = {
    getLocation: function(index, inputStream) {
        var n = index + 1,
            line = null,
            column = -1;

        while (--n >= 0 && inputStream.charAt(n) !== '\n') {
            column++;
        }

        if (typeof index === 'number') {
            line = (inputStream.slice(0, index).match(/\n/g) || "").length;
        }

        return {
            line: line,
            column: column
        };
    }
};

},{}],81:[function(require,module,exports){
var tree = require("../tree"),
    Visitor = require("./visitor"),
    logger = require("../logger");

/*jshint loopfunc:true */

var ExtendFinderVisitor = function() {
    this._visitor = new Visitor(this);
    this.contexts = [];
    this.allExtendsStack = [[]];
};

ExtendFinderVisitor.prototype = {
    run: function (root) {
        root = this._visitor.visit(root);
        root.allExtends = this.allExtendsStack[0];
        return root;
    },
    visitRule: function (ruleNode, visitArgs) {
        visitArgs.visitDeeper = false;
    },
    visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
        visitArgs.visitDeeper = false;
    },
    visitRuleset: function (rulesetNode, visitArgs) {
        if (rulesetNode.root) {
            return;
        }

        var i, j, extend, allSelectorsExtendList = [], extendList;

        // get &:extend(.a); rules which apply to all selectors in this ruleset
        var rules = rulesetNode.rules, ruleCnt = rules ? rules.length : 0;
        for (i = 0; i < ruleCnt; i++) {
            if (rulesetNode.rules[i] instanceof tree.Extend) {
                allSelectorsExtendList.push(rules[i]);
                rulesetNode.extendOnEveryPath = true;
            }
        }

        // now find every selector and apply the extends that apply to all extends
        // and the ones which apply to an individual extend
        var paths = rulesetNode.paths;
        for (i = 0; i < paths.length; i++) {
            var selectorPath = paths[i],
                selector = selectorPath[selectorPath.length - 1],
                selExtendList = selector.extendList;

            extendList = selExtendList ? selExtendList.slice(0).concat(allSelectorsExtendList)
                                       : allSelectorsExtendList;

            if (extendList) {
                extendList = extendList.map(function(allSelectorsExtend) {
                    return allSelectorsExtend.clone();
                });
            }

            for (j = 0; j < extendList.length; j++) {
                this.foundExtends = true;
                extend = extendList[j];
                extend.findSelfSelectors(selectorPath);
                extend.ruleset = rulesetNode;
                if (j === 0) { extend.firstExtendOnThisSelectorPath = true; }
                this.allExtendsStack[this.allExtendsStack.length - 1].push(extend);
            }
        }

        this.contexts.push(rulesetNode.selectors);
    },
    visitRulesetOut: function (rulesetNode) {
        if (!rulesetNode.root) {
            this.contexts.length = this.contexts.length - 1;
        }
    },
    visitMedia: function (mediaNode, visitArgs) {
        mediaNode.allExtends = [];
        this.allExtendsStack.push(mediaNode.allExtends);
    },
    visitMediaOut: function (mediaNode) {
        this.allExtendsStack.length = this.allExtendsStack.length - 1;
    },
    visitDirective: function (directiveNode, visitArgs) {
        directiveNode.allExtends = [];
        this.allExtendsStack.push(directiveNode.allExtends);
    },
    visitDirectiveOut: function (directiveNode) {
        this.allExtendsStack.length = this.allExtendsStack.length - 1;
    }
};

var ProcessExtendsVisitor = function() {
    this._visitor = new Visitor(this);
};

ProcessExtendsVisitor.prototype = {
    run: function(root) {
        var extendFinder = new ExtendFinderVisitor();
        this.extendIndicies = {};
        extendFinder.run(root);
        if (!extendFinder.foundExtends) { return root; }
        root.allExtends = root.allExtends.concat(this.doExtendChaining(root.allExtends, root.allExtends));
        this.allExtendsStack = [root.allExtends];
        var newRoot = this._visitor.visit(root);
        this.checkExtendsForNonMatched(root.allExtends);
        return newRoot;
    },
    checkExtendsForNonMatched: function(extendList) {
        var indicies = this.extendIndicies;
        extendList.filter(function(extend) {
            return !extend.hasFoundMatches && extend.parent_ids.length == 1;
        }).forEach(function(extend) {
                var selector = "_unknown_";
                try {
                    selector = extend.selector.toCSS({});
                }
                catch(_) {}

                if (!indicies[extend.index + ' ' + selector]) {
                    indicies[extend.index + ' ' + selector] = true;
                    logger.warn("extend '" + selector + "' has no matches");
                }
            });
    },
    doExtendChaining: function (extendsList, extendsListTarget, iterationCount) {
        //
        // chaining is different from normal extension.. if we extend an extend then we are not just copying, altering
        // and pasting the selector we would do normally, but we are also adding an extend with the same target selector
        // this means this new extend can then go and alter other extends
        //
        // this method deals with all the chaining work - without it, extend is flat and doesn't work on other extend selectors
        // this is also the most expensive.. and a match on one selector can cause an extension of a selector we had already
        // processed if we look at each selector at a time, as is done in visitRuleset

        var extendIndex, targetExtendIndex, matches, extendsToAdd = [], newSelector, extendVisitor = this, selectorPath,
            extend, targetExtend, newExtend;

        iterationCount = iterationCount || 0;

        //loop through comparing every extend with every target extend.
        // a target extend is the one on the ruleset we are looking at copy/edit/pasting in place
        // e.g.  .a:extend(.b) {}  and .b:extend(.c) {} then the first extend extends the second one
        // and the second is the target.
        // the seperation into two lists allows us to process a subset of chains with a bigger set, as is the
        // case when processing media queries
        for (extendIndex = 0; extendIndex < extendsList.length; extendIndex++) {
            for (targetExtendIndex = 0; targetExtendIndex < extendsListTarget.length; targetExtendIndex++) {

                extend = extendsList[extendIndex];
                targetExtend = extendsListTarget[targetExtendIndex];

                // look for circular references
                if ( extend.parent_ids.indexOf( targetExtend.object_id ) >= 0 ) { continue; }

                // find a match in the target extends self selector (the bit before :extend)
                selectorPath = [targetExtend.selfSelectors[0]];
                matches = extendVisitor.findMatch(extend, selectorPath);

                if (matches.length) {

                    extend.hasFoundMatches = true;

                    // we found a match, so for each self selector..
                    extend.selfSelectors.forEach(function(selfSelector) {

                        // process the extend as usual
                        newSelector = extendVisitor.extendSelector(matches, selectorPath, selfSelector);

                        // but now we create a new extend from it
                        newExtend = new(tree.Extend)(targetExtend.selector, targetExtend.option, 0);
                        newExtend.selfSelectors = newSelector;

                        // add the extend onto the list of extends for that selector
                        newSelector[newSelector.length - 1].extendList = [newExtend];

                        // record that we need to add it.
                        extendsToAdd.push(newExtend);
                        newExtend.ruleset = targetExtend.ruleset;

                        //remember its parents for circular references
                        newExtend.parent_ids = newExtend.parent_ids.concat(targetExtend.parent_ids, extend.parent_ids);

                        // only process the selector once.. if we have :extend(.a,.b) then multiple
                        // extends will look at the same selector path, so when extending
                        // we know that any others will be duplicates in terms of what is added to the css
                        if (targetExtend.firstExtendOnThisSelectorPath) {
                            newExtend.firstExtendOnThisSelectorPath = true;
                            targetExtend.ruleset.paths.push(newSelector);
                        }
                    });
                }
            }
        }

        if (extendsToAdd.length) {
            // try to detect circular references to stop a stack overflow.
            // may no longer be needed.
            this.extendChainCount++;
            if (iterationCount > 100) {
                var selectorOne = "{unable to calculate}";
                var selectorTwo = "{unable to calculate}";
                try
                {
                    selectorOne = extendsToAdd[0].selfSelectors[0].toCSS();
                    selectorTwo = extendsToAdd[0].selector.toCSS();
                }
                catch(e) {}
                throw { message: "extend circular reference detected. One of the circular extends is currently:" +
                    selectorOne + ":extend(" + selectorTwo + ")"};
            }

            // now process the new extends on the existing rules so that we can handle a extending b extending c extending
            // d extending e...
            return extendsToAdd.concat(extendVisitor.doExtendChaining(extendsToAdd, extendsListTarget, iterationCount + 1));
        } else {
            return extendsToAdd;
        }
    },
    visitRule: function (ruleNode, visitArgs) {
        visitArgs.visitDeeper = false;
    },
    visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
        visitArgs.visitDeeper = false;
    },
    visitSelector: function (selectorNode, visitArgs) {
        visitArgs.visitDeeper = false;
    },
    visitRuleset: function (rulesetNode, visitArgs) {
        if (rulesetNode.root) {
            return;
        }
        var matches, pathIndex, extendIndex, allExtends = this.allExtendsStack[this.allExtendsStack.length - 1],
            selectorsToAdd = [], extendVisitor = this, selectorPath;

        // look at each selector path in the ruleset, find any extend matches and then copy, find and replace

        for (extendIndex = 0; extendIndex < allExtends.length; extendIndex++) {
            for (pathIndex = 0; pathIndex < rulesetNode.paths.length; pathIndex++) {
                selectorPath = rulesetNode.paths[pathIndex];

                // extending extends happens initially, before the main pass
                if (rulesetNode.extendOnEveryPath) { continue; }
                var extendList = selectorPath[selectorPath.length - 1].extendList;
                if (extendList && extendList.length) { continue; }

                matches = this.findMatch(allExtends[extendIndex], selectorPath);

                if (matches.length) {
                    allExtends[extendIndex].hasFoundMatches = true;

                    allExtends[extendIndex].selfSelectors.forEach(function(selfSelector) {
                        selectorsToAdd.push(extendVisitor.extendSelector(matches, selectorPath, selfSelector));
                    });
                }
            }
        }
        rulesetNode.paths = rulesetNode.paths.concat(selectorsToAdd);
    },
    findMatch: function (extend, haystackSelectorPath) {
        //
        // look through the haystack selector path to try and find the needle - extend.selector
        // returns an array of selector matches that can then be replaced
        //
        var haystackSelectorIndex, hackstackSelector, hackstackElementIndex, haystackElement,
            targetCombinator, i,
            extendVisitor = this,
            needleElements = extend.selector.elements,
            potentialMatches = [], potentialMatch, matches = [];

        // loop through the haystack elements
        for (haystackSelectorIndex = 0; haystackSelectorIndex < haystackSelectorPath.length; haystackSelectorIndex++) {
            hackstackSelector = haystackSelectorPath[haystackSelectorIndex];

            for (hackstackElementIndex = 0; hackstackElementIndex < hackstackSelector.elements.length; hackstackElementIndex++) {

                haystackElement = hackstackSelector.elements[hackstackElementIndex];

                // if we allow elements before our match we can add a potential match every time. otherwise only at the first element.
                if (extend.allowBefore || (haystackSelectorIndex === 0 && hackstackElementIndex === 0)) {
                    potentialMatches.push({pathIndex: haystackSelectorIndex, index: hackstackElementIndex, matched: 0,
                        initialCombinator: haystackElement.combinator});
                }

                for (i = 0; i < potentialMatches.length; i++) {
                    potentialMatch = potentialMatches[i];

                    // selectors add " " onto the first element. When we use & it joins the selectors together, but if we don't
                    // then each selector in haystackSelectorPath has a space before it added in the toCSS phase. so we need to
                    // work out what the resulting combinator will be
                    targetCombinator = haystackElement.combinator.value;
                    if (targetCombinator === '' && hackstackElementIndex === 0) {
                        targetCombinator = ' ';
                    }

                    // if we don't match, null our match to indicate failure
                    if (!extendVisitor.isElementValuesEqual(needleElements[potentialMatch.matched].value, haystackElement.value) ||
                        (potentialMatch.matched > 0 && needleElements[potentialMatch.matched].combinator.value !== targetCombinator)) {
                        potentialMatch = null;
                    } else {
                        potentialMatch.matched++;
                    }

                    // if we are still valid and have finished, test whether we have elements after and whether these are allowed
                    if (potentialMatch) {
                        potentialMatch.finished = potentialMatch.matched === needleElements.length;
                        if (potentialMatch.finished &&
                            (!extend.allowAfter &&
                                (hackstackElementIndex + 1 < hackstackSelector.elements.length || haystackSelectorIndex + 1 < haystackSelectorPath.length))) {
                            potentialMatch = null;
                        }
                    }
                    // if null we remove, if not, we are still valid, so either push as a valid match or continue
                    if (potentialMatch) {
                        if (potentialMatch.finished) {
                            potentialMatch.length = needleElements.length;
                            potentialMatch.endPathIndex = haystackSelectorIndex;
                            potentialMatch.endPathElementIndex = hackstackElementIndex + 1; // index after end of match
                            potentialMatches.length = 0; // we don't allow matches to overlap, so start matching again
                            matches.push(potentialMatch);
                        }
                    } else {
                        potentialMatches.splice(i, 1);
                        i--;
                    }
                }
            }
        }
        return matches;
    },
    isElementValuesEqual: function(elementValue1, elementValue2) {
        if (typeof elementValue1 === "string" || typeof elementValue2 === "string") {
            return elementValue1 === elementValue2;
        }
        if (elementValue1 instanceof tree.Attribute) {
            if (elementValue1.op !== elementValue2.op || elementValue1.key !== elementValue2.key) {
                return false;
            }
            if (!elementValue1.value || !elementValue2.value) {
                if (elementValue1.value || elementValue2.value) {
                    return false;
                }
                return true;
            }
            elementValue1 = elementValue1.value.value || elementValue1.value;
            elementValue2 = elementValue2.value.value || elementValue2.value;
            return elementValue1 === elementValue2;
        }
        elementValue1 = elementValue1.value;
        elementValue2 = elementValue2.value;
        if (elementValue1 instanceof tree.Selector) {
            if (!(elementValue2 instanceof tree.Selector) || elementValue1.elements.length !== elementValue2.elements.length) {
                return false;
            }
            for (var i = 0; i  < elementValue1.elements.length; i++) {
                if (elementValue1.elements[i].combinator.value !== elementValue2.elements[i].combinator.value) {
                    if (i !== 0 || (elementValue1.elements[i].combinator.value || ' ') !== (elementValue2.elements[i].combinator.value || ' ')) {
                        return false;
                    }
                }
                if (!this.isElementValuesEqual(elementValue1.elements[i].value, elementValue2.elements[i].value)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    extendSelector:function (matches, selectorPath, replacementSelector) {

        //for a set of matches, replace each match with the replacement selector

        var currentSelectorPathIndex = 0,
            currentSelectorPathElementIndex = 0,
            path = [],
            matchIndex,
            selector,
            firstElement,
            match,
            newElements;

        for (matchIndex = 0; matchIndex < matches.length; matchIndex++) {
            match = matches[matchIndex];
            selector = selectorPath[match.pathIndex];
            firstElement = new tree.Element(
                match.initialCombinator,
                replacementSelector.elements[0].value,
                replacementSelector.elements[0].index,
                replacementSelector.elements[0].currentFileInfo
            );

            if (match.pathIndex > currentSelectorPathIndex && currentSelectorPathElementIndex > 0) {
                path[path.length - 1].elements = path[path.length - 1]
                    .elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
                currentSelectorPathElementIndex = 0;
                currentSelectorPathIndex++;
            }

            newElements = selector.elements
                .slice(currentSelectorPathElementIndex, match.index)
                .concat([firstElement])
                .concat(replacementSelector.elements.slice(1));

            if (currentSelectorPathIndex === match.pathIndex && matchIndex > 0) {
                path[path.length - 1].elements =
                    path[path.length - 1].elements.concat(newElements);
            } else {
                path = path.concat(selectorPath.slice(currentSelectorPathIndex, match.pathIndex));

                path.push(new tree.Selector(
                    newElements
                ));
            }
            currentSelectorPathIndex = match.endPathIndex;
            currentSelectorPathElementIndex = match.endPathElementIndex;
            if (currentSelectorPathElementIndex >= selectorPath[currentSelectorPathIndex].elements.length) {
                currentSelectorPathElementIndex = 0;
                currentSelectorPathIndex++;
            }
        }

        if (currentSelectorPathIndex < selectorPath.length && currentSelectorPathElementIndex > 0) {
            path[path.length - 1].elements = path[path.length - 1]
                .elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
            currentSelectorPathIndex++;
        }

        path = path.concat(selectorPath.slice(currentSelectorPathIndex, selectorPath.length));

        return path;
    },
    visitRulesetOut: function (rulesetNode) {
    },
    visitMedia: function (mediaNode, visitArgs) {
        var newAllExtends = mediaNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
        newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, mediaNode.allExtends));
        this.allExtendsStack.push(newAllExtends);
    },
    visitMediaOut: function (mediaNode) {
        var lastIndex = this.allExtendsStack.length - 1;
        this.checkExtendsForNonMatched(this.allExtendsStack[lastIndex]);
        this.allExtendsStack.length = lastIndex;
    },
    visitDirective: function (directiveNode, visitArgs) {
        var newAllExtends = directiveNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
        newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, directiveNode.allExtends));
        this.allExtendsStack.push(newAllExtends);
    },
    visitDirectiveOut: function (directiveNode) {
        var lastIndex = this.allExtendsStack.length - 1;
        this.checkExtendsForNonMatched(this.allExtendsStack[lastIndex]);
        this.allExtendsStack.length = lastIndex;
    }
};

module.exports = ProcessExtendsVisitor;

},{"../logger":31,"../tree":59,"./visitor":87}],82:[function(require,module,exports){
function ImportSequencer(onSequencerEmpty) {
    this.imports = [];
    this.variableImports = [];
    this._onSequencerEmpty = onSequencerEmpty;
    this._currentDepth = 0;
}

ImportSequencer.prototype.addImport = function(callback) {
    var importSequencer = this,
        importItem = {
            callback: callback,
            args: null,
            isReady: false
        };
    this.imports.push(importItem);
    return function() {
        importItem.args = Array.prototype.slice.call(arguments, 0);
        importItem.isReady = true;
        importSequencer.tryRun();
    };
};

ImportSequencer.prototype.addVariableImport = function(callback) {
    this.variableImports.push(callback);
};

ImportSequencer.prototype.tryRun = function() {
    this._currentDepth++;
    try {
        while (true) {
            while (this.imports.length > 0) {
                var importItem = this.imports[0];
                if (!importItem.isReady) {
                    return;
                }
                this.imports = this.imports.slice(1);
                importItem.callback.apply(null, importItem.args);
            }
            if (this.variableImports.length === 0) {
                break;
            }
            var variableImport = this.variableImports[0];
            this.variableImports = this.variableImports.slice(1);
            variableImport();
        }
    } finally {
        this._currentDepth--;
    }
    if (this._currentDepth === 0 && this._onSequencerEmpty) {
        this._onSequencerEmpty();
    }
};

module.exports = ImportSequencer;

},{}],83:[function(require,module,exports){
var contexts = require("../contexts"),
    Visitor = require("./visitor"),
    ImportSequencer = require("./import-sequencer");

var ImportVisitor = function(importer, finish) {

    this._visitor = new Visitor(this);
    this._importer = importer;
    this._finish = finish;
    this.context = new contexts.Eval();
    this.importCount = 0;
    this.onceFileDetectionMap = {};
    this.recursionDetector = {};
    this._sequencer = new ImportSequencer(this._onSequencerEmpty.bind(this));
};

ImportVisitor.prototype = {
    isReplacing: false,
    run: function (root) {
        try {
            // process the contents
            this._visitor.visit(root);
        }
        catch(e) {
            this.error = e;
        }

        this.isFinished = true;
        this._sequencer.tryRun();
    },
    _onSequencerEmpty: function() {
        if (!this.isFinished) {
            return;
        }
        this._finish(this.error);
    },
    visitImport: function (importNode, visitArgs) {
        var inlineCSS = importNode.options.inline;

        if (!importNode.css || inlineCSS) {

            var context = new contexts.Eval(this.context, this.context.frames.slice(0));
            var importParent = context.frames[0];

            this.importCount++;
            if (importNode.isVariableImport()) {
                this._sequencer.addVariableImport(this.processImportNode.bind(this, importNode, context, importParent));
            } else {
                this.processImportNode(importNode, context, importParent);
            }
        }
        visitArgs.visitDeeper = false;
    },
    processImportNode: function(importNode, context, importParent) {
        var evaldImportNode,
            inlineCSS = importNode.options.inline;

        try {
            evaldImportNode = importNode.evalForImport(context);
        } catch(e) {
            if (!e.filename) { e.index = importNode.index; e.filename = importNode.currentFileInfo.filename; }
            // attempt to eval properly and treat as css
            importNode.css = true;
            // if that fails, this error will be thrown
            importNode.error = e;
        }

        if (evaldImportNode && (!evaldImportNode.css || inlineCSS)) {

            if (evaldImportNode.options.multiple) {
                context.importMultiple = true;
            }

            // try appending if we haven't determined if it is css or not
            var tryAppendLessExtension = evaldImportNode.css === undefined;

            for (var i = 0; i < importParent.rules.length; i++) {
                if (importParent.rules[i] === importNode) {
                    importParent.rules[i] = evaldImportNode;
                    break;
                }
            }

            var onImported = this.onImported.bind(this, evaldImportNode, context),
                sequencedOnImported = this._sequencer.addImport(onImported);

            this._importer.push(evaldImportNode.getPath(), tryAppendLessExtension, evaldImportNode.currentFileInfo,
                evaldImportNode.options, sequencedOnImported);
        } else {
            this.importCount--;
            if (this.isFinished) {
                this._sequencer.tryRun();
            }
        }
    },
    onImported: function (importNode, context, e, root, importedAtRoot, fullPath) {
        if (e) {
            if (!e.filename) {
                e.index = importNode.index; e.filename = importNode.currentFileInfo.filename;
            }
            this.error = e;
        }

        var importVisitor = this,
            inlineCSS = importNode.options.inline,
            duplicateImport = importedAtRoot || fullPath in importVisitor.recursionDetector;

        if (!context.importMultiple) {
            if (duplicateImport) {
                importNode.skip = true;
            } else {
                importNode.skip = function() {
                    if (fullPath in importVisitor.onceFileDetectionMap) {
                        return true;
                    }
                    importVisitor.onceFileDetectionMap[fullPath] = true;
                    return false;
                };
            }
        }

        if (root) {
            importNode.root = root;
            importNode.importedFilename = fullPath;

            if (!inlineCSS && (context.importMultiple || !duplicateImport)) {
                importVisitor.recursionDetector[fullPath] = true;

                var oldContext = this.context;
                this.context = context;
                try {
                    this._visitor.visit(root);
                } catch (e) {
                    this.error = e;
                }
                this.context = oldContext;
            }
        }

        importVisitor.importCount--;

        if (importVisitor.isFinished) {
            importVisitor._sequencer.tryRun();
        }
    },
    visitRule: function (ruleNode, visitArgs) {
        visitArgs.visitDeeper = false;
    },
    visitDirective: function (directiveNode, visitArgs) {
        this.context.frames.unshift(directiveNode);
    },
    visitDirectiveOut: function (directiveNode) {
        this.context.frames.shift();
    },
    visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
        this.context.frames.unshift(mixinDefinitionNode);
    },
    visitMixinDefinitionOut: function (mixinDefinitionNode) {
        this.context.frames.shift();
    },
    visitRuleset: function (rulesetNode, visitArgs) {
        this.context.frames.unshift(rulesetNode);
    },
    visitRulesetOut: function (rulesetNode) {
        this.context.frames.shift();
    },
    visitMedia: function (mediaNode, visitArgs) {
        this.context.frames.unshift(mediaNode.rules[0]);
    },
    visitMediaOut: function (mediaNode) {
        this.context.frames.shift();
    }
};
module.exports = ImportVisitor;

},{"../contexts":10,"./import-sequencer":82,"./visitor":87}],84:[function(require,module,exports){
var visitors = {
    Visitor: require("./visitor"),
    ImportVisitor: require('./import-visitor'),
    ExtendVisitor: require('./extend-visitor'),
    JoinSelectorVisitor: require('./join-selector-visitor'),
    ToCSSVisitor: require('./to-css-visitor')
};

module.exports = visitors;

},{"./extend-visitor":81,"./import-visitor":83,"./join-selector-visitor":85,"./to-css-visitor":86,"./visitor":87}],85:[function(require,module,exports){
var Visitor = require("./visitor");

var JoinSelectorVisitor = function() {
    this.contexts = [[]];
    this._visitor = new Visitor(this);
};

JoinSelectorVisitor.prototype = {
    run: function (root) {
        return this._visitor.visit(root);
    },
    visitRule: function (ruleNode, visitArgs) {
        visitArgs.visitDeeper = false;
    },
    visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
        visitArgs.visitDeeper = false;
    },

    visitRuleset: function (rulesetNode, visitArgs) {
        var context = this.contexts[this.contexts.length - 1],
            paths = [], selectors;

        this.contexts.push(paths);

        if (! rulesetNode.root) {
            selectors = rulesetNode.selectors;
            if (selectors) {
                selectors = selectors.filter(function(selector) { return selector.getIsOutput(); });
                rulesetNode.selectors = selectors.length ? selectors : (selectors = null);
                if (selectors) { rulesetNode.joinSelectors(paths, context, selectors); }
            }
            if (!selectors) { rulesetNode.rules = null; }
            rulesetNode.paths = paths;
        }
    },
    visitRulesetOut: function (rulesetNode) {
        this.contexts.length = this.contexts.length - 1;
    },
    visitMedia: function (mediaNode, visitArgs) {
        var context = this.contexts[this.contexts.length - 1];
        mediaNode.rules[0].root = (context.length === 0 || context[0].multiMedia);
    }
};

module.exports = JoinSelectorVisitor;

},{"./visitor":87}],86:[function(require,module,exports){
var tree = require("../tree"),
    Visitor = require("./visitor");

var ToCSSVisitor = function(context) {
    this._visitor = new Visitor(this);
    this._context = context;
};

ToCSSVisitor.prototype = {
    isReplacing: true,
    run: function (root) {
        return this._visitor.visit(root);
    },

    visitRule: function (ruleNode, visitArgs) {
        if (ruleNode.variable) {
            return;
        }
        return ruleNode;
    },

    visitMixinDefinition: function (mixinNode, visitArgs) {
        // mixin definitions do not get eval'd - this means they keep state
        // so we have to clear that state here so it isn't used if toCSS is called twice
        mixinNode.frames = [];
    },

    visitExtend: function (extendNode, visitArgs) {
    },

    visitComment: function (commentNode, visitArgs) {
        if (commentNode.isSilent(this._context)) {
            return;
        }
        return commentNode;
    },

    visitMedia: function(mediaNode, visitArgs) {
        mediaNode.accept(this._visitor);
        visitArgs.visitDeeper = false;

        if (!mediaNode.rules.length) {
            return;
        }
        return mediaNode;
    },

    visitDirective: function(directiveNode, visitArgs) {
        if (directiveNode.name === "@charset") {
            if (!directiveNode.getIsReferenced()) {
                return;
            }
            // Only output the debug info together with subsequent @charset definitions
            // a comment (or @media statement) before the actual @charset directive would
            // be considered illegal css as it has to be on the first line
            if (this.charset) {
                if (directiveNode.debugInfo) {
                    var comment = new tree.Comment("/* " + directiveNode.toCSS(this._context).replace(/\n/g, "") + " */\n");
                    comment.debugInfo = directiveNode.debugInfo;
                    return this._visitor.visit(comment);
                }
                return;
            }
            this.charset = true;
        }
        if (directiveNode.rules && directiveNode.rules.rules) {
            this._mergeRules(directiveNode.rules.rules);
            //process childs
            directiveNode.accept(this._visitor);
            visitArgs.visitDeeper = false;

            // the directive was directly referenced and therefore needs to be shown in the output
            if (directiveNode.getIsReferenced()) {
                return directiveNode;
            }

            if (!directiveNode.rules.rules) {
                return ;
            }

            //the directive was not directly referenced
            for (var r = 0; r < directiveNode.rules.rules.length; r++) {
                var rule = directiveNode.rules.rules[r];
                if (rule.getIsReferenced && rule.getIsReferenced()) {
                    //the directive contains something that was referenced (likely by extend)
                    //therefore it needs to be shown in output too

                    //marking as referenced in case the directive is stored inside another directive
                    directiveNode.markReferenced();
                    return directiveNode;
                }
            }
            //The directive was not directly referenced and does not contain anything that
            //was referenced. Therefore it must not be shown in output.
            return ;
        } else {
            if (!directiveNode.getIsReferenced()) {
                return;
            }
        }
        return directiveNode;
    },

    checkPropertiesInRoot: function(rules) {
        var ruleNode;
        for (var i = 0; i < rules.length; i++) {
            ruleNode = rules[i];
            if (ruleNode instanceof tree.Rule && !ruleNode.variable) {
                throw { message: "properties must be inside selector blocks, they cannot be in the root.",
                    index: ruleNode.index, filename: ruleNode.currentFileInfo ? ruleNode.currentFileInfo.filename : null};
            }
        }
    },

    visitRuleset: function (rulesetNode, visitArgs) {
        var rule, rulesets = [];
        if (rulesetNode.firstRoot) {
            this.checkPropertiesInRoot(rulesetNode.rules);
        }
        if (! rulesetNode.root) {
            if (rulesetNode.paths) {
                rulesetNode.paths = rulesetNode.paths
                    .filter(function(p) {
                        var i;
                        if (p[0].elements[0].combinator.value === ' ') {
                            p[0].elements[0].combinator = new(tree.Combinator)('');
                        }
                        for (i = 0; i < p.length; i++) {
                            if (p[i].getIsReferenced() && p[i].getIsOutput()) {
                                return true;
                            }
                        }
                        return false;
                    });
            }

            // Compile rules and rulesets
            var nodeRules = rulesetNode.rules, nodeRuleCnt = nodeRules ? nodeRules.length : 0;
            for (var i = 0; i < nodeRuleCnt; ) {
                rule = nodeRules[i];
                if (rule && rule.rules) {
                    // visit because we are moving them out from being a child
                    rulesets.push(this._visitor.visit(rule));
                    nodeRules.splice(i, 1);
                    nodeRuleCnt--;
                    continue;
                }
                i++;
            }
            // accept the visitor to remove rules and refactor itself
            // then we can decide now whether we want it or not
            if (nodeRuleCnt > 0) {
                rulesetNode.accept(this._visitor);
            } else {
                rulesetNode.rules = null;
            }
            visitArgs.visitDeeper = false;

            nodeRules = rulesetNode.rules;
            if (nodeRules) {
                this._mergeRules(nodeRules);
                nodeRules = rulesetNode.rules;
            }
            if (nodeRules) {
                this._removeDuplicateRules(nodeRules);
                nodeRules = rulesetNode.rules;
            }

            // now decide whether we keep the ruleset
            if (nodeRules && nodeRules.length > 0 && rulesetNode.paths.length > 0) {
                rulesets.splice(0, 0, rulesetNode);
            }
        } else {
            rulesetNode.accept(this._visitor);
            visitArgs.visitDeeper = false;
            if (rulesetNode.firstRoot || (rulesetNode.rules && rulesetNode.rules.length > 0)) {
                rulesets.splice(0, 0, rulesetNode);
            }
        }
        if (rulesets.length === 1) {
            return rulesets[0];
        }
        return rulesets;
    },

    _removeDuplicateRules: function(rules) {
        if (!rules) { return; }

        // remove duplicates
        var ruleCache = {},
            ruleList, rule, i;

        for (i = rules.length - 1; i >= 0 ; i--) {
            rule = rules[i];
            if (rule instanceof tree.Rule) {
                if (!ruleCache[rule.name]) {
                    ruleCache[rule.name] = rule;
                } else {
                    ruleList = ruleCache[rule.name];
                    if (ruleList instanceof tree.Rule) {
                        ruleList = ruleCache[rule.name] = [ruleCache[rule.name].toCSS(this._context)];
                    }
                    var ruleCSS = rule.toCSS(this._context);
                    if (ruleList.indexOf(ruleCSS) !== -1) {
                        rules.splice(i, 1);
                    } else {
                        ruleList.push(ruleCSS);
                    }
                }
            }
        }
    },

    _mergeRules: function (rules) {
        if (!rules) { return; }

        var groups = {},
            parts,
            rule,
            key;

        for (var i = 0; i < rules.length; i++) {
            rule = rules[i];

            if ((rule instanceof tree.Rule) && rule.merge) {
                key = [rule.name,
                    rule.important ? "!" : ""].join(",");

                if (!groups[key]) {
                    groups[key] = [];
                } else {
                    rules.splice(i--, 1);
                }

                groups[key].push(rule);
            }
        }

        Object.keys(groups).map(function (k) {

            function toExpression(values) {
                return new (tree.Expression)(values.map(function (p) {
                    return p.value;
                }));
            }

            function toValue(values) {
                return new (tree.Value)(values.map(function (p) {
                    return p;
                }));
            }

            parts = groups[k];

            if (parts.length > 1) {
                rule = parts[0];
                var spacedGroups = [];
                var lastSpacedGroup = [];
                parts.map(function (p) {
                    if (p.merge === "+") {
                        if (lastSpacedGroup.length > 0) {
                            spacedGroups.push(toExpression(lastSpacedGroup));
                        }
                        lastSpacedGroup = [];
                    }
                    lastSpacedGroup.push(p);
                });
                spacedGroups.push(toExpression(lastSpacedGroup));
                rule.value = toValue(spacedGroups);
            }
        });
    }
};

module.exports = ToCSSVisitor;

},{"../tree":59,"./visitor":87}],87:[function(require,module,exports){
var tree = require("../tree");

var _visitArgs = { visitDeeper: true },
    _hasIndexed = false;

function _noop(node) {
    return node;
}

function indexNodeTypes(parent, ticker) {
    // add .typeIndex to tree node types for lookup table
    var key, child;
    for (key in parent) {
        if (parent.hasOwnProperty(key)) {
            child = parent[key];
            switch (typeof child) {
                case "function":
                    // ignore bound functions directly on tree which do not have a prototype
                    // or aren't nodes
                    if (child.prototype && child.prototype.type) {
                        child.prototype.typeIndex = ticker++;
                    }
                    break;
                case "object":
                    ticker = indexNodeTypes(child, ticker);
                    break;
            }
        }
    }
    return ticker;
}

var Visitor = function(implementation) {
    this._implementation = implementation;
    this._visitFnCache = [];

    if (!_hasIndexed) {
        indexNodeTypes(tree, 1);
        _hasIndexed = true;
    }
};

Visitor.prototype = {
    visit: function(node) {
        if (!node) {
            return node;
        }

        var nodeTypeIndex = node.typeIndex;
        if (!nodeTypeIndex) {
            return node;
        }

        var visitFnCache = this._visitFnCache,
            impl = this._implementation,
            aryIndx = nodeTypeIndex << 1,
            outAryIndex = aryIndx | 1,
            func = visitFnCache[aryIndx],
            funcOut = visitFnCache[outAryIndex],
            visitArgs = _visitArgs,
            fnName;

        visitArgs.visitDeeper = true;

        if (!func) {
            fnName = "visit" + node.type;
            func = impl[fnName] || _noop;
            funcOut = impl[fnName + "Out"] || _noop;
            visitFnCache[aryIndx] = func;
            visitFnCache[outAryIndex] = funcOut;
        }

        if (func !== _noop) {
            var newNode = func.call(impl, node, visitArgs);
            if (impl.isReplacing) {
                node = newNode;
            }
        }

        if (visitArgs.visitDeeper && node && node.accept) {
            node.accept(this);
        }

        if (funcOut != _noop) {
            funcOut.call(impl, node);
        }

        return node;
    },
    visitArray: function(nodes, nonReplacing) {
        if (!nodes) {
            return nodes;
        }

        var cnt = nodes.length, i;

        // Non-replacing
        if (nonReplacing || !this._implementation.isReplacing) {
            for (i = 0; i < cnt; i++) {
                this.visit(nodes[i]);
            }
            return nodes;
        }

        // Replacing
        var out = [];
        for (i = 0; i < cnt; i++) {
            var evald = this.visit(nodes[i]);
            if (evald === undefined) { continue; }
            if (!evald.splice) {
                out.push(evald);
            } else if (evald.length) {
                this.flatten(evald, out);
            }
        }
        return out;
    },
    flatten: function(arr, out) {
        if (!out) {
            out = [];
        }

        var cnt, i, item,
            nestedCnt, j, nestedItem;

        for (i = 0, cnt = arr.length; i < cnt; i++) {
            item = arr[i];
            if (item === undefined) {
                continue;
            }
            if (!item.splice) {
                out.push(item);
                continue;
            }

            for (j = 0, nestedCnt = item.length; j < nestedCnt; j++) {
                nestedItem = item[j];
                if (nestedItem === undefined) {
                    continue;
                }
                if (!nestedItem.splice) {
                    out.push(nestedItem);
                } else if (nestedItem.length) {
                    this.flatten(nestedItem, out);
                }
            }
        }

        return out;
    }
};
module.exports = Visitor;

},{"../tree":59}],88:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],89:[function(require,module,exports){
'use strict';

var asap = require('asap')

module.exports = Promise;
function Promise(fn) {
  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
  if (typeof fn !== 'function') throw new TypeError('not a function')
  var state = null
  var value = null
  var deferreds = []
  var self = this

  this.then = function(onFulfilled, onRejected) {
    return new self.constructor(function(resolve, reject) {
      handle(new Handler(onFulfilled, onRejected, resolve, reject))
    })
  }

  function handle(deferred) {
    if (state === null) {
      deferreds.push(deferred)
      return
    }
    asap(function() {
      var cb = state ? deferred.onFulfilled : deferred.onRejected
      if (cb === null) {
        (state ? deferred.resolve : deferred.reject)(value)
        return
      }
      var ret
      try {
        ret = cb(value)
      }
      catch (e) {
        deferred.reject(e)
        return
      }
      deferred.resolve(ret)
    })
  }

  function resolve(newValue) {
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then
        if (typeof then === 'function') {
          doResolve(then.bind(newValue), resolve, reject)
          return
        }
      }
      state = true
      value = newValue
      finale()
    } catch (e) { reject(e) }
  }

  function reject(newValue) {
    state = false
    value = newValue
    finale()
  }

  function finale() {
    for (var i = 0, len = deferreds.length; i < len; i++)
      handle(deferreds[i])
    deferreds = null
  }

  doResolve(fn, resolve, reject)
}


function Handler(onFulfilled, onRejected, resolve, reject){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.resolve = resolve
  this.reject = reject
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}

},{"asap":91}],90:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

function ValuePromise(value) {
  this.then = function (onFulfilled) {
    if (typeof onFulfilled !== 'function') return this
    return new Promise(function (resolve, reject) {
      asap(function () {
        try {
          resolve(onFulfilled(value))
        } catch (ex) {
          reject(ex);
        }
      })
    })
  }
}
ValuePromise.prototype = Promise.prototype

var TRUE = new ValuePromise(true)
var FALSE = new ValuePromise(false)
var NULL = new ValuePromise(null)
var UNDEFINED = new ValuePromise(undefined)
var ZERO = new ValuePromise(0)
var EMPTYSTRING = new ValuePromise('')

Promise.resolve = function (value) {
  if (value instanceof Promise) return value

  if (value === null) return NULL
  if (value === undefined) return UNDEFINED
  if (value === true) return TRUE
  if (value === false) return FALSE
  if (value === 0) return ZERO
  if (value === '') return EMPTYSTRING

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        return new Promise(then.bind(value))
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex)
      })
    }
  }

  return new ValuePromise(value)
}

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr)

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { res(i, val) }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) { 
    reject(value);
  });
}

Promise.race = function (values) {
  return new Promise(function (resolve, reject) { 
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    })
  });
}

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
}

},{"./core.js":89,"asap":91}],91:[function(require,module,exports){
(function (process){

// Use the fastest possible means to execute a task in a future turn
// of the event loop.

// linked list of tasks (single, with head node)
var head = {task: void 0, next: null};
var tail = head;
var flushing = false;
var requestFlush = void 0;
var isNodeJS = false;

function flush() {
    /* jshint loopfunc: true */

    while (head.next) {
        head = head.next;
        var task = head.task;
        head.task = void 0;
        var domain = head.domain;

        if (domain) {
            head.domain = void 0;
            domain.enter();
        }

        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function() {
                   throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    flushing = false;
}

if (typeof process !== "undefined" && process.nextTick) {
    // Node.js before 0.9. Note that some fake-Node environments, like the
    // Mocha test runner, introduce a `process` global without a `nextTick`.
    isNodeJS = true;

    requestFlush = function () {
        process.nextTick(flush);
    };

} else if (typeof setImmediate === "function") {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
        requestFlush = setImmediate.bind(window, flush);
    } else {
        requestFlush = function () {
            setImmediate(flush);
        };
    }

} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    requestFlush = function () {
        channel.port2.postMessage(0);
    };

} else {
    // old browsers
    requestFlush = function () {
        setTimeout(flush, 0);
    };
}

function asap(task) {
    tail = tail.next = {
        task: task,
        domain: isNodeJS && process.domain,
        next: null
    };

    if (!flushing) {
        flushing = true;
        requestFlush();
    }
};

module.exports = asap;


}).call(this,require('_process'))
},{"_process":88}],92:[function(require,module,exports){
// should work in any browser without browserify

if (typeof Promise.prototype.done !== 'function') {
  Promise.prototype.done = function (onFulfilled, onRejected) {
    var self = arguments.length ? this.then.apply(this, arguments) : this
    self.then(null, function (err) {
      setTimeout(function () {
        throw err
      }, 0)
    })
  }
}
},{}],"promise/polyfill.js":[function(require,module,exports){
// not "use strict" so we can declare global "Promise"

var asap = require('asap');

if (typeof Promise === 'undefined') {
  Promise = require('./lib/core.js')
  require('./lib/es6-extensions.js')
}

require('./polyfill-done.js');

},{"./lib/core.js":89,"./lib/es6-extensions.js":90,"./polyfill-done.js":92,"asap":91}]},{},[2])(2)
});
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.StylesEditor = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AmpersandEvents = require('ampersand-events');
var classExtend = require('ampersand-class-extend');
var isArray = require('lodash.isarray');
var bind = require('lodash.bind');
var assign = require('lodash.assign');
var slice = [].slice;

function Collection(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator) this.comparator = options.comparator;
    if (options.parent) this.parent = options.parent;
    if (!this.mainIndex) {
        var idAttribute = this.model && this.model.prototype && this.model.prototype.idAttribute;
        this.mainIndex = idAttribute || 'id';
    }
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, assign({silent: true}, options));
}

assign(Collection.prototype, AmpersandEvents, {
    initialize: function () {},

    isModel: function (model) {
        return this.model && model instanceof this.model;
    },

    add: function (models, options) {
        return this.set(models, assign({merge: false, add: true, remove: false}, options));
    },

    // overridable parse method
    parse: function (res, options) {
        return res;
    },

    // overridable serialize method
    serialize: function () {
        return this.map(function (model) {
            if (model.serialize) {
                return model.serialize();
            } else {
                var out = {};
                assign(out, model);
                delete out.collection;
                return out;
            }
        });
    },

    toJSON: function () {
        return this.serialize();
    },

    set: function (models, options) {
        options = assign({add: true, remove: true, merge: true}, options);
        if (options.parse) models = this.parse(models, options);
        var singular = !isArray(models);
        models = singular ? (models ? [models] : []) : models.slice();
        var id, model, attrs, existing, sort, i, length;
        var at = options.at;
        var sortable = this.comparator && (at == null) && options.sort !== false;
        var sortAttr = ('string' === typeof this.comparator) ? this.comparator : null;
        var toAdd = [], toRemove = [], modelMap = {};
        var add = options.add, merge = options.merge, remove = options.remove;
        var order = !sortable && add && remove ? [] : false;
        var targetProto = this.model && this.model.prototype || Object.prototype;

        // Turn bare objects into model references, and prevent invalid models
        // from being added.
        for (i = 0, length = models.length; i < length; i++) {
            attrs = models[i] || {};
            if (this.isModel(attrs)) {
                id = model = attrs;
            } else if (targetProto.generateId) {
                id = targetProto.generateId(attrs);
            } else {
                id = attrs[this.mainIndex];
            }

            // If a duplicate is found, prevent it from being added and
            // optionally merge it into the existing model.
            if (existing = this.get(id)) {
                if (remove) modelMap[existing.cid || existing[this.mainIndex]] = true;
                if (merge) {
                    attrs = attrs === model ? model.attributes : attrs;
                    if (options.parse) attrs = existing.parse(attrs, options);
                    // if this is model
                    if (existing.set) {
                        existing.set(attrs, options);
                        if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
                    } else {
                        // if not just update the properties
                        assign(existing, attrs);
                    }
                }
                models[i] = existing;

            // If this is a new, valid model, push it to the `toAdd` list.
            } else if (add) {
                model = models[i] = this._prepareModel(attrs, options);
                if (!model) continue;
                toAdd.push(model);
                this._addReference(model, options);
            }

            // Do not add multiple models with the same `id`.
            model = existing || model;
            if (!model) continue;
            if (order && ((model.isNew && model.isNew() || !model[this.mainIndex]) || !modelMap[model.cid || model[this.mainIndex]])) order.push(model);
            modelMap[model[this.mainIndex]] = true;
        }

        // Remove nonexistent models if appropriate.
        if (remove) {
            for (i = 0, length = this.length; i < length; i++) {
                model = this.models[i];
                if (!modelMap[model.cid || model[this.mainIndex]]) toRemove.push(model);
            }
            if (toRemove.length) this.remove(toRemove, options);
        }

        // See if sorting is needed, update `length` and splice in new models.
        if (toAdd.length || (order && order.length)) {
            if (sortable) sort = true;
            if (at != null) {
                for (i = 0, length = toAdd.length; i < length; i++) {
                    this.models.splice(at + i, 0, toAdd[i]);
                }
            } else {
                var orderedModels = order || toAdd;
                for (i = 0, length = orderedModels.length; i < length; i++) {
                    this.models.push(orderedModels[i]);
                }
            }
        }

        // Silently sort the collection if appropriate.
        if (sort) this.sort({silent: true});

        // Unless silenced, it's time to fire all appropriate add/sort events.
        if (!options.silent) {
            for (i = 0, length = toAdd.length; i < length; i++) {
                model = toAdd[i];
                if (model.trigger) {
                    model.trigger('add', model, this, options);
                } else {
                    this.trigger('add', model, this, options);
                }
            }
            if (sort || (order && order.length)) this.trigger('sort', this, options);
        }

        // Return the added (or merged) model (or models).
        return singular ? models[0] : models;
    },

    get: function (query, indexName) {
        if (query == null) return;
        var index = this._indexes[indexName || this.mainIndex];
        return (index && (index[query] || index[query[this.mainIndex]])) || this._indexes.cid[query] || this._indexes.cid[query.cid];
    },

    // Get the model at the given index.
    at: function (index) {
        return this.models[index];
    },

    remove: function (models, options) {
        var singular = !isArray(models);
        var i, length, model, index;

        models = singular ? [models] : slice.call(models);
        options || (options = {});
        for (i = 0, length = models.length; i < length; i++) {
            model = models[i] = this.get(models[i]);
            if (!model) continue;
            this._deIndex(model);
            index = this.models.indexOf(model);
            this.models.splice(index, 1);
            if (!options.silent) {
                options.index = index;
                if (model.trigger) {
                    model.trigger('remove', model, this, options);
                } else {
                    this.trigger('remove', model, this, options);
                }
            }
            this._removeReference(model, options);
        }
        return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function (models, options) {
        options || (options = {});
        for (var i = 0, length = this.models.length; i < length; i++) {
            this._removeReference(this.models[i], options);
        }
        options.previousModels = this.models;
        this._reset();
        models = this.add(models, assign({silent: true}, options));
        if (!options.silent) this.trigger('reset', this, options);
        return models;
    },

    sort: function (options) {
        var self = this;
        if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
        options || (options = {});

        if (typeof this.comparator === 'string') {
            this.models.sort(function (left, right) {
                if (left.get) {
                    left = left.get(self.comparator);
                    right = right.get(self.comparator);
                } else {
                    left = left[self.comparator];
                    right = right[self.comparator];
                }
                if (left > right || left === void 0) return 1;
                if (left < right || right === void 0) return -1;
                return 0;
            });
        } else if (this.comparator.length === 1) {
            this.models.sort(function (left, right) {
                left = self.comparator(left);
                right = self.comparator(right);
                if (left > right || left === void 0) return 1;
                if (left < right || right === void 0) return -1;
                return 0;
            });
        } else {
            this.models.sort(bind(this.comparator,this));
        }

        if (!options.silent) this.trigger('sort', this, options);
        return this;
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function () {
        var list = slice.call(this.indexes || []);
        var i = 0;
        list.push(this.mainIndex);
        list.push('cid');
        var l = list.length;
        this.models = [];
        this._indexes = {};
        for (; i < l; i++) {
            this._indexes[list[i]] = {};
        }
    },

    _prepareModel: function (attrs, options) {
        // if we haven't defined a constructor, skip this
        if (!this.model) return attrs;

        if (this.isModel(attrs)) {
            if (!attrs.collection) attrs.collection = this;
            return attrs;
        } else {
            options = options ? assign({}, options) : {};
            options.collection = this;
            var model = new this.model(attrs, options);
            if (!model.validationError) return model;
            this.trigger('invalid', this, model.validationError, options);
            return false;
        }
    },

    _deIndex: function (model, attribute, value) {
        var indexVal;
        if (attribute !== undefined) {
            if (undefined === this._indexes[attribute]) throw new Error('Given attribute is not an index');
            delete this._indexes[attribute][value];
            return;
        }
        // Not a specific attribute
        for (attribute in this._indexes) {
            indexVal = model.hasOwnProperty(attribute) ? model[attribute] : (model.get && model.get(attribute));
            delete this._indexes[attribute][indexVal];
        }
    },

    _index: function (model, attribute) {
        var indexVal;
        if (attribute !== undefined) {
            if (undefined === this._indexes[attribute]) throw new Error('Given attribute is not an index');
            indexVal = model[attribute] || (model.get && model.get(attribute));
            if (indexVal) this._indexes[attribute][indexVal] = model;
            return;
        }
        // Not a specific attribute
        for (attribute in this._indexes) {
            indexVal = model.hasOwnProperty(attribute) ? model[attribute] : (model.get && model.get(attribute));
            if (indexVal != null) this._indexes[attribute][indexVal] = model;
        }
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function (model, options) {
        this._index(model);
        if (!model.collection) model.collection = this;
        if (model.on) model.on('all', this._onModelEvent, this);
    },

        // Internal method to sever a model's ties to a collection.
    _removeReference: function (model, options) {
        if (this === model.collection) delete model.collection;
        this._deIndex(model);
        if (model.off) model.off('all', this._onModelEvent, this);
    },

    _onModelEvent: function (event, model, collection, options) {
        var eventName = event.split(':')[0];
        var attribute = event.split(':')[1];

        if ((eventName === 'add' || eventName === 'remove') && collection !== this) return;
        if (eventName === 'destroy') this.remove(model, options);
        if (model && eventName === 'change' && attribute && this._indexes[attribute]) {
            this._deIndex(model, attribute, model.previousAttributes()[attribute]);
            this._index(model, attribute);
        }
        this.trigger.apply(this, arguments);
    }
});

Object.defineProperties(Collection.prototype, {
    length: {
        get: function () {
            return this.models.length;
        }
    },
    isCollection: {
        value: true
    }
});

var arrayMethods = [
    'indexOf',
    'lastIndexOf',
    'every',
    'some',
    'forEach',
    'map',
    'filter',
    'reduce',
    'reduceRight'
];

arrayMethods.forEach(function (method) {
    Collection.prototype[method] = function () {
        return this.models[method].apply(this.models, arguments);
    };
});

// alias each/forEach for maximum compatibility
Collection.prototype.each = Collection.prototype.forEach;

Collection.extend = classExtend;

module.exports = Collection;

},{"ampersand-class-extend":2,"ampersand-events":3,"lodash.assign":19,"lodash.bind":29,"lodash.isarray":35}],2:[function(require,module,exports){
var assign = require('lodash.assign');

/// Following code is largely pasted from Backbone.js

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var extend = function(protoProps) {
    var parent = this;
    var child;
    var args = [].slice.call(arguments);

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () {
            return parent.apply(this, arguments);
        };
    }

    // Add static properties to the constructor function from parent
    assign(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Mix in all prototype properties to the subclass if supplied.
    if (protoProps) {
        args.unshift(child.prototype);
        assign.apply(null, args);
    }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

// Expose the extend function
module.exports = extend;

},{"lodash.assign":19}],3:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-events"] = window.ampersand["ampersand-events"] || [];  window.ampersand["ampersand-events"].push("1.1.1");}
var runOnce = require('lodash.once');
var uniqueId = require('lodash.uniqueid');
var keys = require('lodash.keys');
var isEmpty = require('lodash.isempty');
var each = require('lodash.foreach');
var bind = require('lodash.bind');
var assign = require('lodash.assign');
var slice = Array.prototype.slice;
var eventSplitter = /\s+/;


var Events = {
    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
        if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({callback: callback, context: context, ctx: context || this});
        return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
        if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
        var self = this;
        var once = runOnce(function() {
            self.off(name, once);
            callback.apply(this, arguments);
        });
        once._callback = callback;
        return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
        var retain, ev, events, names, i, l, j, k;
        if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
        if (!name && !callback && !context) {
            this._events = void 0;
            return this;
        }
        names = name ? [name] : keys(this._events);
        for (i = 0, l = names.length; i < l; i++) {
            name = names[i];
            if (events = this._events[name]) {
                this._events[name] = retain = [];
                if (callback || context) {
                    for (j = 0, k = events.length; j < k; j++) {
                        ev = events[j];
                        if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                                (context && context !== ev.context)) {
                            retain.push(ev);
                        }
                    }
                }
                if (!retain.length) delete this._events[name];
            }
        }

        return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
        if (!this._events) return this;
        var args = slice.call(arguments, 1);
        if (!eventsApi(this, 'trigger', name, args)) return this;
        var events = this._events[name];
        var allEvents = this._events.all;
        if (events) triggerEvents(events, args);
        if (allEvents) triggerEvents(allEvents, arguments);
        return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) return this;
        var remove = !name && !callback;
        if (!callback && typeof name === 'object') callback = this;
        if (obj) (listeningTo = {})[obj._listenId] = obj;
        for (var id in listeningTo) {
            obj = listeningTo[id];
            obj.off(name, callback, this);
            if (remove || isEmpty(obj._events)) delete this._listeningTo[id];
        }
        return this;
    },

    // extend an object with event capabilities if passed
    // or just return a new one.
    createEmitter: function (obj) {
        return assign(obj || {}, Events);
    }
};

Events.bind = Events.on;
Events.unbind = Events.off;


// Implement fancy features of the Events API such as multiple event
// names `"change blur"` and jQuery-style event maps `{change: action}`
// in terms of the existing API.
var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
        for (var key in name) {
            obj[action].apply(obj, [key, name[key]].concat(rest));
        }
        return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, l = names.length; i < l; i++) {
            obj[action].apply(obj, [names[i]].concat(rest));
        }
        return false;
    }

    return true;
};

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy.
var triggerEvents = function(events, args) {
    var ev;
    var i = -1;
    var l = events.length;
    var a1 = args[0];
    var a2 = args[1];
    var a3 = args[2];
    switch (args.length) {
        case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
        case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
        case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
        default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
};

var listenMethods = {
    listenTo: 'on',
    listenToOnce: 'once'
};

// Inversion-of-control versions of `on` and `once`. Tell *this* object to
// listen to an event in another object ... keeping track of what it's
// listening to.
each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback, run) {
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var id = obj._listenId || (obj._listenId = uniqueId('l'));
        listeningTo[id] = obj;
        if (!callback && typeof name === 'object') callback = this;
        obj[implementation](name, callback, this);
        return this;
    };
});

Events.listenToAndRun = function (obj, name, callback) {
    Events.listenTo.apply(this, arguments);
    if (!callback && typeof name === 'object') callback = this;
    callback.apply(this);
    return this;
};

module.exports = Events;

},{"lodash.assign":19,"lodash.bind":29,"lodash.foreach":4,"lodash.isempty":8,"lodash.keys":12,"lodash.once":15,"lodash.uniqueid":17}],4:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayEach = require('lodash._arrayeach'),
    baseEach = require('lodash._baseeach'),
    bindCallback = require('lodash._bindcallback'),
    isArray = require('lodash.isarray');

/**
 * Creates a function for `_.forEach` or `_.forEachRight`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over an array.
 * @param {Function} eachFunc The function to iterate over a collection.
 * @returns {Function} Returns the new each function.
 */
function createForEach(arrayFunc, eachFunc) {
  return function(collection, iteratee, thisArg) {
    return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
      ? arrayFunc(collection, iteratee)
      : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
  };
}

/**
 * Iterates over elements of `collection` invoking `iteratee` for each element.
 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
 * (value, index|key, collection). Iteratee functions may exit iteration early
 * by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length" property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2]).forEach(function(n) {
 *   console.log(n);
 * }).value();
 * // => logs each value from left to right and returns the array
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
 *   console.log(n, key);
 * });
 * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
 */
var forEach = createForEach(arrayEach, baseEach);

module.exports = forEach;

},{"lodash._arrayeach":5,"lodash._baseeach":6,"lodash._bindcallback":7,"lodash.isarray":35}],5:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands or `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],6:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var keys = require('lodash.keys');

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

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
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
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
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
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

module.exports = baseEach;

},{"lodash.keys":12}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray'),
    isFunction = require('lodash.isfunction'),
    isString = require('lodash.isstring'),
    keys = require('lodash.keys');

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
 * Checks if `value` is empty. A value is considered empty unless it is an
 * `arguments` object, array, string, or jQuery-like collection with a length
 * greater than `0` or an object with own enumerable properties.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {Array|Object|string} value The value to inspect.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
      (isObjectLike(value) && isFunction(value.splice)))) {
    return !value.length;
  }
  return !keys(value).length;
}

module.exports = isEmpty;

},{"lodash.isarguments":9,"lodash.isarray":35,"lodash.isfunction":10,"lodash.isstring":11,"lodash.keys":12}],9:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

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

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
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
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
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
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{}],10:[function(require,module,exports){
/**
 * lodash 3.0.6 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
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

module.exports = isFunction;

},{}],11:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var stringTag = '[object String]';

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
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
}

module.exports = isString;

},{}],12:[function(require,module,exports){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
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
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
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
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
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
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
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
  var Ctor = object == null ? undefined : object.constructor;
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

},{"lodash._getnative":13,"lodash.isarguments":14,"lodash.isarray":35}],13:[function(require,module,exports){
/**
 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

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
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
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
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
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
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = getNative;

},{}],14:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],15:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var before = require('lodash.before');

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first call. The `func` is invoked
 * with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // `initialize` invokes `createApplication` once
 */
function once(func) {
  return before(2, func);
}

module.exports = once;

},{"lodash.before":16}],16:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it is called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery('#add').on('click', _.before(5, addContactToList));
 * // => allows adding up to 4 contacts to the list
 */
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    if (typeof n == 'function') {
      var temp = n;
      n = func;
      func = temp;
    } else {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
  }
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}

module.exports = before;

},{}],17:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring');

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is provided the ID is appended to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {string} [prefix] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return baseToString(prefix) + id;
}

module.exports = uniqueId;

},{"lodash._basetostring":18}],18:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],19:[function(require,module,exports){
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

},{"lodash._baseassign":20,"lodash._createassigner":22,"lodash.keys":26}],20:[function(require,module,exports){
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

},{"lodash._basecopy":21,"lodash.keys":26}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"lodash._bindcallback":23,"lodash._isiterateecall":24,"lodash.restparam":25}],23:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"lodash._getnative":27,"lodash.isarguments":28,"lodash.isarray":35}],27:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],28:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],29:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var createWrapper = require('lodash._createwrapper'),
    replaceHolders = require('lodash._replaceholders'),
    restParam = require('lodash.restparam');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    PARTIAL_FLAG = 32;

/**
 * Creates a function that invokes `func` with the `this` binding of `thisArg`
 * and prepends any additional `_.bind` arguments to those provided to the
 * bound function.
 *
 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for partially applied arguments.
 *
 * **Note:** Unlike native `Function#bind` this method does not set the `length`
 * property of bound functions.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var greet = function(greeting, punctuation) {
 *   return greeting + ' ' + this.user + punctuation;
 * };
 *
 * var object = { 'user': 'fred' };
 *
 * var bound = _.bind(greet, object, 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * // using placeholders
 * var bound = _.bind(greet, object, _, '!');
 * bound('hi');
 * // => 'hi fred!'
 */
var bind = restParam(function(func, thisArg, partials) {
  var bitmask = BIND_FLAG;
  if (partials.length) {
    var holders = replaceHolders(partials, bind.placeholder);
    bitmask |= PARTIAL_FLAG;
  }
  return createWrapper(func, bitmask, thisArg, partials, holders);
});

// Assign default placeholders.
bind.placeholder = {};

module.exports = bind;

},{"lodash._createwrapper":30,"lodash._replaceholders":33,"lodash.restparam":34}],30:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.7 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayCopy = require('lodash._arraycopy'),
    baseCreate = require('lodash._basecreate'),
    replaceHolders = require('lodash._replaceholders');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64,
    ARY_FLAG = 128;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders) {
  var holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      leftIndex = -1,
      leftLength = partials.length,
      result = Array(leftLength + argsLength);

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    result[holders[argsIndex]] = args[argsIndex];
  }
  while (argsLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders) {
  var holdersIndex = -1,
      holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      rightIndex = -1,
      rightLength = partials.length,
      result = Array(argsLength + rightLength);

  while (++argsIndex < argsLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    result[offset + holders[holdersIndex]] = args[argsIndex++];
  }
  return result;
}

/**
 * Creates a function that wraps `func` and invokes it with the `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new bound function.
 */
function createBindWrapper(func, thisArg) {
  var Ctor = createCtorWrapper(func);

  function wrapper() {
    var fn = (this && this !== global && this instanceof wrapper) ? Ctor : func;
    return fn.apply(thisArg, arguments);
  }
  return wrapper;
}

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtorWrapper(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors.
    // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

/**
 * Creates a function that wraps `func` and invokes it with optional `this`
 * binding of, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurry = bitmask & CURRY_FLAG,
      isCurryBound = bitmask & CURRY_BOUND_FLAG,
      isCurryRight = bitmask & CURRY_RIGHT_FLAG,
      Ctor = isBindKey ? undefined : createCtorWrapper(func);

  function wrapper() {
    // Avoid `arguments` object use disqualifying optimizations by
    // converting it to an array before providing it to other functions.
    var length = arguments.length,
        index = length,
        args = Array(length);

    while (index--) {
      args[index] = arguments[index];
    }
    if (partials) {
      args = composeArgs(args, partials, holders);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight);
    }
    if (isCurry || isCurryRight) {
      var placeholder = wrapper.placeholder,
          argsHolders = replaceHolders(args, placeholder);

      length -= argsHolders.length;
      if (length < arity) {
        var newArgPos = argPos ? arrayCopy(argPos) : undefined,
            newArity = nativeMax(arity - length, 0),
            newsHolders = isCurry ? argsHolders : undefined,
            newHoldersRight = isCurry ? undefined : argsHolders,
            newPartials = isCurry ? args : undefined,
            newPartialsRight = isCurry ? undefined : args;

        bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
        bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

        if (!isCurryBound) {
          bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
        }
        var result = createHybridWrapper(func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity);

        result.placeholder = placeholder;
        return result;
      }
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    if (argPos) {
      args = reorder(args, argPos);
    }
    if (isAry && ary < args.length) {
      args.length = ary;
    }
    if (this && this !== global && this instanceof wrapper) {
      fn = Ctor || createCtorWrapper(func);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` and invokes it with the optional `this`
 * binding of `thisArg` and the `partials` prepended to those provided to
 * the wrapper.
 *
 * @private
 * @param {Function} func The function to partially apply arguments to.
 * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to the new function.
 * @returns {Function} Returns the new bound function.
 */
function createPartialWrapper(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    // Avoid `arguments` object use disqualifying optimizations by
    // converting it to an array before providing it `func`.
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength);

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    var fn = (this && this !== global && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, args);
  }
  return wrapper;
}

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  length -= (holders ? holders.length : 0);
  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

  newData[9] = arity == null
    ? (isBindKey ? 0 : func.length)
    : (nativeMax(arity - length, 0) || 0);

  if (bitmask == BIND_FLAG) {
    var result = createBindWrapper(newData[0], newData[2]);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
    result = createPartialWrapper.apply(undefined, newData);
  } else {
    result = createHybridWrapper.apply(undefined, newData);
  }
  return result;
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
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = arrayCopy(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
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

module.exports = createWrapper;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._arraycopy":31,"lodash._basecreate":32,"lodash._replaceholders":33}],31:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],32:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(prototype) {
    if (isObject(prototype)) {
      object.prototype = prototype;
      var result = new object;
      object.prototype = undefined;
    }
    return result || {};
  };
}());

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

module.exports = baseCreate;

},{}],33:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    if (array[index] === placeholder) {
      array[index] = PLACEHOLDER;
      result[++resIndex] = index;
    }
  }
  return result;
}

module.exports = replaceHolders;

},{}],34:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],35:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

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
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
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
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
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
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
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
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isArray;

},{}],36:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-state"] = window.ampersand["ampersand-state"] || [];  window.ampersand["ampersand-state"].push("4.5.6");}
var uniqueId = require('lodash.uniqueid');
var assign = require('lodash.assign');
var omit = require('lodash.omit');
var escape = require('lodash.escape');
var forEach = require('lodash.foreach');
var includes = require('lodash.includes');
var isString = require('lodash.isstring');
var isObject = require('lodash.isobject');
var isArray = require('lodash.isarray');
var isDate = require('lodash.isdate');
var isUndefined = require('lodash.isundefined');
var isFunction = require('lodash.isfunction');
var isNull = require('lodash.isnull');
var isEmpty = require('lodash.isempty');
var isEqual = require('lodash.isequal');
var clone = require('lodash.clone');
var has = require('lodash.has');
var result = require('lodash.result');
var keys = require('lodash.keys');
var bind = require('lodash.bind');
var defaults = require('lodash.defaults');
var union = require('lodash.union');
var Events = require('ampersand-events');
var KeyTree = require('key-tree-store');
var arrayNext = require('array-next');
var changeRE = /^change:/;

function Base(attrs, options) {
    options || (options = {});
    this.cid || (this.cid = uniqueId('state'));
    this._events = {};
    this._values = {};
    this._definition = Object.create(this._definition);
    if (options.parse) attrs = this.parse(attrs, options);
    this.parent = options.parent;
    this.collection = options.collection;
    this._keyTree = new KeyTree();
    this._initCollections();
    this._initChildren();
    this._cache = {};
    this._previousAttributes = {};
    if (attrs) this.set(attrs, assign({silent: true, initial: true}, options));
    this._changed = {};
    if (this._derived) this._initDerived();
    if (options.init !== false) this.initialize.apply(this, arguments);
}


assign(Base.prototype, Events, {
    // can be allow, ignore, reject
    extraProperties: 'ignore',

    idAttribute: 'id',

    namespaceAttribute: 'namespace',

    typeAttribute: 'modelType',

    // Stubbed out to be overwritten
    initialize: function () {
        return this;
    },

    // Get ID of model per configuration.
    // Should *always* be how ID is determined by other code.
    getId: function () {
        return this[this.idAttribute];
    },

    // Get namespace of model per configuration.
    // Should *always* be how namespace is determined by other code.
    getNamespace: function () {
        return this[this.namespaceAttribute];
    },

    // Get type of model per configuration.
    // Should *always* be how type is determined by other code.
    getType: function () {
        return this[this.typeAttribute];
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function () {
        return this.getId() == null;
    },

    // get HTML-escaped value of attribute
    escape: function (attr) {
        return escape(this.get(attr));
    },

    // Check if the model is currently in a valid state.
    isValid: function (options) {
        return this._validate({}, assign(options || {}, { validate: true }));
    },

    // Parse can be used remap/restructure/rename incoming properties
    // before they are applied to attributes.
    parse: function (resp, options) {
        //jshint unused:false
        return resp;
    },

    // Serialize is the inverse of `parse` it lets you massage data
    // on the way out. Before, sending to server, for example.
    serialize: function () {
        var res = this.getAttributes({props: true}, true);
        forEach(this._children, function (value, key) {
            res[key] = this[key].serialize();
        }, this);
        forEach(this._collections, function (value, key) {
            res[key] = this[key].serialize();
        }, this);
        return res;
    },

    // Main set method used by generated setters/getters and can
    // be used directly if you need to pass options or set multiple
    // properties at once.
    set: function (key, value, options) {
        var self = this;
        var extraProperties = this.extraProperties;
        var changing, changes, newType, newVal, def, cast, err, attr,
            attrs, dataType, silent, unset, currentVal, initial, hasChanged, isEqual;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (isObject(key) || key === null) {
            attrs = key;
            options = value;
        } else {
            attrs = {};
            attrs[key] = value;
        }

        options = options || {};

        if (!this._validate(attrs, options)) return false;

        // Extract attributes and options.
        unset = options.unset;
        silent = options.silent;
        initial = options.initial;

        changes = [];
        changing = this._changing;
        this._changing = true;

        // if not already changing, store previous
        if (!changing) {
            this._previousAttributes = this.attributes;
            this._changed = {};
        }

        // For each `set` attribute...
        for (attr in attrs) {
            newVal = attrs[attr];
            newType = typeof newVal;
            currentVal = this._values[attr];
            def = this._definition[attr];


            if (!def) {
                // if this is a child model or collection
                if (this._children[attr] || this._collections[attr]) {
                    this[attr].set(newVal, options);
                    continue;
                } else if (extraProperties === 'ignore') {
                    continue;
                } else if (extraProperties === 'reject') {
                    throw new TypeError('No "' + attr + '" property defined on ' + (this.type || 'this') + ' model and extraProperties not set to "ignore" or "allow"');
                } else if (extraProperties === 'allow') {
                    def = this._createPropertyDefinition(attr, 'any');
                } else if (extraProperties) {
                    throw new TypeError('Invalid value for extraProperties: "' + extraProperties + '"');
                }
            }

            isEqual = this._getCompareForType(def.type);
            dataType = this._dataTypes[def.type];

            // check type if we have one
            if (dataType && dataType.set) {
                cast = dataType.set(newVal);
                newVal = cast.val;
                newType = cast.type;
            }

            // If we've defined a test, run it
            if (def.test) {
                err = def.test.call(this, newVal, newType);
                if (err) {
                    throw new TypeError('Property \'' + attr + '\' failed validation with error: ' + err);
                }
            }

            // If we are required but undefined, throw error.
            // If we are null and are not allowing null, throw error
            // If we have a defined type and the new type doesn't match, and we are not null, throw error.

            if (isUndefined(newVal) && def.required) {
                throw new TypeError('Required property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);
            }
            if (isNull(newVal) && def.required && !def.allowNull) {
                throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + ' (cannot be null). Tried to set ' + newVal);
            }
            if ((def.type && def.type !== 'any' && def.type !== newType) && !isNull(newVal) && !isUndefined(newVal)) {
                throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);
            }
            if (def.values && !includes(def.values, newVal)) {
                throw new TypeError('Property \'' + attr + '\' must be one of values: ' + def.values.join(', ') + '. Tried to set ' + newVal);
            }

            hasChanged = !isEqual(currentVal, newVal, attr);

            // enforce `setOnce` for properties if set
            if (def.setOnce && currentVal !== undefined && hasChanged && !initial) {
                throw new TypeError('Property \'' + attr + '\' can only be set once.');
            }

            // keep track of changed attributes
            // and push to changes array
            if (hasChanged) {
                changes.push({prev: currentVal, val: newVal, key: attr});
                self._changed[attr] = newVal;
            } else {
                delete self._changed[attr];
            }
        }

        // actually update our values
        forEach(changes, function (change) {
            self._previousAttributes[change.key] = change.prev;
            if (unset) {
                delete self._values[change.key];
            } else {
                self._values[change.key] = change.val;
            }
        });

        if (!silent && changes.length) self._pending = true;
        if (!silent) {
            forEach(changes, function (change) {
                self.trigger('change:' + change.key, self, change.val, options);
            });
        }

        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing) return this;
        if (!silent) {
            while (this._pending) {
                this._pending = false;
                this.trigger('change', this, options);
            }
        }
        this._pending = false;
        this._changing = false;
        return this;
    },

    get: function (attr) {
        return this[attr];
    },

    // Toggle boolean properties or properties that have a `values`
    // array in its definition.
    toggle: function (property) {
        var def = this._definition[property];
        if (def.type === 'boolean') {
            // if it's a bool, just flip it
            this[property] = !this[property];
        } else if (def && def.values) {
            // If it's a property with an array of values
            // skip to the next one looping back if at end.
            this[property] = arrayNext(def.values, this[property]);
        } else {
            throw new TypeError('Can only toggle properties that are type `boolean` or have `values` array.');
        }
        return this;
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function () {
        return clone(this._previousAttributes);
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function (attr) {
        if (attr == null) return !isEmpty(this._changed);
        return has(this._changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function (diff) {
        if (!diff) return this.hasChanged() ? clone(this._changed) : false;
        var val, changed = false;
        var old = this._changing ? this._previousAttributes : this.attributes;
        var def, isEqual;
        for (var attr in diff) {
            def = this._definition[attr];
            if (!def) continue;
            isEqual = this._getCompareForType(def.type);
            if (isEqual(old[attr], (val = diff[attr]))) continue;
            (changed || (changed = {}))[attr] = val;
        }
        return changed;
    },

    toJSON: function () {
        return this.serialize();
    },

    unset: function (attrs, options) {
        attrs = Array.isArray(attrs) ? attrs : [attrs];
        forEach(attrs, function (key) {
            var def = this._definition[key];
            var val;
            if (def.required) {
                val = result(def, 'default');
                return this.set(key, val, options);
            } else {
                return this.set(key, val, assign({}, options, {unset: true}));
            }
        }, this);
    },

    clear: function (options) {
        var self = this;
        forEach(keys(this.attributes), function (key) {
            self.unset(key, options);
        });
        return this;
    },

    previous: function (attr) {
        if (attr == null || !Object.keys(this._previousAttributes).length) return null;
        return this._previousAttributes[attr];
    },

    // Get default values for a certain type
    _getDefaultForType: function (type) {
        var dataType = this._dataTypes[type];
        return dataType && dataType['default'];
    },

    // Determine which comparison algorithm to use for comparing a property
    _getCompareForType: function (type) {
        var dataType = this._dataTypes[type];
        if (dataType && dataType.compare) return bind(dataType.compare, this);
        return isEqual;
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function (attrs, options) {
        if (!options.validate || !this.validate) return true;
        attrs = assign({}, this.attributes, attrs);
        var error = this.validationError = this.validate(attrs, options) || null;
        if (!error) return true;
        this.trigger('invalid', this, error, assign(options || {}, {validationError: error}));
        return false;
    },

    _createPropertyDefinition: function (name, desc, isSession) {
        return createPropertyDefinition(this, name, desc, isSession);
    },

    // just makes friendlier errors when trying to define a new model
    // only used when setting up original property definitions
    _ensureValidType: function (type) {
        return includes(['string', 'number', 'boolean', 'array', 'object', 'date', 'any'].concat(keys(this._dataTypes)), type) ? type : undefined;
    },

    getAttributes: function (options, raw) {
        options || (options = {});
        defaults(options, {
            session: false,
            props: false,
            derived: false
        });
        var res = {};
        var val, item, def;
        for (item in this._definition) {
            def = this._definition[item];
            if ((options.session && def.session) || (options.props && !def.session)) {
                val = (raw) ? this._values[item] : this[item];
                if (typeof val === 'undefined') val = result(def, 'default');
                if (typeof val !== 'undefined') res[item] = val;
            }
        }
        if (options.derived) {
            for (item in this._derived) res[item] = this[item];
        }
        return res;
    },

    _initDerived: function () {
        var self = this;

        forEach(this._derived, function (value, name) {
            var def = self._derived[name];
            def.deps = def.depList;

            var update = function (options) {
                options = options || {};

                var newVal = def.fn.call(self);

                if (self._cache[name] !== newVal || !def.cache) {
                    if (def.cache) {
                        self._previousAttributes[name] = self._cache[name];
                    }
                    self._cache[name] = newVal;
                    self.trigger('change:' + name, self, self._cache[name]);
                }
            };

            def.deps.forEach(function (propString) {
                self._keyTree.add(propString, update);
            });
        });

        this.on('all', function (eventName) {
            if (changeRE.test(eventName)) {
                self._keyTree.get(eventName.split(':')[1]).forEach(function (fn) {
                    fn();
                });
            }
        }, this);
    },

    _getDerivedProperty: function (name, flushCache) {
        // is this a derived property that is cached
        if (this._derived[name].cache) {
            //set if this is the first time, or flushCache is set
            if (flushCache || !this._cache.hasOwnProperty(name)) {
                this._cache[name] = this._derived[name].fn.apply(this);
            }
            return this._cache[name];
        } else {
            return this._derived[name].fn.apply(this);
        }
    },

    _initCollections: function () {
        var coll;
        if (!this._collections) return;
        for (coll in this._collections) {
            this[coll] = new this._collections[coll](null, {parent: this});
        }
    },

    _initChildren: function () {
        var child;
        if (!this._children) return;
        for (child in this._children) {
            this[child] = new this._children[child]({}, {parent: this});
            this.listenTo(this[child], 'all', this._getEventBubblingHandler(child));
        }
    },

    // Returns a bound handler for doing event bubbling while
    // adding a name to the change string.
    _getEventBubblingHandler: function (propertyName) {
        return bind(function (name, model, newValue) {
            if (changeRE.test(name)) {
                this.trigger('change:' + propertyName + '.' + name.split(':')[1], model, newValue);
            } else if (name === 'change') {
                this.trigger('change', this);
            }
        }, this);
    },

    // Check that all required attributes are present
    _verifyRequired: function () {
        var attrs = this.attributes; // should include session
        for (var def in this._definition) {
            if (this._definition[def].required && typeof attrs[def] === 'undefined') {
                return false;
            }
        }
        return true;
    }
});

// getter for attributes
Object.defineProperties(Base.prototype, {
    attributes: {
        get: function () {
            return this.getAttributes({props: true, session: true});
        }
    },
    all: {
        get: function () {
            return this.getAttributes({
                session: true,
                props: true,
                derived: true
            });
        }
    },
    isState: {
        get: function () { return true; },
        set: function () { }
    }
});

// helper for creating/storing property definitions and creating
// appropriate getters/setters
function createPropertyDefinition(object, name, desc, isSession) {
    var def = object._definition[name] = {};
    var type, descArray;

    if (isString(desc)) {
        // grab our type if all we've got is a string
        type = object._ensureValidType(desc);
        if (type) def.type = type;
    } else {

        //Transform array of ['type', required, default] to object form
        if (isArray(desc)) {
            descArray = desc;
            desc = {
                type: descArray[0],
                required: descArray[1],
                'default': descArray[2]
            };
        }

        type = object._ensureValidType(desc.type);
        if (type) def.type = type;

        if (desc.required) def.required = true;

        if (desc['default'] && typeof desc['default'] === 'object') {
            throw new TypeError('The default value for ' + name + ' cannot be an object/array, must be a value or a function which returns a value/object/array');
        }

        def['default'] = desc['default'];

        def.allowNull = desc.allowNull ? desc.allowNull : false;
        if (desc.setOnce) def.setOnce = true;
        if (def.required && isUndefined(def['default']) && !def.setOnce) def['default'] = object._getDefaultForType(type);
        def.test = desc.test;
        def.values = desc.values;
    }
    if (isSession) def.session = true;

    // define a getter/setter on the prototype
    // but they get/set on the instance
    Object.defineProperty(object, name, {
        set: function (val) {
            this.set(name, val);
        },
        get: function () {
            if (!this._values) {
                throw Error('You may be trying to `extend` a state object with "' + name + '" which has been defined in `props` on the object being extended');
            }
            var value = this._values[name];
            var typeDef = this._dataTypes[def.type];
            if (typeof value !== 'undefined') {
                if (typeDef && typeDef.get) {
                    value = typeDef.get(value);
                }
                return value;
            }
            value = result(def, 'default');
            this._values[name] = value;
            return value;
        }
    });

    return def;
}

// helper for creating derived property definitions
function createDerivedProperty(modelProto, name, definition) {
    var def = modelProto._derived[name] = {
        fn: isFunction(definition) ? definition : definition.fn,
        cache: (definition.cache !== false),
        depList: definition.deps || []
    };

    // add to our shared dependency list
    forEach(def.depList, function (dep) {
        modelProto._deps[dep] = union(modelProto._deps[dep] || [], [name]);
    });

    // defined a top-level getter for derived names
    Object.defineProperty(modelProto, name, {
        get: function () {
            return this._getDerivedProperty(name);
        },
        set: function () {
            throw new TypeError('"' + name + '" is a derived property, it can\'t be set directly.');
        }
    });
}

var dataTypes = {
    string: {
        'default': function () {
            return '';
        }
    },
    date: {
        set: function (newVal) {
            var newType;
            if (newVal == null) {
                newType = typeof null;
            } else if (!isDate(newVal)) {
                try {
                    var dateVal = new Date(newVal).valueOf();
                    if (isNaN(dateVal)) {
                        // If the newVal cant be parsed, then try parseInt first
                        dateVal = new Date(parseInt(newVal, 10)).valueOf();
                        if (isNaN(dateVal)) throw TypeError;
                    }
                    newVal = dateVal;
                    newType = 'date';
                } catch (e) {
                    newType = typeof newVal;
                }
            } else {
                newType = 'date';
                newVal = newVal.valueOf();
            }

            return {
                val: newVal,
                type: newType
            };
        },
        get: function (val) {
            if (val == null) { return val; }
            return new Date(val);
        },
        'default': function () {
            return new Date();
        }
    },
    array: {
        set: function (newVal) {
            return {
                val: newVal,
                type: isArray(newVal) ? 'array' : typeof newVal
            };
        },
        'default': function () {
            return [];
        }
    },
    object: {
        set: function (newVal) {
            var newType = typeof newVal;
            // we have to have a way of supporting "missing" objects.
            // Null is an object, but setting a value to undefined
            // should work too, IMO. We just override it, in that case.
            if (newType !== 'object' && isUndefined(newVal)) {
                newVal = null;
                newType = 'object';
            }
            return {
                val: newVal,
                type: newType
            };
        },
        'default': function () {
            return {};
        }
    },
    // the `state` data type is a bit special in that setting it should
    // also bubble events
    state: {
        set: function (newVal) {
            var isInstance = newVal instanceof Base || (newVal && newVal.isState);
            if (isInstance) {
                return {
                    val: newVal,
                    type: 'state'
                };
            } else {
                return {
                    val: newVal,
                    type: typeof newVal
                };
            }
        },
        compare: function (currentVal, newVal, attributeName) {
            var isSame = currentVal === newVal;

            // if this has changed we want to also handle
            // event propagation
            if (!isSame) {
                if (currentVal) {
                    this.stopListening(currentVal);
                }

                if (newVal != null) {
                    this.listenTo(newVal, 'all', this._getEventBubblingHandler(attributeName));
                }
            }

            return isSame;
        }
    }
};

// the extend method used to extend prototypes, maintain inheritance chains for instanceof
// and allow for additions to the model definitions.
function extend(protoProps) {
    var parent = this;
    var child;
    var args = [].slice.call(arguments);

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () {
            return parent.apply(this, arguments);
        };
    }

    // Add static properties to the constructor function from parent
    assign(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function () { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // set prototype level objects
    child.prototype._derived =  assign({}, parent.prototype._derived);
    child.prototype._deps = assign({}, parent.prototype._deps);
    child.prototype._definition = assign({}, parent.prototype._definition);
    child.prototype._collections = assign({}, parent.prototype._collections);
    child.prototype._children = assign({}, parent.prototype._children);
    child.prototype._dataTypes = assign({}, parent.prototype._dataTypes || dataTypes);

    // Mix in all prototype properties to the subclass if supplied.
    if (protoProps) {
        var omitFromExtend = [
            'dataTypes', 'props', 'session', 'derived', 'collections', 'children'
        ];
        args.forEach(function processArg(def) {
            if (def.dataTypes) {
                forEach(def.dataTypes, function (def, name) {
                    child.prototype._dataTypes[name] = def;
                });
            }
            if (def.props) {
                forEach(def.props, function (def, name) {
                    createPropertyDefinition(child.prototype, name, def);
                });
            }
            if (def.session) {
                forEach(def.session, function (def, name) {
                    createPropertyDefinition(child.prototype, name, def, true);
                });
            }
            if (def.derived) {
                forEach(def.derived, function (def, name) {
                    createDerivedProperty(child.prototype, name, def);
                });
            }
            if (def.collections) {
                forEach(def.collections, function (constructor, name) {
                    child.prototype._collections[name] = constructor;
                });
            }
            if (def.children) {
                forEach(def.children, function (constructor, name) {
                    child.prototype._children[name] = constructor;
                });
            }
            assign(child.prototype, omit(def, omitFromExtend));
        });
    }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
}

Base.extend = extend;

// Our main exports
module.exports = Base;

},{"ampersand-events":37,"array-next":40,"key-tree-store":41,"lodash.assign":42,"lodash.bind":49,"lodash.clone":55,"lodash.defaults":64,"lodash.escape":66,"lodash.foreach":68,"lodash.has":72,"lodash.includes":77,"lodash.isarray":81,"lodash.isdate":82,"lodash.isempty":83,"lodash.isequal":85,"lodash.isfunction":89,"lodash.isnull":90,"lodash.isobject":91,"lodash.isstring":92,"lodash.isundefined":93,"lodash.keys":94,"lodash.omit":97,"lodash.result":113,"lodash.union":117,"lodash.uniqueid":126}],37:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3,"lodash.assign":42,"lodash.bind":49,"lodash.foreach":68,"lodash.isempty":83,"lodash.keys":94,"lodash.once":38,"lodash.uniqueid":126}],38:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"lodash.before":39}],39:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],40:[function(require,module,exports){
module.exports = function arrayNext(array, currentItem) {
    var len = array.length;
    var newIndex = array.indexOf(currentItem) + 1;
    if (newIndex > (len - 1)) newIndex = 0;
    return array[newIndex];
};

},{}],41:[function(require,module,exports){
var slice = Array.prototype.slice;

// our constructor
function KeyTreeStore() {
    this.storage = {};
}

// add an object to the store
KeyTreeStore.prototype.add = function (keypath, obj) {
    var arr = this.storage[keypath] || (this.storage[keypath] = []);
    arr.push(obj);
};

// remove an object
KeyTreeStore.prototype.remove = function (obj) {
    var path, arr;
    for (path in this.storage) {
        arr = this.storage[path];
        arr.some(function (item, index) {
            if (item === obj) {
                arr.splice(index, 1);
                return true;
            }
        });
    }
};

// get array of all all relevant functions, without keys
KeyTreeStore.prototype.get = function (keypath) {
    var res = [];
    var key;

    for (key in this.storage) {
        if (!keypath || keypath === key || key.indexOf(keypath + '.') === 0) {
            res = res.concat(this.storage[key]);
        }
    }

    return res;
};

// get all results that match keypath but still grouped by key
KeyTreeStore.prototype.getGrouped = function (keypath) {
    var res = {};
    var key;

    for (key in this.storage) {
        if (!keypath || keypath === key || key.indexOf(keypath + '.') === 0) {
            res[key] = slice.call(this.storage[key]);
        }
    }

    return res;
};

// get all results that match keypath but still grouped by key
KeyTreeStore.prototype.getAll = function (keypath) {
    var res = {};
    var key;

    for (key in this.storage) {
        if (keypath === key || key.indexOf(keypath + '.') === 0) {
            res[key] = slice.call(this.storage[key]);
        }
    }

    return res;
};

// run all matches with optional context
KeyTreeStore.prototype.run = function (keypath, context) {
    var args = slice.call(arguments, 2);
    this.get(keypath).forEach(function (fn) {
        fn.apply(context || this, args);
    });
};



module.exports = KeyTreeStore;

},{}],42:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19,"lodash._baseassign":43,"lodash._createassigner":45,"lodash.keys":94}],43:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"lodash._basecopy":44,"lodash.keys":94}],44:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],45:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22,"lodash._bindcallback":46,"lodash._isiterateecall":47,"lodash.restparam":48}],46:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],47:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],48:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],49:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29,"lodash._createwrapper":50,"lodash._replaceholders":53,"lodash.restparam":54}],50:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30,"lodash._arraycopy":51,"lodash._basecreate":52,"lodash._replaceholders":53}],51:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],52:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],53:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],54:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],55:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseClone = require('lodash._baseclone'),
    bindCallback = require('lodash._bindcallback'),
    isIterateeCall = require('lodash._isiterateecall');

/**
 * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
 * otherwise they are assigned by reference. If `customizer` is provided it is
 * invoked to produce the cloned values. If `customizer` returns `undefined`
 * cloning is handled by the method instead. The `customizer` is bound to
 * `thisArg` and invoked with two argument; (value [, index|key, object]).
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
 * The enumerable properties of `arguments` objects and objects created by
 * constructors other than `Object` are cloned to plain `Object` objects. An
 * empty object is returned for uncloneable values such as functions, DOM nodes,
 * Maps, Sets, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {*} Returns the cloned value.
 * @example
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * var shallow = _.clone(users);
 * shallow[0] === users[0];
 * // => true
 *
 * var deep = _.clone(users, true);
 * deep[0] === users[0];
 * // => false
 *
 * // using a customizer callback
 * var el = _.clone(document.body, function(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(false);
 *   }
 * });
 *
 * el === document.body
 * // => false
 * el.nodeName
 * // => BODY
 * el.childNodes.length;
 * // => 0
 */
function clone(value, isDeep, customizer, thisArg) {
  if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
    isDeep = false;
  }
  else if (typeof isDeep == 'function') {
    thisArg = customizer;
    customizer = isDeep;
    isDeep = false;
  }
  return typeof customizer == 'function'
    ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 1))
    : baseClone(value, isDeep);
}

module.exports = clone;

},{"lodash._baseclone":56,"lodash._bindcallback":62,"lodash._isiterateecall":63}],56:[function(require,module,exports){
(function (global){
/**
 * lodash 3.3.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayCopy = require('lodash._arraycopy'),
    arrayEach = require('lodash._arrayeach'),
    baseAssign = require('lodash._baseassign'),
    baseFor = require('lodash._basefor'),
    isArray = require('lodash.isarray'),
    keys = require('lodash.keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
cloneableTags[dateTag] = cloneableTags[float32Tag] =
cloneableTags[float64Tag] = cloneableTags[int8Tag] =
cloneableTags[int16Tag] = cloneableTags[int32Tag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[stringTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[mapTag] = cloneableTags[setTag] =
cloneableTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Native method references. */
var ArrayBuffer = global.ArrayBuffer,
    Uint8Array = global.Uint8Array;

/**
 * The base implementation of `_.clone` without support for argument juggling
 * and `this` binding `customizer` functions.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The object `value` belongs to.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return arrayCopy(value, result);
    }
  } else {
    var tag = objToString.call(value),
        isFunc = tag == funcTag;

    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return baseAssign(result, value);
      }
    } else {
      return cloneableTags[tag]
        ? initCloneByTag(value, tag, isDeep)
        : (object ? value : {});
    }
  }
  // Check for circular references and return its corresponding clone.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == value) {
      return stackB[length];
    }
  }
  // Add the source value to the stack of traversed objects and associate it with its clone.
  stackA.push(value);
  stackB.push(result);

  // Recursively populate clone (susceptible to call stack limits).
  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
  });
  return result;
}

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

/**
 * Creates a clone of the given array buffer.
 *
 * @private
 * @param {ArrayBuffer} buffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function bufferClone(buffer) {
  var result = new ArrayBuffer(buffer.byteLength),
      view = new Uint8Array(result);

  view.set(new Uint8Array(buffer));
  return result;
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add array properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  var Ctor = object.constructor;
  if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
    Ctor = Object;
  }
  return new Ctor;
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return bufferClone(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      var buffer = object.buffer;
      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      var result = new Ctor(object.source, reFlags.exec(object));
      result.lastIndex = object.lastIndex;
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

module.exports = baseClone;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._arraycopy":57,"lodash._arrayeach":58,"lodash._baseassign":59,"lodash._basefor":61,"lodash.isarray":81,"lodash.keys":94}],57:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],58:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],59:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"lodash._basecopy":60,"lodash.keys":94}],60:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],61:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
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

module.exports = baseFor;

},{}],62:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],63:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],64:[function(require,module,exports){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
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
 * Creates a `_.defaults` or `_.defaultsDeep` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Function} Returns the new defaults function.
 */
function createDefaults(assigner, customizer) {
  return restParam(function(args) {
    var object = args[0];
    if (object == null) {
      return object;
    }
    args.push(customizer);
    return assigner.apply(undefined, args);
  });
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
var defaults = createDefaults(assign, assignDefaults);

module.exports = defaults;

},{"lodash.assign":42,"lodash.restparam":65}],65:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],66:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring');

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"'`]/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeHtmlChar(chr) {
  return htmlEscapes[chr];
}

/**
 * Converts the characters "&", "<", ">", '"', "'", and '`', in `string` to
 * their corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional characters
 * use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't require escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value.
 * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * Backticks are escaped because in Internet Explorer < 9, they can break out
 * of attribute values or HTML comments. See [#102](https://html5sec.org/#102),
 * [#108](https://html5sec.org/#108), and [#133](https://html5sec.org/#133) of
 * the [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
 *
 * When working with HTML you should always quote attribute values to reduce
 * XSS vectors. See [Ryan Grove's article](http://wonko.com/post/html-escaping)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  // Reset `lastIndex` because in IE < 9 `String#replace` does not.
  string = baseToString(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
}

module.exports = escape;

},{"lodash._basetostring":67}],67:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],68:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4,"lodash._arrayeach":69,"lodash._baseeach":70,"lodash._bindcallback":71,"lodash.isarray":81}],69:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],70:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6,"lodash.keys":94}],71:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],72:[function(require,module,exports){
/**
 * lodash 3.2.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseGet = require('lodash._baseget'),
    baseSlice = require('lodash._baseslice'),
    toPath = require('lodash._topath'),
    isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

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
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
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
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
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
 * Checks if `path` is a direct property.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': { 'c': 3 } } };
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b.c');
 * // => true
 *
 * _.has(object, ['a', 'b', 'c']);
 * // => true
 */
function has(object, path) {
  if (object == null) {
    return false;
  }
  var result = hasOwnProperty.call(object, path);
  if (!result && !isKey(path)) {
    path = toPath(path);
    object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
    if (object == null) {
      return false;
    }
    path = last(path);
    result = hasOwnProperty.call(object, path);
  }
  return result || (isLength(object.length) && isIndex(path, object.length) &&
    (isArray(object) || isArguments(object)));
}

module.exports = has;

},{"lodash._baseget":73,"lodash._baseslice":74,"lodash._topath":75,"lodash.isarguments":76,"lodash.isarray":81}],73:[function(require,module,exports){
/**
 * lodash 3.7.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
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

module.exports = baseGet;

},{}],74:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],75:[function(require,module,exports){
/**
 * lodash 3.8.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArray = require('lodash.isarray');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = toPath;

},{"lodash.isarray":81}],76:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],77:[function(require,module,exports){
/**
 * lodash 3.1.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIndexOf = require('lodash._baseindexof'),
    baseValues = require('lodash._basevalues'),
    isIterateeCall = require('lodash._isiterateecall'),
    isArray = require('lodash.isarray'),
    isString = require('lodash.isstring'),
    keys = require('lodash.keys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
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
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is in `collection` using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons. If `fromIndex` is negative, it is used as the offset
 * from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @alias contains, include
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {*} target The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
 * @returns {boolean} Returns `true` if a matching element is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
 * // => true
 *
 * _.includes('pebbles', 'eb');
 * // => true
 */
function includes(collection, target, fromIndex, guard) {
  var length = collection ? getLength(collection) : 0;
  if (!isLength(length)) {
    collection = values(collection);
    length = collection.length;
  }
  if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
    fromIndex = 0;
  } else {
    fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
  }
  return (typeof collection == 'string' || !isArray(collection) && isString(collection))
    ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, target, fromIndex) > -1);
}

/**
 * Creates an array of the own enumerable property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return baseValues(object, keys(object));
}

module.exports = includes;

},{"lodash._baseindexof":78,"lodash._basevalues":79,"lodash._isiterateecall":80,"lodash.isarray":81,"lodash.isstring":92,"lodash.keys":94}],78:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.indexOf` without support for binary searches.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 * If `fromRight` is provided elements of `array` are iterated from right to left.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{}],79:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * returned by `keysFunc`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  var index = -1,
      length = props.length,
      result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
}

module.exports = baseValues;

},{}],80:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],81:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],82:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var dateTag = '[object Date]';

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
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */
function isDate(value) {
  return isObjectLike(value) && objToString.call(value) == dateTag;
}

module.exports = isDate;

},{}],83:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isarguments":84,"lodash.isarray":81,"lodash.isfunction":89,"lodash.isstring":92,"lodash.keys":94}],84:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],85:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIsEqual = require('lodash._baseisequal'),
    bindCallback = require('lodash._bindcallback');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent. If `customizer` is provided it is invoked to compare values.
 * If `customizer` returns `undefined` comparisons are handled by the method
 * instead. The `customizer` is bound to `thisArg` and invoked with three
 * arguments: (value, other [, index|key]).
 *
 * **Note:** This method supports comparing arrays, booleans, `Date` objects,
 * numbers, `Object` objects, regexes, and strings. Objects are compared by
 * their own, not inherited, enumerable properties. Functions and DOM nodes
 * are **not** supported. Provide a customizer function to extend support
 * for comparing other values.
 *
 * @static
 * @memberOf _
 * @alias eq
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize value comparisons.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * object == other;
 * // => false
 *
 * _.isEqual(object, other);
 * // => true
 *
 * // using a customizer callback
 * var array = ['hello', 'goodbye'];
 * var other = ['hi', 'goodbye'];
 *
 * _.isEqual(array, other, function(value, other) {
 *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
 *     return true;
 *   }
 * });
 * // => true
 */
function isEqual(value, other, customizer, thisArg) {
  customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
  var result = customizer ? customizer(value, other) : undefined;
  return  result === undefined ? baseIsEqual(value, other, customizer) : !!result;
}

module.exports = isEqual;

},{"lodash._baseisequal":86,"lodash._bindcallback":88}],86:[function(require,module,exports){
/**
 * lodash 3.0.7 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArray = require('lodash.isarray'),
    isTypedArray = require('lodash.istypedarray'),
    keys = require('lodash.keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

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

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `_.some` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index],
        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

    if (result !== undefined) {
      if (result) {
        continue;
      }
      return false;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isLoose) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          })) {
        return false;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
      return false;
    }
  }
  return true;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} value The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  var skipCtor = isLoose;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key],
        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

    // Recursively compare objects (susceptible to call stack limits).
    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
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

module.exports = baseIsEqual;

},{"lodash.isarray":81,"lodash.istypedarray":87,"lodash.keys":94}],87:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

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
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{}],88:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],89:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],90:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

},{}],91:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

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

module.exports = isObject;

},{}],92:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],93:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;

},{}],94:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"lodash._getnative":95,"lodash.isarguments":96,"lodash.isarray":81}],95:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],96:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],97:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayMap = require('lodash._arraymap'),
    baseDifference = require('lodash._basedifference'),
    baseFlatten = require('lodash._baseflatten'),
    bindCallback = require('lodash._bindcallback'),
    pickByArray = require('lodash._pickbyarray'),
    pickByCallback = require('lodash._pickbycallback'),
    keysIn = require('lodash.keysin'),
    restParam = require('lodash.restparam');

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable properties of `object` that are not omitted.
 * Property names may be specified as individual arguments or as arrays of
 * property names. If `predicate` is provided it is invoked for each property
 * of `object` omitting the properties `predicate` returns truthy for. The
 * predicate is bound to `thisArg` and invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {Function|...(string|string[])} [predicate] The function invoked per
 *  iteration or property names to omit, specified as individual property
 *  names or arrays of property names.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'user': 'fred', 'age': 40 };
 *
 * _.omit(object, 'age');
 * // => { 'user': 'fred' }
 *
 * _.omit(object, _.isNumber);
 * // => { 'user': 'fred' }
 */
var omit = restParam(function(object, props) {
  if (object == null) {
    return {};
  }
  if (typeof props[0] != 'function') {
    var props = arrayMap(baseFlatten(props), String);
    return pickByArray(object, baseDifference(keysIn(object), props));
  }
  var predicate = bindCallback(props[0], props[1], 3);
  return pickByCallback(object, function(value, key, object) {
    return !predicate(value, key, object);
  });
});

module.exports = omit;

},{"lodash._arraymap":98,"lodash._basedifference":99,"lodash._baseflatten":104,"lodash._bindcallback":106,"lodash._pickbyarray":107,"lodash._pickbycallback":108,"lodash.keysin":110,"lodash.restparam":112}],98:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `_.map` for arrays without support for callback
 * shorthands or `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],99:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIndexOf = require('lodash._baseindexof'),
    cacheIndexOf = require('lodash._cacheindexof'),
    createCache = require('lodash._createcache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.difference` which accepts a single array
 * of values to exclude.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values) {
  var length = array ? array.length : 0,
      result = [];

  if (!length) {
    return result;
  }
  var index = -1,
      indexOf = baseIndexOf,
      isCommon = true,
      cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
      valuesLength = values.length;

  if (cache) {
    indexOf = cacheIndexOf;
    isCommon = false;
    values = cache;
  }
  outer:
  while (++index < length) {
    var value = array[index];

    if (isCommon && value === value) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === value) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (indexOf(values, value, 0) < 0) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

},{"lodash._baseindexof":100,"lodash._cacheindexof":101,"lodash._createcache":102}],100:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],101:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is in `cache` mimicking the return signature of
 * `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var data = cache.data,
      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

  return result ? 0 : -1;
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

module.exports = cacheIndexOf;

},{}],102:[function(require,module,exports){
(function (global){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative');

/** Native method references. */
var Set = getNative(global, 'Set');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = getNative(Object, 'create');

/**
 *
 * Creates a cache object to store unique values.
 *
 * @private
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var length = values ? values.length : 0;

  this.data = { 'hash': nativeCreate(null), 'set': new Set };
  while (length--) {
    this.push(values[length]);
  }
}

/**
 * Adds `value` to the cache.
 *
 * @private
 * @name push
 * @memberOf SetCache
 * @param {*} value The value to cache.
 */
function cachePush(value) {
  var data = this.data;
  if (typeof value == 'string' || isObject(value)) {
    data.set.add(value);
  } else {
    data.hash[value] = true;
  }
}

/**
 * Creates a `Set` cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [values] The values to cache.
 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
 */
function createCache(values) {
  return (nativeCreate && Set) ? new SetCache(values) : null;
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

// Add functions to the `Set` cache.
SetCache.prototype.push = cachePush;

module.exports = createCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._getnative":103}],103:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],104:[function(require,module,exports){
/**
 * lodash 3.1.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

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

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

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
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = baseFlatten;

},{"lodash.isarguments":105,"lodash.isarray":81}],105:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],106:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],107:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `_.pick` which picks `object` properties specified
 * by `props`.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property names to pick.
 * @returns {Object} Returns the new object.
 */
function pickByArray(object, props) {
  object = toObject(object);

  var index = -1,
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index];
    if (key in object) {
      result[key] = object[key];
    }
  }
  return result;
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
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

module.exports = pickByArray;

},{}],108:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFor = require('lodash._basefor'),
    keysIn = require('lodash.keysin');

/**
 * The base implementation of `_.forIn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForIn(object, iteratee) {
  return baseFor(object, iteratee, keysIn);
}

/**
 * A specialized version of `_.pick` that picks `object` properties `predicate`
 * returns truthy for.
 *
 * @private
 * @param {Object} object The source object.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Object} Returns the new object.
 */
function pickByCallback(object, predicate) {
  var result = {};
  baseForIn(object, function(value, key, object) {
    if (predicate(value, key, object)) {
      result[key] = value;
    }
  });
  return result;
}

module.exports = pickByCallback;

},{"lodash._basefor":109,"lodash.keysin":110}],109:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],110:[function(require,module,exports){
/**
 * lodash 3.0.8 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

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

module.exports = keysIn;

},{"lodash.isarguments":111,"lodash.isarray":81}],111:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],112:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],113:[function(require,module,exports){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseGet = require('lodash._baseget'),
    baseSlice = require('lodash._baseslice'),
    toPath = require('lodash._topath'),
    isArray = require('lodash.isarray'),
    isFunction = require('lodash.isfunction');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
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
 * This method is like `_.get` except that if the resolved value is a function
 * it is invoked with the `this` binding of its parent object and its result
 * is returned.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to resolve.
 * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
 *
 * _.result(object, 'a[0].b.c1');
 * // => 3
 *
 * _.result(object, 'a[0].b.c2');
 * // => 4
 *
 * _.result(object, 'a.b.c', 'default');
 * // => 'default'
 *
 * _.result(object, 'a.b.c', _.constant('default'));
 * // => 'default'
 */
function result(object, path, defaultValue) {
  var result = object == null ? undefined : object[path];
  if (result === undefined) {
    if (object != null && !isKey(path, object)) {
      path = toPath(path);
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      result = object == null ? undefined : object[last(path)];
    }
    result = result === undefined ? defaultValue : result;
  }
  return isFunction(result) ? result.call(object) : result;
}

module.exports = result;

},{"lodash._baseget":114,"lodash._baseslice":115,"lodash._topath":116,"lodash.isarray":81,"lodash.isfunction":89}],114:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"dup":73}],115:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],116:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75,"lodash.isarray":81}],117:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = require('lodash._baseflatten'),
    baseUniq = require('lodash._baseuniq'),
    restParam = require('lodash.restparam');

/**
 * Creates an array of unique values, in order, of the provided arrays using
 * `SameValueZero` for equality comparisons.
 *
 * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
 * comparisons are like strict equality comparisons, e.g. `===`, except that
 * `NaN` matches `NaN`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([1, 2], [4, 2], [2, 1]);
 * // => [1, 2, 4]
 */
var union = restParam(function(arrays) {
  return baseUniq(baseFlatten(arrays, false, true));
});

module.exports = union;

},{"lodash._baseflatten":118,"lodash._baseuniq":120,"lodash.restparam":125}],118:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104,"lodash.isarguments":119,"lodash.isarray":81}],119:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],120:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIndexOf = require('lodash._baseindexof'),
    cacheIndexOf = require('lodash._cacheindexof'),
    createCache = require('lodash._createcache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniq` without support for callback shorthands
 * and `this` binding.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The function invoked per iteration.
 * @returns {Array} Returns the new duplicate-value-free array.
 */
function baseUniq(array, iteratee) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array.length,
      isCommon = true,
      isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
      seen = isLarge ? createCache() : null,
      result = [];

  if (seen) {
    indexOf = cacheIndexOf;
    isCommon = false;
  } else {
    isLarge = false;
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value, index, array) : value;

    if (isCommon && value === value) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (indexOf(seen, computed, 0) < 0) {
      if (iteratee || isLarge) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;

},{"lodash._baseindexof":121,"lodash._cacheindexof":122,"lodash._createcache":123}],121:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],122:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"dup":101}],123:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"dup":102,"lodash._getnative":124}],124:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],125:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],126:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17,"lodash._basetostring":127}],127:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],128:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-view"] = window.ampersand["ampersand-view"] || [];  window.ampersand["ampersand-view"].push("7.4.2");}
var State = require('ampersand-state');
var CollectionView = require('ampersand-collection-view');
var domify = require('domify');
var uniqueId = require("lodash.uniqueid");
var pick = require("lodash.pick");
var assign = require("lodash.assign");
var forEach = require("lodash.foreach");
var result = require("lodash.result");
var last = require("lodash.last");
var isString = require("lodash.isstring");
var bind = require("lodash.bind");
var flatten = require("lodash.flatten");
var invoke = require("lodash.invoke");
var events = require('events-mixin');
var matches = require('matches-selector');
var bindings = require('ampersand-dom-bindings');
var getPath = require('get-object-path');


function View(attrs) {
    this.cid = uniqueId('view');
    attrs || (attrs = {});
    var parent = attrs.parent;
    delete attrs.parent;
    BaseState.call(this, attrs, {init: false, parent: parent});
    this.on('change:el', this._handleElementChange, this);
    this._parsedBindings = bindings(this.bindings, this);
    this._initializeBindings();
    if (attrs.el && !this.autoRender) {
        this._handleElementChange();
    }
    this._initializeSubviews();
    this.template = attrs.template || this.template;
    this.initialize.apply(this, arguments);
    this.set(pick(attrs, viewOptions));
    if (this.autoRender && this.template) {
        this.render();
    }
}

var BaseState = State.extend({
    dataTypes: {
        element: {
            set: function (newVal) {
                return {
                    val: newVal,
                    type: newVal instanceof Element ? 'element' : typeof newVal
                };
            },
            compare: function (el1, el2) {
                return el1 === el2;
            }
        },
        collection: {
            set: function (newVal) {
                return {
                    val: newVal,
                    type: newVal && newVal.isCollection ? 'collection' : typeof newVal
                };
            },
            compare: function (currentVal, newVal) {
                return currentVal === newVal;
            }
        }
    },
    props: {
        model: 'state',
        el: 'element',
        collection: 'collection'
    },
    derived: {
        rendered: {
            deps: ['el'],
            fn: function () {
                return !!this.el;
            }
        },
        hasData: {
            deps: ['model'],
            fn: function () {
                return !!this.model;
            }
        }
    }
});

// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

// List of view options to be merged as properties.
var viewOptions = ['model', 'collection', 'el'];

View.prototype = Object.create(BaseState.prototype);

// Set up all inheritable properties and methods.
assign(View.prototype, {
    // ## query
    // Get an single element based on CSS selector scoped to this.el
    // if you pass an empty string it return `this.el`.
    // If you pass an element we just return it back.
    // This lets us use `get` to handle cases where users
    // can pass a selector or an already selected element.
    query: function (selector) {
        if (!selector) return this.el;
        if (typeof selector === 'string') {
            if (matches(this.el, selector)) return this.el;
            return this.el.querySelector(selector) || undefined;
        }
        return selector;
    },

    // ## queryAll
    // Returns an array of elements based on CSS selector scoped to this.el
    // if you pass an empty string it return `this.el`. Also includes root
    // element.
    queryAll: function (selector) {
        var res = [];
        if (!this.el) return res;
        if (selector === '') return [this.el];
        if (matches(this.el, selector)) res.push(this.el);
        return res.concat(Array.prototype.slice.call(this.el.querySelectorAll(selector)));
    },

    // ## queryByHook
    // Convenience method for fetching element by it's `data-hook` attribute.
    // Also tries to match against root element.
    // Also supports matching 'one' of several space separated hooks.
    queryByHook: function (hook) {
        return this.query('[data-hook~="' + hook + '"]');
    },

    // ## queryAllByHook
    // Convenience method for fetching all elements by their's `data-hook` attribute.
    queryAllByHook: function (hook) {
        return this.queryAll('[data-hook~="' + hook + '"]');
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function () {},

    // **render** is the core function that your view can override, its job is
    // to populate its element (`this.el`), with the appropriate HTML.
    render: function () {
        this.renderWithTemplate(this);
        return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable events listeners.
    remove: function () {
        var parsedBindings = this._parsedBindings;
        if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
        if (this._subviews) invoke(flatten(this._subviews), 'remove');
        this.trigger('remove', this);
        this.stopListening();
        // TODO: Not sure if this is actually necessary.
        // Just trying to de-reference this potentially large
        // amount of generated functions to avoid memory leaks.
        forEach(parsedBindings, function (properties, modelName) {
            forEach(properties, function (value, key) {
                delete parsedBindings[modelName][key];
            });
            delete parsedBindings[modelName];
        });
        return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    _handleElementChange: function (element, delegate) {
        if (this.eventManager) this.eventManager.unbind();
        this.eventManager = events(this.el, this);
        this.delegateEvents();
        this._applyBindingsForKey();
        return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function (e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function (events) {
        if (!(events || (events = result(this, 'events')))) return this;
        this.undelegateEvents();
        for (var key in events) {
            this.eventManager.bind(key, events[key]);
        }
        return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function () {
        this.eventManager.unbind();
        return this;
    },

    // ## registerSubview
    // Pass it a view. This can be anything with a `remove` method
    registerSubview: function (view) {
        // Storage for our subviews.
        this._subviews || (this._subviews = []);
        this._subviews.push(view);
        // set the parent reference if it has not been set
        if (!view.parent) view.parent = this;
        return view;
    },

    // ## renderSubview
    // Pass it a view instance and a container element
    // to render it in. It's `remove` method will be called
    // when the parent view is destroyed.
    renderSubview: function (view, container) {
        if (typeof container === 'string') {
            container = this.query(container);
        }
        this.registerSubview(view);
        view.render();
        (container || this.el).appendChild(view.el);
        return view;
    },

    _applyBindingsForKey: function (name) {
        if (!this.el) return;
        var fns = this._parsedBindings.getGrouped(name);
        var item;
        for (item in fns) {
            fns[item].forEach(function (fn) {
                fn(this.el, getPath(this, item), last(item.split('.')));
            }, this);
        }
    },

    _initializeBindings: function () {
        if (!this.bindings) return;
        this.on('all', function (eventName) {
            if (eventName.slice(0, 7) === 'change:') {
                this._applyBindingsForKey(eventName.split(':')[1]);
            }
        }, this);
    },

    // ## _initializeSubviews
    // this is called at setup and grabs declared subviews
    _initializeSubviews: function () {
        if (!this.subviews) return;
        for (var item in this.subviews) {
            this._parseSubview(this.subviews[item], item);
        }
    },

    // ## _parseSubview
    // helper for parsing out the subview declaration and registering
    // the `waitFor` if need be.
    _parseSubview: function (subview, name) {
        var self = this;
        var opts = {
            selector: subview.container || '[data-hook="' + subview.hook + '"]',
            waitFor: subview.waitFor || '',
            prepareView: subview.prepareView || function (el) {
                return new subview.constructor({
                    el: el,
                    parent: self
                });
            }
        };
        function action() {
            var el, subview;
            // if not rendered or we can't find our element, stop here.
            if (!this.el || !(el = this.query(opts.selector))) return;
            if (!opts.waitFor || getPath(this, opts.waitFor)) {
                subview = this[name] = opts.prepareView.call(this, el);
                subview.render();
                this.registerSubview(subview);
                this.off('change', action);
            }
        }
        // we listen for main `change` items
        this.on('change', action, this);
    },


    // Shortcut for doing everything we need to do to
    // render and fully replace current root element.
    // Either define a `template` property of your view
    // or pass in a template directly.
    // The template can either be a string or a function.
    // If it's a function it will be passed the `context`
    // argument.
    renderWithTemplate: function (context, templateArg) {
        var template = templateArg || this.template;
        if (!template) throw new Error('Template string or function needed.');
        var newDom = isString(template) ? template : template.call(this, context || this);
        if (isString(newDom)) newDom = domify(newDom);
        var parent = this.el && this.el.parentNode;
        if (parent) parent.replaceChild(newDom, this.el);
        if (newDom.nodeName === '#document-fragment') throw new Error('Views can only have one root element, including comment nodes.');
        this.el = newDom;
        return this;
    },

    // ## cacheElements
    // This is a shortcut for adding reference to specific elements within your view for
    // access later. This avoids excessive DOM queries and makes it easier to update
    // your view if your template changes.
    //
    // In your `render` method. Use it like so:
    //
    //     render: function () {
    //       this.basicRender();
    //       this.cacheElements({
    //         pages: '#pages',
    //         chat: '#teamChat',
    //         nav: 'nav#views ul',
    //         me: '#me',
    //         cheatSheet: '#cheatSheet',
    //         omniBox: '#awesomeSauce'
    //       });
    //     }
    //
    // Then later you can access elements by reference like so: `this.pages`, or `this.chat`.
    cacheElements: function (hash) {
        for (var item in hash) {
            this[item] = this.query(hash[item]);
        }
        return this;
    },

    // ## listenToAndRun
    // Shortcut for registering a listener for a model
    // and also triggering it right away.
    listenToAndRun: function (object, events, handler) {
        var bound = bind(handler, this);
        this.listenTo(object, events, bound);
        bound();
    },

    // ## animateRemove
    // Placeholder for if you want to do something special when they're removed.
    // For example fade it out, etc.
    // Any override here should call `.remove()` when done.
    animateRemove: function () {
        this.remove();
    },

    // ## renderCollection
    // Method for rendering a collections with individual views.
    // Just pass it the collection, and the view to use for the items in the
    // collection. The collectionView is returned.
    renderCollection: function (collection, ViewClass, container, opts) {
        var containerEl = (typeof container === 'string') ? this.query(container) : container;
        var config = assign({
            collection: collection,
            el: containerEl || this.el,
            view: ViewClass,
            parent: this,
            viewOptions: {
                parent: this
            }
        }, opts);
        var collectionView = new CollectionView(config);
        collectionView.render();
        return this.registerSubview(collectionView);
    }
});

View.extend = BaseState.extend;
module.exports = View;

},{"ampersand-collection-view":129,"ampersand-dom-bindings":165,"ampersand-state":36,"domify":168,"events-mixin":169,"get-object-path":174,"lodash.assign":175,"lodash.bind":186,"lodash.flatten":192,"lodash.foreach":197,"lodash.invoke":205,"lodash.isstring":216,"lodash.last":217,"lodash.pick":218,"lodash.result":230,"lodash.uniqueid":236,"matches-selector":238}],129:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-collection-view"] = window.ampersand["ampersand-collection-view"] || [];  window.ampersand["ampersand-collection-view"].push("1.4.0");}
var assign = require('lodash.assign');
var invoke = require('lodash.invoke');
var pick = require('lodash.pick');
var find = require('lodash.find');
var difference = require('lodash.difference');
var Events = require('ampersand-events');
var ampExtend = require('ampersand-class-extend');

// options
var options = ['collection', 'el', 'viewOptions', 'view', 'emptyView', 'filter', 'reverse', 'parent'];


function CollectionView(spec) {
    if (!spec) {
        throw new ReferenceError('Collection view missing required parameters: collection, el');
    }
    if (!spec.collection) {
        throw new ReferenceError('Collection view requires a collection');
    }
    if (!spec.el && !this.insertSelf) {
        throw new ReferenceError('Collection view requires an el');
    }
    assign(this, pick(spec, options));
    this.views = [];
    this.listenTo(this.collection, 'add', this._addViewForModel);
    this.listenTo(this.collection, 'remove', this._removeViewForModel);
    this.listenTo(this.collection, 'sort', this._rerenderAll);
    this.listenTo(this.collection, 'refresh reset', this._reset);
}

assign(CollectionView.prototype, Events, {
    // for view contract compliance
    render: function () {
        this._renderAll();
        return this;
    },
    remove: function () {
        invoke(this.views, 'remove');
        this.stopListening();
    },
    _getViewByModel: function (model) {
        return find(this.views, function (view) {
            return model === view.model;
        });
    },
    _createViewForModel: function (model, renderOpts) {
        var defaultViewOptions = {model: model, collection: this.collection, parent: this};
        var view = new this.view(assign(defaultViewOptions, this.viewOptions));
        this.views.push(view);
        view.renderedByParentView = true;
        view.render(renderOpts);
        return view;
    },
    _getOrCreateByModel: function (model, renderOpts) {
        return this._getViewByModel(model) || this._createViewForModel(model, renderOpts);
    },
    _addViewForModel: function (model, collection, options) {
        var matches = this.filter ? this.filter(model) : true;
        if (!matches) {
            return;
        }
        if (this.renderedEmptyView) {
            this.renderedEmptyView.remove();
            delete this.renderedEmptyView;
        }
        var view = this._getOrCreateByModel(model, {containerEl: this.el});
        if (options && options.rerender) {
            this._insertView(view);
        } else {
            this._insertViewAtIndex(view);
        }
    },
    _insertViewAtIndex: function (view) {
        if (!view.insertSelf) {
            var pos = this.collection.indexOf(view.model);
            var modelToInsertBefore, viewToInsertBefore;

            if (this.reverse) {
                modelToInsertBefore = this.collection.at(pos - 1);
            } else {
                modelToInsertBefore = this.collection.at(pos + 1);
            }

            viewToInsertBefore = this._getViewByModel(modelToInsertBefore);

            // FIX IE bug (https://developer.mozilla.org/en-US/docs/Web/API/Node.insertBefore)
            // "In Internet Explorer an undefined value as referenceElement will throw errors, while in rest of the modern browsers, this works fine."
            if(viewToInsertBefore) {
                this.el.insertBefore(view.el, viewToInsertBefore && viewToInsertBefore.el);
            } else {
                this.el.appendChild(view.el);
            }
        }
    },
    _insertView: function (view) {
        if (!view.insertSelf) {
            if (this.reverse && this.el.firstChild) {
                this.el.insertBefore(view.el, this.el.firstChild);
            } else {
                this.el.appendChild(view.el);
            }
        }
    },
    _removeViewForModel: function (model) {
        var view = this._getViewByModel(model);
        if (!view) {
            return;
        }
        var index = this.views.indexOf(view);
        if (index !== -1) {
            // remove it if we found it calling animateRemove
            // to give user option of gracefully destroying.
            view = this.views.splice(index, 1)[0];
            this._removeView(view);
            if (this.views.length === 0) {
                this._renderEmptyView();
            }
        }
    },
    _removeView: function (view) {
        if (view.animateRemove) {
            view.animateRemove();
        } else {
            view.remove();
        }
    },
    _renderAll: function () {
        this.collection.each(this._addViewForModel, this);
        if (this.views.length === 0) {
            this._renderEmptyView();
        }
    },
    _rerenderAll: function (collection, options) {
        options = options || {};
        this.collection.each(function (model) {
            this._addViewForModel(model, this, assign(options, {rerender: true}));
        }, this);
    },
    _renderEmptyView: function() {
        if (this.emptyView && !this.renderedEmptyView) {
            var view = this.renderedEmptyView = new this.emptyView({parent: this});
            this.el.appendChild(view.render().el);
        }
    },
    _reset: function () {
        var newViews = this.collection.map(this._getOrCreateByModel, this);

        //Remove existing views from the ui
        var toRemove = difference(this.views, newViews);
        toRemove.forEach(this._removeView, this);

        //Rerender the full list with the new views
        this.views = newViews;
        this._rerenderAll();
        if (this.views.length === 0) {
            this._renderEmptyView();
        }
    }
});

CollectionView.extend = ampExtend;

module.exports = CollectionView;

},{"ampersand-class-extend":130,"ampersand-events":131,"lodash.assign":175,"lodash.difference":142,"lodash.find":152,"lodash.invoke":205,"lodash.pick":218}],130:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2,"lodash.assign":175}],131:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3,"lodash.assign":175,"lodash.bind":186,"lodash.foreach":197,"lodash.isempty":132,"lodash.keys":136,"lodash.once":140,"lodash.uniqueid":236}],132:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isarguments":133,"lodash.isarray":134,"lodash.isfunction":135,"lodash.isstring":216,"lodash.keys":136}],133:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],134:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],135:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],136:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"lodash._getnative":137,"lodash.isarguments":138,"lodash.isarray":139}],137:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],138:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],139:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],140:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"lodash.before":141}],141:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],142:[function(require,module,exports){
/**
 * lodash 3.2.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseDifference = require('lodash._basedifference'),
    baseFlatten = require('lodash._baseflatten'),
    restParam = require('lodash.restparam');

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

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
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
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Creates an array of unique `array` values not included in the other
 * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The arrays of values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.difference([1, 2, 3], [4, 2]);
 * // => [1, 3]
 */
var difference = restParam(function(array, values) {
  return (isObjectLike(array) && isArrayLike(array))
    ? baseDifference(array, baseFlatten(values, false, true))
    : [];
});

module.exports = difference;

},{"lodash._basedifference":143,"lodash._baseflatten":148,"lodash.restparam":151}],143:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"dup":99,"lodash._baseindexof":144,"lodash._cacheindexof":145,"lodash._createcache":146}],144:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],145:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"dup":101}],146:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"dup":102,"lodash._getnative":147}],147:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],148:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104,"lodash.isarguments":149,"lodash.isarray":150}],149:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],150:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],151:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],152:[function(require,module,exports){
/**
 * lodash 3.2.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseCallback = require('lodash._basecallback'),
    baseEach = require('lodash._baseeach'),
    baseFind = require('lodash._basefind'),
    baseFindIndex = require('lodash._basefindindex'),
    isArray = require('lodash.isarray');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new find function.
 */
function createFind(eachFunc, fromRight) {
  return function(collection, predicate, thisArg) {
    predicate = baseCallback(predicate, thisArg, 3);
    if (isArray(collection)) {
      var index = baseFindIndex(collection, predicate, fromRight);
      return index > -1 ? collection[index] : undefined;
    }
    return baseFind(collection, predicate, eachFunc);
  };
}

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.result(_.find(users, function(chr) {
 *   return chr.age < 40;
 * }), 'user');
 * // => 'barney'
 *
 * // using the `_.matches` callback shorthand
 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
 * // => 'pebbles'
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.result(_.find(users, 'active', false), 'user');
 * // => 'fred'
 *
 * // using the `_.property` callback shorthand
 * _.result(_.find(users, 'active'), 'user');
 * // => 'barney'
 */
var find = createFind(baseEach);

module.exports = find;

},{"lodash._basecallback":153,"lodash._baseeach":158,"lodash._basefind":159,"lodash._basefindindex":160,"lodash.isarray":161}],153:[function(require,module,exports){
/**
 * lodash 3.3.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIsEqual = require('lodash._baseisequal'),
    bindCallback = require('lodash._bindcallback'),
    isArray = require('lodash.isarray'),
    pairs = require('lodash.pairs');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return thisArg === undefined
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return thisArg === undefined
    ? property(func)
    : baseMatchesProperty(func, thisArg);
}

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} matchData The propery names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = toObject(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    var key = matchData[0][0],
        value = matchData[0][1];

    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === value && (value !== undefined || (key in toObject(object)));
    };
  }
  return function(object) {
    return baseIsMatch(object, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, srcValue) {
  var isArr = isArray(path),
      isCommon = isKey(path) && isStrictComparable(srcValue),
      pathKey = (path + '');

  path = toPath(path);
  return function(object) {
    if (object == null) {
      return false;
    }
    var key = pathKey;
    object = toObject(object);
    if ((isArr || !isCommon) && !(key in object)) {
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      if (object == null) {
        return false;
      }
      key = last(path);
      object = toObject(object);
    }
    return object[key] === srcValue
      ? (srcValue !== undefined || (key in object))
      : baseIsEqual(srcValue, object[key], undefined, true);
  };
}

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
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  var pathKey = (path + '');
  path = toPath(path);
  return function(object) {
    return baseGet(object, path, pathKey);
  };
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Gets the propery names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = pairs(object),
      length = result.length;

  while (length--) {
    result[length][2] = isStrictComparable(result[length][1]);
  }
  return result;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
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

/**
 * Creates a function that returns the property value at `path` on a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': { 'c': 2 } } },
 *   { 'a': { 'b': { 'c': 1 } } }
 * ];
 *
 * _.map(objects, _.property('a.b.c'));
 * // => [2, 1]
 *
 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}

module.exports = baseCallback;

},{"lodash._baseisequal":154,"lodash._bindcallback":156,"lodash.isarray":161,"lodash.pairs":157}],154:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"dup":86,"lodash.isarray":161,"lodash.istypedarray":155,"lodash.keys":162}],155:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],156:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],157:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var keys = require('lodash.keys');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
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
 * Creates a two dimensional array of the key-value pairs for `object`,
 * e.g. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
 */
function pairs(object) {
  object = toObject(object);

  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"lodash.keys":162}],158:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6,"lodash.keys":162}],159:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
 * without support for callback shorthands and `this` binding, which iterates
 * over `collection` using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @param {boolean} [retKey] Specify returning the key of the found element
 *  instead of the element itself.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFind(collection, predicate, eachFunc, retKey) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = retKey ? key : value;
      return false;
    }
  });
  return result;
}

module.exports = baseFind;

},{}],160:[function(require,module,exports){
/**
 * lodash 3.6.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for callback shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],161:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],162:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"lodash._getnative":163,"lodash.isarguments":164,"lodash.isarray":161}],163:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],164:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],165:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-dom-bindings"] = window.ampersand["ampersand-dom-bindings"] || [];  window.ampersand["ampersand-dom-bindings"].push("3.5.0");}
var Store = require('key-tree-store');
var dom = require('ampersand-dom');
var matchesSelector = require('matches-selector');


// returns a key-tree-store of functions
// that can be applied to any element/model.

// all resulting functions should be called
// like func(el, value, lastKeyName)
module.exports = function (bindings, context) {
    var store = new Store();
    var key, current;

    for (key in bindings) {
        current = bindings[key];
        if (typeof current === 'string') {
            store.add(key, getBindingFunc({
                type: 'text',
                selector: current
            }));
        } else if (current.forEach) {
            current.forEach(function (binding) {
                store.add(key, getBindingFunc(binding, context));
            });
        } else {
            store.add(key, getBindingFunc(current, context));
        }
    }

    return store;
};


var slice = Array.prototype.slice;

function getMatches(el, selector) {
    if (selector === '') return [el];
    var matches = [];
    if (matchesSelector(el, selector)) matches.push(el);
    return matches.concat(slice.call(el.querySelectorAll(selector)));
}

function setAttributes(el, attrs) {
    for (var name in attrs) {
        dom.setAttribute(el, name, attrs[name]);
    }
}

function removeAttributes(el, attrs) {
    for (var name in attrs) {
        dom.removeAttribute(el, name);
    }
}

function makeArray(val) {
    return Array.isArray(val) ? val : [val];
}

function getBindingFunc(binding, context) {
    var type = binding.type || 'text';
    var isCustomBinding = typeof type === 'function';
    var selector = (function () {
        if (typeof binding.selector === 'string') {
            return binding.selector;
        } else if (binding.hook) {
            return '[data-hook~="' + binding.hook + '"]';
        } else {
            return '';
        }
    })();
    var yes = binding.yes;
    var no = binding.no;
    var hasYesNo = !!(yes || no);

    // storage variable for previous if relevant
    var previousValue;

    if (isCustomBinding) {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                type.call(context, match, value, previousValue);
            });
            previousValue = value;
        };
    } else if (type === 'text') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                dom.text(match, value);
            });
        };
    } else if (type === 'class') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                dom.switchClass(match, previousValue, value);
            });
            previousValue = value;
        };
    } else if (type === 'attribute') {
        if (!binding.name) throw Error('attribute bindings must have a "name"');
        return function (el, value) {
            var names = makeArray(binding.name);
            getMatches(el, selector).forEach(function (match) {
                names.forEach(function (name) {
                    dom.setAttribute(match, name, value);
                });
            });
            previousValue = value;
        };
    } else if (type === 'value') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                if (!value && value !== 0) value = '';
                // only apply bindings if element is not currently focused
                if (document.activeElement !== match) match.value = value;
            });
            previousValue = value;
        };
    } else if (type === 'booleanClass') {
        // if there's a `no` case this is actually a switch
        if (hasYesNo) {
            yes = makeArray(yes || '');
            no = makeArray(no || '');
            return function (el, value) {
                var prevClass = value ? no : yes;
                var newClass = value ? yes : no;
                getMatches(el, selector).forEach(function (match) {
                    prevClass.forEach(function (pc) {
                        dom.removeClass(match, pc);
                    });
                    newClass.forEach(function (nc) {
                        dom.addClass(match, nc);
                    });
                });
            };
        } else {
            return function (el, value, keyName) {
                var name = makeArray(binding.name || keyName);
                getMatches(el, selector).forEach(function (match) {
                    name.forEach(function (className) {
                        dom[value ? 'addClass' : 'removeClass'](match, className);
                    });
                });
            };
        }
    } else if (type === 'booleanAttribute') {
        // if there are `yes` and `no` selectors, this swaps between them
        if (hasYesNo) {
            yes = makeArray(yes || '');
            no = makeArray(no || '');
            return function (el, value) {
                var prevAttribute = value ? no : yes;
                var newAttribute = value ? yes : no;
                getMatches(el, selector).forEach(function (match) {
                    prevAttribute.forEach(function (pa) {
                        if (pa) {
                            dom.removeAttribute(match, pa);
                        }
                    });
                    newAttribute.forEach(function (na) {
                        if (na) {
                            dom.addAttribute(match, na);
                        }
                    });
                });
            };
        } else {
            return function (el, value, keyName) {
                var name = makeArray(binding.name || keyName);
                getMatches(el, selector).forEach(function (match) {
                    name.forEach(function (attr) {
                        dom[value ? 'addAttribute' : 'removeAttribute'](match, attr);
                    });
                });
            };
        }
    } else if (type === 'toggle') {
        var mode = (binding.mode || 'display');
        // this doesn't require a selector since we can pass yes/no selectors
        if (hasYesNo) {
            return function (el, value) {
                getMatches(el, yes).forEach(function (match) {
                    dom[value ? 'show' : 'hide'](match, mode);
                });
                getMatches(el, no).forEach(function (match) {
                    dom[value ? 'hide' : 'show'](match, mode);
                });
            };
        } else {
            return function (el, value) {
                getMatches(el, selector).forEach(function (match) {
                    dom[value ? 'show' : 'hide'](match, mode);
                });
            };
        }
    } else if (type === 'switch') {
        if (!binding.cases) throw Error('switch bindings must have "cases"');
        return function (el, value) {
            for (var item in binding.cases) {
                getMatches(el, binding.cases[item]).forEach(function (match) {
                    dom[value === item ? 'show' : 'hide'](match);
                });
            }
        };
    } else if (type === 'innerHTML') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                dom.html(match, value);
            });
        };
    } else if (type === 'switchClass') {
        if (!binding.cases) throw Error('switchClass bindings must have "cases"');
        return function (el, value, keyName) {
            var name = makeArray(binding.name || keyName);
            for (var item in binding.cases) {
                getMatches(el, binding.cases[item]).forEach(function (match) {
                    name.forEach(function (className) {
                        dom[value === item ? 'addClass' : 'removeClass'](match, className);
                    });
                });
            }
        };
    } else if (type === 'switchAttribute') {
        if (!binding.cases) throw Error('switchAttribute bindings must have "cases"');
        return function (el, value, keyName) {
            getMatches(el, selector).forEach(function (match) {
                if (previousValue) {
                    removeAttributes(match, previousValue);
                }

                if (value in binding.cases) {
                    var attrs = binding.cases[value];
                    if (typeof attrs === 'string') {
                        attrs = {};
                        attrs[binding.name || keyName] = binding.cases[value];
                    }
                    setAttributes(match, attrs);

                    previousValue = attrs;
                }
            });
        };
    } else {
        throw new Error('no such binding type: ' + type);
    }
}

},{"ampersand-dom":166,"key-tree-store":167,"matches-selector":238}],166:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-dom"] = window.ampersand["ampersand-dom"] || [];  window.ampersand["ampersand-dom"].push("1.4.0");}
var dom = module.exports = {
    text: function (el, val) {
        el.textContent = getString(val);
    },
    // optimize if we have classList
    addClass: function (el, cls) {
        cls = getString(cls);
        if (!cls) return;
        if (Array.isArray(cls)) {
            cls.forEach(function(c) {
                dom.addClass(el, c);
            });
        } else if (el.classList) {
            el.classList.add(cls);
        } else {
            if (!hasClass(el, cls)) {
                if (el.classList) {
                    el.classList.add(cls);
                } else {
                    el.className += ' ' + cls;
                }
            }
        }
    },
    removeClass: function (el, cls) {
        if (Array.isArray(cls)) {
            cls.forEach(function(c) {
                dom.removeClass(el, c);
            });
        } else if (el.classList) {
            cls = getString(cls);
            if (cls) el.classList.remove(cls);
        } else {
            // may be faster to not edit unless we know we have it?
            el.className = el.className.replace(new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },
    hasClass: hasClass,
    switchClass: function (el, prevCls, newCls) {
        if (prevCls) this.removeClass(el, prevCls);
        this.addClass(el, newCls);
    },
    // makes sure attribute (with no content) is added
    // if exists it will be cleared of content
    addAttribute: function (el, attr) {
        // setting to empty string does same
        el.setAttribute(attr, '');
        // Some browsers won't update UI for boolean attributes unless you
        // set it directly. So we do both
        if (hasBooleanProperty(el, attr)) el[attr] = true;
    },
    // completely removes attribute
    removeAttribute: function (el, attr) {
        el.removeAttribute(attr);
        if (hasBooleanProperty(el, attr)) el[attr] = false;
    },
    // sets attribute to string value given, clearing any current value
    setAttribute: function (el, attr, value) {
        el.setAttribute(attr, getString(value));
    },
    getAttribute: function (el, attr) {
        return el.getAttribute(attr);
    },
    hasAttribute: function (el, attr) {
        return el.hasAttribute(attr);
    },
    hide: function (el, mode) {
        if (!mode) mode = 'display';
        if (!isHidden(el)) {
            storeDisplayStyle(el, mode);
            hide(el, mode);
        }
    },
    // show element
    show: function (el, mode) {
        if (!mode) mode = 'display';
        show(el, mode);
    },
    html: function (el, content) {
        el.innerHTML = content;
    }
};

// helpers
function getString(val) {
    if (!val && val !== 0) {
        return '';
    } else {
        return val;
    }
}

function hasClass(el, cls) {
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return new RegExp('(^| )' + cls + '( |$)', 'gi').test(el.className);
    }
}

function hasBooleanProperty(el, prop) {
    var val = el[prop];
    return prop in el && (val === true || val === false);
}

function isHidden (el) {
    return dom.getAttribute(el, 'data-anddom-hidden') === 'true';
}

function storeDisplayStyle (el, mode) {
    dom.setAttribute(el, 'data-anddom-' + mode, el.style[mode]);
}

function show (el, mode) {
    el.style[mode] = dom.getAttribute(el, 'data-anddom-' + mode) || '';
    dom.removeAttribute(el, 'data-anddom-hidden');
}

function hide (el, mode) {
    dom.setAttribute(el, 'data-anddom-hidden', 'true');
    el.style[mode] = (mode === 'visibility' ? 'hidden' : 'none');
}

},{}],167:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],168:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var div = document.createElement('div');
// Setup
div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
var innerHTMLBug = !div.getElementsByTagName('link').length;
div = undefined;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],169:[function(require,module,exports){

/**
 * Module dependencies.
 */

var events = require('component-event');
var delegate = require('delegate-events');
var forceCaptureEvents = ['focus', 'blur'];

/**
 * Expose `Events`.
 */

module.exports = Events;

/**
 * Initialize an `Events` with the given
 * `el` object which events will be bound to,
 * and the `obj` which will receive method calls.
 *
 * @param {Object} el
 * @param {Object} obj
 * @api public
 */

function Events(el, obj) {
  if (!(this instanceof Events)) return new Events(el, obj);
  if (!el) throw new Error('element required');
  if (!obj) throw new Error('object required');
  this.el = el;
  this.obj = obj;
  this._events = {};
}

/**
 * Subscription helper.
 */

Events.prototype.sub = function(event, method, cb){
  this._events[event] = this._events[event] || {};
  this._events[event][method] = cb;
};

/**
 * Bind to `event` with optional `method` name.
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 * Examples:
 *
 *  Direct event handling:
 *
 *    events.bind('click') // implies "onclick"
 *    events.bind('click', 'remove')
 *    events.bind('click', 'sort', 'asc')
 *
 *  Delegated event handling:
 *
 *    events.bind('click li > a')
 *    events.bind('click li > a', 'remove')
 *    events.bind('click a.sort-ascending', 'sort', 'asc')
 *    events.bind('click a.sort-descending', 'sort', 'desc')
 *
 * @param {String} event
 * @param {String|function} [method]
 * @return {Function} callback
 * @api public
 */

Events.prototype.bind = function(event, method){
  var e = parse(event);
  var el = this.el;
  var obj = this.obj;
  var name = e.name;
  var method = method || 'on' + name;
  var args = [].slice.call(arguments, 2);

  // callback
  function cb(){
    var a = [].slice.call(arguments).concat(args);

    if (typeof method === 'function') {
        method.apply(obj, a);    
        return;
    }
    
    if (!obj[method]) {
        throw new Error(method + ' method is not defined');
    } else {
        obj[method].apply(obj, a);
    }
  }

  // bind
  if (e.selector) {
    cb = delegate.bind(el, e.selector, name, cb);
  } else {
    events.bind(el, name, cb);
  }

  // subscription for unbinding
  this.sub(name, method, cb);

  return cb;
};

/**
 * Unbind a single binding, all bindings for `event`,
 * or all bindings within the manager.
 *
 * Examples:
 *
 *  Unbind direct handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * Unbind delegate handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * @param {String|Function} [event]
 * @param {String|Function} [method]
 * @api public
 */

Events.prototype.unbind = function(event, method){
  if (0 == arguments.length) return this.unbindAll();
  if (1 == arguments.length) return this.unbindAllOf(event);

  // no bindings for this event
  var bindings = this._events[event];
  var capture = (forceCaptureEvents.indexOf(event) !== -1);
  if (!bindings) return;

  // no bindings for this method
  var cb = bindings[method];
  if (!cb) return;

  events.unbind(this.el, event, cb, capture);
};

/**
 * Unbind all events.
 *
 * @api private
 */

Events.prototype.unbindAll = function(){
  for (var event in this._events) {
    this.unbindAllOf(event);
  }
};

/**
 * Unbind all events for `event`.
 *
 * @param {String} event
 * @api private
 */

Events.prototype.unbindAllOf = function(event){
  var bindings = this._events[event];
  if (!bindings) return;

  for (var method in bindings) {
    this.unbind(event, method);
  }
};

/**
 * Parse `event`.
 *
 * @param {String} event
 * @return {Object}
 * @api private
 */

function parse(event) {
  var parts = event.split(/ +/);
  return {
    name: parts.shift(),
    selector: parts.join(' ')
  }
}

},{"component-event":170,"delegate-events":171}],170:[function(require,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
},{}],171:[function(require,module,exports){
/**
 * Module dependencies.
 */

var closest = require('closest')
  , event = require('component-event');

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

// Some events don't bubble, so we want to bind to the capture phase instead
// when delegating.
var forceCaptureEvents = ['focus', 'blur'];

exports.bind = function(el, selector, type, fn, capture){
  if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

  return event.bind(el, type, function(e){
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

  event.unbind(el, type, fn, capture);
};

},{"closest":172,"component-event":170}],172:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":173}],173:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],174:[function(require,module,exports){
module.exports = get;

function get (context, path) {
  if (path.indexOf('.') == -1 && path.indexOf('[') == -1) {
    return context[path];
  }

  var crumbs = path.split(/\.|\[|\]/g);
  var i = -1;
  var len = crumbs.length;
  var result;

  while (++i < len) {
    if (i == 0) result = context;
    if (!crumbs[i]) continue;
    if (result == undefined) break;
    result = result[crumbs[i]];
  }

  return result;
}

},{}],175:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19,"lodash._baseassign":176,"lodash._createassigner":178,"lodash.keys":182}],176:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"lodash._basecopy":177,"lodash.keys":182}],177:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],178:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22,"lodash._bindcallback":179,"lodash._isiterateecall":180,"lodash.restparam":181}],179:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],180:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],181:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],182:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"lodash._getnative":183,"lodash.isarguments":184,"lodash.isarray":185}],183:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],184:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],185:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],186:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29,"lodash._createwrapper":187,"lodash._replaceholders":190,"lodash.restparam":191}],187:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30,"lodash._arraycopy":188,"lodash._basecreate":189,"lodash._replaceholders":190}],188:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],189:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],190:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],191:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],192:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = require('lodash._baseflatten'),
    isIterateeCall = require('lodash._isiterateecall');

/**
 * Flattens a nested array. If `isDeep` is `true` the array is recursively
 * flattened, otherwise it is only flattened a single level.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, 3, [4]]]);
 * // => [1, 2, 3, [4]]
 *
 * // using `isDeep`
 * _.flatten([1, [2, 3, [4]]], true);
 * // => [1, 2, 3, 4]
 */
function flatten(array, isDeep, guard) {
  var length = array ? array.length : 0;
  if (guard && isIterateeCall(array, isDeep, guard)) {
    isDeep = false;
  }
  return length ? baseFlatten(array, isDeep) : [];
}

module.exports = flatten;

},{"lodash._baseflatten":193,"lodash._isiterateecall":196}],193:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104,"lodash.isarguments":194,"lodash.isarray":195}],194:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],195:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],196:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],197:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4,"lodash._arrayeach":198,"lodash._baseeach":199,"lodash._bindcallback":203,"lodash.isarray":204}],198:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],199:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6,"lodash.keys":200}],200:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"lodash._getnative":201,"lodash.isarguments":202,"lodash.isarray":204}],201:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],202:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],203:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],204:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],205:[function(require,module,exports){
/**
 * lodash 3.2.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseEach = require('lodash._baseeach'),
    invokePath = require('lodash._invokepath'),
    isArray = require('lodash.isarray'),
    restParam = require('lodash.restparam');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
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
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Invokes the method at `path` of each element in `collection`, returning
 * an array of the results of each invoked method. Any additional arguments
 * are provided to each invoked method. If `methodName` is a function it is
 * invoked for, and `this` bound to, each element in `collection`.
 *
 * @static
 * @memberOf _
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Array|Function|string} path The path of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invoke([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */
var invoke = restParam(function(collection, path, args) {
  var index = -1,
      isFunc = typeof path == 'function',
      isProp = isKey(path),
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value) {
    var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
    result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
  });
  return result;
});

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

module.exports = invoke;

},{"lodash._baseeach":206,"lodash._invokepath":210,"lodash.isarray":214,"lodash.restparam":215}],206:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6,"lodash.keys":207}],207:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"lodash._getnative":208,"lodash.isarguments":209,"lodash.isarray":214}],208:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],209:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],210:[function(require,module,exports){
/**
 * lodash 3.7.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseGet = require('lodash._baseget'),
    baseSlice = require('lodash._baseslice'),
    toPath = require('lodash._topath'),
    isArray = require('lodash.isarray');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Invokes the method at `path` on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {Array} args The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 */
function invokePath(object, path, args) {
  if (object != null && !isKey(path, object)) {
    path = toPath(path);
    object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
    path = last(path);
  }
  var func = object == null ? object : object[path];
  return func == null ? undefined : func.apply(object, args);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
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

module.exports = invokePath;

},{"lodash._baseget":211,"lodash._baseslice":212,"lodash._topath":213,"lodash.isarray":214}],211:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"dup":73}],212:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],213:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75,"lodash.isarray":214}],214:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],215:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],216:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],217:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],218:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = require('lodash._baseflatten'),
    bindCallback = require('lodash._bindcallback'),
    pickByArray = require('lodash._pickbyarray'),
    pickByCallback = require('lodash._pickbycallback'),
    restParam = require('lodash.restparam');

/**
 * Creates an object composed of the picked `object` properties. Property
 * names may be specified as individual arguments or as arrays of property
 * names. If `predicate` is provided it is invoked for each property of `object`
 * picking the properties `predicate` returns truthy for. The predicate is
 * bound to `thisArg` and invoked with three arguments: (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {Function|...(string|string[])} [predicate] The function invoked per
 *  iteration or property names to pick, specified as individual property
 *  names or arrays of property names.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'user': 'fred', 'age': 40 };
 *
 * _.pick(object, 'user');
 * // => { 'user': 'fred' }
 *
 * _.pick(object, _.isString);
 * // => { 'user': 'fred' }
 */
var pick = restParam(function(object, props) {
  if (object == null) {
    return {};
  }
  return typeof props[0] == 'function'
    ? pickByCallback(object, bindCallback(props[0], props[1], 3))
    : pickByArray(object, baseFlatten(props));
});

module.exports = pick;

},{"lodash._baseflatten":219,"lodash._bindcallback":222,"lodash._pickbyarray":223,"lodash._pickbycallback":224,"lodash.restparam":229}],219:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104,"lodash.isarguments":220,"lodash.isarray":221}],220:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],221:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],222:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],223:[function(require,module,exports){
arguments[4][107][0].apply(exports,arguments)
},{"dup":107}],224:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"dup":108,"lodash._basefor":225,"lodash.keysin":226}],225:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],226:[function(require,module,exports){
arguments[4][110][0].apply(exports,arguments)
},{"dup":110,"lodash.isarguments":227,"lodash.isarray":228}],227:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],228:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],229:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],230:[function(require,module,exports){
arguments[4][113][0].apply(exports,arguments)
},{"dup":113,"lodash._baseget":231,"lodash._baseslice":232,"lodash._topath":233,"lodash.isarray":234,"lodash.isfunction":235}],231:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"dup":73}],232:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],233:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75,"lodash.isarray":234}],234:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],235:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],236:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17,"lodash._basetostring":237}],237:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],238:[function(require,module,exports){
'use strict';

var proto = Element.prototype;
var vendor = proto.matches
  || proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],239:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}

},{}],240:[function(require,module,exports){
'use strict';
/* global require: false, module: false, less: false */

require('./classList');
var State = require('ampersand-state');
var Collection = require('ampersand-collection');
var View = require('ampersand-view');


var VariableState = State.extend({
  props: {
    name: {
      type: 'string',
      required: true
    },
    value: 'string',
    filename: 'string'
  },

  session: {
    original: {
      type: 'string'
    }
  },

  derived: {
    changed: {
      deps: ['original', 'value'],
      fn: function () {
        return this.original !== this.value;
      }
    }
  }
});

var VariablesCollection = Collection.extend({
  mainIndex: 'name',
  model: VariableState,
  toObj: function () {
    var obj = {};

    this.forEach(function (variable) {
      obj[variable.name] = variable.value;
    });

    return obj;
  }
});


var VariableView = View.extend({
  template: '<li>' +
              '<label></label>' +
              '<div>' +
                '<input type="text" />' +
                '<a title="reset">×</a>' +
              '</div>' +
              '<span></span>' +
            '</li>',

  bindings: {
    'model.name': {
      type: 'text',
      selector: 'label'
    },
    'model.value': {
      type: 'value',
      selector: 'input'
    },
    'model.changed': {
      type: 'booleanClass',
      name: 'changed'
    },
    'model.filename': [
      {
        type: 'toggle',
        selector: 'span'
      },
      {
        type: 'text',
        selector: 'span'
      }
    ],
    'parent.compiling': {
      selector: 'input',
      type: 'booleanAttribute',
      name: 'disabled'
    },
    cid: [
      {
        type: 'attribute',
        name: 'for',
        selector: 'label'
      },
      {
        type: 'attribute',
        name: 'id',
        selector: 'input'
      }
    ]
  },

  events: {
    'focus input':  '_handleInputFocus',
    'change input': '_handleInputChange',
    'click a':      '_handleResetClick'
  },

  _handleInputFocus: function (evt) {
    evt.target.scrollIntoViewIfNeeded();
  },

  _handleInputChange: function (evt) {
    if (this.model.value === evt.target.value) { return; }
    this.model.value = evt.target.value;
  },

  _handleResetClick: function () {
    this.model.value = this.model.original;
  }
});







var Editor = View.extend({
  autoRender: true,

  template: '<div class="styles-editor">' +
              '<div class="toggle-open">' +
                '<a><span></span><span></span><span></span></a>' +
              '</div>' +

              '<div class="tabs-wrapper">' +
                '<ul class="tabs">' +
                  '<li class="variables">Variables</li>' +
                  // '<li class="imports">Imports</li>' +
                  '<li class="base">Base</li>' +
                '</ul>' +

                '<div class="tabs-content">' +
                  '<ul class="variables"></ul>' +
                  // '<ul class="imports"></ul>' +
                  '<div class="base">' +
                    '<textarea class="input"></textarea>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              // '<textarea class="output" readonly></textarea>' +

              '<div class="errors"><div></div></div>' +

              '<div class="actions">' +
                '<a target="_blank" class="download">Download</a>'+
              '</div>' +
            '</div>',

  session: {
    open: 'boolean',
    dragingOver: 'boolean',
    compiling: 'number',
    compiled: 'string',
    globals: 'any',
    error: 'any',
    // rootpath: {
    //   type: 'any',
    //   test: function (val) {
    //     if (typeof val !== 'string' && val !== false) {
    //       return 'Seriously?';
    //     }
    //   },
    //   default: 'less-src'
    // },
    applyToPage: {
      type: 'boolean',
      default: true
    },
    showTab: {
      type: 'string',
      default: 'variables'
    }
  },

  collections: {
    // imports:    ImportsCollection,
    variables:  VariablesCollection
  },

  bindings: {
    dragingOver: {
      type: 'booleanClass',
      name: 'drag-over'
    },

    open: [
      {
        type: 'booleanClass',
        name: 'open'
      },
      {
        type: function (el, value) {
          document.body.classList[value ? 'add' : 'remove']('styles-editor-open');
        }
      }
    ],

    compiling: {
      type: 'booleanClass',
      name: 'compiling'
    },

    error: [
      {
        type: 'booleanClass'
      },
      {
        type: 'text',
        selector: '.errors > div'
      }
    ],

    compiled: [
      {
        type: 'value',
        selector: '.output'
      },
      {
        selector: '.download',
        type: function (el, value) {
          if (!value) {
            el.removeAttribute('href');
            return;
          }
          var blob = new Blob([value], {type: 'text/css'});
          el.setAttribute('href', URL.createObjectURL(blob));
        }
      }
    ],

    showTab: [
      {
        type: function (el, value) {
          this.queryAll('.tabs > li').forEach(function (li) {
            li.classList.remove('active');
          });
          this.query('.tabs > li.' + value).classList.add('active');
        },
        selector: '.tabs'
      },
      {
        type: function (el, value) {
          this.queryAll('.tabs-content > *').forEach(function (ul) {
            ul.classList.remove('active');
          });
          this.query('.tabs-content > .' + value).classList.add('active');
        },
        selector: '.tabs-content'
      }
    ]
  },

  events: {
    'click .toggle-open': '_handleOpenClick',
    'click .tabs li':     '_handleTabClick',
    'change .input':      '_handleInputChange',

    'drag':               '_fileDrag',
    'dragstart':          '_fileDrag',
    'dragover':           '_fileDrag',
    'dragend':            '_handleDragend',
    'drop':               '_handleDrop'
  },

  _handleOpenClick: function () {
    this.open = !this.open;
  },

  _handleTabClick: function (evt) {
    this.showTab = evt.target.className;
  },

  _handleInputChange: function () {
    this.update();
  },



  _fileDrag: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
    this.dragingOver = true;
  },

  _handleDragend: function () {
    this.dragingOver = false;
  },

  _handleDrop: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.dragingOver = false;
    var self = this;

    function readFileData(file) {
      return function (progressEvt) {
        var varName = 'custom-' + file.type.split('/').shift() + '-' + self.variables.length;
        self.variables.add({
          filename: file.name,
          name: varName,
          value: '"'+ progressEvt.target.result +'"'
        });
      };
    }

    var reader;
    var files = evt.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      reader = new FileReader();
      reader.onload = readFileData(files[i]);
      reader.readAsDataURL(files[i]);
    }
  },

  remove: function () {
    document.body.removeChild(this.styleEl);
    View.prototype.remove.apply(this, arguments);
  },

  update: function () {
    var self = this;

    var src = self.inputEl.value;

    function success(output) {
      self.compiling = null;
      self.compiled = output.css;

      if (self.applyToPage) {
        self.styleEl.innerHTML = output.css;
      }
    }

    function error(err) {
      self.compiling = null;
      self.error = err.message;
      // throw err;
    }

    // debounce and prevent blocking
    if (self.compiling) {
      clearTimeout(self.compiling);
    }

    self.compiling = setTimeout(function () {
      self.error = null;
      less.render(src, {
        globalVars: self.globals,
        modifyVars: self.variables.toObj()
      }).then(success, error);
    }, 10);


    return this;
  },

  render: function () {
    this.renderWithTemplate();

    this.cacheElements({
      tabsEl:       'ul.tabs',
      variablesEl:  'ul.variables',
      importsEl:    'ul.imports',
      inputEl:      'textarea.input',
      outputEl:     'textarea.output',
      downloadEl:   'a.download'
    });

    if (!this.inputEl) {
      throw new Error('Missing input textarea element');
    }

    this.styleEl = document.createElement('style');
    document.body.appendChild(this.styleEl);

    this.variablesView = this.renderCollection(this.variables, VariableView, this.variablesEl);
    this.listenToAndRun(this.variables, 'all', this.update);

    return this.update();
  }
});

Editor.objToStates = function (obj) {
  var arr = [];
  Object.keys(obj).forEach(function (key) {
    arr.push({
      name:     key,
      value:    obj[key],
      original: obj[key]
    });
  });
  return arr;
};

module.exports = Editor;

},{"./classList":239,"ampersand-collection":1,"ampersand-state":36,"ampersand-view":128}]},{},[240])(240)
});