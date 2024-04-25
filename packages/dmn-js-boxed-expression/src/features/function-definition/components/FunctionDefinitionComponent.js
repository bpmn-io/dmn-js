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

  return (
    <div className="function-definition">
      <Kind kind={ kind } />
      <FormalParameters parameters={ parameters } />
      <BodyExpression expression={ body } />
    </div>
  );
}

const KIND_MAP = {
  'FEEL': 'F',
  'Java': 'J',
  'PMML': 'P'
};

function Kind({ kind }, context) {
  const translate = context.injector.get('translate');

  return (
    <div
      className="function-definition-kind"
      title={ translate('Function kind: {kind}', { kind }) }
    >
      { KIND_MAP[kind] }
    </div>
  );
}

function FormalParameters({ parameters }) {
  return (
    <div className="function-definition-parameters">
      <div>
        (
        {
          parameters.reduce((acc, parameter) => {
            return acc.concat(<Parameter parameter={ parameter } />, ', ');
          }, []).slice(0, -1)
        }
        )
      </div>
    </div>
  );
}

function Parameter({ parameter }) {
  const { name, typeRef } = parameter;
  const displayedName = name || '<unnamed>';

  return <span>
    {typeRef ? `${displayedName}: ${typeRef}` : displayedName}
  </span>;
}

function BodyExpression({ expression }, context) {
  const Expression = context.components.getComponent('expression', {
    expression
  });

  return (
    <div className="function-definition-body">
      <Expression expression={ expression } />
    </div>
  );
}
