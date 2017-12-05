
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { query as domQuery } from 'min-dom';


export default class ViewDrdComponent extends Component {
  
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.reposition = this.reposition.bind(this);
  }

  onClick() {
    this._eventBus.fire('showDrd');
  }

  reposition() {
    if (!this.node) {
      return;
    }
    
    const containerWidth = this.container.getBoundingClientRect().width;
    const tableWidth = domQuery('.tjs-table', this.container).getBoundingClientRect().width;

    this.node.style.right = (containerWidth - tableWidth + 40) + 'px';
  }

  componentWillMount() {
    this._eventBus = this.context.injector.get('eventBus');

    const renderer = this.context.injector.get('renderer');
    
    this._eventBus.on('elements.changed', this.reposition);

    this.container = renderer.getContainer();
  }

  render() {
    return (
      <div
        className="view-drd"
        ref={ node => this.node = node }>
        <button
          onClick={ this.onClick }
          className="view-drd-button">View DRD</button>
      </div>
    );
  }

}