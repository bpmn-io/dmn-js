import { Component } from 'inferno';


export default class OutputCell extends Component {

  constructor(props) {
    super(props);
  }

  onClick = (event) => {
    const { output } = this.props;

    this._eventBus.fire('output.edit', {
      event,
      output
    });
  }

  onContextmenu = (event) => {
    const { id } = this.props.output;

    this._eventBus.fire('cell.contextmenu', {
      event,
      id
    });
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    this._changeSupport = this.context.changeSupport;
    this._eventBus = injector.get('eventBus');

    const { output } = this.props;

    this._changeSupport.onElementsChanged(output.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const { output } = this.props;

    this._changeSupport.offElementsChanged(output.id, this.onElementsChanged);
  }

  render() {
    const output = this.props.output;

    var label = output.get('label');
    var name = output.get('name');

    return (
      <th
        onClick={ this.onClick }
        onContextmenu={ this.onContextmenu }
        className="output-cell output-editor">

        {
          label ? (
            <span className="output-label" title="Output Label">
              { label }
            </span>
          ) : (
            <span className="output-name" title="Output Expression">
              { name || '-' }
            </span>
          )
        }
      </th>
    );
  }

}