import { forEach } from 'min-dash';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  is,
  getBusinessObject
} from '../../../util/ModelUtil';

const ID = 'id';


export default class IdChangeBehavior extends CommandInterceptor {
  constructor(eventBus) {
    super(eventBus);

    this.executed('element.updateProperties', this.updateIds.bind(this));
  }

  updateIds({ context }) {
    const { element, oldProperties, properties } = context;

    const bo = getBusinessObject(element);

    if (this.shouldSkipUpdate(bo, oldProperties, properties)) {
      return;
    }

    const definitions = getDefinitions(bo);

    const drgElements = definitions.get('drgElement');
    drgElements.forEach(drgElement => {
      updateElementReferences(drgElement, oldProperties.id, properties.id);
    });

    const artifacts = definitions.get('artifact');
    artifacts.forEach(artifact => {
      updateAssociationReferences(artifact, oldProperties.id, properties.id);
    });
  }

  shouldSkipUpdate(bo, oldProperties, newProperties) {
    return !isIdChange(oldProperties, newProperties) ||
     (!is(bo, 'dmn:DRGElement') && !is(bo, 'dmn:TextAnnotation'));
  }
}

IdChangeBehavior.$inject = [ 'eventBus' ];


// helpers //////////////////////

function isIdChange(oldProperties, properties) {
  return ID in oldProperties && ID in properties;
}


/**
 * Walk up the tree until at the root to get to dmn:Definitions.
 *
 * @param {ModdleElement} element
 */
function getDefinitions(element) {
  let definitions = element;

  while (!is(definitions, 'dmn:Definitions')) {
    definitions = definitions.$parent;
  }

  return definitions;
}

function updateElementReferences(element, oldId, id) {

  const handlers = {

    authorityRequirement: () => {
      element.authorityRequirement.forEach(authorityRequirement => {
        const {
          requiredAuthority,
          requiredDecision,
          requiredInput
        } = authorityRequirement;

        if (requiredAuthority && requiredAuthority.href === `#${oldId}`) {
          requiredAuthority.href = `#${id}`;
        }

        if (requiredDecision && requiredDecision.href === `#${oldId}`) {
          requiredDecision.href = `#${id}`;
        }

        if (requiredInput && requiredInput.href === `#${oldId}`) {
          requiredInput.href = `#${id}`;
        }
      });
    },

    informationRequirement: () => {
      element.informationRequirement.forEach(informationRequirement => {
        const { requiredDecision, requiredInput } = informationRequirement;

        if (requiredDecision && requiredDecision.href === `#${oldId}`) {
          requiredDecision.href = `#${id}`;
        }

        if (requiredInput && requiredInput.href === `#${oldId}`) {
          requiredInput.href = `#${id}`;
        }
      });
    },

    knowledgeRequirement: () => {
      element.knowledgeRequirement.forEach(knowledgeRequirement => {
        const { requiredKnowledge } = knowledgeRequirement;

        if (requiredKnowledge && requiredKnowledge.href === `#${oldId}`) {
          requiredKnowledge.href = `#${id}`;
        }
      });
    }

  };

  forEach(handlers, (handler, key) => {

    if (element[key]) {
      handler();
    }

  });
}

function updateAssociationReferences(element, oldId, id) {

  const handlers = {
    sourceRef: () => {
      const { sourceRef } = element;

      if (sourceRef.href === `#${oldId}`) {
        sourceRef.href = `#${id}`;
      }
    },
    targetRef: () => {
      const { targetRef } = element;

      if (targetRef.href === `#${oldId}`) {
        targetRef.href = `#${id}`;
      }
    }
  };

  forEach(handlers, (handler, key) => {

    if (element[key]) {
      handler();
    }

  });
}
