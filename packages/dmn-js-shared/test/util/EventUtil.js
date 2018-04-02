import { query as domQuery } from 'min-dom';

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

  element.dispatchEvent(event);
}

export function triggerClick(el, clientX, clientY, ctrlKey) {
  triggerMouseEvent(el, 'click', clientX, clientY, ctrlKey);
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

  element.dispatchEvent(e);
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

export function triggerKeyEvent(element, event, code) {
  const e = document.createEvent('Events');

  e.initEvent(event, true, true);

  e.keyCode = code;
  e.which = code;

  element.dispatchEvent(e);
}

export function triggerInputSelectChange(inputSelect, value, testContainer) {
  triggerClick(inputSelect);

  const option = domQuery(`.option[data-value="${ value }"]`, testContainer);

  triggerClick(option);
}