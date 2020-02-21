import { Component } from 'inferno';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';


export default class TextareaEditorComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');

    this._viewer = context.injector.get('viewer');

    this.editLiteralExpressionText = this.editLiteralExpressionText.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);

    // there is only one single element
    const { id } = this.getLiteralExpression();

    context.changeSupport.onElementsChanged(id, this.onElementsChanged);
  }

  getLiteralExpression() {
    return this._viewer.getDecision().decisionLogic;
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  editLiteralExpressionText(text) {
    this._modeling.editLiteralExpressionText(text);
  }

  render() {

    // there is only one single element
    const { text } = this.getLiteralExpression();

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