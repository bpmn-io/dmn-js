import CreateConnectionBehavior from './CreateConnectionBehavior';
import DecisionServiceBehavior from './DecisionServiceBehavior';
import LayoutConnectionBehavior from './LayoutConnectionBehavior';
import ReplaceConnectionBehavior from './ReplaceConnectionBehavior';
import ReplaceElementBehavior from './ReplaceElementBehavior';
import IdChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/IdChangeBehavior';
import NameChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/NameChangeBehavior';
export default {
  __init__: [
    'createConnectionBehavior',
    'decisionServiceBehavior',
    'idChangeBehavior',
    'nameChangeBehavior',
    'layoutConnectionBehavior',
    'replaceConnectionBehavior',
    'replaceElementBehavior'
  ],
  createConnectionBehavior: [ 'type', CreateConnectionBehavior ],
  decisionServiceBehavior: [ 'type', DecisionServiceBehavior ],
  idChangeBehavior: [ 'type', IdChangeBehavior ],
  nameChangeBehavior: [ 'type', NameChangeBehavior ],
  layoutConnectionBehavior: [ 'type', LayoutConnectionBehavior ],
  replaceConnectionBehavior: [ 'type', ReplaceConnectionBehavior ],
  replaceElementBehavior: [ 'type', ReplaceElementBehavior ]
};
