import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';

const EXPRESSION_LANGUAGE_LABELS = {
  feel: 'FEEL',
  juel: 'JUEL',
  python: 'Python',
  javascript: 'JavaScript',
  groovy: 'Groovy',
  jruby: 'JRuby'
};


export default class RulesEditorCellComponent extends Component {

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
    const { cell } = this.props;

    const { isFocussed } = this.state;

    const className = is(cell, 'dmn:UnaryTests') ? 'input' : 'output';

    const businessObject = cell.businessObject;

    return (
      <EditableTableCell
        className={ className }
        id={ cell.id }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        isFocussed={ isFocussed }
        onChange={ this.changeCellValue }
        value={ businessObject.text }
        businessObject={ businessObject } />
    );
  }
}


class EditableTableCell extends EditableComponent {

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

  render() {
    const { businessObject, id, isFocussed } = this.props;

    const isDefaultExpressionLanguage = this.isDefaultExpressionLanguage(businessObject);

    const expressionLanguageLabel = this.getExpressionLanguageLabel(businessObject);

    return (
      <td data-element-id={ id } className={ this.getClassName() }>
        { this.getEditor() }
        {
          !isDefaultExpressionLanguage
            && !isFocussed
            && <span
              className="cell-expression-language"
              title={ `Expression Language: ${ expressionLanguageLabel }` }>
              <span class="dmn-icon-file-code"></span>
              <span class="label">{ expressionLanguageLabel }</span>
            </span>
        }
      </td>
    );
  }
}