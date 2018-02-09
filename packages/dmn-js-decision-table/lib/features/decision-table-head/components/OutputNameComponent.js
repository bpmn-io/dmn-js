
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';


export default class OutputNameComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.onContextmenu = this.onContextmenu.bind(this);

    this.onElementsChanged = this.onElementsChanged.bind(this);

    this.setOutputName = this.setOutputName.bind(this);
  }


  componentWillMount() {
    const { changeSupport, injector } = this.context;

    this._changeSupport = changeSupport;

    this._eventBus = injector.get('eventBus');
    this._modeling = injector.get('modeling');

    changeSupport.onElementsChanged(this.props.output.id, this.onElementsChanged);
  }


  componentWillUnmount() {
    this._changeSupport.offElementsChanged(this.props.output.id, this.onElementsChanged);
  }


  onContextmenu(event) {
    const { id } = this.props.output;

    this._eventBus.fire('cell.contextmenu', {
      event,
      node: event.node,
      id
    });
  }


  setOutputName(newName) {
    const { output } = this.props;

    this._modeling.editOutputName(output, newName);
  }


  onElementsChanged() {
    this.forceUpdate();
  }


  render() {
    const { output } = this.props;

    return (
      <EditableOutputName
        className="output output-name"
        onContextmenu={ this.onContextmenu }
        onChange={ this.setOutputName }
        value={ output.name } />
    );
  }

}


class EditableOutputName extends EditableComponent {

  render() {

    var { onContextmenu } = this.props;

    return (
      <th
        className={ this.getClassName() }
        onContextmenu={ onContextmenu }>
        { this.getEditor() }
      </th>
    );
  }

}