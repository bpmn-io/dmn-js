'use strict';

function DRDTreeWalker(handler, options) {

  function visit(element, di) {

    var gfx = element.gfx;

    // avoid multiple rendering of elements
    if (gfx) {
      throw new Error('already rendered ' + element.id);
    }

    // call handler
    return handler.element(element, di);
  }

  ////// Semantic handling //////////////////////

  function handleDefinitions(definitions) {
    var decisions;

    // make sure we walk the correct bpmnElement
    handler.root(definitions);

    decisions = definitions.decision;

    if (!decisions) {
      return;
    }

    decisions.forEach(function(decision) {
      handleDecision(decision);
      handleEdges(decision);
    });
  }

  function handleEdges(decision) {
    var extensionElements = decision.extensionElements;

    extensionElements.forEach(function(extensionElement) {
      if (extensionElement.$instanceOf('biodi:ExtensionElements')) {
        var edges = extensionElement.edge;

        if (edges) {
          edges.forEach(function(edge) {
            if (edge.$instanceOf('biodi:Edge')) {
              visit(decision, edge);
            }
          });
        }
      }
    });
  }

  function handleDecision(decision) {
    var extensionElements = decision.extensionElements;

    extensionElements.forEach(function(extensionElement) {
      if (extensionElement.$instanceOf('biodi:ExtensionElements')) {
        var bounds = extensionElement.bounds;

        if (bounds && bounds.$instanceOf('biodi:Bounds')) {
          visit(decision, bounds);
        }
      }
    });


  }

  ///// API ////////////////////////////////

  return {
    handleDefinitions: handleDefinitions
  };
}

module.exports = DRDTreeWalker;
