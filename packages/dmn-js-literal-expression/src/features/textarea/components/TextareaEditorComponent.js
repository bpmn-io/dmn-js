import { Component } from 'inferno';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';


export default class TextareaEditorComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');
    const viewer = this._viewer = context.injector.get('viewer');

    this.editLiteralExpressionText = this.editLiteralExpressionText.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);

    const { id } = viewer._decision.literalExpression;

    context.changeSupport.onElementsChanged(id, this.onElementsChanged);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  editLiteralExpressionText(text) {
    this._modeling.editLiteralExpressionText(text);
  }

  render() {
    const { text } = this._viewer._decision.literalExpression;

    return (
      <Editor
        className="textarea editor"
        value={ text }
        onChange={ this.editLiteralExpressionText } />
    );
  }
}

class Editor extends EditableComponent {

  render() {

    return (
      <div className={ this.getClassName() }>
        { this.getEditor() }
      </div>
    );
  }

}