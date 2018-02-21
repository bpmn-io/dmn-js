import { Component } from 'inferno';

const HIT_POLICIES = [
  'UNIQUE',
  'FIRST',
  'PRIORITY',
  'ANY',
  'COLLECT',
  'RULE ORDER',
  'OUTPUT ORDER'
];

const LIST_FUNCTIONS = [
  'NONE',
  'SUM',
  'MIN',
  'MAX',
  'COUNT'
];


export default class HitPolicyContextMenuComponent extends Component {

  constructor(props) {
    super(props);

    this.onHitPolicyChange = this.onHitPolicyChange.bind(this);
    this.onAggregationChange = this.onAggregationChange.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onHitPolicyChange({ target }) {
    const hitPolicy = target.value;

    this._modeling.editHitPolicy(hitPolicy, undefined);
  }

  onAggregationChange({ target }) {
    let aggregation = target.value === 'NONE'
      ? undefined
      : target.value;

    this._modeling.editHitPolicy('COLLECT', aggregation);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    const changeSupport = this._changeSupport = this.context.changeSupport;

    this._sheet = injector.get('sheet');
    this._modeling = injector.get('modeling');

    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy,
          aggregation = businessObject.aggregation;

    changeSupport.onElementsChanged(root.id, this.onElementsChanged);

    this.state = {
      hitPolicy,
      aggregation
    };
  }

  componentWillUnmount() {
    const root = this._sheet.getRoot();

    this._changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy,
          aggregation = businessObject.aggregation;

    return (
      <div className="context-menu-container hit-policy-edit">
        <p className="hit-policy-edit-policy">
          <label className="dms-label">Hit Policy:</label>&nbsp;

          <select
            className="hit-policy-edit-policy-select dms-select"
            onChange={ this.onHitPolicyChange }>
            {
              HIT_POLICIES.map(p => {
                return (
                  <option
                    key={ p }
                    selected={ hitPolicy === p }
                    value={ p }>{ p }</option>
                );
              })
            }
          </select>
        </p>
        {
          hitPolicy === 'COLLECT' &&
            <p className="hit-policy-edit-operator">
              <label className="dms-label">Aggregation:</label>&nbsp;

              <select
                className="hit-policy-edit-operator-select dms-select"
                onChange={ this.onAggregationChange }>
                {
                  LIST_FUNCTIONS.map(listFunction => {
                    let selected = false;

                    if (listFunction === 'NONE') {
                      selected = aggregation === undefined;
                    } else {
                      selected = aggregation === listFunction;
                    }

                    return (
                      <option
                        key={ listFunction }
                        selected={ selected }
                        value={ listFunction }>{ listFunction }</option>
                    );
                  })
                }
              </select>
            </p>
        }
      </div>
    );
  }
}