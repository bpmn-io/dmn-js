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

function ContextComponent({ expression }, { injector }) {
  const context = injector.get('context');
  const entries = context.getEntries(expression);

  return (
    <div className="context">
      {
        entries.map(entry => {
          return <ContextEntry entry={ entry } />;
        })
      }
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
