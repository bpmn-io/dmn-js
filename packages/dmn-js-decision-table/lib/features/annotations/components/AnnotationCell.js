export default function AnnotationCell(props) {
  const { row } = props;

  return (
    <td className="annotation">
      { row.businessObject.description || '-' }
    </td>
  );
}