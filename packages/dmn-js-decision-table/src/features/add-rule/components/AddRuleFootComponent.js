import { Component } from 'inferno';

import {
  inject
} from 'table-js/lib/components';

export default class AddRuleFootComponent extends Component {
  constructor(props, context) {
    super(props, context);

    inject(this);

    this.addRule = this.addRule.bind(this);
  }

  componentWillMount() {
    this._eventBus = this.context.injector.get('eventBus');
  }

  handleClick = (e) => {
    e.stopPropagation();

    this.addRule();
  }

  addRule() {
    this._eventBus.fire('addRule');
  }

  render() {
    const { cols } = this.props;

    const cells = [
      <td className="add-rule-add">
        <span className="dmn-icon-plus action-icon" title="Add Rule"></span>
      </td>
    ];

    const { businessObject } = this.sheet.getRoot();

    if (!businessObject.input || !businessObject.input.length) {
      cells.push(<td className="input-cell">-</td>);
    }

    for (let i = 0; i < cols.length + 1; i++) {
      let className = 'add-rule';

      const businessObject = cols[i] && cols[i].businessObject;

      let placeholder = '';

      if (businessObject) {
        if (businessObject.$instanceOf('dmn:InputClause')) {
          className += ' input-cell';
          placeholder = '-';
        }

        if (businessObject.$instanceOf('dmn:OutputClause')) {
          className += ' output-cell';
        }
      }

      cells.push(<td className={ className }>{placeholder}</td>);
    }

    return (
      <tfoot
        className="actionable add-rule"
        onClick={ this.handleClick }>
        <tr>
          { cells }
        </tr>
      </tfoot>
    );
  }
}

AddRuleFootComponent.$inject = [ 'sheet' ];
