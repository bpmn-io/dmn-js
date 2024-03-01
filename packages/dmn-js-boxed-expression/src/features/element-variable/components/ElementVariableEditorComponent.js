import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import { withChangeSupport } from '../../../util/withChangeSupport';

const VARIABLE_TYPE_ID = 'dmn-boxed-expression-variable-type';

const VariableType = withChangeSupport(function(props, context) {
  const { element } = props;
  const modeling = context.injector.get('modeling');
  const dmnFactory = context.injector.get('dmnFactory');
  const dataTypes = context.injector.get('dataTypes');
  const translate = context.injector.get('translate');

  const variable = element.get('variable');
  const onChange = typeRef => {
    if (!variable) {
      modeling.updateProperties(element, {
        variable: dmnFactory.create('dmn:InformationItem', {
          name: element.get('name'), typeRef
        })
      });
      return;
    }

    modeling.updateProperties(variable, { typeRef });
  };

  const value = variable ? variable.get('typeRef') : '';

  const typeRefOptions = dataTypes.getAll().map(t => {
    return {
      label: translate(t),
      value: t
    };
  });

  return <InputSelect
    value={ value }
    onChange={ onChange }
    options={ typeRefOptions }
    id={ VARIABLE_TYPE_ID }
  />;
}, props => [ props.element, props.element.get('variable') ]);


export default function ElementPropertiesComponent(_, context) {
  const viewer = context.injector.get('viewer');
  const rootElement = viewer.getRootElement();

  // there is only one single element
  const { name } = viewer.getRootElement();

  return (
    <div className="element-variable">
      <h2>Result</h2>
      <div>{ name }</div>
      <div className="element-variable-type">
        <label className="element-variable-type-label" htmlFor={ VARIABLE_TYPE_ID }>
          Result type
        </label>
        <VariableType element={ rootElement } />
      </div>
    </div>
  );
}