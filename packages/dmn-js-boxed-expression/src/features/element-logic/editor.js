import ElementLogicRenderer from './ElementLogicRenderer';
import { ElementLogicEditor as ElementLogic } from './ElementLogicEditor';
import { ElementLogicSelector } from './components/ElementLogicSelector';

export default {
  __init__: [ 'elementLogicRenderer', 'elementLogicSelector' ],
  elementLogicRenderer: [ 'type', ElementLogicRenderer ],
  elementLogic: [ 'type', ElementLogic ],
  elementLogicSelector: [ 'type', ElementLogicSelector ]
};
