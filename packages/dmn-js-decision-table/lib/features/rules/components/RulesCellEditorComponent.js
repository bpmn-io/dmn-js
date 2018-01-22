
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import EditableComponent from '../../../components/EditableComponent';


export default class RulesEditorCellComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.changeCellValue = this.changeCellValue.bind(this);

    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    const { cell } = this.props;

    const changeSupport = this._changeSupport = this.context.changeSupport;

    this._modeling = injector.get('modeling');

    changeSupport.onElementsChanged(cell.id, this.onElementsChanged);
  }


  componentWillUnmount() {
    const { cell } = this.props;

    this._changeSupport.offElementsChanged(cell.id, this.onElementsChanged);
  }


  changeCellValue(value) {
    const { cell } = this.props;

    this._modeling.editCell(cell.businessObject, value);
  }


  render() {
    const { cell } = this.props;

    const className = is(cell, 'dmn:UnaryTests') ? 'input' : 'output';

    const businessObject = cell.businessObject;

    return (
      <EditableTableCell
        className={ className }
        id={ cell.id }
        onChange={ this.changeCellValue }
        value={ businessObject.text } />
    );
  }
}


class EditableTableCell extends EditableComponent {

  render() {
    var { id } = this.props;

    return (
      <td data-element-id={ id } className={ this.getClassName() }>
        { this.getEditor() }
      </td>
    );
  }
}