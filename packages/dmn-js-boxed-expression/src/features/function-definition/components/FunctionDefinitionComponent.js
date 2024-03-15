import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export class FunctionDefinitionComponentProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:FunctionDefinition')) {
        return FunctionDefinitionComponent;
      }
    });
  }
}

function FunctionDefinitionComponent({ expression }, context) {
  const functionDefinition = context.injector.get('functionDefinition');

  const kind = functionDefinition.getKind(expression);
  const parameters = functionDefinition.getParameters(expression);
  const body = functionDefinition.getBody(expression);

  const BodyExpression = context.components.getComponent('expression', {
    expression: body
  });

  return (
    <div class="">

      <FormalParameters parameters={ parameters } />
      <BodyExpression expression={ body } />
    </div>
  );
}

function FormalParameters({ parameters }) {
  return (
    <div>
      (
      {
        parameters.map((parameter, idx) => {
          return <span>{parameter.name}: {parameter.typeRef}</span>;
        })
      }
      )
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
