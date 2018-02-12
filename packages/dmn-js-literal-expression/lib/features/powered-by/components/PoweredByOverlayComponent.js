import { Component } from 'inferno';

// eslint-disable-next-line
const logo = 'iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFiMte9PrwldFwfcZPqtqN0+zEyOe1XLgjvuKncsJAZ70y6fXh3vDT////UrQV////G2zN+AAAABB0Uk5T////////////////////AOAjXRkAAAHDSURBVHjavJZJkoUgDEBJmAX8979tM8u3E6x20VlYJfFFMoL4vBDxATxZcakIOJTWSmxvKWVIkJ8jHvlRv1F2LFrVISCZI+tCtQx+XfewgVTfyY3plPiQEAzI3zWy+kR6NBhFBYeBuscJLOUuA2WVLpCjVIaFzrNQZArxAZKUQm6gsj37L9Cb7dnIBUKxENaaMJQqMpDXvSL+ktxdGRm2IsKgJGGPg7atwUG5CcFUEuSv+CwQqizTrvDTNXdMU2bMiDWZd8d7QIySWVRsb2vBBioxOFt4OinPBapL+neAb5KL5IJ8szOza2/DYoipUCx+CjO0Bpsv0V6mktNZ+k8rlABlWG0FrOpKYVo8DT3dBeLEjUBAj7moDogVii7nSS9QzZnFcOVBp1g2PyBQ3Vr5aIapN91VJy33HTJLC1iX2FY6F8gRdaAeIEfVONgtFCzZTmoLEdOjBDfsIOA6128gw3eu1shAajdZNAORxuQDJN5A5PbEG6gNIu24QJD5iNyRMZIr6bsHbCtCU/OaOaSvgkUyDMdDa1BXGf5HJ1To+/Ym6mCKT02Y+/Sa126ZKyd3jxhzpc1r8zVL6YM1Qy/kR4ABAFJ6iQUnivhAAAAAAElFTkSuQmCC';


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
          <div>
            <img
              className="logo"
              src={ `data:image/png;base64,${ logo }` } />
          </div>
          <div>
            Web-based tooling for BPMN, DMN and CMMN diagrams powered by <a
              href="http://bpmn.io"
              target="_blank">bpmn.io</a>.
          </div>
        </div>
      </div>
    );
  }
}