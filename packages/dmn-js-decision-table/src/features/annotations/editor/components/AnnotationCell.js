import { Component } from 'inferno';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';

import {
  Cell,
  inject
} from 'table-js/lib/components';


export default class EditableAnnotationCell extends Component {

  constructor(props, context) {
    super(props, context);

    inject(this);
  }

  componentWillMount() {
    const { row } = this.props;

    this.changeSupport.onElementsChanged(row.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const { row } = this.props;

    this.changeSupport.offElementsChanged(row.id, this.onElementsChanged);
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  setAnnotationValue = (text) => {
    const { row } = this.props;

    this.modeling.editAnnotation(row.businessObject, text);
  }


  render() {
    const {
      row,
      rowIndex
    } = this.props;
    const {
      description,
      id
    } = row.businessObject;

    return (

      <Cell
        className="annotation"
        onChange={ this.setAnnotationValue }
        coords={ `${rowIndex}:annotation` }
        value={ description }
        elementId={ id }
        data-row-id={ row.id }>

        <AnnotationEditor
          ctrlForNewline={ true }
          className="annotation-editor"
          onChange={ this.setAnnotationValue }
          value={ description } />
      </Cell>
    );
  }

}

EditableAnnotationCell.$inject = [
  'changeSupport',
  'modeling'
];


class AnnotationEditor extends EditableComponent {

  render() {
    return (
      <div className={ this.getClassName() }>
        { this.getEditor() }
      </div>
    );
  }
}