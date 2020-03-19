import CreateConnectionBehavior from './CreateConnectionBehavior';
import LayoutConnectionBehavior from './LayoutConnectionBehavior';
import ReplaceConnectionBehavior from './ReplaceConnectionBehavior';
import ReplaceElementBehavior from './ReplaceElementBehavior';
import IdChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/IdChangeBehavior';

export default {
  __init__: [
    'createConnectionBehavior',
    'idChangeBehavior',
    'layoutConnectionBehavior',
    'replaceConnectionBehavior',
    'replaceElementBehavior'
  ],
  createConnectionBehavior: [ 'type', CreateConnectionBehavior ],
  idChangeBehavior: [ 'type', IdChangeBehavior ],
  layoutConnectionBehavior: [ 'type', LayoutConnectionBehavior ],
  replaceConnectionBehavior: [ 'type', ReplaceConnectionBehavior ],
  replaceElementBehavior: [ 'type', ReplaceElementBehavior ]
};
