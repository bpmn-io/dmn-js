export default function DecisionRulesAnnotationCellComponent(props) {
  const { row } = props;

  return (
    <td className="annotation">
      { row.businessObject.description || '-' }
    </td>
  );
}