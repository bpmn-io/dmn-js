import CommandStack from 'diagram-js/lib/command/CommandStack';
import IdChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/IdChangeBehavior';
import NameChangeBehavior from './behavior/NameChangeBehavior';

import Modeling from './Modeling';

export default {
  __init__: [
    'idChangeBehavior',
    'modeling',
    'nameChangeBehavior'
  ],
  commandStack: [ 'type', CommandStack ],
  idChangeBehavior: [ 'type', IdChangeBehavior ],
  modeling: [ 'type', Modeling ],
  nameChangeBehavior: [ 'type', NameChangeBehavior ]
};