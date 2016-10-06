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
    var decisions, inputData, knowledgeSources, businessKnowledgeModel;

    // make sure we walk the correct bpmnElement
    handler.root(definitions);

    decisions = definitions.decision;

    if (decisions) {
      decisions.forEach(function(decision) {
        handleShape(decision);
        handleEdges(decision);
      });
    }

    inputData = definitions.inputData;

    if (inputData) {
      inputData.forEach(function(inputData) {
        handleShape(inputData);
        handleEdges(inputData);
      });
    }

    knowledgeSources = definitions.knowledgeSource;

    if (knowledgeSources) {
      knowledgeSources.forEach(function(knowledgeSource) {
        handleShape(knowledgeSource);
        handleEdges(knowledgeSource);
      });
    }

    businessKnowledgeModel = definitions.businessKnowledgeModel;

    if (businessKnowledgeModel) {
      businessKnowledgeModel.forEach(function(businessKnowledgeModel) {
        handleShape(businessKnowledgeModel);
        handleEdges(businessKnowledgeModel);
      });
    }
  }

  function handleEdges(parent) {
    var extensionElements = parent.extensionElements;

    extensionElements.forEach(function(extensionElement) {
      if (extensionElement.$instanceOf('biodi:ExtensionElements')) {
        var edges = extensionElement.edge;

        if (edges) {
          edges.forEach(function(edge) {
            if (edge.$instanceOf('biodi:Edge')) {
              visit(parent, edge);
            }
          });
        }
      }
    });
  }

  function handleShape(element) {
    var extensionElements = element.extensionElements;

    extensionElements.forEach(function(extensionElement) {
      if (extensionElement.$instanceOf('biodi:ExtensionElements')) {
        var bounds = extensionElement.bounds;

        if (bounds && bounds.$instanceOf('biodi:Bounds')) {
          visit(element, bounds);
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
