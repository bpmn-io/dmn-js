import { Component } from 'inferno';

import { assign } from 'min-dash';

import { closest as domClosest } from 'min-dom';

import { inject } from 'table-js/lib/components';

import {
  getNodeById
} from '../../cell-selection/CellSelectionUtil';

import { isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

const OFFSET = 4;

export default class SimpleModeButtonComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this.state = {
      top: 0,
      left: 0,
      isVisible: false,
      isDisabled: false,
      selection: null
    };

    inject(this);

    const { debounceInput } = this;

    this.onClick = this.onClick.bind(this);

    this.handleSelectionChanged = this.handleSelectionChanged.bind(this);
    this.hideAndShowDebounced = this.hideAndShowDebounced.bind(this);
    this.showDebounced = debounceInput(this.showDebounced.bind(this));
    this.updatePosition = this.updatePosition.bind(this);
  }

  componentDidMount() {
    const { eventBus } = this;

    eventBus.on('cellSelection.changed', this.handleSelectionChanged);

    eventBus.on('commandStack.changed', this.updatePosition);

    eventBus.on('sheet.scroll', this.hideAndShowDebounced);
  }

  componentWillUnmount() {
    const { eventBus } = this;

    eventBus.off('cellSelection.changed', this.handleSelectionChanged);

    eventBus.off('commandStack.changed', this.updatePosition);

    eventBus.off('sheet.scroll', this.hideAndShowDebounced);
  }

  hideAndShowDebounced() {
    if (this.state.isVisible) {
      this.hide();
      this.showDebounced();
    }
  }

  showDebounced() {
    this.show();
  }

  hide(state = {}) {
    this.setState({
      ...state,
      isVisible: false
    });
  }

  show(state = {}) {
    this.setState({
      ...state,
      isVisible: true
    });

    this.updatePosition();
  }

  handleSelectionChanged({ elementId }) {
    const {
      elementRegistry,
      expressionLanguages,
      simpleMode
    } = this;

    const selection = elementRegistry.get(elementId);

    if (!selection || !simpleMode.canSimpleEdit(selection)) {
      this.hide({
        isDisabled: false,
        selection: null
      });

      return;
    }

    const expressionLanguage = getExpressionLanguage(selection);

    const isDisabled = !isDefaultExpressionLanguage(
      selection,
      expressionLanguage,
      expressionLanguages
    );

    this.show({
      isDisabled,
      selection
    });
  }

  // position button always on opposite site of context menu
  updatePosition() {
    const { selection } = this.state;

    const { node } = this;

    if (!selection || !node) {
      return;
    }

    const { renderer } = this;

    const container = renderer.getContainer(),
          containerBounds = container.getBoundingClientRect();

    const cellNode = getNodeById(selection.id, container);

    const cellBounds = cellNode.getBoundingClientRect();

    const nodeBounds = this.node.getBoundingClientRect();

    const { scrollLeft, scrollTop } = getTableContainerScroll(node);

    const nodePosition = {};

    if (cellBounds.left + (cellBounds.width / 2) > containerBounds.width / 2) {

      // left
      nodePosition.left =
        (-containerBounds.left
          + cellBounds.left
          - nodeBounds.width
          + OFFSET
          + scrollLeft)
        + 'px';
    } else {

      // right
      nodePosition.left =
        (-containerBounds.left
          + cellBounds.left
          + cellBounds.width
          - OFFSET
          + scrollLeft)
        + 'px';
    }

    if (cellBounds.top + (cellBounds.height / 2) > containerBounds.height / 2) {

      // bottom
      nodePosition.top =
        (-containerBounds.top
          + cellBounds.top
          - nodeBounds.height
          + OFFSET
          + scrollTop)
        + 'px';
    } else {

      // top
      nodePosition.top =
        (-containerBounds.top
          + cellBounds.top
          - OFFSET
          + scrollTop)
        + 'px';
    }

    assign(this.node.style, nodePosition);
  }

  onClick() {
    const { eventBus } = this;

    const { isDisabled } = this.state;

    if (isDisabled) {
      return;
    }

    const { selection } = this;

    const element = selection.get();

    if (!element) {
      return;
    }

    eventBus.fire('simpleMode.open', {
      element,
      node: getNodeById(element.id, this._container)
    });

    this.hide();
  }

  render() {
    const {
      isDisabled,
      isVisible,
      top,
      left
    } = this.state;

    const classes = [
      'simple-mode-button',
      'no-deselect'
    ];

    if (isDisabled) {
      classes.push('disabled');
    }

    return (
      isVisible
        ? (
          <div
            className={ classes.join(' ') }
            onClick={ this.onClick }
            ref={ node => this.node = node }
            style={ { top, left } }
            title={ isDisabled
              ? this._translate('Editing not supported for set expression language')
              : this._translate('Edit') }><span className="dmn-icon-edit"></span></div>
        ) : null
    );
  }
}

SimpleModeButtonComponent.$inject = [
  'debounceInput',
  'elementRegistry',
  'eventBus',
  'expressionLanguages',
  'renderer',
  'selection',
  'simpleMode'
];

// helpers //////////////////////

/**
 * Return set expression language if found.
 *
 * @param {Cell} cell - Cell.
 */
function getExpressionLanguage(cell) {
  return cell.businessObject.expressionLanguage;
}

function isDefaultExpressionLanguage(cell, expressionLanguage, expressionLanguages) {
  return !expressionLanguage ||
    expressionLanguage === getDefaultExpressionLanguage(cell, expressionLanguages);
}

function getDefaultExpressionLanguage(cell, expressionLanguages) {
  if (isInput(cell.col)) {
    return expressionLanguages.getDefault('inputCell').value;
  } else if (isOutput(cell.col)) {
    return expressionLanguages.getDefault('outputCell').value;
  }
}

function getTableContainerScroll(node) {
  const tableContainer = domClosest(node, '.tjs-table-container');

  if (!tableContainer) {
    return {
      scrollTop: 0,
      scrollLeft: 0
    };
  }

  const { scrollLeft, scrollTop } = tableContainer;

  return {
    scrollTop,
    scrollLeft
  };
}