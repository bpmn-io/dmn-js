import inherits from 'inherits-browser';

import Ids from 'ids';

import {
  isObject,
  assign
} from 'min-dash';

import {
  attr as domAttr,
  query as domQuery
} from 'min-dom';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  createLine
} from 'diagram-js/lib/util/RenderUtil';

import {
  is,
  getName
} from 'dmn-js-shared/lib/util/ModelUtil';

var RENDERER_IDS = new Ids();

var black = 'hsl(225, 10%, 15%)';

/**
 * Renderer for the DRD view. The default colors are configurable.
 * When default label color is not provided, it will take the default
 * stroke color.
 *
 * @example
 * ```javascript
 * // for simple DRD viewer
 * const viewer = new DrdViewer({
 *   drdRenderer: {
 *     defaultFillColor: '#ffd700',
 *     defaultStrokeColor: '#0057b8',
 *     defaultLabelColor: '#0057b8'
 *   }
 * });
 *
 * // in dmn-js
 * const modeler = new DmnModeler({
 *   drd: {
 *     drdRenderer: {
 *       defaultFillColor: '#ffd700',
 *       defaultStrokeColor: '#0057b8',
 *       defaultLabelColor: '#0057b8'
 *     }
 *   }
 * });
 * ```
 */
export default function DrdRenderer(
    config, eventBus, pathMap, styles, textRenderer, canvas) {

  BaseRenderer.call(this, eventBus);

  var rendererId = RENDERER_IDS.next();

  var computeStyle = styles.computeStyle;

  var markers = {};

  var defaultFillColor = config && config.defaultFillColor || 'white',
      defaultStrokeColor = config && config.defaultStrokeColor || black,
      defaultLabelColor = config && config.defaultLabelColor;

  function marker(type, fill, stroke) {
    var id = type + '-' + colorEscape(fill) +
      '-' + colorEscape(stroke) + '-' + rendererId;

    if (!markers[id]) {
      createMarker(id, type, fill, stroke);
    }

    return 'url(#' + id + ')';
  }

  function addMarker(id, options) {
    var attrs = assign({
      strokeWidth: 1,
      strokeLinecap: 'round',
      strokeDasharray: 'none'
    }, options.attrs);

    var ref = options.ref || { x: 0, y: 0 };

    var scale = options.scale || 1;

    // fix for safari / chrome / firefox bug not correctly
    // resetting stroke dash array
    if (attrs.strokeDasharray === 'none') {
      attrs.strokeDasharray = [ 10000, 1 ];
    }

    var marker = svgCreate('marker');

    svgAttr(options.element, attrs);

    svgAppend(marker, options.element);

    svgAttr(marker, {
      id: id,
      viewBox: '0 0 20 20',
      refX: ref.x,
      refY: ref.y,
      markerWidth: 20 * scale,
      markerHeight: 20 * scale,
      orient: 'auto'
    });

    var defs = domQuery('defs', canvas._svg);

    if (!defs) {
      defs = svgCreate('defs');

      svgAppend(canvas._svg, defs);
    }

    svgAppend(defs, marker);

    markers[id] = marker;
  }

  function createMarker(id, type, fill, stroke) {

    if (type === 'association-start') {
      var associationStart = svgCreate('path');
      svgAttr(associationStart, { d: 'M 11 5 L 1 10 L 11 15' });

      addMarker(id, {
        element: associationStart,
        attrs: {
          fill: 'none',
          stroke: stroke,
          strokeWidth: 1.5
        },
        ref: { x: 1, y: 10 },
        scale: 0.5
      });

    } else if (type === 'association-end') {
      var associationEnd = svgCreate('path');
      svgAttr(associationEnd, { d: 'M 1 5 L 11 10 L 1 15' });

      addMarker(id, {
        element: associationEnd,
        attrs: {
          fill: 'none',
          stroke: stroke,
          strokeWidth: 1.5
        },
        ref: { x: 12, y: 10 },
        scale: 0.5
      });
    } else if (type === 'information-requirement-end') {
      var informationRequirementEnd = svgCreate('path');
      svgAttr(informationRequirementEnd, { d: 'M 1 5 L 11 10 L 1 15 Z' });

      addMarker(id, {
        element: informationRequirementEnd,
        attrs: {
          fill: stroke,
          stroke: 'none'
        },
        ref: { x: 11, y: 10 },
        scale: 1
      });
    } else if (type === 'knowledge-requirement-end') {
      var knowledgeRequirementEnd = svgCreate('path');
      svgAttr(knowledgeRequirementEnd, { d: 'M 1 3 L 11 10 L 1 17' });

      addMarker(id, {
        element: knowledgeRequirementEnd,
        attrs: {
          fill: 'none',
          stroke: stroke,
          strokeWidth: 2
        },
        ref: { x: 11, y: 10 },
        scale: 0.8
      });
    } else if (type === 'authority-requirement-end') {
      var authorityRequirementEnd = svgCreate('circle');
      svgAttr(authorityRequirementEnd, { cx: 3, cy: 3, r: 3 });

      addMarker(id, {
        element: authorityRequirementEnd,
        attrs: {
          fill: stroke,
          stroke: 'none'
        },
        ref: { x: 3, y: 3 },
        scale: 0.9
      });
    }
  }

  function drawRect(p, width, height, r, offset, attrs) {

    if (isObject(offset)) {
      attrs = offset;
      offset = 0;
    }

    offset = offset || 0;

    attrs = computeStyle(attrs, {
      stroke: black,
      strokeWidth: 2,
      fill: 'white'
    });

    var rect = svgCreate('rect');
    svgAttr(rect, {
      x: offset,
      y: offset,
      width: width - offset * 2,
      height: height - offset * 2,
      rx: r,
      ry: r
    });
    svgAttr(rect, attrs);

    svgAppend(p, rect);

    return rect;
  }

  function renderLabel(p, label, options) {
    var text = textRenderer.createText(label || '', options);

    domAttr(text, 'class', 'djs-label');

    svgAppend(p, text);

    return text;
  }

  function renderEmbeddedLabel(p, element, align, options) {
    var name = getName(element);

    options = assign({
      box: element,
      align: align,
      padding: 5,
      style: {
        fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor)
      }
    }, options);

    return renderLabel(p, name, options);
  }

  function drawPath(p, d, attrs) {

    attrs = computeStyle(attrs, [ 'no-fill' ], {
      strokeWidth: 2,
      stroke: black
    });

    var path = svgCreate('path');
    svgAttr(path, { d: d });
    svgAttr(path, attrs);

    svgAppend(p, path);

    return path;
  }


  var handlers = {
    'dmn:Decision': function(p, element) {
      var rect = drawRect(p, element.width, element.height, 0, {
        stroke: getStrokeColor(element, defaultStrokeColor),
        fill: getFillColor(element, defaultFillColor)
      });

      renderEmbeddedLabel(p, element, 'center-middle');

      return rect;
    },
    'dmn:KnowledgeSource': function(p, element) {

      var pathData = pathMap.getScaledPath('KNOWLEDGE_SOURCE', {
        xScaleFactor: 1.021,
        yScaleFactor: 1,
        containerWidth: element.width,
        containerHeight: element.height,
        position: {
          mx: 0.0,
          my: 0.075
        }
      });

      var knowledgeSource = drawPath(p, pathData, {
        strokeWidth: 2,
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor)
      });

      renderEmbeddedLabel(p, element, 'center-middle');

      return knowledgeSource;
    },
    'dmn:BusinessKnowledgeModel': function(p, element) {

      var pathData = pathMap.getScaledPath('BUSINESS_KNOWLEDGE_MODEL', {
        xScaleFactor: 1,
        yScaleFactor: 1,
        containerWidth: element.width,
        containerHeight: element.height,
        position: {
          mx: 0.0,
          my: 0.3
        }
      });

      var businessKnowledge = drawPath(p, pathData, {
        strokeWidth: 2,
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor)
      });

      renderEmbeddedLabel(p, element, 'center-middle');

      return businessKnowledge;
    },
    'dmn:InputData': function(p, element) {

      var rect = drawRect(p, element.width, element.height, 22, {
        stroke: getStrokeColor(element, defaultStrokeColor),
        fill: getFillColor(element, defaultFillColor)
      });

      renderEmbeddedLabel(p, element, 'center-middle');

      return rect;
    },
    'dmn:TextAnnotation': function(p, element) {
      var style = {
        'fill': 'none',
        'stroke': 'none'
      };

      var textElement = drawRect(p, element.width, element.height, 0, 0, style);

      var textPathData = pathMap.getScaledPath('TEXT_ANNOTATION', {
        xScaleFactor: 1,
        yScaleFactor: 1,
        containerWidth: element.width,
        containerHeight: element.height,
        position: {
          mx: 0.0,
          my: 0.0
        }
      });

      drawPath(p, textPathData, {
        stroke: getStrokeColor(element, defaultStrokeColor),
      });

      var text = getSemantic(element).text || '';

      renderLabel(p, text, {
        style: {
          fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor)
        },
        box: element,
        align: 'left-top',
        padding: 5
      });

      return textElement;
    },
    'dmn:Association': function(p, element) {
      var semantic = getSemantic(element);

      var fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultStrokeColor),
          attrs = {
            stroke: stroke,
            strokeDasharray: '0.5, 5',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            fill: 'none'
          };

      if (semantic.associationDirection === 'One' ||
          semantic.associationDirection === 'Both') {
        attrs.markerEnd = marker('association-end', fill, stroke);
      }

      if (semantic.associationDirection === 'Both') {
        attrs.markerStart = marker('association-start', fill, stroke);
      }

      return drawLine(p, element.waypoints, attrs);
    },
    'dmn:InformationRequirement': function(p, element) {

      var fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultStrokeColor),
          attrs = {
            stroke: stroke,
            strokeWidth: 1,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            markerEnd: marker('information-requirement-end', fill, stroke)
          };

      return drawLine(p, element.waypoints, attrs);
    },
    'dmn:KnowledgeRequirement': function(p, element) {

      var fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultStrokeColor);
      var attrs = {
        stroke: stroke,
        strokeWidth: 1,
        strokeDasharray: 5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        markerEnd: marker('knowledge-requirement-end', fill, stroke)
      };

      return drawLine(p, element.waypoints, attrs);
    },
    'dmn:AuthorityRequirement': function(p, element) {

      var fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultStrokeColor),
          attrs = {
            stroke: stroke,
            strokeWidth: 1.5,
            strokeDasharray: 5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            markerEnd: marker('authority-requirement-end', fill, stroke)
          };

      return drawLine(p, element.waypoints, attrs);
    }
  };


  // draw shape and connection //////////////////

  function drawShape(parent, element) {
    var h = handlers[element.type];

    if (!h) {
      return BaseRenderer.prototype.drawShape.apply(this, [ parent, element ]);
    } else {
      return h(parent, element);
    }
  }

  function drawConnection(parent, element) {
    var type = element.type;
    var h = handlers[type];

    if (!h) {
      return BaseRenderer.prototype.drawConnection.apply(this, [ parent, element ]);
    } else {
      return h(parent, element);
    }
  }

  function drawLine(p, waypoints, attrs) {
    attrs = computeStyle(attrs, [ 'no-fill' ], {
      stroke: black,
      strokeWidth: 2,
      fill: 'none'
    });

    var line = createLine(waypoints, attrs);

    svgAppend(p, line);

    return line;
  }

  this.canRender = function(element) {
    return is(element, 'dmn:DMNElement') ||
           is(element, 'dmn:InformationRequirement') ||
           is(element, 'dmn:KnowledgeRequirement') ||
           is(element, 'dmn:AuthorityRequirement');
  };

  this.drawShape = drawShape;
  this.drawConnection = drawConnection;
}

inherits(DrdRenderer, BaseRenderer);

DrdRenderer.$inject = [
  'config.drdRenderer',
  'eventBus',
  'pathMap',
  'styles',
  'textRenderer',
  'canvas'
];


// helper functions //////////////////////

function getSemantic(element) {
  return element.businessObject;
}

function colorEscape(str) {

  // only allow characters and numbers
  return str.replace(/[^0-9a-zA-z]+/g, '_');
}

function getStrokeColor(element, defaultColor) {
  return defaultColor;
}

function getFillColor(element, defaultColor) {
  return defaultColor;
}

function getLabelColor(element, defaultColor, defaultStrokeColor) {
  return defaultColor || getStrokeColor(element, defaultStrokeColor);
}