import { Component } from 'inferno';

import {
  inject
} from 'table-js/lib/components';

import { HIT_POLICIES } from './../HitPolicies';

import { find } from 'min-dash';


export default class HitPolicy extends Component {
  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');

    inject(this);
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
      <div
        className="hit-policy header"
        title={ this._translate(hitPolicyEntry.explanation) }
      >
        <label className="dms-label">
          { this._translate('Hit policy:') }
        </label>
        <span className="hit-policy-value">
          { this._translate(hitPolicyEntry.label) }
        </span>
      </div>
    );
  }
}

HitPolicy.$inject = [
  'sheet'
];


// helpers //////////////////////
function isEqualHitPolicy(a, b) {
  return a.hitPolicy === b.hitPolicy && a.aggregation === b.aggregation;
}
