import DecisionTableHeadEditor from './DecisionTableHeadEditor';
import Modeling from '../modeling';

export default {
  __depends__: [ Modeling ],
  __init__: [ 'decisionTableHeadEditor' ],
  decisionTableHeadEditor: [ 'type', DecisionTableHeadEditor ]
};