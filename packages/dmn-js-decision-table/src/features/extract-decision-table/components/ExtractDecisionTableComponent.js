import { Component } from 'inferno';


export default class ViewDrdComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const { injector } = context;

    this._eventBus = injector.get('eventBus');
  }

  openModal = () => {
    this._eventBus.fire('extractDecisionTable.openModal');
  }

  render() {
    return (
      <div
        className="extract-decision-table"
        ref={ node => this.node = node }>
        <button
          onClick={ this.openModal }
          className="button">Move Inputs to New Decision Table</button>
      </div>
    );
  }

}