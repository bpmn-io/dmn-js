import {
  Cell
} from 'table-js/lib/components';


export default function AnnotationCell(props) {
  const { row } = props;

  const {
    id,
    description
  } = row.businessObject;

  return (
    <Cell className="annotation" elementId={ id + '__annotation' }>
      { description || '-' }
    </Cell>
  );
}