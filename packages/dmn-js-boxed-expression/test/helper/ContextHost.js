import { is } from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * Renders the entries of a context below each other, which allows to display
 * several decision tables at once.
 */
class ContextHost {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:Context')) {
        return Context;
      }
    });
  }
}

function Context({ expression }, { components }) {
  return (
    <div className="test-context">
      {
        expression.get('contextEntry').map(entry => {
          const value = entry.get('value');

          const Expression = components.getComponent('expression', {
            expression: value
          });

          return <Expression key={ entry.id } expression={ value } />;
        })
      }
    </div>
  );
}

export default {
  __init__: [ 'contextHost' ],
  contextHost: [ 'type', ContextHost ]
};
