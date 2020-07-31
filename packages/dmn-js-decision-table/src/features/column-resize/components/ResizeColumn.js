import { Component } from 'inferno';

import { inject } from 'table-js/lib/components';

import {
  closest as domClosest
} from 'min-dom';

import { is, getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';


export default class ResizeColumn extends Component {

  constructor(props, context) {
    super(props, context);

    inject(this);
  }

  componentDidMount() {
    const root = this.getRoot();

    this.changeSupport.onElementsChanged(root, this.onElementsChanged);
  }

  componentWillUnmount() {
    const root = this.getRoot();

    this.changeSupport.offElementsChanged(root, this.onElementsChanged);
  }

  getRoot() {
    return this.sheet.getRoot();
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  handleMouseDown = event => {
    const cell = domClosest(event.target, 'th', false);

    startResize({
      node: cell,
      event,
      minWidth: this.props.minWidth || 150,
      onEnd: this.saveWidth
    });
  }

  saveWidth = newWidth => {
    const { col } = this.props;

    const update = {};

    if (is(col, 'dmn:DecisionTable')) {
      update.annotationsWidth = newWidth;
    } else {
      update.width = newWidth;
    }

    this.modeling.updateProperties(col, update);
  }

  isLastInputOrOutput() {
    const { col } = this.props,
          root = this.getRoot(),
          bo = getBusinessObject(root);

    if (is(col, 'dmn:InputClause')) {
      const inputs = bo.get('input');

      return inputs.indexOf(col) === inputs.length - 1;
    } else if (is(col, 'dmn:OutputClause')) {
      const outputs = bo.get('output');

      return outputs.indexOf(col) === outputs.length - 1;
    }
  }

  render() {
    const style = this.isLastInputOrOutput() ? {
      right: '-7px',
      width: '27px'
    } : null;

    return (
      <div
        onMouseDown={ this.handleMouseDown }
        className="resize-column-handle"
        title={ this.translate('Resize') }
        style={ style }
      />
    );
  }
}

ResizeColumn.$inject = [ 'sheet', 'changeSupport', 'translate', 'modeling' ];

// helper
function startResize({ node, event, minWidth, onEnd = noop }) {
  event.preventDefault();

  const initialWidth = node.getBoundingClientRect().width;
  const initialX = event.clientX;

  let currentUpdate;

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  function handleMouseMove(event) {
    event.preventDefault();

    const currentWidth = getResizedWidth(event.clientX);

    if (currentUpdate) {
      cancelAnimationFrame(currentUpdate);
    }

    currentUpdate = requestAnimationFrame(() => {
      node.style.width = currentWidth + 'px';
    });
  }

  function handleMouseUp(event) {
    event.preventDefault();

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    const currentWidth = getResizedWidth(event.clientX);

    onEnd(currentWidth);
  }

  function getResizedWidth(currentX) {
    const delta = currentX - initialX;

    return Math.max(initialWidth + delta, minWidth);
  }
}

function noop() {}
