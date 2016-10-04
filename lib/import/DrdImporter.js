var assign = require('lodash/object/assign');


function elementData(semantic, attrs) {
  return assign({
    id: semantic.id,
    type: semantic.$type,
    businessObject: semantic
  }, attrs);
}

function collectWaypoints(edge) {
  if (edge.waypoint) {
    return edge.waypoint.map(function(waypoint) {
      return { x: waypoint.x, y: waypoint.y };
    });
  }
}

function DrdImporter(eventBus, canvas, drdElementFactory) {
  this._eventBus = eventBus;
  this._canvas = canvas;

  this._elementFactory = drdElementFactory;
}

DrdImporter.$inject = [ 'eventBus', 'canvas', 'drdElementFactory' ];

module.exports = DrdImporter;


DrdImporter.prototype.root = function(diagram) {
  var element = this._elementFactory.createRoot(elementData(diagram));

  this._canvas.setRootElement(element);

  return element;
};

/**
 * Add drd element (semantic) to the canvas.
 */
DrdImporter.prototype.add = function(semantic, di) {

  var elementFactory = this._elementFactory,
      canvas = this._canvas,
      eventBus = this._eventBus,
      element;

  if (di.$instanceOf('biodi:Bounds')) {
    element = elementFactory.createShape(elementData(semantic, {
      x: Math.round(di.x),
      y: Math.round(di.y),
      width: Math.round(di.width),
      height: Math.round(di.height)
    }));

    canvas.addShape(element);

    eventBus.fire('drdElement.added', { element: element, di: di });

  } else if (di.$instanceOf('biodi:Edge')) {
    var waypoints = collectWaypoints(di);

    element = elementFactory.createConnection(elementData(di, {
      hidden: false,
      source: semantic,
      target: semantic,
      waypoints: waypoints
    }));

    canvas.addConnection(element);

    eventBus.fire('drdElement.added', { element: element, di: di });
    
  } else {
    throw new Error('unknown di for element ' + semantic.id);
  }

  return element;
};
