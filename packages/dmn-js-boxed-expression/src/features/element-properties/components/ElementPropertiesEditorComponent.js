import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';

import { withChangeSupport } from '../../../util/withChangeSupport';

class ElementNameEditor extends EditableComponent {

  render() {
    return (
      <h2 className={ this.getClassName() }>
        { this.getEditor() }
      </h2>
    );
  }

}

const ElementName = withChangeSupport(function(props, context) {
  const { element } = props;
  const modeling = context.injector.get('modeling');
  const translate = context.injector.get('translate');

  const name = element.get('name');
  const onChange = name => {
    modeling.updateProperties(element, { name });
  };

  return <ElementNameEditor
    label={ translate('Element name') }
    className="element-name editor"
    value={ name }
    onChange={ onChange }
  />;
}, props => [ props.element ]);

export default function ElementPropertiesEditorComponent(_, context) {
  const viewer = context.injector.get('viewer');

  const rootElement = viewer.getRootElement();

  return (
    <div className="element-properties">
      <ElementName element={ rootElement } />
    </div>
  );
}
