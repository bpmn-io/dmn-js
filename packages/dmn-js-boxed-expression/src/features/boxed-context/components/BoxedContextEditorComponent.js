import Input from 'dmn-js-shared/lib/components/Input';
import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { withChangeSupport } from '../../../util/withChangeSupport';


export class BoxedContextComponentProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:Context')) {
        return BoxedContextEditorComponent;
      }
    });
  }
}

const BoxedContextEditorComponent = withChangeSupport(
  _BoxedContextEditorComponent,
  props => [ props.expression ]
);

function _BoxedContextEditorComponent({ expression }, context) {
  const boxedContext = context.injector.get('boxedContext');
  const entries = boxedContext.getEntries(expression);

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
  const boxedContext = context.injector.get('boxedContext');

  const value = entry.get('value');
  const Expression = context.components.getComponent('expression', {
    expression: value
  });

  return (
    <tr className="context-entry">
      <td className="variable-name">
        <Input
          value={ boxedContext.getEntryName(entry) }
          onChange={ name => boxedContext.setEntryName(entry, name) }
        />
      </td>
      <td>
        <Expression expression={ value } />
      </td>
    </tr>
  );
}