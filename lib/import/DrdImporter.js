'use strict';

var assign = require('lodash/object/assign');

var ModelUtil = require('../util/ModelUtil'),
    is = ModelUtil.is,
    getBusinessObject = ModelUtil.getBusinessObject;


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

function DrdImporter(eventBus, canvas, drdElementFactory, elementRegistry, overlays) {
  this._eventBus = eventBus;
  this._canvas = canvas;
  this._elementRegistry = elementRegistry;
  this._overlays = overlays;
  this._elementFactory = drdElementFactory;

  eventBus.on('drdElement.added', function(context) {
    var element = context.element,
        bo = getBusinessObject(element),
        name = bo.variable && bo.variable.name,
        text = bo.literalExpression && bo.literalExpression.text;

    if (is(element, 'dmn:Decision') && text) {
      overlays.add(element, {
        html: [
          '<div class="literal-expression-overlay">',
          '<div class="variable-name" title="Variable Name">',
          '<em>Name:</em> ' + name,
          '</div>',
          '<div class="literal-text" title="Literal Expression">',
          '<em>Expression:</em> ' + text,
          '</div>',
          '</div>'
        ].join(''),
        position: {
          bottom: -2,
          left: -1
        }
      });
    }
  });
}

DrdImporter.$inject = [ 'eventBus', 'canvas', 'drdElementFactory', 'elementRegistry', 'overlays' ];

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

    var sourceShape = this._getShape(di.target);
    var targetShape = this._getShape(semantic.id);

    if (sourceShape && targetShape) {
      element = elementFactory.createConnection(elementData(di, {
        hidden: false,
        source: sourceShape,
        target: targetShape,
        waypoints: waypoints
      }));

      this._setConnectionType(element, sourceShape.businessObject, targetShape.businessObject);

      canvas.addConnection(element);

      eventBus.fire('drdElement.added', { element: element, di: di });
    }

  } else {
    throw new Error('unknown di for element ' + semantic.id);
  }

  return element;
};

DrdImporter.prototype._setConnectionType = function(element, source, target) {
  if ((source.$instanceOf('dmn:Decision') || source.$instanceOf('dmn:InputData')) &&
      target.$instanceOf('dmn:Decision')) {
    element.type = 'dmn:InformationRequirement';
  } else if (source.$instanceOf('dmn:KnowledgeSource') || target.$instanceOf('dmn:KnowledgeSource')) {
    element.type = 'dmn:AuthorityRequirement';
  } else if (source.$instanceOf('dmn:BusinessKnowledgeModel')) {
    element.type = 'dmn:KnowledgeRequirement';
  }
};

DrdImporter.prototype._getShape = function(id) {
  return this._elementRegistry.get(id);
};
