import { assign } from 'min-dash';

import {
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

import {
  is,
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';

import {
  BUSINESS_KNOWLEDGE_MODEL_OUTLINE_PATH,
  KNOWLEDGE_SOURCE_OUTLINE_PATH,
  BUSINESS_KNOWLEDGE_MODEL_STANDARD_SIZE,
  KNOWLEDGE_SOURCE_STANDARD_SIZE,
  createPath
} from './OutlineUtil';

const DEFAULT_OFFSET = 5;

/**
 * DMN-specific outline provider.
 *
 * @implements {BaseOutlineProvider}
 *
 * @param {Outline} outline
 * @param {Styles} styles
 */
export default function OutlineProvider(outline, styles) {

  this._styles = styles;

  outline.registerProvider(this);
}

OutlineProvider.$inject = [
  'outline',
  'styles'
];

/**
 * Returns outline for a given element.
 *
 * @param {Element} element
 *
 * @return {Outline}
 */
OutlineProvider.prototype.getOutline = function(element) {

  const OUTLINE_STYLE = this._styles.cls('djs-outline', [ 'no-fill' ]);

  var outline;

  if (is(element, 'dmn:InputData')) {
    outline = svgCreate('rect');

    svgAttr(outline, assign({
      x: -DEFAULT_OFFSET,
      y: -DEFAULT_OFFSET,
      rx: 27,
      width: element.width + DEFAULT_OFFSET * 2,
      height: element.height + DEFAULT_OFFSET * 2,
    }, OUTLINE_STYLE));

  } else if (
    is(element, 'dmn:BusinessKnowledgeModel')
    && isStandardSize(element, 'dmn:BusinessKnowledgeModel')
  ) {
    outline = createPath(
      BUSINESS_KNOWLEDGE_MODEL_OUTLINE_PATH,
      { x: -6, y:-6 },
      OUTLINE_STYLE
    );

  } else if (
    is(element, 'dmn:KnowledgeSource')
    && isStandardSize(element, 'dmn:KnowledgeSource')) {
    outline = createPath(
      KNOWLEDGE_SOURCE_OUTLINE_PATH,
      { x: -6, y:-1.5 },
      OUTLINE_STYLE
    );
  }

  return outline;
};

/**
 * Updates the outline for a given element.
 * Returns true if the update for the given element was handled by this provider.
 *
 * @param {Element} element
 * @param {Outline} outline
 * @returns {boolean}
 */
OutlineProvider.prototype.updateOutline = function(element) {

  if (isAny(element, [
    'dmn:InputData',
    'dmn:BusinessKnowledgeModel',
    'dmn:KnowledgeSource'
  ])) {
    return true;
  }

  return false;
};


// helpers //////////

function isStandardSize(element, type) {
  var standardSize;

  if (type === 'dmn:BusinessKnowledgeModel') {
    standardSize = BUSINESS_KNOWLEDGE_MODEL_STANDARD_SIZE;
  } else if (type === 'dmn:KnowledgeSource') {
    standardSize = KNOWLEDGE_SOURCE_STANDARD_SIZE;
  }

  return element.width === standardSize.width
          && element.height === standardSize.height;
}