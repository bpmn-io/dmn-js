import { Component } from 'inferno';

import {
  mixin
} from 'table-js/lib/components';

import {
  ComponentWithSlots
} from 'dmn-js-shared/lib/components/mixins';


export default class InputCell extends Component {

  constructor(props, context) {
    super(props, context);

    mixin(this, ComponentWithSlots);

    this._translate = context.injector.get('translate');
  }

  onClick = (event) => {
    const { input } = this.props;

    this._eventBus.fire('input.edit', {
      event,
      input
    });
  }

  onContextmenu = (event) => {
    const { id } = this.props.input;

    this._eventBus.fire('cell.contextmenu', {
      event,
      id
    });
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  isDefaultExpressionLanguage(expressionLanguage) {
    const expressionLanguages = this.context.injector.get('expressionLanguages');
    const defaultExpressionLanguage = expressionLanguages.getDefault('inputCell').value;

    return expressionLanguage === defaultExpressionLanguage;
  }

  componentWillMount() {
    const { injector } = this.context;

    this._changeSupport = this.context.changeSupport;
    this._sheet = injector.get('sheet');
    this._eventBus = injector.get('eventBus');
    this._elementRegistry = injector.get('elementRegistry');

    const root = this._sheet.getRoot();

    const { input } = this.props;

    this._changeSupport.onElementsChanged(root.id, this.onElementsChanged);
    this._changeSupport.onElementsChanged(input.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const root = this._sheet.getRoot();

    const { input } = this.props;

    this._changeSupport.offElementsChanged(root.id, this.onElementsChanged);
    this._changeSupport.offElementsChanged(input.id, this.onElementsChanged);
  }

  render() {
    const input = this.props.input;

    const {
      inputExpression
    } = input;

    var label = input.get('label');
    var inputVariable = input.get('inputVariable');

    var expressionLanguage = inputExpression.get('expressionLanguage');

    var showLanguageBadge = !label &&
      expressionLanguage &&
      this.isDefaultExpressionLanguage(expressionLanguage);

    return (
      <th
        data-col-id={ input.id }
        onClick={ this.onClick }
        onContextmenu={ this.onContextmenu }
        className="input-cell input-editor">

        {
          this.slotFills({
            type: 'cell-inner',
            context: {
              cellType: 'input-cell',
              col: this._elementRegistry.get(input.id)
            },
            col: input
          })
        }

        {
          label ? (
            <span className="input-label" title={ this._translate('Input Label') }>
              { label }
            </span>
          ) : (
            <span
              className="input-expression"
              title={ this._translate('Input Expression') }>
              { inputExpression.text || '-' }
            </span>
          )
        }

        {
          inputVariable && (
            <span
              className="dms-badge dmn-variable-name input-variable"
              title="Input Variable">
              { inputVariable }
            </span>
          )
        }

        {
          showLanguageBadge && (
            <span
              className="dms-badge dmn-expression-language input-expression-language"
              title={ this._translate(
                'Input Expression Language = {expressionLanguage}',
                { expressionLanguage }
              ) }
            >
              <span className="dms-badge-icon dmn-icon-file-code"></span>
              <span className="dms-badge-label">{ expressionLanguage }</span>
            </span>
          )
        }
      </th>
    );
  }

}