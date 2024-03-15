export class FunctionDefinition {
  getParameters(element) {
    return element.get('formalParameter');
  }

  getBody(element) {
    return element.get('body');
  }

  getKind(element) {
    return element.get('kind') || 'FEEL';
  }
}