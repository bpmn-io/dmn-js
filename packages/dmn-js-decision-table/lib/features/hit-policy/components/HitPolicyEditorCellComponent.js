import { Component } from 'inferno';


export default class HitPolicyCellComponent extends Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onClick(event) {
    this._eventBus.fire('hitPolicy.edit', {
      event,
      node: this.node
    });
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    const changeSupport = this._changeSupport = this.context.changeSupport;
    this._sheet = injector.get('sheet');
    this._eventBus = injector.get('eventBus');

    const root = this._sheet.getRoot();

    changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const root = this._sheet.getRoot();

    this._changeSupport.offElementsChanged(root.id, this.onElementsChanged);
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy.charAt(0),
          aggregation = businessObject.aggregation;

    const aggregationLabel = getAggregationLabel(aggregation);

    return (
      <th
        data-element-id={ root.id }
        data-hit-policy="true"
        onClick={ this.onClick }
        className="hit-policy header"
        ref= { node => this.node = node }
        rowspan="3">{ hitPolicy }{ aggregationLabel }</th>
    );
  }
}


// helpers //////////////////////

function getAggregationLabel(aggregation) {
  switch (aggregation) {
  case 'SUM': return '+';
  case 'MIN': return '<';
  case 'MAX': return '>';
  case 'COUNT': return '#';
  default: return '';
  }
}