import {
  query as domQuery
} from 'min-dom';

import {
  assign,
  isObject
} from 'min-dash';


export function triggerInputEvent(element, text) {
  if (element.tagName === 'INPUT') {
    element.value = text;
  } else if (element.contentEditable) {
    element.innerHTML = text;
  }

  const event = new Event('input', {
    bubbles: true,
    cancelable: true
  });

  return element.dispatchEvent(event);
}

export function triggerClick(el, clientX, clientY, ctrlKey) {
  return triggerMouseEvent(el, 'click', clientX, clientY, ctrlKey);
}

export function triggerMouseEvent(element, event, clientX, clientY, ctrlKey = false) {
  const e = document.createEvent('MouseEvent');

  if (e.initMouseEvent) {
    e.initMouseEvent(
      event, true, true, window, 0, 0, 0,
      clientX, clientY, ctrlKey, false, false, false,
      0, null
    );
  }

  return element.dispatchEvent(e);
}

export function triggerEvent(element, name, eventType, bubbles=false) {
  const event = document.createEvent(eventType);

  event.initEvent(name, bubbles, true);

  return element.dispatchEvent(event);
}

export function triggerFocusIn(element) {
  return triggerEvent(element, 'focusin', 'UIEvents', true);
}

export function triggerChangeEvent(element, value) {
  element.value = value;

  return triggerEvent(element, 'change', 'HTMLEvents');
}

export function triggerKeyEvent(element, event, optionsOrCode) {
  const e = document.createEvent('Events');

  e.initEvent(event, true, true);

  if (isObject(optionsOrCode)) {
    assign(e, optionsOrCode);
  } else {
    e.keyCode = optionsOrCode;
    e.which = optionsOrCode;
  }

  return element.dispatchEvent(e);
}

export function triggerInputSelectChange(inputSelect, value, testContainer) {
  triggerClick(inputSelect);

  const optionQuery = value ?
    `.option[data-value="${ value }"]` : '.option:not([data-value])';

  const option = domQuery(optionQuery, testContainer);

  return triggerClick(option);
}