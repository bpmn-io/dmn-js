import { Component } from 'inferno';

import { without } from 'min-dash';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

const defaultName = 'New Decision Table';


export default class ViewDrdComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const { injector } = context;

    this._sheet = injector.get('sheet');

    const eventBus = this._eventBus = injector.get('eventBus');

    eventBus.on('extractDecisionTable.openModal', () => {
      this.openModal();
    });

    this.state = {
      open: false,
      name: defaultName,
      cols: []
    };
  }

  openModal = () => {
    this.setState({
      open: true
    });
  }

  closeModal = () => {
    this.setState({
      open: false,
      name: defaultName,
      cols: []
    });
  }

  onChangeName = (event) => {
    this.setState({
      name: event.target.value
    });
  }

  onToggleColumn = (id) => {
    const { cols } = this.state;

    // TODO: prevent extracting all outputs

    if (cols.includes(id)) {
      this.setState({
        cols: without(cols, id)
      });
    } else {
      this.setState({
        cols: [ ...cols, id ]
      });
    }
  }

  extractDecisionTable = () => {
    const { cols, name } = this.state;

    const root = this._sheet.getRoot();

    this._eventBus.fire('extractDecisionTable.extract', {
      cols: root.cols.filter(({ id }) => cols.includes(id)),
      name
    });

    this.setState({
      open: false,
      name: defaultName,
      cols: []
    });
  }

  renderModal() {
    const root = this._sheet.getRoot();

    const { cols } = this.state;

    const noColumnsSelected = !cols.length;

    return <div
      className="extract-decision-table-modal"
      ref={ node => this.node = node }>
      <h3 class="dms-heading">Move Inputs to New Decision Table</h3>
      {/* <p class="dms-hint">Move inputs to a new decision table.</p> */}
      <h4>Name</h4>
      <input class="dms-input" type="text" placeholder="New Decision Table" onChange={ this.onChangeName }></input>
      <h4 class="dms-heading">Select Inputs</h4>
      <ul class="columns">
        {
          root.cols
            .filter(({ businessObject }) => {
              return is(businessObject, 'dmn:InputClause');
            })
            .map(({ businessObject }) => {
              let {
                id,
                label
              } = businessObject;

              return <li class="column" key={ id }>
                <input type="checkbox" onClick={ () => this.onToggleColumn(id) }></input> { label || '-' }
              </li>;
            })
        }
      </ul>
      <button
        onClick={ this.extractDecisionTable }
        className={ 'button primary'.concat(noColumnsSelected ? ' disabled' : '') } disabled={ noColumnsSelected }>Confirm</button>
      <button
        onClick={ this.closeModal }
        className="button margin-left">Cancel</button>
    </div>;
  }

  render() {
    const { open } = this.state;

    return open ? this.renderModal() : null;
  }

}