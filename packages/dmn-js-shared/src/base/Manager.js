import EventBus from 'diagram-js/lib/core/EventBus';

import DmnModdle from 'dmn-moddle';

import {
  domify,
  query as domQuery,
  remove as domRemove
} from 'min-dom';

import {
  assign,
  debounce,
  every,
  find,
  isDefined,
  isFunction,
  isNumber
} from 'min-dash';

import {
  wrapForCompatibility
} from '../util/CompatibilityUtils';


/**
 * @typedef {import('./View').OpenResult} OpenResult
 */

/**
 * @typedef {import('./View').OpenError} OpenError
 */


const DEFAULT_CONTAINER_OPTIONS = {
  width: '100%',
  height: '100%',
  position: 'relative'
};

/**
 * The base class for DMN viewers and editors.
 *
 * @abstract
 */
export default class Manager {

  /**
   * Create a new instance with the given options.
   *
   * @param  {Object} options
   *
   * @return {Manager}
   */
  constructor(options = {}) {
    this._eventBus = new EventBus();

    this._viewsChanged = debounce(this._viewsChanged, 0);

    this._views = [];
    this._viewers = {};

    // keep support for callbacks
    this.open = wrapForCompatibility(this.open.bind(this));
    this.importXML = wrapForCompatibility(this.importXML.bind(this));
    this.saveXML = wrapForCompatibility(this.saveXML.bind(this));

    this._init(options);
  }

  /**
  * The importXML result.
  *
  * @typedef {Object} ImportXMLResult
  *
  * @property {Array<string>} warnings
  */

  /**
  * The importXML error.
  *
  * @typedef {Error} ImportXMLError
  *
  * @property {Array<string>} warnings
  */

  /**
   * Parse and render a DMN diagram.
   *
   * Once finished the viewer reports back the result to the
   * provided callback function with (err, warnings).
   *
   * ## Life-Cycle Events
   *
   * During import the viewer will fire life-cycle events:
   *
   *   * import.parse.start (about to read model from xml)
   *   * import.parse.complete (model read; may have worked or not)
   *   * import.render.start (graphical import start)
   *   * import.render.complete (graphical import finished)
   *   * import.done (everything done)
   *
   * You can use these events to hook into the life-cycle.
   *
   * @param {string} xml the DMN xml
   * @param {Object} [options]
   * @param {boolean} [options.open=true]
   *
   * @return {Promise<ImportXMLResult, ImportXMLError>}
   */
  importXML(xml, options) {
    var self = this;

    options = options || { open: true };

    return new Promise(function(resolve, reject) {
      var previousActiveView = self._activeView;

      // clean up previously rendered diagram before new import
      self._clear().then(() => {

        // hook in pre-parse listeners +
        // allow xml manipulation
        xml = self._emit('import.parse.start', { xml: xml }) || xml;

        var parseWarnings;

        self._moddle.fromXML(xml, 'dmn:Definitions').then((parseResult) => {

          var definitions = parseResult.rootElement;
          var references = parseResult.references;
          var elementsById = parseResult.elementsById;
          parseWarnings = parseResult.warnings;

          // hook in post parse listeners +
          // allow definitions manipulation
          definitions = self._emit('import.parse.complete', ParseCompleteEvent({
            error: null,
            definitions: definitions,
            elementsById: elementsById,
            references: references,
            warnings: parseWarnings
          })) || definitions;
          self._setDefinitions(definitions);

          if (!options.open) {
            self._emit('import.done', { error: null, warnings: parseWarnings });

            resolve({ warnings: parseWarnings });
            return;
          }

          // open either previously active view or view of the same type if available
          var view = self._getInitialView(self._views, previousActiveView);

          if (!view) {
            var noDisplayableContentsErr = new Error('no displayable contents');

            self._emit('import.done',
              { error: noDisplayableContentsErr, warnings: parseWarnings });

            noDisplayableContentsErr.warnings = parseWarnings;

            return reject(noDisplayableContentsErr);
          }

          self.open(view)
            .then(result => ({ warnings: result.warnings }))
            .catch(error => ({ error: error, warnings: error.warnings }))
            .then(result => {
              var allWarnings = [].concat(parseWarnings, result.warnings);

              self._emit('import.done', { error: result.error, warnings: allWarnings });

              if (result.error) {
                result.error.warnings = allWarnings;
                reject(result.error);
              } else {
                resolve({ warnings: allWarnings });
              }

            });
        }).catch((parseError) => {

          parseWarnings = parseError.warnings;

          parseError = checkDMNCompatibilityError(parseError, xml) ||
            checkValidationError(parseError) ||
            parseError;

          self._emit('import.parse.complete', ParseCompleteEvent({
            error: parseError,
            warnings: parseWarnings
          }));

          self._emit('import.done', { error: parseError, warnings: parseWarnings });

          parseError.warnings = parseWarnings;

          return reject(parseError);
        });
      }).catch(clearError => {
        self._emit('import.done', { error: clearError, warnings: [] });
        clearError.warnings = [];

        return reject(clearError);
      });
    });

    // TODO: remove with future dmn-js version
    function ParseCompleteEvent(data) {

      var event = self._eventBus.createEvent(data);

      Object.defineProperty(event, 'context', {
        enumerable: true,
        get: function() {

          console.warn(new Error(
            'import.parse.complete <context> is deprecated ' +
            'and will be removed in future library versions'
          ));

          return {
            warnings: data.warnings,
            references: data.references,
            elementsById: data.elementsById
          };
        }
      });

      return event;
    }
  }

  getDefinitions() {
    return this._definitions;
  }

  /**
   * Return active view.
   *
   * @return {View}
   */
  getActiveView() {
    return this._activeView;
  }

  /**
   * Get the currently active viewer instance.
   *
   * @return {View}
   */
  getActiveViewer() {
    var activeView = this.getActiveView();

    return activeView && this._getViewer(activeView);
  }

  getView(element) {
    return this._views.filter(function(v) {
      return v.element === element;
    })[0];
  }

  getViews() {
    return this._views;
  }

  /**
   * The saveXML result.
   *
   * @typedef {Object} SaveXMLResult
   *
   * @property {string} xml
   */

  /**
   * Export the currently displayed DMN diagram as
   * a DMN XML document.
   *
   * ## Life-Cycle Events
   *
   * During XML saving the viewer will fire life-cycle events:
   *
   *   * saveXML.start (before serialization)
   *   * saveXML.serialized (after xml generation)
   *   * saveXML.done (everything done)
   *
   * You can use these events to hook into the life-cycle.
   *
   * @param {Object} [options] export options
   * @param {boolean} [options.format=false] output formated XML
   * @param {boolean} [options.preamble=true] output preamble
   *
   * @return {Promise<SaveXMLResult, Error>}
   */
  saveXML(options) {
    var self = this;

    options = options || {};

    var definitions = this._definitions;

    return new Promise(function(resolve, reject) {

      if (!definitions) {
        reject(new Error('no definitions loaded'));
        return;
      }

      // allow to fiddle around with definitions
      definitions = self._emit('saveXML.start', {
        definitions: definitions
      }) || definitions;

      self._moddle.toXML(definitions, options)
        .then(function(result) {

          var xml = result.xml;

          xml = self._emit('saveXML.serialized', {
            xml: xml
          }) || xml;

          return { xml };
        }).catch((error) => ({ error }))
        .then((result) => {

          self._emit('saveXML.done', result);

          if (result.error) {
            reject(result.error);
          } else {
            resolve({ xml: result.xml });
          }
        });

    });

  }

  /**
   * Register an event listener
   *
   * Remove a previously added listener via {@link #off(event, callback)}.
   *
   * @param {string} event
   * @param {number} [priority]
   * @param {Function} callback
   * @param {Object} [that]
   */
  on(...args) {
    this._eventBus.on(...args);
  }

  /**
   * De-register an event listener
   *
   * @param {string} event
   * @param {Function} callback
   */
  off(...args) {
    this._eventBus.off(...args);
  }

  /**
   * Register a listener to be invoked once only.
   *
   * @param {string} event
   * @param {number} [priority]
   * @param {Function} callback
   * @param {Object} [that]
   */
  once(...args) {
    this._eventBus.once(...args);
  }

  attachTo(parentNode) {

    // unwrap jQuery if provided
    if (parentNode.get && parentNode.constructor.prototype.jquery) {
      parentNode = parentNode.get(0);
    }

    if (typeof parentNode === 'string') {
      parentNode = domQuery(parentNode);
    }

    parentNode.appendChild(this._container);

    this._emit('attach', {});
  }

  detach() {
    this._emit('detach', {});

    domRemove(this._container);
  }

  destroy() {
    Object.keys(this._viewers).forEach((viewerId) => {
      var viewer = this._viewers[viewerId];

      safeExecute(viewer, 'destroy');
    });

    domRemove(this._container);
  }

  _init(options) {
    this._options = options;

    this._moddle = this._createModdle(options);

    this._viewers = {};
    this._views = [];

    const container = domify('<div class="dmn-js-parent"></div>');

    const containerOptions = assign({}, DEFAULT_CONTAINER_OPTIONS, options);

    assign(container.style, {
      width: ensureUnit(containerOptions.width),
      height: ensureUnit(containerOptions.height),
      position: containerOptions.position
    });

    this._container = container;

    if (options.container) {
      this.attachTo(options.container);
    }
  }

  _clear() {
    return this._switchView(null);
  }

  /**
   * Open diagram view.
   *
   * @param  {View} view
   * @returns {Promise} Resolves with {OpenResult} when successful
   * or rejects with {OpenError}
   */
  open(view) {
    return this._switchView(view);
  }

  _setDefinitions(definitions) {
    this._definitions = definitions;

    this._updateViews();
  }

  _viewsChanged = () => {
    this._emit('views.changed', {
      views: this._views,
      activeView: this._activeView
    });
  };

  /**
   * Recompute changed views after elements in
   * the DMN diagram have changed.
   */
  _updateViews() {

    var definitions = this._definitions;

    if (!definitions) {
      this._views = [];
      this._switchView(null);

      return;
    }

    var viewProviders = this._getViewProviders();

    var displayableElements = [ definitions, ...(definitions.drgElement || []) ];

    // compute list of available views
    var views = this._views,
        newViews = [];

    for (var element of displayableElements) {
      var provider = find(viewProviders, function(provider) {
        if (typeof provider.opens === 'string') {
          return provider.opens === element.$type;
        } else {
          return provider.opens(element);
        }
      });

      if (!provider) {
        continue;
      }

      var view = {
        element,
        id: element.id,
        name: element.name,
        type: provider.id
      };

      newViews.push(view);
    }

    var activeView = this._activeView,
        newActiveView;

    if (activeView) {

      // check the new active view
      newActiveView = find(newViews, function(view) {
        return viewsEqual(activeView, view);
      }) || this._getInitialView(newViews);

      if (!newActiveView) {
        this._switchView(null);
        return;
      }
    }

    // Views have changed if
    // active view has changed OR
    // number of views has changed OR
    // not all views equal
    var activeViewChanged = !viewsEqual(activeView, newActiveView)
      || viewNameChanged(activeView, newActiveView);

    var viewsChanged = views.length !== newViews.length
        || !every(newViews, function(newView) {
          return find(views, function(view) {
            return viewsEqual(view, newView) && !viewNameChanged(view, newView);
          });
        });

    this._activeView = newActiveView;
    this._views = newViews;

    if (activeViewChanged || viewsChanged) {
      this._viewsChanged();
    }
  }

  _getInitialView(views, preferredView) {
    var initialView;

    if (preferredView) {
      initialView = find(views, function(view) {
        return viewsEqual(view, preferredView);
      }) || find(views, function(view) {
        return view.type === preferredView;
      });
    }

    return initialView || views[0];
  }

  /**
   * Switch to another view.
   *
   * @param  {View} newView
   * @returns {Promise} Resolves with {OpenResult} when successful
   * or rejects with {OpenError}
   */
  _switchView(newView) {
    var self = this;

    return new Promise(function(resolve, reject) {
      var complete = (openError, openResult) => {
        self._viewsChanged();

        if (openError) {
          reject(openError);
        } else {
          resolve(openResult);
        }
      };

      var activeView = self.getActiveView(),
          activeViewer;

      var newViewer = newView && self._getViewer(newView),
          element = newView && newView.element;

      if (activeView) {
        activeViewer = self._getViewer(activeView);

        if (activeViewer !== newViewer) {
          safeExecute(activeViewer, 'clear');

          activeViewer.detach();
        }
      }

      self._activeView = newView;

      if (newViewer) {

        if (activeViewer !== newViewer) {
          newViewer.attachTo(self._container);
        }

        self._emit('import.render.start', {
          view: newView,
          element: element
        });

        newViewer.open(element)
          .then(
            result => {
              self._emit('import.render.complete', {
                view: newView,
                error: null,
                warnings: result.warnings
              });

              complete(null, result);
            })
          .catch(
            error => {
              self._emit('import.render.complete', {
                view: newView,
                error: error,
                warnings: error.warnings
              });

              complete(error, null);
            }
          );

        return;
      }

      // no active view
      complete();
    });
  }

  _getViewer(view) {

    var type = view.type;

    var viewer = this._viewers[type];

    if (!viewer) {
      viewer = this._viewers[type] = this._createViewer(view.type);

      this._emit('viewer.created', {
        type: type,
        viewer: viewer
      });
    }

    return viewer;
  }

  _createViewer(id) {

    var provider = find(this._getViewProviders(), function(provider) {
      return provider.id === id;
    });

    if (!provider) {
      throw new Error('no provider for view type <' + id + '>');
    }

    var Viewer = provider.constructor;

    var providerOptions = this._options[id] || {};
    var commonOptions = this._options.common || {};

    return new Viewer({
      ...commonOptions,
      ...providerOptions,
      additionalModules: [
        ...(providerOptions.additionalModules || []), {
          _parent: [ 'value', this ],
          moddle: [ 'value', this._moddle ]
        }
      ]
    });
  }

  /**
   * Emit an event.
   */
  _emit(...args) {
    return this._eventBus.fire(...args);
  }

  _createModdle(options) {
    return new DmnModdle(options.moddleExtensions);
  }

  /**
   * Return the list of available view providers.
   *
   * @abstract
   *
   * @return {Array<ViewProvider>}
   */
  _getViewProviders() {
    return [];
  }

}


// helpers //////////////////////

/**
 * Ensure the passed argument is a proper unit (defaulting to px)
 */
function ensureUnit(val) {
  return val + (isNumber(val) ? 'px' : '');
}

function checkDMNCompatibilityError(err, xml) {

  // check if we can indicate opening of old DMN 1.1 or DMN 1.2 diagrams

  if (err.message !== 'failed to parse document as <dmn:Definitions>') {
    return null;
  }

  var olderDMNVersion = (
    (xml.indexOf('"http://www.omg.org/spec/DMN/20151101/dmn.xsd"') !== -1 && '1.1') ||
    (xml.indexOf('"http://www.omg.org/spec/DMN/20180521/MODEL/"') !== -1 && '1.2')
  );

  if (!olderDMNVersion) {
    return null;
  }

  err = new Error(
    'unsupported DMN ' + olderDMNVersion + ' file detected; ' +
    'only DMN 1.3 files can be opened'
  );

  console.error(
    'Cannot open what looks like a DMN ' + olderDMNVersion + ' diagram. ' +
    'Please refer to https://bpmn.io/l/dmn-compatibility.html ' +
    'to learn how to make the toolkit compatible with older DMN files',
    err
  );

  return err;
}

function checkValidationError(err) {

  // check if we can help the user by indicating wrong DMN 1.3 xml
  // (in case he or the exporting tool did not get that right)

  var pattern = /unparsable content <([^>]+)> detected([\s\S]*)$/,
      match = pattern.exec(err.message);

  if (!match) {
    return null;
  }

  err.message =
    'unparsable content <' + match[ 1 ] + '> detected; ' +
    'this may indicate an invalid DMN 1.3 diagram file' + match[ 2 ];

  return err;
}

function viewsEqual(a, b) {
  if (!isDefined(a)) {
    if (!isDefined(b)) {
      return true;
    } else {
      return false;
    }
  }

  if (!isDefined(b)) {
    return false;
  }

  // compare by element OR element ID equality
  return a.element === b.element || a.id === b.id;
}

function viewNameChanged(a, b) {
  return !a || !b || a.name !== b.name;
}

function safeExecute(viewer, method) {
  if (isFunction(viewer[ method ])) {
    viewer[ method ]();
  }
}
