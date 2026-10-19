import AnnotationHeader from './components/AnnotationHeader';
import AnnotationCell from './components/AnnotationCell';


export default function AnnotationsProvider(components) {

  components.onGetComponent('cell', ({ cellType }) => {

    if (cellType === 'after-label-cells') {
      return AnnotationHeader;
    } else if (cellType === 'after-rule-cells') {
      return AnnotationCell;
    }
  });
}

AnnotationsProvider.$inject = [ 'components' ];
