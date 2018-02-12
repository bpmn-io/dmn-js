import { Component } from 'inferno';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';


export default class AnnotationCellEditorComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.setAnnotationValue = this.setAnnotationValue.bind(this);

    this.onElementsChanged = this.onElementsChanged.bind(this);
  }


  componentWillMount() {
    const { row } = this.props;
    const { changeSupport, injector } = this.context;

    this._modeling = injector.get('modeling');

    changeSupport.onElementsChanged(row.id, this.onElementsChanged);
  }


  componentWillUnmount() {
    const { row } = this.props;
    const { changeSupport } = this.context;

    changeSupport.offElementsChanged(row.id, this.onElementsChanged);
  }


  setAnnotationValue(text) {
    const { row } = this.props;

    this._modeling.editAnnotation(row.businessObject, text);
  }


  onElementsChanged() {
    this.forceUpdate();
  }


  render() {
    const { row } = this.props;
    const { businessObject } = row;

    return (
      <EditableAnnotationCell
        className="annotation"
        onChange={ this.setAnnotationValue }
        value={ businessObject.description } />
    );
  }

}


class EditableAnnotationCell extends EditableComponent {

  render() {
    return (
      <td className={ this.getClassName() }>
        { this.getEditor() }
      </td>
    );
  }
}