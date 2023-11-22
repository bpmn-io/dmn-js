import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { inject } from 'table-js/lib/components';

export default class DecisionTablePropertiesComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');

    inject(this);
  }

  render() {
    const root = this.sheet.getRoot();

    if (!is(root, 'dmn:DMNElement')) {
      return null;
    }

    const { name } = root.businessObject.$parent;

    const HitPolicy = this.components.getComponent('hit-policy') || NullComponent;

    return (
      <div className="decision-table-properties">
        <div className="decision-table-name" title={
          this._translate('Decision name: ') + name }>
          { name }
        </div>
        <div className="decision-table-header-separator" />
        <HitPolicy />
      </div>
    );
  }
}

DecisionTablePropertiesComponent.$inject = [
  'sheet',
  'components'
];

function NullComponent() {
  return null;
}
