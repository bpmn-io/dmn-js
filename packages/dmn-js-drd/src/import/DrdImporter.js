import {
  assign,
  map
} from 'min-dash';

import {
  is
} from 'dmn-js-shared/lib/util/ModelUtil';


export default function DrdImporter(
    eventBus,
    canvas,
    elementFactory,
    elementRegistry) {

  this._eventBus = eventBus;
  this._canvas = canvas;
  this._elementRegistry = elementRegistry;
  this._elementFactory = elementFactory;
}

DrdImporter.$inject = [
  'eventBus',
  'canvas',
  'elementFactory',
  'elementRegistry'
];


DrdImporter.prototype.root = function(semantic) {
  var element = this._elementFactory.createRoot(elementData(semantic));

  this._canvas.setRootElement(element);

  return element;
};

/**
 * Add drd element (semantic) to the canvas.
 */
DrdImporter.prototype.add = function(semantic) {
  var elementFactory = this._elementFactory,
      canvas = this._canvas,
      eventBus = this._eventBus,
      di = semantic.di;

  var element, waypoints, source, target, elementDefinition, bounds;

  if (di.$instanceOf('dmndi:DMNShape')) {
    bounds = di.bounds;

    elementDefinition = elementData(semantic, {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height)
    });

    element = elementFactory.createShape(elementDefinition);

    canvas.addShape(element);

    eventBus.fire('drdElement.added', { element: element, di: di });

  } else if (di.$instanceOf('dmndi:DMNEdge')) {
    waypoints = collectWaypoints(di);

    source = this._getSource(semantic);
    target = this._getTarget(semantic);

    if (source && target) {
      elementDefinition = elementData(semantic, {
        hidden: false,
        source: source,
        target: target,
        waypoints: waypoints
      });

      element = elementFactory.createConnection(elementDefinition);

      canvas.addConnection(element);

      eventBus.fire('drdElement.added', { element: element, di: di });
    }

  } else {
    throw new Error('unknown di for element ' + semantic.id);
  }

  return element;
};

DrdImporter.prototype._getSource = function(semantic) {
  var href, elementReference;

  if (is(semantic, 'dmn:Association')) {
    elementReference = semantic.sourceRef;
  } else if (is(semantic, 'dmn:InformationRequirement')) {
    elementReference = semantic.requiredDecision || semantic.requiredInput;
  } else if (is(semantic, 'dmn:KnowledgeRequirement')) {
    elementReference = semantic.requiredKnowledge;
  } else if (is(semantic, 'dmn:AuthorityRequirement')) {
    elementReference = semantic.requiredDecision ||
      semantic.requiredInput || semantic.requiredAuthority;
  }

  if (elementReference) {
    href = elementReference.href;
  }

  if (href) {
    return this._getShape(getIdFromHref(href));
  }
};

DrdImporter.prototype._getTarget = function(semantic) {
  if (is(semantic, 'dmn:Association')) {
    return semantic.targetRef && this._getShape(getIdFromHref(semantic.targetRef.href));
  }

  return this._getShape(semantic.$parent.id);
};

DrdImporter.prototype._getShape = function(id) {
  return this._elementRegistry.get(id);
};



// helper /////
function elementData(semantic, attrs) {
  return assign({
    id: semantic.id,
    type: semantic.$type,
    businessObject: semantic
  }, attrs);
}

function collectWaypoints(edge) {
  var waypoints = edge.waypoint;

  if (waypoints) {
    return map(waypoints, function(waypoint) {
      var position = { x: waypoint.x, y: waypoint.y };

      return assign({ original: position }, position);
    });
  }
}

function getIdFromHref(href) {
  return href.split('#').pop();
}
