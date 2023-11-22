import { Component } from 'inferno';

import { isString } from 'min-dash';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';
import LiteralExpression from 'dmn-js-shared/lib/components/LiteralExpression';

import { Cell } from 'table-js/lib/components';


export default class DecisionRulesCellEditorComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.changeCellValue = this.changeCellValue.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    const { cell } = this.props;

    const changeSupport = this._changeSupport = this.context.changeSupport;

    this._modeling = injector.get('modeling');

    changeSupport.onElementsChanged(cell.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const { cell } = this.props;

    this._changeSupport.offElementsChanged(cell.id, this.onElementsChanged);
  }

  changeCellValue(value) {
    const { cell } = this.props;

    this._modeling.editCell(cell.businessObject, value);
  }

  render() {
    const {
      cell,
      rowIndex,
      row,
      col,
      colIndex
    } = this.props;

    const isUnaryTest = is(cell, 'dmn:UnaryTests');
    const businessObject = cell.businessObject;

    return (
      <Cell
        className={ isUnaryTest ? 'input-cell' : 'output-cell' }
        elementId={ cell.id }
        coords={ `${rowIndex}:${colIndex}` }
        data-row-id={ row.id }
        data-col-id={ col.id }
      >
        <TableCellEditor
          placeholder={ isUnaryTest ? '-' : '' }
          onChange={ this.changeCellValue }
          value={ businessObject.text }
          businessObject={ businessObject } />
      </Cell>
    );
  }
}

class FeelEditor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { focussed: false };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.setState({ focussed: true });
  }

  onBlur() {
    this.setState({ focussed: false });
  }

  render() {
    const { focussed } = this.state;
    const className = `feel-editor${focussed ? ' focussed' : ''}`;

    // TODO(@barmac): display only a single editor;
    // required to workaround "replaceChild" error
    return <div className={ className } onClick={ this.onFocus }>
      { focussed &&
        <LiteralExpression
          { ...this.props }
          autoFocus={ true }
          onBlur={ this.onBlur }
        />
      }
      <ContentEditable
        { ...this.props }
        onInput={ () => {} }
        onFocus={ this.onFocus }
      />
    </div>;
  }
}

class TableCellEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this._expressionLanguages = context.injector.get('expressionLanguages');
    this._translate = context.injector.get('translate');
    this._variableResolver = context.injector.get('variableResolver', false);
  }

  isDefaultExpressionLanguage(businessObject) {
    const { expressionLanguage } = businessObject;

    const defaultExpressionLanguage = this.getDefaultExpressionLanguage(
      businessObject
    ).value;

    return !expressionLanguage || expressionLanguage === defaultExpressionLanguage;
  }

  getDescription(businessObject) {
    return businessObject.description;
  }

  getExpressionLanguageLabel(businessObject) {
    const { expressionLanguage } = businessObject;

    const defaultExpressionLanguage = this.getDefaultExpressionLanguage(businessObject);

    return this._expressionLanguages.getLabel(expressionLanguage) ||
      defaultExpressionLanguage.label;
  }

  isScript(businessObject) {
    const defaultExpressionLanguage = this.getDefaultExpressionLanguage(businessObject);

    const isInputCell = is(businessObject, 'dmn:UnaryTests');

    if (!isInputCell) {
      return false;
    }

    if (businessObject.text.indexOf('\n') !== -1) {
      return true;
    }

    return businessObject.expressionLanguage &&
      businessObject.expressionLanguage !== defaultExpressionLanguage;
  }

  getDefaultExpressionLanguage(businessObject) {
    const elementType = is(businessObject, 'dmn:UnaryTests') ? 'inputCell' : 'outputCell';

    return this._expressionLanguages.getDefault(elementType);
  }

  getEditor() {
    return this.isFEEL() ? FeelEditor : ContentEditable;
  }

  isFEEL() {
    return this.getExpressionLanguage() === 'feel';
  }

  getExpressionLanguage() {
    const { businessObject } = this.props;

    return businessObject.expressionLanguage ||
      this.getDefaultExpressionLanguage(businessObject).value;
  }

  _getVariables() {
    const { businessObject } = this.props;

    return this._variableResolver &&
      this._variableResolver.getVariables(businessObject);
  }

  render() {
    const {
      businessObject,
      placeholder,
      value,
      onChange
    } = this.props;

    const description = this.getDescription(businessObject);

    const isDefaultExpressionLanguage = this.isDefaultExpressionLanguage(businessObject);

    const expressionLanguageLabel = this.getExpressionLanguageLabel(businessObject);

    const isScript = this.isScript(businessObject);

    const Editor = this.getEditor();
    const variables = this._getVariables();

    return (
      <div className="cell-editor">
        {
          isString(description)
            && <div className="description-indicator"></div>
        }
        <Editor
          className={ isScript ? 'script-editor' : '' }
          ctrlForNewline={ true }
          onInput={ onChange }
          value={ value }
          placeholder={ placeholder }
          variables={ variables }
        />
        {
          !isDefaultExpressionLanguage && (
            <span
              className="dms-badge dmn-expression-language"
              title={ this._translate(
                'Expression language: {expressionLanguageLabel}',
                { expressionLanguageLabel }
              ) }>
              <span class="dms-badge-icon dmn-icon-file-code"></span>
              <span class="dms-badge-label">{ expressionLanguageLabel }</span>
            </span>
          )
        }
      </div>
    );
  }
}
