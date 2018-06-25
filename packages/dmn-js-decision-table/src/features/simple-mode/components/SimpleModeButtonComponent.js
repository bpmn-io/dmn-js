import { Component } from 'inferno';

import { assign } from 'min-dash';

import {
  getNodeById
} from '../../cell-selection/CellSelectionUtil';

import { isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

const OFFSET = 4;


export default class SimpleModeButtonComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      top: 0,
      left: 0,
      isVisible: false,
      isDisabled: true
    };

    const { injector } = context;

    const eventBus = this._eventBus = injector.get('eventBus'),
          simpleMode = injector.get('simpleMode');

    this._renderer = injector.get('renderer');

    this._selection = context.injector.get('selection');

    this.updatePosition = this.updatePosition.bind(this);

    eventBus.on('selection.changed', ({ selection }) => {
      if (!selection || !simpleMode.canSimpleEdit(selection)) {
        this.setState({
          isVisible: false
        });

        return;
      }

      var isDisabled;

      this.setState({
        isVisible: true,
        selection
      }, this.updatePosition);

      const expressionLanguage = getExpressionLanguage(selection);

      if (isDefaultExpressionLanguage(selection, expressionLanguage)) {
        isDisabled = false;
      } else {
        isDisabled = true;
      }

      this.setState({
        isVisible: true,
        selection,
        isDisabled
      }, this.updatePosition);
    });

    this.onClick = this.onClick.bind(this);
  }

  // position button always on opposite site of context menu
  updatePosition() {
    const { selection } = this.state;

    if (!selection || !this.node) {
      return;
    }

    const container = this._container = this._renderer.getContainer();

    const cellNode = getNodeById(selection.id, container);

    const cellBounds = cellNode.getBoundingClientRect();

    const nodeBounds = this.node.getBoundingClientRect();

    const containerBounds = container.getBoundingClientRect();

    const { scrollLeft, scrollTop } = container;

    const nodePosition = {};

    if (cellBounds.left + (cellBounds.width / 2) > containerBounds.width / 2) {
      nodePosition.left =
        (window.scrollX
        - containerBounds.left
        + cellBounds.left
        - nodeBounds.width
        + OFFSET
        + scrollLeft)
        + 'px';
    } else {
      nodePosition.left =
        (window.scrollX
        - containerBounds.left
        + cellBounds.left
        + cellBounds.width
        - OFFSET
        + scrollLeft)
        + 'px';
    }

    if (cellBounds.top + (cellBounds.height / 2) > containerBounds.height / 2) {
      nodePosition.top =
        (window.scrollY
        - containerBounds.top
        + cellBounds.top
        - nodeBounds.height
        + OFFSET
        + scrollTop)
        + 'px';
    } else {
      nodePosition.top =
        (window.scrollY
        - containerBounds.top
        + cellBounds.top
        - OFFSET
        + scrollTop)
        + 'px';
    }

    assign(this.node.style, nodePosition);
  }

  onClick() {
    const { isDisabled } = this.state;

    if (isDisabled) {
      return;
    }

    const element = this._selection.get();

    if (!element) {
      return;
    }

    this._eventBus.fire('simpleMode.open', {
      element,
      node: getNodeById(element.id, this._container)
    });

    this.setState({
      isVisible: false
    });
  }

  render() {
    const { isDisabled, isVisible, top, left } = this.state;

    const classes = [
      'simple-mode-button',
      'no-deselect'
    ];

    if (isDisabled) {
      classes.push('disabled');
    }

    return (
      isVisible
        ? <div
          className={ classes.join(' ') }
          onClick={ this.onClick }
          ref={ node => this.node = node }
          style={ { top, left } }
          title={ isDisabled
            ? 'Editing not supported for set expression language'
            : 'Edit' }><span className="dmn-icon-edit"></span></div>
        : null
    );
  }
}


// helpers //////////////////////

/**
 * Return set expression language if found.
 *
 * @param {Cell} cell - Cell.
 */
function getExpressionLanguage(cell) {
  return cell.businessObject.expressionLanguage;
}

function isDefaultExpressionLanguage(cell, expressionLanguage) {
  if (isInput(cell.col)) {
    return !expressionLanguage || expressionLanguage === 'feel';
  } else if (isOutput(cell.col)) {
    return !expressionLanguage || expressionLanguage === 'juel';
  }
}