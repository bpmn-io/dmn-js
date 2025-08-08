import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export class ElementLogic {
  static $inject = [ 'viewer' ];

  constructor(viewer) {
    this._viewer = viewer;
  }

  getLogic() {
    const rootElement = this._viewer.getRootElement();

    if (is(rootElement, 'dmn:Decision')) {
      return rootElement.get('decisionLogic');
    } else if (is(rootElement, 'dmn:BusinessKnowledgeModel')) {
      return rootElement.get('encapsulatedLogic');
    }
  }
}
