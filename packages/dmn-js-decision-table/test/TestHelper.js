import uniq from 'lodash/uniq';
import forEach from 'lodash/forEach';

import DecisionTable from 'lib/DecisionTable';

import DecisionTableEditor from 'lib/DecisionTableEditor';


let INSTANCE = null;


export function importXML(xml) {

  return function(done) {

    getInstance().importXML(xml, function(err) {

      if (err) {
        return done(err);
      }

      done();
    });

  };

}

export function bootstrapViewer(options, locals) {
  return bootstrap(DecisionTable, options, locals);
}

export function bootstrapEditor(options, locals) {
  return bootstrap(DecisionTableEditor, options, locals);
}

export function inject(fn) {

  return function() {
    getInstance().invoke(fn);
  };

}

////////// helpers /////////////////////////////////

function bootstrap(Table, options = {}, locals = {}) {

  return function() {

    const { modules, ...actualOpts } = options;

    var mockModule = {};

    forEach(locals, function(v, k) {
      mockModule[k] = [ 'value', v ];
    });

    actualOpts.additionalModules = uniq(
      [].concat(
        modules || [],
        [ mockModule ]
      )
    );

    if (INSTANCE) {
      INSTANCE.destroy();
    }

    if (!actualOpts.container) {
      let container = document.createElement('div');

      document.body.appendChild(container);
      actualOpts.container = container;
    }

    INSTANCE = new Table(actualOpts);
  };
}

function getInstance() {

  if (!INSTANCE) {
    throw new Error('no bootstrapped INSTANCE, call bootstrap(options, ...) first');
  }

  return INSTANCE;
}

export function insertCSS(name, css) {
  if (document.querySelector('[data-css-file="' + name + '"]')) {
    return;
  }

  const head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
  
  style.setAttribute('data-css-file', name);

  style.type = 'text/css';
  
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}