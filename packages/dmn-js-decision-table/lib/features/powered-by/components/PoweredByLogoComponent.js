import { Component } from 'inferno';

import { query as domQuery } from 'min-dom';

// eslint-disable-next-line
const logo = 'iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFiMte9PrwldFwfcZPqtqN0+zEyOe1XLgjvuKncsJAZ70y6fXh3vDT////UrQV////G2zN+AAAABB0Uk5T////////////////////AOAjXRkAAAHDSURBVHjavJZJkoUgDEBJmAX8979tM8u3E6x20VlYJfFFMoL4vBDxATxZcakIOJTWSmxvKWVIkJ8jHvlRv1F2LFrVISCZI+tCtQx+XfewgVTfyY3plPiQEAzI3zWy+kR6NBhFBYeBuscJLOUuA2WVLpCjVIaFzrNQZArxAZKUQm6gsj37L9Cb7dnIBUKxENaaMJQqMpDXvSL+ktxdGRm2IsKgJGGPg7atwUG5CcFUEuSv+CwQqizTrvDTNXdMU2bMiDWZd8d7QIySWVRsb2vBBioxOFt4OinPBapL+neAb5KL5IJ8szOza2/DYoipUCx+CjO0Bpsv0V6mktNZ+k8rlABlWG0FrOpKYVo8DT3dBeLEjUBAj7moDogVii7nSS9QzZnFcOVBp1g2PyBQ3Vr5aIapN91VJy33HTJLC1iX2FY6F8gRdaAeIEfVONgtFCzZTmoLEdOjBDfsIOA6128gw3eu1shAajdZNAORxuQDJN5A5PbEG6gNIu24QJD5iNyRMZIr6bsHbCtCU/OaOaSvgkUyDMdDa1BXGf5HJ1To+/Ym6mCKT02Y+/Sa126ZKyd3jxhzpc1r8zVL6YM1Qy/kR4ABAFJ6iQUnivhAAAAAAElFTkSuQmCC';


export default class PoweredByLogoComponent extends Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.reposition = this.reposition.bind(this);
  }

  onClick() {
    this._eventBus.fire('poweredBy.show');
  }

  // TODO(philippfromme): fix, position should be fixed to top
  // right of container so it's always visible
  reposition() {
    if (!this.node) {
      return;
    }

    const containerWidth = this.container.getBoundingClientRect().width;
    const tableWidth = domQuery(
      '.tjs-table', this.container
    ).getBoundingClientRect().width;

    this.node.style.right = (containerWidth - tableWidth - 10) + 'px';
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
        onClick={ this.onClick }
        className="powered-by-logo"
        title="Powered by bpmn.io"
        ref={ node => this.node = node }>
        <img
          className="logo"
          src={ `data:image/png;base64,${ logo }` } />
      </div>
    );
  }
}