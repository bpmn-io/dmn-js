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


export default class TypeRefContextMenuComponent extends Component {

  constructor(props) {
    super(props);

    this.onTypeChange = this.onTypeChange.bind(this);
  }

  onTypeChange({ target }) {
    const { element } = this.props.context;

    if (is(element, 'dmn:LiteralExpression')) {
      this._modeling.editInputExpressionTypeRef(element, target.value);
    } else {
      this._modeling.editOutputTypeRef(element, target.value);
    }
  }

  componentWillMount() {
    const { injector } = this.context;

    this._modeling = injector.get('modeling');
  }

  render() {
    const { element } = this.props.context;

    const { typeRef } = element;

    return (
      <div className="type-ref-edit">
        Type:
        <select
          className="type-ref-edit-select"
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