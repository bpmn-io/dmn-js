export default function ElementPropertiesComponent(_, context) {
  const viewer = context.injector.get('viewer');

  // there is only one single element
  const { name } = viewer.getRootElement();

  return (
    <div className="element-properties">
      <h2 className="element-name">{ name }</h2>
    </div>
  );
}