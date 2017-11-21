'use strict';

var forEach = require('lodash/collection/forEach'),
    find = require('lodash/collection/find');

var is = require('../util/ModelUtil').is;


function parseID(element) {
  return element && element.href.slice(1);
}

function DRDTreeWalker(handler, options) {

  // list of elements to handle deferred to ensure
  // prerequisites are drawn
  var deferred = [];

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

    // make sure we walk the correct dmnElement
    handler.root(definitions);

    forEach(['decision', 'drgElements', 'artifacts' ], function(element) {
      if (definitions[element]) {
        forEach(definitions[element], handleElement);
      }
    });

    handleDeferred(deferred);
  }

  function handleDeferred(elements) {
    forEach(elements, function(d) {
      d();
    });
  }

  function handleElement(element) {
    var edges = [];

    handleDI(element, function(extensionElement) {
      if (extensionElement.$parent.$instanceOf('dmn:ExtensionElements')) {

        if (is(extensionElement, 'biodi:Bounds')) {
          visit(element, extensionElement);

        } else if (is(extensionElement, 'biodi:Edge')) {
          edges.push(extensionElement);
        }
      }
    });

    handleConnections(edges, element);
  }



  function handleConnections(edges, element) {

    function deferConnection(semantic, property) {
      var id = parseID(property),
          edge = find(edges, { source: id });

      if (edge) {
        deferred.push(function() {
          visit(semantic, edge);
        });
      }
    }

    if (is(element, 'dmn:Association')) {
      return deferConnection(element, element.sourceRef);
    }

    forEach([
      'informationRequirement',
      'knowledgeRequirement',
      'authorityRequirement'
    ], function(requirements) {
      forEach(element[requirements], function(requirement) {
        var properties = null;

        // get the href
        if (is(requirement, 'dmn:InformationRequirement')) {
          properties = [ 'requiredDecision', 'requiredInput' ];

        } else if (is(requirement, 'dmn:KnowledgeRequirement')) {
          properties = [ 'requiredKnowledge' ];

        } else if (is(requirement, 'dmn:AuthorityRequirement')) {
          properties = [ 'requiredDecision', 'requiredInput', 'requiredAuthority' ];
        }

        if (properties) {
          forEach(properties, function(property) {
            if (requirement[property]) {
              deferConnection(requirement, requirement[property]);
            }
          });
        }
      });
    });
  }

  function handleDI(element, fn) {
    var extensionElements = element.extensionElements,
        values;

    if (!extensionElements) {
      return;
    }

    values = extensionElements.values;

    forEach(values, fn);
  }

  ///// API ////////////////////////////////

  return {
    handleDefinitions: handleDefinitions
  };
}

module.exports = DRDTreeWalker;
