
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default class TypeRefCell extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onContextmenu = this.onContextmenu.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onClick() {
    const { inputExpression, output } = this.props;

    this._eventBus.fire('typeRef.edit', {
      event,
      node: this.node,
      element: inputExpression || output
    });
  }

  onContextmenu(event) {
    const { inputExpression, output } = this.props;

    const id = inputExpression
      ? inputExpression.$parent.id
      : output.id;

    this._eventBus.fire('cell.contextmenu', {
      event,
      node: event.node,
      id
    });
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;
    
    const changeSupport = this._changeSupport = this.context.changeSupport;
    this._sheet = injector.get('sheet');
    this._eventBus = injector.get('eventBus');

    const root = this._sheet.getRoot();

    const { inputExpression, output } = this.props;

    changeSupport.onElementsChanged(root.id, this.onElementsChanged);
    changeSupport.onElementsChanged(inputExpression ? inputExpression.id : output.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const root = this._sheet.getRoot();

    const { inputExpression, output } = this.props;
    
    this._changeSupport.offElementsChanged(root.id, this.onElementsChanged);
    this._changeSupport.offElementsChanged(inputExpression ? inputExpression.id : output.id, this.onElementsChanged);
  }

  render() {
    const { inputExpression, output } = this.props;

    const businessOject = inputExpression || output;

    const { typeRef } = businessOject;

    const className = is(businessOject, 'dmn:LiteralExpression')
      ? 'input type-ref'
      : 'output type-ref';

    return (
      <th
        onClick={ this.onClick }
        onContextmenu={ this.onContextmenu }
        ref={ node => this.node = node }
        className={ className }>{ typeRef }</th>
    );
  }
}