import Select from 'dmn-js-shared/lib/components/Select';


/**
 * Component which allows to set element logic from available values.
 */
export class ElementLogicSelector {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => (!expression && ElementLogicSelectorComponent)
    );
  }
}

const options = [
  { value: '', label: '<none>' },
  { value: 'dmn:FunctionDefinition', label: 'Function definition' },
  { value: 'dmn:LiteralExpression', label: 'Literal expression' },
  { value: 'dmn:Context', label: 'Boxed Context' }
];

function ElementLogicSelectorComponent({ parent }, { injector }) {
  const elementLogic = injector.get('elementLogic');
  const dmnFactory = injector.get('dmnFactory');

  const onChange = value => {
    const logic = dmnFactory.create(value);
    elementLogic.setLogic(parent, logic);
  };

  return <div className="dmn-boxed-expression-element-logic-selector">
    <label>
      Select expression type to implement:
      <Select value="" options={ options } onChange={ onChange } />
    </label>
  </div>;
}