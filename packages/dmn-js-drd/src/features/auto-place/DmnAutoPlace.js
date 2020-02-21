import { getNewShapePosition } from './DmnAutoPlaceUtil';


/**
 * BPMN auto-place behavior.
 *
 * @param {EventBus} eventBus
 */
export default function AutoPlace(eventBus) {
  eventBus.on('autoPlace', function(context) {
    var shape = context.shape,
        source = context.source;

    getNewShapePosition(source, shape);
  });
}

AutoPlace.$inject = [ 'eventBus' ];