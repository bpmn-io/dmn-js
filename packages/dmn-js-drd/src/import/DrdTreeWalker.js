import {
  forEach
} from 'min-dash';

import Refs from 'object-refs';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


var diRefs = new Refs(
  { name: 'dmnElementRef', enumerable: true },
  { name: 'di', configurable: true }
);

export default function DRDTreeWalker(handler, options) {

  // list of elements to handle deferred to ensure
  // prerequisites are drawn
  var deferred = [];

  function visit(element) {

    var gfx = element.gfx;

    // avoid multiple rendering of elements
    if (gfx) {
      throw new Error('already rendered ' + element.id);
    }

    // call handler
    return handler.element(element);
  }

  function visitRoot(element) {
    return handler.root(element);
  }

  function visitIfDi(element) {

    try {
      var gfx = element.di && visit(element);

      return gfx;
    } catch (e) {
      logError(e.message, { element: element, error: e });
    }
  }


  // Semantic handling //////////////////////

  /**
   * Handle definitions and return the rendered diagram (if any)
   *
   * @param {ModdleElement} definitions to walk and import
   * @param {ModdleElement} [diagram] specific diagram to import and display
   *
   * @throws {Error} if no diagram to display could be found
   */
  function handleDefinitions(definitions, diagram) {

    // make sure we walk the correct dmnElement
    var dmnDI = definitions.dmnDI;

    if (!dmnDI) {
      throw new Error('no dmndi:DMNDI');
    }

    var diagrams = dmnDI.diagrams || [];

    if (diagram && diagrams.indexOf(diagram) === -1) {
      throw new Error('diagram not part of dmndi:DMNDI');
    }

    if (!diagram && diagrams && diagrams.length) {
      diagram = diagrams[0];
    }

    // no diagram -> nothing to import
    if (!diagram) {
      throw new Error('no diagram to display');
    }

    // assign current diagram to definitions so that it can accessed later
    definitions.di = diagram;

    // load DI from selected diagram only
    handleDiagram(diagram);

    visitRoot(definitions);

    handleDrgElements(definitions.get('drgElement'));
    handleArtifacts(definitions.get('artifact'));

    handleDeferred();
  }

  function handleDrgElements(elements) {
    forEach(elements, function(element) {
      visitIfDi(element);

      handleRequirements(element);
    });
  }

  function handleArtifacts(elements) {
    forEach(elements, function(element) {
      if (is(element, 'dmn:Association')) {
        handleAssociation(element);
      } else {
        visitIfDi(element);
      }
    });
  }

  /**
   * Defer association visit until all shapes are visited.
   *
   * @param {ModdleElement} element
   */
  function handleAssociation(element) {
    defer(function() {
      visitIfDi(element);
    });
  }

  /**
   * Defer requirements visiting until all shapes are visited.
   *
   * @param {ModdleElement} element
   */
  function handleRequirements(element) {
    forEach([
      'informationRequirement',
      'knowledgeRequirement',
      'authorityRequirement'
    ], function(requirements) {
      forEach(element[requirements], function(requirement) {
        defer(function() {
          visitIfDi(requirement);
        });
      });
    });
  }

  // DI handling //////////////////////
  function handleDiagram(diagram) {
    forEach(diagram.diagramElements, handleDiagramElement);
  }

  function handleDiagramElement(diagramElement) {
    registerDi(diagramElement);
  }

  function registerDi(di) {
    var dmnElement = di.dmnElementRef;

    if (dmnElement) {
      if (dmnElement.di) {
        logError('multiple DI elements defined for element', { element: dmnElement });
      } else {
        diRefs.bind(dmnElement, 'di');
        dmnElement.di = di;
      }
    } else {
      logError('no DMN element referenced in element', { element: di });
    }
  }

  function defer(fn) {
    deferred.push(fn);
  }

  function handleDeferred() {
    forEach(deferred, function(d) {
      d();
    });
  }

  function logError(message, context) {
    handler.error(message, context);
  }

  // API //////////////////////

  return {
    handleDefinitions: handleDefinitions
  };
}
