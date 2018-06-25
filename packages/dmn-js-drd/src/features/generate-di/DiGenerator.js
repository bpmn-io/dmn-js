import { forEach } from 'min-dash';

import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';
import { is } from 'dmn-js-shared/lib/util/ModelUtil';


/**
 * A component that generated basic DI, if graphical
 * information is missing on a dmn:Definitions element
 * to be imported.
 *
 * @param {EventBus} eventBus
 * @param {DrdFactory} drdFactory
 * @param {ElementFactory} elementFactory
 */
export default function DiGenerator(eventBus, drdFactory, elementFactory) {

  // ensure the definitions contains DI information
  eventBus.on('import.start', ({ definitions }) => {
    if (!containsDi(definitions)) {
      createDi(definitions);
    }
  });


  /**
   * Create basic DI for given dmn:Definitions element
   */
  function createDi(definitions) {

    var idx = 0;

    forEach(definitions.drgElements, function(element) {

      var bounds,
          extensionElements,
          dimensions;

      // only create DI for decision elements;
      // we're not a full fledged layouter (!)
      if (!is(element, 'dmn:Decision')) {
        return;
      }

      extensionElements = element.extensionElements;

      if (!extensionElements) {
        extensionElements = element.extensionElements = drdFactory.createDi();
        extensionElements.$parent = element;
      }

      dimensions = elementFactory._getDefaultSize(element);

      bounds = drdFactory.createDiBounds({
        x: 150 + (idx * 30),
        y: 150 + (idx * 30),
        width: dimensions.width,
        height: dimensions.height
      });

      // add bounds
      extensionElements.get('values').push(bounds);
      bounds.$parent = extensionElements;

      // stacking elements nicely on top of each other
      idx++;
    });
  }

}


DiGenerator.$inject = [
  'eventBus',
  'drdFactory',
  'elementFactory'
];