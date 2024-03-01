import CommandStack from 'diagram-js/lib/command/CommandStack';
import IdChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/IdChangeBehavior';

import Modeling from './Modeling';

export default {
  __init__: [ 'idChangeBehavior', 'modeling' ],
  commandStack: [ 'type', CommandStack ],
  idChangeBehavior: [ 'type', IdChangeBehavior ],
  modeling: [ 'type', Modeling ]
};