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

    if (!is(bo, 'dmn:DRGElement') || !isIdChange(oldProperties, properties)) {
      return;
    }

    const drgElements = getDrgElements(bo);

    drgElements.forEach(drgElement => {
      updateElementReferences(drgElement, oldProperties.id, properties.id);
    });
  }

}

IdChangeBehavior.$inject = [ 'eventBus' ];


// helpers //////////////////////

function isIdChange(oldProperties, properties) {
  return ID in oldProperties && ID in properties;
}

function getDrgElements(element) {
  const definitions = getDefinitions(element);

  const drgElements = definitions.get('drgElement');

  return drgElements;
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
