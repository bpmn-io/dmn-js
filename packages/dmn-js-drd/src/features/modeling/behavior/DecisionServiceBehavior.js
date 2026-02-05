import {
  add as collectionAdd,
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default function DecisionServiceBehavior(drdFactory, injector, eventBus) {
  this._drdFactory = drdFactory;
  this._injector = injector;
  this._elementRegistry = null;
  this._eventBus = eventBus;

  var self = this;

  // Listen to drag events to show/hide decision service section labels
  eventBus.on('drag.start', function() {
    self._updateDecisionServiceLabelsVisibility(true);
  });

  eventBus.on([ 'drag.end', 'drag.cancel' ], function() {
    self._updateDecisionServiceLabelsVisibility(false);
  });
}

DecisionServiceBehavior.$inject = [ 'drdFactory', 'injector', 'eventBus' ];

/**
 * Get the element registry
 * @returns {ElementRegistry}
 */
DecisionServiceBehavior.prototype._getElementRegistry = function() {
  if (!this._elementRegistry) {
    this._elementRegistry = this._injector.get('elementRegistry');
  }
  return this._elementRegistry;
};

/**
 * Update the visibility of decision service section labels (OUTPUT/ENCAPSULATED)
 * @param {boolean} visible - Whether to show or hide the labels
 */
DecisionServiceBehavior.prototype._updateDecisionServiceLabelsVisibility = function(visible) {
  var labels = document.querySelectorAll('.dmn-decision-service-label');
  labels.forEach(function(label) {
    label.style.display = visible ? 'block' : 'none';
  });
};

/**
 * Get the divider Y position for a decision service
 * @param {Element} decisionServiceElement - The decision service element
 * @returns {number} The Y position of the divider line
 */
DecisionServiceBehavior.prototype._getDividerPosition = function(decisionServiceElement) {
  return decisionServiceElement.y + (decisionServiceElement.height / 2);
};

/**
 * Determines if a decision should be in the "output" (top) or "encapsulated" (bottom) section
 * based on its Y position relative to the divider line.
 *
 * @param {Element} decisionElement - The decision element
 * @param {ModdleElement} decisionServiceBo - The decision service business object
 * @returns {boolean} true if decision should be in output section, false for encapsulated
 */
DecisionServiceBehavior.prototype.isOutputDecision = function(decisionElement, decisionServiceBo) {
  var decisionServiceElement = this._getElementRegistry().get(decisionServiceBo.id);

  if (!decisionServiceElement) {
    return false;
  }

  // Get divider line Y position
  var dividerY = this._getDividerPosition(decisionServiceElement);

  // Check if decision's Y position is above the divider line
  var decisionCenterY = decisionElement.y + (decisionElement.height / 2);

  return decisionCenterY < dividerY;
};

/**
 * Handle Decision being moved into DecisionService.
 *
 * @param {ModdleElement} decisionBo - The decision business object
 * @param {ModdleElement} decisionServiceBo - The decision service business object
 * @param {ModdleElement} definitions - The definitions element
 */
DecisionServiceBehavior.prototype.addDecisionToService = function(decisionBo, decisionServiceBo, definitions) {
  var children;

  // Ensure the decision is in Definitions' drgElement collection
  if (definitions) {
    children = definitions.get('drgElement');
    if (!children) {
      definitions.drgElement = [];
      children = definitions.drgElement;
    }
    if (children.indexOf(decisionBo) === -1) {
      collectionAdd(children, decisionBo);
    }

    // Keep the $parent as Definitions, not DecisionService
    decisionBo.$parent = definitions;
  }

  // Get the element from the registry to check its position
  var decisionElement = this._getElementRegistry().get(decisionBo.id);

  var isOutputDecision = this.isOutputDecision(decisionElement, decisionServiceBo);

  if (isOutputDecision) {
    children = decisionServiceBo.get('outputDecision');
    if (!children) {
      decisionServiceBo.outputDecision = [];
      children = decisionServiceBo.outputDecision;
    }
  } else {
    children = decisionServiceBo.get('encapsulatedDecision');
    if (!children) {
      decisionServiceBo.encapsulatedDecision = [];
      children = decisionServiceBo.encapsulatedDecision;
    }
  }

  // Create DMNElementReference (not moving the actual decision)
  var reference = this._drdFactory.create('dmn:DMNElementReference', {
    href: '#' + decisionBo.id
  });

  // Only add the reference if it doesn't already exist
  var existingRef = children.find(function(r) { return r.href === '#' + decisionBo.id; });
  if (!existingRef) {
    collectionAdd(children, reference);
  }

  // Update inputDecision and inputData based on output decisions
  this.updateInputsFromOutputDecisions(decisionServiceBo);
};


/**
 * Handle Decision being moved out of DecisionService back to root level.
 *
 * @param {ModdleElement} decisionBo - The decision business object
 * @param {ModdleElement} definitions - The definitions element
 */
DecisionServiceBehavior.prototype.removeDecisionFromServices = function(decisionBo, definitions) {
  var self = this;
  var drgElements = definitions.get('drgElement');

  if (drgElements) {
    drgElements.forEach(function(element) {
      if (is(element, 'dmn:DecisionService')) {

        // Remove the decision reference from this service
        self.removeDecisionFromService(decisionBo, element);
      }
    });
  }

  // Ensure the decision is in Definitions' drgElement collection
  var children = definitions.get('drgElement');
  if (children && children.indexOf(decisionBo) === -1) {
    collectionAdd(children, decisionBo);
  }
  decisionBo.$parent = definitions;
};



/**
 * Remove a decision from a DecisionService.
 *
 * @param {ModdleElement} decisionBo - The decision business object
 * @param {ModdleElement} decisionServiceBo - The decision service business object
 */
DecisionServiceBehavior.prototype.removeDecisionFromService = function(decisionBo, decisionServiceBo) {
  var children = decisionServiceBo.get('encapsulatedDecision');
  var ref;

  if (children) {
    ref = children.find(function(d) { return d.href === '#' + decisionBo.id; });
    if (ref) {
      collectionRemove(children, ref);
    }
  }

  children = decisionServiceBo.get('outputDecision');
  if (children) {
    ref = children.find(function(d) { return d.href === '#' + decisionBo.id; });
    if (ref) {
      collectionRemove(children, ref);
    }
  }

  // Update inputDecision and inputData based on remaining output decisions
  this.updateInputsFromOutputDecisions(decisionServiceBo);
};


/**
 * Update which section a decision belongs to when moved within a DecisionService.
 *
 * @param {Element} decisionElement - The decision shape element
 * @param {ModdleElement} decisionServiceBo - The decision service business object
 */
DecisionServiceBehavior.prototype.updateDecisionSection = function(decisionElement, decisionServiceBo) {
  var decisionBo = decisionElement.businessObject;

  // Determine which section the decision should be in based on position
  var isOutputDecision = this.isOutputDecision(decisionElement, decisionServiceBo);

  // Get current collections
  var outputDecisions = decisionServiceBo.get('outputDecision') || [];
  var encapsulatedDecisions = decisionServiceBo.get('encapsulatedDecision') || [];

  // Check if decision is already in the correct section
  var decisionHref = '#' + decisionBo.id;
  var inOutputDecisions = outputDecisions.some(function(d) { return d.href === decisionHref; });
  var inEncapsulatedDecisions = encapsulatedDecisions.some(function(d) { return d.href === decisionHref; });

  if (isOutputDecision && inOutputDecisions) {
    return;
  }

  if (!isOutputDecision && inEncapsulatedDecisions) {
    return;
  }

  // Remove from current section
  this.removeDecisionFromService(decisionBo, decisionServiceBo);

  // Add to correct section
  var reference = this._drdFactory.create('dmn:DMNElementReference', {
    href: decisionHref
  });

  if (isOutputDecision) {
    if (!decisionServiceBo.outputDecision) {
      decisionServiceBo.outputDecision = [];
    }
    collectionAdd(decisionServiceBo.outputDecision, reference);
  } else {
    if (!decisionServiceBo.encapsulatedDecision) {
      decisionServiceBo.encapsulatedDecision = [];
    }
    collectionAdd(decisionServiceBo.encapsulatedDecision, reference);
  }

  // Update inputDecision and inputData based on output decisions
  this.updateInputsFromOutputDecisions(decisionServiceBo);
};

/**
 * Traverse output decisions and automatically populate inputDecision and inputData
 * based on their direct connections using graph traversal.
 *
 * @param {ModdleElement} decisionServiceBo - The decision service business object
 */
DecisionServiceBehavior.prototype.updateInputsFromOutputDecisions = function(decisionServiceBo) {
  var elementRegistry = this._getElementRegistry();

  var outputDecisions = decisionServiceBo.get('outputDecision') || [];
  var encapsulatedDecisions = decisionServiceBo.get('encapsulatedDecision') || [];

  // Create a set of all decisions within this service (output + encapsulated)
  var decisionsInService = new Set();
  outputDecisions.forEach(function(ref) {
    decisionsInService.add(ref.href.substring(1)); // Remove '#'
  });
  encapsulatedDecisions.forEach(function(ref) {
    decisionsInService.add(ref.href.substring(1)); // Remove '#'
  });

  var inputDecisionIds = new Set();
  var inputDataIds = new Set();

  // Helper function to traverse a decision's dependencies using BFS
  var traverseDecision = function(decisionId, visited) {

    // Avoid cycles
    if (visited.has(decisionId)) {
      return;
    }
    visited.add(decisionId);

    var decisionElement = elementRegistry.get(decisionId);
    if (!decisionElement) {
      return;
    }

    var informationRequirements = decisionElement.businessObject.get('informationRequirement') || [];

    informationRequirements.forEach(function(infoReq) {

      // Handle required decisions
      if (infoReq.requiredDecision) {
        var requiredDecisionId = infoReq.requiredDecision.href.substring(1);

        // If this decision is NOT in the service, it's an input decision
        if (!decisionsInService.has(requiredDecisionId)) {
          inputDecisionIds.add(requiredDecisionId);
        } else {

          // If it's in the service (encapsulated), continue traversing
          traverseDecision(requiredDecisionId, visited);
        }
      }

      // Handle required input data
      if (infoReq.requiredInput) {
        var requiredInputId = infoReq.requiredInput.href.substring(1);
        inputDataIds.add(requiredInputId);
      }
    });
  };

  // Start traversal from each output decision
  var visited = new Set();
  outputDecisions.forEach(function(outputDecisionRef) {
    var decisionId = outputDecisionRef.href.substring(1);
    traverseDecision(decisionId, visited);
  });

  // Update inputDecision collection
  this._updateReferenceCollection(
    decisionServiceBo,
    'inputDecision',
    inputDecisionIds,
    elementRegistry
  );

  // Update inputData collection
  this._updateReferenceCollection(
    decisionServiceBo,
    'inputData',
    inputDataIds,
    elementRegistry
  );
};

/**
 * Helper method to update a reference collection (inputDecision or inputData)
 * @param {ModdleElement} decisionServiceBo - The decision service business object
 * @param {string} collectionName - Name of the collection ('inputDecision' or 'inputData')
 * @param {Set} newIds - Set of element IDs that should be in the collection
 * @param {ElementRegistry} elementRegistry - The element registry
 */
DecisionServiceBehavior.prototype._updateReferenceCollection = function(
    decisionServiceBo,
    collectionName,
    newIds,
    elementRegistry
) {
  var self = this;
  var currentCollection = decisionServiceBo.get(collectionName) || [];
  var currentIds = new Set();

  currentCollection.forEach(function(ref) {
    currentIds.add(ref.href.substring(1));
  });

  // Add new references
  newIds.forEach(function(elementId) {
    if (!currentIds.has(elementId)) {

      // Verify the element still exists before adding reference
      var element = elementRegistry.get(elementId);
      if (element) {
        if (!decisionServiceBo[collectionName]) {
          decisionServiceBo[collectionName] = [];
        }
        var reference = self._drdFactory.create('dmn:DMNElementReference', {
          href: '#' + elementId
        });
        collectionAdd(decisionServiceBo[collectionName], reference);
      }
    }
  });

  // Remove references that are no longer needed
  var referencesToRemove = [];
  currentCollection.forEach(function(ref) {
    var elementId = ref.href.substring(1);
    if (!newIds.has(elementId)) {
      referencesToRemove.push(ref);
    }
  });
  referencesToRemove.forEach(function(ref) {
    collectionRemove(decisionServiceBo[collectionName], ref);
  });
};

/**
 * Update all decision services that contain the given decision element.
 * This should be called when information requirements change.
 *
 * @param {Element} decisionElement - The decision element whose requirements changed
 * @param {ModdleElement} definitions - The definitions business object
 */
DecisionServiceBehavior.prototype.updateServicesContainingDecision = function(decisionElement, definitions) {
  if (!decisionElement || !is(decisionElement.businessObject, 'dmn:Decision')) {
    return;
  }

  if (!definitions || !is(definitions, 'dmn:Definitions')) {
    return;
  }

  var drgElements = definitions.get('drgElement') || [];
  var decisionId = decisionElement.businessObject.id;
  var self = this;

  // Find all decision services and update them if they contain this decision
  drgElements.forEach(function(element) {
    if (is(element, 'dmn:DecisionService')) {
      var outputDecisions = element.get('outputDecision') || [];
      var encapsulatedDecisions = element.get('encapsulatedDecision') || [];

      // Check if this decision is in the service (output or encapsulated)
      var isInService = outputDecisions.some(function(ref) {
        return ref.href === '#' + decisionId;
      }) || encapsulatedDecisions.some(function(ref) {
        return ref.href === '#' + decisionId;
      });

      if (isInService) {

        // Update the decision service's inputs
        self.updateInputsFromOutputDecisions(element);
      }
    }
  });
};

/**
 * Remove references to a deleted element from all decision services.
 * This should be called when a decision or input data is deleted.
 *
 * @param {string} deletedId - The ID of the deleted element
 * @param {ModdleElement} definitions - The definitions business object
 */
DecisionServiceBehavior.prototype.removeElementFromAllServices = function(deletedId, definitions) {
  if (!deletedId || !definitions || !is(definitions, 'dmn:Definitions')) {
    return;
  }

  var drgElements = definitions.get('drgElement') || [];
  var self = this;
  var deletedHref = '#' + deletedId;

  // Find all decision services and remove references to the deleted element
  drgElements.forEach(function(element) {
    if (is(element, 'dmn:DecisionService')) {
      var needsUpdate = false;

      // Helper to remove from a collection
      var removeFromCollection = function(collectionName) {
        var collection = element.get(collectionName) || [];
        var toRemove = collection.filter(function(ref) {
          return ref.href === deletedHref;
        });

        if (toRemove.length > 0) {
          toRemove.forEach(function(ref) {
            collectionRemove(element[collectionName], ref);
          });
          needsUpdate = true;
        }
      };

      // Remove from all possible collections
      removeFromCollection('outputDecision');
      removeFromCollection('encapsulatedDecision');
      removeFromCollection('inputDecision');
      removeFromCollection('inputData');

      // If we removed from output/encapsulated, recalculate inputs
      if (needsUpdate) {
        self.updateInputsFromOutputDecisions(element);
      }
    }
  });
};

/**
 * Update all decision services by recalculating their inputs.
 * @param {ModdleElement} definitions - The definitions business object
 */
DecisionServiceBehavior.prototype.updateAllServices = function(definitions) {
  if (!definitions || !is(definitions, 'dmn:Definitions')) {
    return;
  }

  var drgElements = definitions.get('drgElement') || [];
  var self = this;

  // Update all decision services
  drgElements.forEach(function(element) {
    if (is(element, 'dmn:DecisionService')) {
      self.updateInputsFromOutputDecisions(element);
    }
  });
};
