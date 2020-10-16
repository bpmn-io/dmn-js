import { Component } from 'inferno';

import { find } from 'min-dash';

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import {
  inject
} from 'table-js/lib/components';

import { HIT_POLICIES } from './../../HitPolicies';


export default class EditableHitPolicy extends Component {

  constructor(props, context) {
    super(props, context);

    inject(this);
  }

  onChange = ({ aggregation, hitPolicy }) => {
    this.modeling.editHitPolicy(hitPolicy, aggregation);
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  componentDidMount() {
    this.changeSupport.onElementsChanged(this.getRoot().id, this.onElementsChanged);
  }

  componentWillUnmount() {
    this.changeSupport.offElementsChanged(this.getRoot().id, this.onElementsChanged);
  }

  getRoot() {
    return this.sheet.getRoot();
  }

  render() {
    const root = this.getRoot(),
          businessObject = root.businessObject;

    const { aggregation, hitPolicy } = businessObject;

    const hitPolicyEntry = find(HIT_POLICIES, entry => {
      return isEqualHitPolicy(entry.value, { aggregation, hitPolicy });
    });

    return (
      <div className="hit-policy" title={ hitPolicyEntry.explanation }>
        <label className="dms-label">
          Hit Policy:
        </label>
        <InputSelect
          className="hit-policy-edit-policy-select"
          onChange={ this.onChange }
          options={ HIT_POLICIES }
          value={ hitPolicyEntry.value }
          data-hit-policy="true"
          noInput
        />
      </div>
    );
  }
}

EditableHitPolicy.$inject = [
  'changeSupport',
  'sheet',
  'modeling'
];


// helpers //////////////////////
function isEqualHitPolicy(a, b) {
  return a.hitPolicy === b.hitPolicy && a.aggregation === b.aggregation;
}
