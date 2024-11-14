import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { withChangeSupport } from '../../../util/withChangeSupport';
import { EditButton } from '../../../components/EditButton';

export class FunctionDefinitionComponentProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:FunctionDefinition')) {
        return FunctionDefinitionEditorComponent;
      }
    });
  }
}

const FunctionDefinitionEditorComponent = withChangeSupport(
  _FunctionDefinitionEditorComponent,
  props => [ props.expression ]
);


function _FunctionDefinitionEditorComponent({ expression }, context) {
  const functionDefinition = context.injector.get('functionDefinition');
  const contextMenu = context.injector.get('contextMenu');

  const kind = functionDefinition.getKind(expression);
  const parameters = functionDefinition.getParameters(expression);
  const body = functionDefinition.getBody(expression);

  const openKindEditor = event => {
    const position = getParentPosition(event);
    contextMenu.open(position, {
      contextMenuType: 'kind-editor',
      expression
    });
  };
  const openFormalParametersEditor = event => {
    const position = getParentPosition(event);
    contextMenu.open(position, {
      contextMenuType: 'formal-parameters-editor',
      expression
    });
  };

  return (
    <div className="function-definition">
      <Kind kind={ kind } openEditor={ openKindEditor } />
      <FormalParameters
        parameters={ parameters }
        openEditor={ openFormalParametersEditor }
      />
      <BodyExpression expression={ body } parameters={ parameters } />
    </div>
  );
}

const KIND_MAP = {
  'FEEL': 'F',
  'Java': 'J',
  'PMML': 'P'
};

function Kind({ kind, openEditor }, context) {
  const translate = context.injector.get('translate');

  return (
    <div className="function-definition-kind">
      { KIND_MAP[kind] }
      <EditButton label={ translate('Edit function kind') } onClick={ openEditor } />
    </div>
  );
}

function FormalParameters({ openEditor, parameters }, context) {
  const translate = context.injector.get('translate');

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
      <EditButton label={ translate('Edit formal parameters') } onClick={ openEditor } />
    </div>
  );
}

const Parameter = withChangeSupport(_Parameter, props => [ props.parameter ]);

function _Parameter({ parameter }) {
  const { name, typeRef } = parameter;
  const displayedName = name || '<unnamed>';

  return <span>
    {typeRef ? `${displayedName}: ${typeRef}` : displayedName}
  </span>;
}

const BodyExpression = withChangeSupport(_BodyExpression, props => props.parameters);

function _BodyExpression({ expression, parameters }, context) {
  const Expression = context.components.getComponent('expression', {
    expression
  });

  return (
    <div className="function-definition-body">
      <Expression expression={ expression } parameters={ parameters } />
    </div>
  );
}

function getParentPosition(event) {
  const parent = event.target.parentElement,
        bbox = parent.getBoundingClientRect();

  return {
    x: bbox.x,
    y: bbox.y
  };
}
