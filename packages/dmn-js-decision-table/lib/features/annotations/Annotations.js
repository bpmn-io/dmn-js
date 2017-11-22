import AnnotationsLabelComponent from './components/AnnotationsLabelComponent';
import AnnotationCellComponent from './components/AnnotationCellComponent';

export default class Annotations {
  constructor(components) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'after-label-cells') {
        return AnnotationsLabelComponent;
      } else if (cellType === 'after-rule-cells') {
        return AnnotationCellComponent;
      }
    });
  }
}

Annotations.$inject = [ 'components' ];