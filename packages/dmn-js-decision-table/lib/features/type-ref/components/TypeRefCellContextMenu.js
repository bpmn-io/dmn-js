import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

const TYPES = [
  'string',
  'boolean',
  'integer',
  'long',
  'double',
  'date'
];


export default class TypeRefCellContextMenu extends Component {

  constructor(props, context) {
    super(props);

    this._modeling = context.injector.get('modeling');
  }

  onTypeChange = (event) => {
    const {
      element
    } = this.props.context;

    const value = event.target.value;

    const newProperties = (
      is(element, 'dmn:InputClause') ? {
        inputExpression: {
          typeRef: value
        }
      } : {
        typeRef: value
      }
    );

    this._modeling.updateProperties(element, newProperties);
  }

  render() {
    const { element } = this.props.context;

    const typeRef = (
      is(element, 'dmn:InputClause') ?
        element.inputExpression :
        element
    ).typeRef;

    return (
      <div className="type-ref-edit context-menu-container">
        <label className="dms-label">Type:</label>
        <select
          className="type-ref-edit-select dms-select"
          onChange={ this.onTypeChange }>
          {
            TYPES.map(type => {
              return (
                <option
                  key={ type }
                  selected={ typeRef === type }
                  value={ type }>{ type }</option>
              );
            })
          }
        </select>
      </div>
    );
  }
}