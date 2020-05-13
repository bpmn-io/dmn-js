export default function AnnotationHeader(props, context) {
  const _translate = context.injector.get('translate');

  return (
    <th className="annotation header">
      { _translate('Annotations') }
    </th>
  );
}