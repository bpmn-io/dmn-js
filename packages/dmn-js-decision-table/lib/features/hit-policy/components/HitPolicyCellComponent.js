import { Component } from 'inferno';


export default class HitPolicyCellComponent extends Component {
  componentWillMount() {
    const { injector } = this.context;

    this._sheet = injector.get('sheet');
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy.charAt(0),
          aggregation = businessObject.aggregation;

    const aggregationLabel = getAggregationLabel(aggregation);

    return (
      <th className="hit-policy header" rowspan="3">
        { hitPolicy }{ aggregationLabel }
      </th>
    );
  }
}

////////// helpers //////////

function getAggregationLabel(aggregation) {
  switch (aggregation) {
  case 'SUM': return '+';
  case 'MIN': return '<';
  case 'MAX': return '>';
  case 'COUNT': return '#';
  default: return '';
  }
}