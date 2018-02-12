export default function RulesAnnotationCellComponent(props) {
  const { row } = props;

  return (
    <td className="annotation">
      { row.businessObject.description || '-' }
    </td>
  );
}