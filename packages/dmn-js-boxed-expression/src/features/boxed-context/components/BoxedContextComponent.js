import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export class BoxedContextComponentProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:Context')) {
        return BoxedContextComponent;
      }
    });
  }
}

function BoxedContextComponent({ expression }, context) {
  const entries = expression.get('contextEntry');

  return (
    <table className="boxed-context" cellPadding="0" cellSpacing="0">
      <tbody>
        {
          entries.map(entry => {
            return (
              <ContextEntry
                entry={ entry }
              />
            );
          })
        }
      </tbody>
    </table>
  );
}

function ContextEntry({ entry }, context) {
  const value = entry.get('value');
  const Expression = context.components.getComponent('expression', {
    expression: value
  });

  return (
    <tr className="context-entry">
      <td className="variable-name">
        { entry.variable?.get('name') }
      </td>
      <td>
        <Expression expression={ value } />
      </td>
    </tr>
  );
}