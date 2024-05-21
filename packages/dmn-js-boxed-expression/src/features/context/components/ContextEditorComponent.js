import { is } from 'dmn-js-shared/lib/util/ModelUtil';
import { withChangeSupport } from '../../../util/withChangeSupport';


export class ContextEditorComponentProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:Context')) {
        return withChangeSupport(ContextEditorComponent, props => [ props.expression ]);
      }
    });
  }
}

function ContextEditorComponent({ expression }, { injector }) {
  const context = injector.get('context');
  const entries = context.getEntries(expression);



  return (
    <div className="context">
      {
        entries.map(entry => {
          return <ContextEntry entry={ entry } />;
        })
      }
      <AddEntry context={ expression } />
    </div>
  );
}

function AddEntry({ context }, { injector }) {
  const contextHelper = injector.get('context');
  const translate = injector.get('translate');

  return (
    <div className="add-entry">
      <button
        onClick={ () => contextHelper.addEntry(context) }
      >
        {translate('Add entry')}
      </button>
    </div>
  );
}

function ContextEntry({ entry }, { components, injector }) {
  const context = injector.get('context');
  const key = context.getKey(entry);
  const expression = context.getExpression(entry);

  const Expression = components.getComponent('expression', {
    expression
  });

  return (
    <div className="context-entry">
      { key && <ContextEntryKey entryKey={ key } /> }
      <Expression expression={ expression } />
    </div>
  );
}

function ContextEntryKey({ entryKey }) {
  return (
    <div
      className="context-entry-key"
    >
      { entryKey.get('name') }
    </div>
  );
}
