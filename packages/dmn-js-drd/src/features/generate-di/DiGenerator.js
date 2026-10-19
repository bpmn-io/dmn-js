import { find, forEach } from 'min-dash';

import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';
import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { MIN_SECTION_HEIGHT } from '../decision-service-divider/DecisionServiceDivider';

import {
  DECISION_SERVICE_PADDING,
  DECISION_SIZE
} from '../modeling/ElementFactory';

import { getIdFromHref } from '../modeling/util/HrefUtil';


/**
 * Generates missing DI on import.
 *
 * @param {DrdFactory} drdFactory
 * @param {ElementFactory} elementFactory
 * @param {EventBus} eventBus
 */
export default function DiGenerator(drdFactory, elementFactory, eventBus, drdUpdater) {
  function createDi(definitions) {

    // retrieve or create dmnDI
    var dmnDI = definitions.dmnDI;

    if (!dmnDI) {
      dmnDI = drdFactory.create('dmndi:DMNDI');
      definitions.set('dmnDI', dmnDI);
    }

    var diagram = drdFactory.create('dmndi:DMNDiagram');

    dmnDI.set('diagrams', [ diagram ]);

    var drgElements = definitions.get('drgElement');

    // ids of decisions referenced by a decision service, laid out inside
    // of it rather than on their own
    var referenced = new Set();

    // ids of decisions already laid out inside a decision service
    var placed = new Set();

    forEach(drgElements, function(drgElement) {
      if (is(drgElement, 'dmn:DecisionService')) {
        forEach([ 'outputDecision', 'encapsulatedDecision' ], function(property) {
          forEach(drgElement.get(property), function(reference) {
            referenced.add(getIdFromHref(reference.href));
          });
        });
      }
    });

    function createShapeDi(drgElement, bounds) {
      var di = drdFactory.createDiShape(drgElement, bounds);

      drdUpdater.updateDiParent(di, diagram);

      return di;
    }

    function getMembers(decisionService, property) {
      var decisions = [];

      forEach(decisionService.get(property), function(reference) {
        var id = getIdFromHref(reference.href);

        var decision = find(drgElements, function(drgElement) {
          return drgElement.id === id && is(drgElement, 'dmn:Decision');
        });

        if (decision && !placed.has(id)) {
          placed.add(id);

          decisions.push(decision);
        }
      });

      return decisions;
    }

    function getSectionHeight(decisionCount) {
      return Math.max(
        MIN_SECTION_HEIGHT,
        DECISION_SERVICE_PADDING +
          decisionCount * (DECISION_SIZE.height + DECISION_SERVICE_PADDING)
      );
    }

    function createDecisionsDi(decisions, x, top, width) {
      forEach(decisions, function(decision, i) {
        createShapeDi(decision, {
          x: x + (width - DECISION_SIZE.width) / 2,
          y: top + DECISION_SERVICE_PADDING +
            i * (DECISION_SIZE.height + DECISION_SERVICE_PADDING),
          width: DECISION_SIZE.width,
          height: DECISION_SIZE.height
        });
      });
    }

    // sizes the service to contain its decisions, one section each
    function createDecisionServiceDi(decisionService, x, y) {
      var output = getMembers(decisionService, 'outputDecision'),
          encapsulated = getMembers(decisionService, 'encapsulatedDecision');

      var outputHeight = getSectionHeight(output.length),
          width = Math.max(
            elementFactory._getDefaultSize(decisionService).width,
            DECISION_SIZE.width + 2 * DECISION_SERVICE_PADDING
          );

      var dividerY = y + outputHeight;

      var di = createShapeDi(decisionService, {
        x: x,
        y: y,
        width: width,
        height: outputHeight + getSectionHeight(encapsulated.length)
      });

      var dividerLine = drdFactory.createDiDividerLine([
        { x: x, y: dividerY },
        { x: x + width, y: dividerY }
      ]);

      dividerLine.$parent = di;
      di.decisionServiceDividerLine = dividerLine;

      createDecisionsDi(output, x, y, width);
      createDecisionsDi(encapsulated, x, dividerY, width);
    }

    var index = 0;

    forEach(drgElements, function(drgElement) {

      // generate DI for decisions and decision services only
      if (!is(drgElement, 'dmn:Decision') && !is(drgElement, 'dmn:DecisionService')) {
        return;
      }

      if (referenced.has(drgElement.id)) {
        return;
      }

      var x = 150 + (index * 30),
          y = 150 + (index * 30);

      if (is(drgElement, 'dmn:DecisionService')) {
        createDecisionServiceDi(drgElement, x, y);
      } else {
        var dimensions = elementFactory._getDefaultSize(drgElement);

        createShapeDi(drgElement, {
          x: x,
          y: y,
          width: dimensions.width,
          height: dimensions.height
        });
      }

      index++;
    });
  }

  eventBus.on('import.start', ({ definitions }) => {
    if (!containsDi(definitions)) {
      createDi(definitions);
    }
  });
}

DiGenerator.$inject = [
  'drdFactory',
  'elementFactory',
  'eventBus',
  'drdUpdater'
];
