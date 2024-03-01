const VARIABLE_TYPE_ID = 'dmn-boxed-expression-variable-type';

export default function ElementVariableComponent(_, context) {
  const viewer = context.injector.get('viewer');

  // there is only one single element
  const { name, variable } = viewer.getRootElement();
  const type = variable ? variable.get('typeRef') : 'Any';

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
