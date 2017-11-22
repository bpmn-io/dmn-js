import AnnotationsLabelComponent from './components/AnnotationsLabelComponent';
import AnnotationCellEditorComponent from './components/AnnotationCellEditorComponent';

export default class AnnotationsEditor {
  constructor(components) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'after-label-cells') {
        return AnnotationsLabelComponent;
      } else if (cellType === 'after-rule-cells') {
        return AnnotationCellEditorComponent;
      }
    });
  }
}

AnnotationsEditor.$inject = [ 'components' ];