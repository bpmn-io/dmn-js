import { Component } from 'inferno';

import { isString } from 'min-dash';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';

import { Cell } from 'table-js/lib/components';


export default class DecisionRulesEditorCellComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isFocussed: false
    };

    this.changeCellValue = this.changeCellValue.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
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


  onFocus() {
    this.setState({
      isFocussed: true
    });
  }


  onBlur() {
    this.setState({
      isFocussed: false
    });
  }


  render() {
    const {
      cell,
      rowIndex,
      row,
      col,
      colIndex
    } = this.props;

    const { isFocussed } = this.state;

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
          className="cell-editor"
          placeholder={ isUnaryTest ? '-' : '' }
          ctrlForNewline={ true }
          onFocus={ this.onFocus }
          onBlur={ this.onBlur }
          isFocussed={ isFocussed }
          onChange={ this.changeCellValue }
          value={ businessObject.text }
          businessObject={ businessObject } />
      </Cell>
    );
  }
}


class TableCellEditor extends EditableComponent {

  constructor(props, context) {
    super(props, context);

    this._expressionLanguages = context.injector.get('expressionLanguages');
    this._translate = context.injector.get('translate');
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

  render() {
    const {
      businessObject,
      isFocussed
    } = this.props;

    const description = this.getDescription(businessObject);

    const isDefaultExpressionLanguage = this.isDefaultExpressionLanguage(businessObject);

    const expressionLanguageLabel = this.getExpressionLanguageLabel(businessObject);

    const isScript = this.isScript(businessObject);

    return (
      <div className={ this.getClassName() }>
        {
          isString(description)
            && !isFocussed
            && <div className="description-indicator"></div>
        }
        {
          this.getEditor({
            className: isScript ? 'script-editor' : null
          })
        }
        {
          !isDefaultExpressionLanguage &&
          !isFocussed && (
            <span
              className="dms-badge dmn-expression-language"
              title={ this._translate(
                'Expression Language = {expressionLanguageLabel}',
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
