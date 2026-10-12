import { Component } from 'inferno';

import { HIT_POLICIES } from './../HitPolicies';

import { find } from 'min-dash';


export default class HitPolicy extends Component {
  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
  }

  getRoot() {
    return this.context.root;
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

// helpers //////////////////////
function isEqualHitPolicy(a, b) {
  return a.hitPolicy === b.hitPolicy && a.aggregation === b.aggregation;
}
