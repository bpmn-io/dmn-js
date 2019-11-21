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
export default function DiGenerator(drdFactory, elementFactory, eventBus) {
  function createDi(definitions) {

    var index = 0;

    forEach(definitions.drgElements, function(drgElement) {

      // generate DI for decisions only
      if (!is(drgElement, 'dmn:Decision')) {
        return;
      }

      var extensionElements = drgElement.extensionElements;

      if (!extensionElements) {
        extensionElements = drgElement.extensionElements =
          drdFactory.createExtensionElements();

        extensionElements.$parent = drgElement;
      }

      var dimensions = elementFactory._getDefaultSize(drgElement);

      var bounds = drdFactory.createDiBounds({
        x: 150 + (index * 30),
        y: 150 + (index * 30),
        width: dimensions.width,
        height: dimensions.height
      });

      extensionElements.get('values').push(bounds);

      bounds.$parent = extensionElements;

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
  'eventBus'
];