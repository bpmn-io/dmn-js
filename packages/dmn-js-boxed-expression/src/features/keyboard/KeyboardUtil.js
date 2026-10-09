export function hasModifier(modifiers) {
  return (
    modifiers.ctrlKey ||
    modifiers.metaKey ||
    modifiers.shiftKey ||
    modifiers.altKey
  );
}

export function isCmd(modifiers) {

  // ensure we don't react to AltGr
  // (mapped to CTRL + ALT)
  if (modifiers.altKey) {
    return false;
  }

  return modifiers.ctrlKey || modifiers.metaKey;
}

export function isShift(modifiers) {
  return modifiers.shiftKey;
}
