import { Component } from 'inferno';


export default class ViewDrdComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const { injector } = context;

    this._eventBus = injector.get('eventBus');
  }

  onClick = () => {
    this._eventBus.fire('showDrd');
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