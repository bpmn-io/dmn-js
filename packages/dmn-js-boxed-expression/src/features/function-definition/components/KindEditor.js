import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

const KIND_OPTIONS = [
  {
    value: 'FEEL',
    label: 'FEEL'
  },
  {
    value: 'Java',
    label: 'Java'
  },
  {
    value: 'PMML',
    label: 'PMML'
  }
];

export class KindEditorProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'kind-editor') {
        return KindEditor;
      }
    });
  }
}

function KindEditor({ context: { expression } }, context) {
  const functionDefinition = context.injector.get('functionDefinition');
  const translate = context.injector.get('translate');
  const kind = functionDefinition.getKind(expression);

  const setKind = value => {
    functionDefinition.setKind(expression, value);
  };

  return (
    <div className="context-menu-container">
      <h3>{translate('Edit function kind')}</h3>
      <InputSelect
        label={ translate('Kind') }
        options={ KIND_OPTIONS }
        value={ kind }
        onChange={ setKind }
        noInput
      />
    </div>
  );
}
