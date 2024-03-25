import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import { withChangeSupport } from '../../../util/withChangeSupport';

const VARIABLE_TYPE_ID = 'dmn-boxed-expression-variable-type';

export default class ElementVariableComponentProvider {
  static $inject = [ 'components', 'elementVariable' ];

  constructor(components, elementVariable) {
    const component = withChangeSupport(
      ElementVariableComponent, () => [ elementVariable.getVariable() ]
    );

    components.onGetComponent('footer', () => component);
  }
}

function ElementVariableComponent(_, context) {
  const elementVariable = context.injector.get('elementVariable');
  const name = elementVariable.getName();

  return (
    <div className="element-variable">
      <h2>Result</h2>
      <div>{ name }</div>
      <div className="element-variable-type">
        <label className="element-variable-type-label" htmlFor={ VARIABLE_TYPE_ID }>
          Result type
        </label>
        <VariableType />
      </div>
    </div>
  );
}

function VariableType(_, context) {
  const elementVariable = context.injector.get('elementVariable');
  const dataTypes = context.injector.get('dataTypes');
  const translate = context.injector.get('translate');

  const type = elementVariable.getType();
  const onChange = type => elementVariable.setType(type);

  const typeRefOptions = dataTypes.getAll().map(t => {
    return {
      label: translate(t),
      value: t
    };
  });

  return <InputSelect
    value={ type }
    onChange={ onChange }
    options={ typeRefOptions }
    id={ VARIABLE_TYPE_ID }
  />;
}
