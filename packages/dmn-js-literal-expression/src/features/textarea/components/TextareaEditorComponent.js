import { Component } from 'inferno';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';
import LiteralExpression from 'dmn-js-shared/lib/components/LiteralExpression';


export default class TextareaEditorComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');

    this._viewer = context.injector.get('viewer');
    this._expressionLanguages = context.injector.get('expressionLanguages');

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

  getEditor() {
    return this.isFeel() ? FeelEditor : Editor;
  }

  isFeel() {
    return this.getExpressionLanguage() === 'feel';
  }

  getExpressionLanguage() {
    const businessObject = this.getLiteralExpression();

    return businessObject.expressionLanguage ||
      this._expressionLanguages.getDefault().value;
  }

  render() {

    // there is only one single element
    const { text } = this.getLiteralExpression();
    const Editor = this.getEditor();

    return (
      <Editor
        className="textarea editor"
        value={ text }
        onChange={ this.editLiteralExpressionText } />
    );
  }
}

class FeelEditor extends Component {
  render() {
    return <LiteralExpression
      className={ this.props.className }
      value={ this.props.value }
      onInput={ this.props.onChange }
    />;
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