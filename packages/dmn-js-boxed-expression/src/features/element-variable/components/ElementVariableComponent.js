const VARIABLE_TYPE_ID = 'dmn-boxed-expression-variable-type';


export default class ElementVariableComponentProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('footer', () => ElementVariableComponent);
  }
}


function ElementVariableComponent(_, context) {
  const elementVariable = context.injector.get('elementVariable');

  // there is only one single element
  const name = elementVariable.getName();
  const type = elementVariable.getType();

  return (
    <div className="element-variable">
      <h2>Result</h2>
      <div>{ name }</div>
      <div className="element-variable-type">
        <span className="element-variable-type-label">
          Result type
        </span>
        <span id={ VARIABLE_TYPE_ID }>{type}</span>
      </div>
    </div>
  );
}
