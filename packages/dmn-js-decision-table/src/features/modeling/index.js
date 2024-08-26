import CommandStack from 'table-js/lib/command';
import DmnUpdater from './DmnUpdater';
import DmnFactory from './DmnFactory';
import ElementFactory from './ElementFactory';
import IdChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/IdChangeBehavior';
import NameChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/NameChangeBehavior';
import Modeling from './Modeling';
import Behavior from './behavior';

export default {
  __init__: [ 'dmnUpdater', 'idChangeBehavior', 'nameChangeBehavior', 'modeling' ],
  __depends__: [ Behavior, CommandStack ],
  dmnUpdater: [ 'type', DmnUpdater ],
  dmnFactory: [ 'type', DmnFactory ],
  elementFactory: [ 'type', ElementFactory ],
  idChangeBehavior: [ 'type', IdChangeBehavior ],
  nameChangeBehavior: [ 'type', NameChangeBehavior ],
  modeling: [ 'type', Modeling ]
};