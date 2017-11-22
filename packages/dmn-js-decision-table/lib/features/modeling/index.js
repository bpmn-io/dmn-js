import CommandStack from 'diagram-js/lib/command/CommandStack';
import DmnUpdater from './DmnUpdater';
import DmnFactory from './DmnFactory';
import ElementFactory from './ElementFactory';
import Modeling from './Modeling';

export default {
  __init__: [ 'dmnUpdater', 'modeling' ],
  commandStack: [ 'type', CommandStack ],
  dmnUpdater: [ 'type', DmnUpdater ],
  dmnFactory: [ 'type', DmnFactory ],
  elementFactory: [ 'type', ElementFactory ],
  modeling: [ 'type', Modeling ]
};