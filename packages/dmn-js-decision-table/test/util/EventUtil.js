export function triggerInputEvent(element, text) {
  element.textContent = text;

  const event = new Event('input', {
    bubbles: true,
    cancelable: true
  });

  element.dispatchEvent(event);
}

export function triggerMouseEvent(element, event, clientX, clientY) {
  const e = document.createEvent('MouseEvent');

  if (e.initMouseEvent) {
    e.initMouseEvent(event, true, true, window, 0, 0, 0, clientX, clientY, false, false, false, false, 0, null);
  }

  element.dispatchEvent(e);
}