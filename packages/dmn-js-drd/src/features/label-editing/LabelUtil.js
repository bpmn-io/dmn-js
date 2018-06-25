import {
  is
} from 'dmn-js-shared/lib/util/ModelUtil';


function getLabelAttr(semantic) {
  if (is(semantic, 'dmn:Decision') ||
      is(semantic, 'dmn:BusinessKnowledgeModel') ||
      is(semantic, 'dmn:InputData') ||
      is(semantic, 'dmn:KnowledgeSource')) {

    return 'name';
  }

  if (is(semantic, 'dmn:TextAnnotation')) {
    return 'text';
  }
}

export function getLabel(element) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {
    return semantic[attr] || '';
  }
}


export function setLabel(element, text, isExternal) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {
    semantic[attr] = text;
  }

  // show external label if not empty
  if (isExternal) {
    element.hidden = !text;
  }

  return element;
}