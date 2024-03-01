export function FunctionDefinitionComponent({ expression }, context) {
  const parameters = expression.get('formalParameter');
  const body = expression.get('body');

  const BodyExpression = context.components.getComponent('expression', {
    expression: body
  });

  return (
    <div>
      <FormalParameters parameters={ parameters } />
      <BodyExpression expression={ body } />
    </div>
  );
}

function FormalParameters({ parameters }) {
  return (
    <div>
      <h2>Parameters</h2>
      <ul>
        {
          parameters.map((parameter, idx) => {
            return <li key={ idx }>{ parameter.name }</li>;
          })
        }
      </ul>
    </div>
  );
}
