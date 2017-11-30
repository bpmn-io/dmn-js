
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
  }

  render() {
    return (
      <div className="view-drd">
        <button
          onClick={ this.onClick }
          className="view-drd-button">View DRD</button>
      </div>
    );
  }

}