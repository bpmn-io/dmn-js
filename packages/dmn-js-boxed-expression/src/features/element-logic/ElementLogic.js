import { is } from 'dmn-js-shared/lib/util/ModelUtil';

const FALLBACK_PRIORITY = 100;

export default class ElementLogic {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('body', () => {
      return LogicComponent;
    });

    components.onGetComponent('expression', FALLBACK_PRIORITY, () => FallbackExpression);
  }
}

function LogicComponent(_, { injector }) {
  const components = injector.get('components');
  const viewer = injector.get('viewer');

  const rootElement = viewer.getRootElement();
  const expression = getLogic(rootElement);

  const Expression = components.getComponent('expression', {
    expression
  });

  return (
    <Expression expression={ expression } />
  );
}

function getLogic(element) {
  if (is(element, 'dmn:Decision')) {
    return element.get('decisionLogic');
  } else if (is(element, 'dmn:BusinessKnowledgeModel')) {
    return element.get('encapsulatedLogic');
  }
}

function FallbackExpression({ expression }) {
  return (
    <div>
      <span style="color:red;">
        Expression of type { expression.$type } is not supported.
      </span>
    </div>
  );
}
