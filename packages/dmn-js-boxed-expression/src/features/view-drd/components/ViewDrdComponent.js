import { Component } from 'inferno';


export default class ViewDrdComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const { injector } = context;

    this._translate = injector.get('translate');
    this._eventBus = injector.get('eventBus');
  }

  onClick = () => {
    this._eventBus.fire('showDrd');
  };

  render() {
    return (
      <div
        className="view-drd"
        ref={ node => this.node = node }>
        <button
          type="button"
          onClick={ this.onClick }
          className="view-drd-button">{ this._translate('View DRD') }</button>
      </div>
    );
  }

}

ViewDrdComponent.$inject = [ 'translate' ];
