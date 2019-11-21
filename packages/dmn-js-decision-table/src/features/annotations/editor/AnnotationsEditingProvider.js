import AnnotationHeader from '../components/AnnotationHeader';
import AnnotationCell from './components/AnnotationCell';

export default function AnnotationsEditingProvider(components) {

  components.onGetComponent('cell', ({ cellType }) => {
    if (cellType === 'after-label-cells') {
      return AnnotationHeader;
    } else if (cellType === 'after-rule-cells') {
      return AnnotationCell;
    }
  });
}

AnnotationsEditingProvider.$inject = [ 'components' ];
