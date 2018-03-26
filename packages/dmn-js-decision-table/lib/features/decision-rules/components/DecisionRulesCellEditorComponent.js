import { Component } from 'inferno';

import { isString } from 'min-dash';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';

import { Cell } from 'table-js/lib/components';

const EXPRESSION_LANGUAGE_LABELS = {
  feel: 'FEEL',
  juel: 'JUEL',
  python: 'Python',
  javascript: 'JavaScript',
  groovy: 'Groovy',
  jruby: 'JRuby'
};


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

    const className = is(cell, 'dmn:UnaryTests') ? 'input-cell' : 'output-cell';

    const businessObject = cell.businessObject;

    return (
      <Cell
        className={ className }
        elementId={ cell.id }
        coords={ `${rowIndex}:${colIndex}` }
        data-row-id={ row.id }
        data-col-id={ col.id }
      >
        <TableCellEditor
          className="cell-editor"
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

  isDefaultExpressionLanguage(businessObject) {
    const { expressionLanguage } = businessObject;

    const isInput = is(businessObject, 'dmn:UnaryTests');

    const {
      defaultInputExpressionLanguage,
      defaultOutputExpressionLanguage
    } = this.context.injector.get('config');

    if (isInput) {
      return (!expressionLanguage && !defaultInputExpressionLanguage)
        || expressionLanguage === (defaultInputExpressionLanguage || 'feel');
    } else {
      return (!expressionLanguage && !defaultOutputExpressionLanguage)
        || expressionLanguage === (defaultOutputExpressionLanguage || 'juel');
    }
  }

  getDescription(businessObject) {
    return businessObject.description;
  }

  getExpressionLanguageLabel(businessObject) {
    const { expressionLanguage } = businessObject;

    const isInput = is(businessObject, 'dmn:UnaryTests');

    if (isInput) {
      return expressionLanguage
        ? EXPRESSION_LANGUAGE_LABELS[businessObject.expressionLanguage.toLowerCase()]
        : 'FEEL';
    } else {
      return expressionLanguage
        ? EXPRESSION_LANGUAGE_LABELS[businessObject.expressionLanguage.toLowerCase()]
        : 'JUEL';
    }
  }

  isScript(businessObject) {

    return (
      is(businessObject, 'dmn:UnaryTests') && (
        (businessObject.expressionLanguage || 'FEEL') !== 'FEEL' ||
        businessObject.text.indexOf('\n') !== -1
      )
    );
  }

  render() {
    const {
      businessObject,
      isFocussed
    } = this.props;

    const description = this.getDescription(businessObject);

    const isDefaultExpressionLanguage = this.isDefaultExpressionLanguage(businessObject);

    const expressionLanguageLabel = this.getExpressionLanguageLabel(businessObject)
      || businessObject.expressionLanguage;

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
              title={ `Expression Language = ${ expressionLanguageLabel }` }>
              <span class="dms-badge-icon dmn-icon-file-code"></span>
              <span class="dms-badge-label">{ expressionLanguageLabel }</span>
            </span>
          )
        }
      </div>
    );
  }
}