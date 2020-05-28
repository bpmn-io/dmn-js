import { Component } from 'inferno';

import Logo from 'dmn-js-shared/lib/components/Logo';


export default class PoweredByOverlayComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      show: false
    };

    this.onClick = this.onClick.bind(this);
    this.onShow = this.onShow.bind(this);
  }

  onClick() {
    this.setState({
      show: false
    });
  }

  onShow() {
    this.setState({
      show: true
    });
  }

  componentWillMount() {
    const eventBus = this._eventBus = this.context.injector.get('eventBus');

    eventBus.on('poweredBy.show', this.onShow);
  }

  componentWillUnmount() {
    this._eventBus.off('poweredBy.show', this.onShow);
  }

  render() {
    const { show } = this.state;

    return (
      show && <div
        onClick={ this.onClick }
        className="powered-by-overlay">
        <div
          className="powered-by-overlay-content"
          onClick={ e => e.stopPropagation() }>
          <a className="logo" href="https://bpmn.io" target="_blank" rel="noopener">
            <Logo />
          </a>
          <span>
            Web-based tooling for BPMN, DMN and CMMN diagrams powered by <a
              href="http://bpmn.io"
              target="_blank">bpmn.io</a>.
          </span>
        </div>
      </div>
    );
  }
}