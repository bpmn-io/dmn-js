
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class InputExpressionCellComponent extends Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onContextmenu = this.onContextmenu.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onClick() {
    console.log('open context menu');
  }

  onContextmenu(event) {
    const { id } = this.props.input;

    this._eventBus.fire('cell.contextmenu', {
      event,
      node: event.node,
      id
    });

    this.node.classList.add('focussed');

    window.addEventListener('click', ({ target }) => {

      if (!this.node.contains(target)) {
        this.node.classList.remove('focussed');
      }

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

    changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const root = this._sheet.getRoot();
    
    this._changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  render() {
    const { inputExpression } = this.props.input;
    
    return (
      <th
        onClick={ this.onClick }
        onContextmenu={ this.onContextmenu }
        ref={ node => this.node = node }
        className="input input-expression">{ inputExpression.text || '-' }</th>
    );
  }

}