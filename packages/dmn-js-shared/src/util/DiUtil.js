/**
 * Does the definitions element contain graphical information?
 *
 * @param  {ModdleElement} definitions
 *
 * @return {Boolean} true, if the definitions contains graphical information
 */
export function containsDi(definitions) {
  return definitions.dmnDI && definitions.dmnDI.diagrams && definitions.dmnDI.diagrams[0];
}

export function hasDi(element) {
  return !!element.di;
}