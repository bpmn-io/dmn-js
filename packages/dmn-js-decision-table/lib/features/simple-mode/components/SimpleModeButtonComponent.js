import { Component } from 'inferno';

import { assign } from 'min-dash/lib/object';

import { query as domQuery } from 'min-dom';

const OFFSET = 4;


export default class SimpleModeButtonComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      top: 0,
      left: 0,
      isVisible: false
    };

    const { injector } = context;

    const eventBus = this._eventBus = injector.get('eventBus'),
          simpleMode = injector.get('simpleMode');

    this._renderer = injector.get('renderer');

    this._selection = context.injector.get('selection');

    eventBus.on('selection.changed', ({ selection }) => {
      if (!selection || !simpleMode.canSimpleEdit(selection)) {
        this.setState({
          isVisible: false
        });

        return;
      }

      this.setState({
        isVisible: true,
        selection
      });
    });

    this.onClick = this.onClick.bind(this);
  }

  componentDidUpdate() {
    const { selection } = this.state;

    if (!selection || !this.node) {
      return;
    }

    const container = this._container = this._renderer.getContainer();

    const cellNode = domQuery(`[data-element-id="${selection.id}"]`, container);

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
        + scrollLeft
        + OFFSET)
        + 'px';
    } else {
      nodePosition.left =
        (window.scrollX
        - containerBounds.left
        + cellBounds.left
        + cellBounds.width
        + scrollLeft
        - OFFSET)
        + 'px';
    }

    if (cellBounds.top + (cellBounds.height / 2) > containerBounds.height / 2) {
      nodePosition.top =
        (window.scrollY
        - containerBounds.top
        + cellBounds.top
        - nodeBounds.height
        + scrollTop
        + OFFSET)
        + 'px';
    } else {
      nodePosition.top =
        (window.scrollY
        - containerBounds.top
        + cellBounds.top
        + scrollTop
        - OFFSET)
        + 'px';
    }

    assign(this.node.style, nodePosition);
  }

  onClick() {
    const element = this._selection.get();

    if (!element) {
      return;
    }

    this._eventBus.fire('simpleMode.open', {
      element,
      node: domQuery(`[data-element-id="${element.id}"]`, this._container)
    });

    this.setState({
      isVisible: false
    });
  }

  render() {
    const { isVisible, top, left } = this.state;

    return (
      isVisible
        ? <div
          className="simple-mode-button no-deselect"
          onClick={ this.onClick }
          ref={ node => this.node = node }
          style={{ top, left }}><span className="dmn-icon-edit"></span></div>
        : null
    );
  }
}