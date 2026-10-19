export default class ElementVariableComponentProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('footer', () => ElementVariableComponent);
  }
}


function ElementVariableComponent(_, context) {
  const elementVariable = context.injector.get('elementVariable');
  const translate = context.injector.get('translate');

  // there is only one single element
  const name = elementVariable.getName();
  const type = elementVariable.getType();

  return (
    <div className="element-variable">
      <h2>{ translate('Result') }</h2>
      <div className="element-variable-name">
        <span className="element-variable-name-label">
          { translate('Variable name') }
        </span>
        <span>
          { name }
        </span>
      </div>
      <div className="element-variable-type">
        <span className="element-variable-type-label">
          { translate('Result type') }
        </span>
        <span>{ translate(type) }</span>
      </div>
    </div>
  );
}
