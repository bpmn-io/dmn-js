import CommandStack from 'table-js/lib/command';
import CoreModule from '../../core';
import DmnUpdater from './DmnUpdater';
import ElementFactory from './ElementFactory';
import IdChangeBehavior from
  'dmn-js-shared/lib/features/modeling/behavior/IdChangeBehavior';
import NameChangeBehavior from './behavior/NameChangeBehavior';
import Modeling from './Modeling';
import Behavior from './behavior';

export default {
  __init__: [ 'dmnUpdater', 'idChangeBehavior', 'nameChangeBehavior', 'modeling' ],
  __depends__: [ Behavior, CommandStack, CoreModule ],
  dmnUpdater: [ 'type', DmnUpdater ],
  elementFactory: [ 'type', ElementFactory ],
  idChangeBehavior: [ 'type', IdChangeBehavior ],
  nameChangeBehavior: [ 'type', NameChangeBehavior ],
  modeling: [ 'type', Modeling ]
};