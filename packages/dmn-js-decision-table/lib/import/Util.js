export function elementToString(element) {
  if (!element) {
    return '<null>';
  }

  const id = element.id ? ` id="${element.id}"` : '';

  return `<${element.$type}${id} />`;
}