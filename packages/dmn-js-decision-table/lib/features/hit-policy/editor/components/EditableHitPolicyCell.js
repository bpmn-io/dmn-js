import { Component } from 'inferno';

import {
  inject
} from 'table-js/lib/components';


export default class EditableHitPolicyCell extends Component {

  constructor(props, context) {
    super(props, context);

    inject(this);
  }

  onClick = (event) => {
    this.eventBus.fire('hitPolicy.edit', {
      event
    });
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  getRoot() {
    return this.sheet.getRoot();
  }

  componentWillMount() {
    this.changeSupport.onElementsChanged(this.getRoot().id, this.onElementsChanged);
  }

  componentWillUnmount() {
    this.changeSupport.offElementsChanged(this.getRoot().id, this.onElementsChanged);
  }

  render() {
    const root = this.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy,
          hitPolicyLabel = hitPolicy.charAt(0),
          aggregation = businessObject.aggregation;

    const aggregationLabel = getAggregationLabel(aggregation);

    return (
      <th
        data-hit-policy="true"
        title={ 'Hit Policy = ' + hitPolicy }
        onClick={ this.onClick }
        className="hit-policy header"
        rowspan="3">{ hitPolicyLabel }{ aggregationLabel }</th>
    );
  }
}

EditableHitPolicyCell.$inject = [
  'changeSupport',
  'sheet',
  'eventBus'
];


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