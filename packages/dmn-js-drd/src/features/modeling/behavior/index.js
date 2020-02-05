import CreateConnectionBehavior from './CreateConnectionBehavior';
import ReplaceConnectionBehavior from './ReplaceConnectionBehavior';
import ReplaceElementBehavior from './ReplaceElementBehavior';
import IdChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/IdChangeBehavior';

export default {
  __init__: [
    'createConnectionBehavior',
    'idChangeBehavior',
    'replaceConnectionBehavior',
    'replaceElementBehavior'
  ],
  createConnectionBehavior: [ 'type', CreateConnectionBehavior ],
  idChangeBehavior: [ 'type', IdChangeBehavior ],
  replaceConnectionBehavior: [ 'type', ReplaceConnectionBehavior ],
  replaceElementBehavior: [ 'type', ReplaceElementBehavior ]
};
