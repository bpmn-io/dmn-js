import CommandStack from 'table-js/lib/command';
import DmnUpdater from './DmnUpdater';
import DmnFactory from './DmnFactory';
import ElementFactory from './ElementFactory';
import IdChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/IdChangeBehavior';
import Modeling from './Modeling';
import Behavior from './behavior';

export default {
  __init__: [ 'dmnUpdater', 'idChangeBehavior', 'modeling' ],
  __depends__: [ Behavior, CommandStack ],
  dmnUpdater: [ 'type', DmnUpdater ],
  dmnFactory: [ 'type', DmnFactory ],
  elementFactory: [ 'type', ElementFactory ],
  idChangeBehavior: [ 'type', IdChangeBehavior ],
  modeling: [ 'type', Modeling ]
};