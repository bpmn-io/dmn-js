import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export class ContextComponentProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:Context')) {
        return ContextComponent;
      }
    });
  }
}

/**
 * Renders the entries of a context: the variable and the value, which is
 * any boxed expression. An entry without variable is the result of the
 * context.
 */
function ContextComponent({ expression }) {
  return (
    <div className="context">
      {
        expression.get('contextEntry').map(entry => {
          return <ContextEntry key={ entry.id } entry={ entry } />;
        })
      }
    </div>
  );
}

function ContextEntry({ entry }, { injector }) {
  const translate = injector.get('translate');

  const variable = entry.get('variable');

  return (
    <div className="context-entry">
      <div
        className="context-entry-variable"
        title={ variable ? undefined : translate('Result') }
      >
        { variable && <Variable variable={ variable } /> }
      </div>
      <div className="context-entry-value">
        <Value expression={ entry.get('value') } />
      </div>
    </div>
  );
}

function Variable({ variable }, { injector }) {
  const translate = injector.get('translate');

  const { name, typeRef } = variable;

  return (
    <span className="context-entry-variable-name">
      { name || translate('<unnamed>') }
      {
        typeRef && (
          <span className="context-entry-variable-type">
            { ': ' }{ translate(typeRef) }
          </span>
        )
      }
    </span>
  );
}

function Value({ expression }, { components }) {
  if (!expression) {
    return null;
  }

  const Expression = components.getComponent('expression', { expression });

  return <Expression expression={ expression } />;
}
