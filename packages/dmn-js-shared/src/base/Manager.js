import EventBus from 'diagram-js/lib/core/EventBus';

import DmnModdle from 'dmn-moddle';

import CamundaModdle from 'camunda-dmn-moddle/resources/camunda';

import {
  domify,
  query as domQuery,
  remove as domRemove
} from 'min-dom';

import {
  assign,
  debounce,
  isNumber
} from 'min-dash';


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
  constructor(options={}) {
    this._eventBus = new EventBus();

    this._viewsChanged = debounce(this._viewsChanged, 0);

    this._views = [];
    this._viewers = {};

    this._init(options);
  }

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
   * @param {String} xml the DMN xml
   * @param {Object} [options]
   * @param {Boolean} [options.open=true]
   * @param {Function} [done] invoked with (err, warnings=[])
   */
  importXML(xml, options, done) {

    if (typeof options !== 'object') {
      done = options;
      options = { open: true };
    }

    if (typeof done !== 'function') {
      done = noop;
    }

    // hook in pre-parse listeners +
    // allow xml manipulation
    xml = this._emit('import.parse.start', { xml: xml }) || xml;

    this._moddle.fromXML(xml, 'dmn:Definitions', (err, definitions, context) => {

      // hook in post parse listeners +
      // allow definitions manipulation
      definitions = this._emit('import.parse.complete', {
        error: err,
        definitions: definitions,
        context: context
      }) || definitions;

      var parseWarnings = context.warnings;

      this._setDefinitions(definitions);

      if (err) {
        err = checkDMNCompatibilityError(err, xml) || checkValidationError(err) || err;
      }

      if (err || !options.open) {
        this._emit('import.done', { error: err, warmings: parseWarnings });

        return done(err, parseWarnings);
      }

      var view = this._activeView || this._getInitialView(this._views);

      if (!view) {
        return done(new Error('no displayable contents'));
      }

      this.open(view, (err, warnings) => {

        var allWarnings = [].concat(parseWarnings, warnings || []);

        this._emit('import.done', { error: err, warnings: allWarnings });

        done(err, allWarnings);
      });
    });
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
   * @param {Boolean} [options.format=false] output formated XML
   * @param {Boolean} [options.preamble=true] output preamble
   * @param {Function} done invoked with (err, xml)
   */
  saveXML(options, done) {

    if (typeof options === 'function') {
      done = options;
      options = {};
    }

    var definitions = this._definitions;

    if (!definitions) {
      return done(new Error('no definitions loaded'));
    }

    // allow to fiddle around with definitions
    definitions = this._emit('saveXML.start', {
      definitions: definitions
    }) || definitions;

    this._moddle.toXML(definitions, options, (err, xml) => {

      try {
        xml = this._emit('saveXML.serialized', {
          error: err,
          xml: xml
        }) || xml;

        this._emit('saveXML.done', {
          error: err,
          xml: xml
        });
      } catch (e) {
        console.error('error in saveXML life-cycle listener', e);
      }

      done(err, xml);
    });
  }

  /**
   * Register an event listener
   *
   * Remove a previously added listener via {@link #off(event, callback)}.
   *
   * @param {String} event
   * @param {Number} [priority]
   * @param {Function} callback
   * @param {Object} [that]
   */
  on(...args) {
    this._eventBus.on(...args);
  }

  /**
   * De-register an event listener
   *
   * @param {String} event
   * @param {Function} callback
   */
  off(...args) {
    this._eventBus.off(...args);
  }

  /**
   * Register a listener to be invoked once only.
   *
   * @param {String} event
   * @param {Number} [priority]
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

  /**
   * Open diagram element.
   *
   * @param  {ModdleElement}   element
   * @param  {Function} [done]
   */
  open(view, done=noop) {
    this._switchView(view, done);
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
  }

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
    this._views = displayableElements.reduce((views, element) => {

      var provider = find(viewProviders, function(provider) {
        if (typeof provider.opens === 'string') {
          return provider.opens === element.$type;
        } else {
          return provider.opens(element);
        }
      });

      if (!provider) {
        return views;
      }

      var view = {
        element,
        type: provider.id
      };

      return [
        ...views,
        view
      ];
    }, []);

    var activeView = this._activeView,
        newActiveView;

    if (activeView) {

      // check the new active view
      newActiveView = find(this._views, function(v) {
        return viewsEqual(activeView, v);
      }) || this._getInitialView(this._views);

      if (viewsEqual(activeView, newActiveView)) {

        // active view changed
        this._activeView = newActiveView;
      } else {

        // active view got deleted
        return this._switchView(null);
      }
    }

    this._viewsChanged();
  }

  _getInitialView(views) {
    return views[0];
  }

  /**
   * Switch to another view.
   *
   * @param  {View} newView
   * @param  {Function} [done]
   */
  _switchView(newView, done=noop) {

    var complete = (err, warnings) => {
      this._viewsChanged();

      done(err, warnings);
    };

    var activeView = this.getActiveView(),
        activeViewer;

    var newViewer = newView && this._getViewer(newView),
        element = newView && newView.element;

    if (activeView) {
      activeViewer = this._getViewer(activeView);

      if (activeViewer !== newViewer) {
        safeExecute(activeViewer, 'clear');

        activeViewer.detach();
      }
    }

    this._activeView = newView;

    if (newViewer) {

      if (activeViewer !== newViewer) {
        newViewer.attachTo(this._container);
      }

      this._emit('import.render.start', {
        view: newView,
        element: element
      });

      return newViewer.open(element, (err, warnings) => {

        this._emit('import.render.complete', {
          view: newView,
          error: err,
          warnings: warnings
        });

        complete(err, warnings);
      });
    }

    // no active view
    complete();
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
    this._eventBus.fire(...args);
  }

  _createModdle(options) {
    return new DmnModdle(assign({
      camunda: CamundaModdle
    }, options.moddleExtensions));
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

function noop() {}

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
    'unparsable content <' + match[1] + '> detected; ' +
    'this may indicate an invalid DMN 1.3 diagram file' + match[2];

  return err;
}

function find(arr, fn) {
  return arr.filter(fn)[0];
}


function viewsEqual(a, b) {

  if (typeof a === 'undefined') {
    if (typeof b === 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  if (typeof b === 'undefined') {
    return false;
  }

  // compare by element _or_ element ID equality
  return a.element === b.element || a.element.id === b.element.id;
}

function safeExecute(viewer, method) {
  if (typeof viewer[method] === 'function') {
    viewer[method]();
  }
}
