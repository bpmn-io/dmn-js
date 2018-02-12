import { Component } from 'inferno';


export default class AddRuleFootComponent extends Component {
  constructor(props) {
    super(props);

    this.addRule = this.addRule.bind(this);
  }

  componentWillMount() {
    this._eventBus = this.context.injector.get('eventBus');
  }

  addRule() {
    this._eventBus.fire('addRule');
  }

  render({ cols }) {

    const cells = [
      <td className="add-rule-add">
        <span className="dmn-icon-plus action-icon"></span>
      </td>
    ];

    for (let i = 0; i < cols.length + 1; i++) {
      let className = 'add-rule';

      const businessObject = cols[i] && cols[i].businessObject;

      if (businessObject) {
        if (businessObject.$instanceOf('dmn:InputClause')) {
          className += ' input';
        }

        if (businessObject.$instanceOf('dmn:OutputClause')) {
          className += ' output';
        }
      }

      cells.push(<td className={ className }>-</td>);
    }

    return (
      <tfoot className="actionable add-rule" onClick={ this.addRule }>
        <tr>
          { cells }
        </tr>
      </tfoot>
    );
  }
}