import { forEach } from 'min-dash';

import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';
import { is } from 'dmn-js-shared/lib/util/ModelUtil';


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

    var index = 0;

    forEach(definitions.get('drgElement'), function(drgElement) {

      // generate DI for decisions and decision services only
      if (!is(drgElement, 'dmn:Decision') && !is(drgElement, 'dmn:DecisionService')) {
        return;
      }

      var dimensions = elementFactory._getDefaultSize(drgElement);

      var x = 150 + (index * 30),
          y = 150 + (index * 30);

      var di = drdFactory.createDiShape(drgElement, {
        x: x,
        y: y,
        width: dimensions.width,
        height: dimensions.height
      });

      if (is(drgElement, 'dmn:DecisionService')) {
        var dividerY = y + (dimensions.height / 2);

        var dividerLine = drdFactory.createDiDividerLine([
          { x: x, y: dividerY },
          { x: x + dimensions.width, y: dividerY }
        ]);

        dividerLine.$parent = di;
        di.decisionServiceDividerLine = dividerLine;
      }

      drdUpdater.updateDiParent(di, diagram);

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