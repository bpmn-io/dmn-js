import { Component } from 'inferno';

import LiteralExpression from 'dmn-js-shared/lib/components/LiteralExpression';


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
      <LiteralExpression
        className="textarea editor"
        value={ text }
        onChange={ this.editLiteralExpressionText } />
    );
  }
}
