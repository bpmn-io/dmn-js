// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';


export default class ViewDrdComponent extends Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this._eventBus.fire('showDrd');
  }

  componentWillMount() {
    this._eventBus = this.context.injector.get('eventBus');

    const renderer = this.context.injector.get('renderer');

    this.container = renderer.getContainer();
  }

  render() {
    return (
      <div
        className="view-drd"
        ref={ node => this.node = node }>
        <button
          onClick={ this.onClick }
          className="view-drd-button">View DRD</button>
      </div>
    );
  }

}