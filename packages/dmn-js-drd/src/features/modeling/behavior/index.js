import CreateConnectionBehavior from './CreateConnectionBehavior';
import LayoutConnectionBehavior from './LayoutConnectionBehavior';
import ReplaceConnectionBehavior from './ReplaceConnectionBehavior';
import ReplaceElementBehavior from './ReplaceElementBehavior';
import IdChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/IdChangeBehavior';
import NameChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/NameChangeBehavior';
import TypeRefBehavior from 'dmn-js-shared/lib/features/modeling/behavior/TypeRefBehavior';

export default {
  __init__: [
    'createConnectionBehavior',
    'idChangeBehavior',
    'nameChangeBehavior',
    'typeRefBehavior',
    'layoutConnectionBehavior',
    'replaceConnectionBehavior',
    'replaceElementBehavior'
  ],
  createConnectionBehavior: [ 'type', CreateConnectionBehavior ],
  idChangeBehavior: [ 'type', IdChangeBehavior ],
  nameChangeBehavior: [ 'type', NameChangeBehavior ],
  typeRefBehavior: [ 'type', TypeRefBehavior ],
  layoutConnectionBehavior: [ 'type', LayoutConnectionBehavior ],
  replaceConnectionBehavior: [ 'type', ReplaceConnectionBehavior ],
  replaceElementBehavior: [ 'type', ReplaceElementBehavior ]
};
