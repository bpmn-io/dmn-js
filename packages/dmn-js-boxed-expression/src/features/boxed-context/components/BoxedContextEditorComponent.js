import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { withChangeSupport } from '../../../util/withChangeSupport';
import Input from 'dmn-js-shared/lib/components/Input';

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

  const addEntry = () => {
    boxedContext.addEntry(expression);
  };

  return (
    <table className="boxed-context">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        { entries.map((entry, idx) => (
          <ContextEntry
            key={ idx }
            entry={ entry }
            parent={ expression }
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={ 2 }>
            <button onClick={ addEntry }>Add entry</button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

const ContextEntry = withChangeSupport(_ContextEntry, props => [ props.entry ]);

function _ContextEntry({ entry, parent }, context) {

  const variable = entry.get('variable');
  const value = entry.get('value');

  const Expression = context.components.getComponent('expression', {
    expression: value
  });

  const onNameChange = value => {
    context.injector.get('modeling').updateProperties(variable, { name: value });
  };

  return (
    <tr className="boxed-context-entry">
      <td>
        <Input onChange={ onNameChange } value={ variable.name } />
      </td>
      <td>
        <Expression parent={ entry } expression={ value } />
      </td>
    </tr>
  );
}

