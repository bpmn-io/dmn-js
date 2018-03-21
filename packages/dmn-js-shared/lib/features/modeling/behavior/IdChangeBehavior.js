import { forEach } from 'min-dash';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from '../../../util/ModelUtil';

const ID = 'id';


export default class IdChangeBehavior extends CommandInterceptor {
  constructor(eventBus) {
    super(eventBus);

    this.executed('updateProperties', this.updateIds.bind(this));
  }

  updateIds({ context }) {
    const { element, oldProperties, properties } = context;

    if (!is(element, 'dmn:DRGElement') || !isIdChange(oldProperties, properties)) {
      return;
    }

    const drgElements = getDrgElements(element);

    drgElements.forEach(drgElement => {
      updateElementReferences(drgElement, oldProperties.id, properties.id);

      updateEdges(drgElement, oldProperties.id, properties.id);
    });
  }

}

IdChangeBehavior.$inject = [ 'eventBus' ];


// helpers //////////////////////

function isIdChange(oldProperties, properties) {
  return ID in oldProperties && ID in properties;
}

function getDrgElements(element) {
  const definitions = element.$parent;

  const drgElements = definitions.drgElements;

  return drgElements;
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

function updateEdges(element, oldId, id) {

  if (element.extensionElements) {
    element.extensionElements.values.forEach(extensionElement => {

      if (is(extensionElement, 'biodi:Edge')) {

        if (extensionElement.source === oldId) {
          extensionElement.source = id;
        }

      }

    });
  }

}