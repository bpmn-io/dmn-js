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

export function triggerClick(el, clientX, clientY) {
  triggerMouseEvent(el, 'click', clientX, clientY);
}

export function triggerMouseEvent(element, event, clientX, clientY) {
  const e = document.createEvent('MouseEvent');

  if (e.initMouseEvent) {
    e.initMouseEvent(
      event, true, true, window, 0, 0, 0,
      clientX, clientY, false, false, false, false,
      0, null
    );
  }

  element.dispatchEvent(e);
}

export function triggerChangeEvent(element, value) {
  element.value = value;

  const event = document.createEvent('HTMLEvents');

  event.initEvent('change', false, true);

  element.dispatchEvent(event);
}

export function triggerKeyEvent(element, event, code) {
  const e = document.createEvent('Events');

  if (e.initEvent) {
    e.initEvent(event, true, true);
  }

  e.keyCode = code;
  e.which = code;

  element.dispatchEvent(e);
}