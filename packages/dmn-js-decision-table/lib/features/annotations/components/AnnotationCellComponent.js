
// eslint-disable-next-line
import Inferno from 'inferno';

export default function RulesAnnotationCellComponent(props) {
  const { row } = props;

  return <td className="annotation">{ row.description || '-' }</td>;
}