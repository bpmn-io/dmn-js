
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

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

    const eventBus = this._eventBus = context.injector.get('eventBus'),
          renderer = context.injector.get('renderer');

    this._selection = context.injector.get('selection');

    eventBus.on('selection.changed', ({ selection }) => {
      if (!selection) {
        this.setState({
          isVisible: false
        });

        return;
      }

      const container = this._container = renderer.getContainer();

      const node = domQuery(`[data-element-id="${selection.id}"]`, container);

      const bounds = node.getBoundingClientRect();
      
      const containerBounds = container.getBoundingClientRect();

      const { scrollLeft, scrollTop } = container;

      const top =
        (window.scrollY
        - containerBounds.top
        + bounds.top
        + bounds.height
        + scrollTop
        - OFFSET)
        + 'px';

      const left =
        (window.scrollX
        - containerBounds.left
        + bounds.left
        + bounds.width
        + scrollLeft
        - OFFSET)
        + 'px';

      this.setState({
        top,
        left,
        isVisible: true
      });
    });

    this.onClick = this.onClick.bind(this);
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
          className="simple-mode-button"
          onClick={ this.onClick }
          ref={ node => this.node = node }
          style={{ top, left }}>Edit</div>
        : null
    );
  }
}