export default function AnnotationHeader(props, context) {
  const _translate = context.injector.get('translate');

  return (
    <th className="annotation header" rowspan="3">
      { _translate('Annotation') }
    </th>
  );
}