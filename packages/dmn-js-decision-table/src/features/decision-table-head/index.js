import DecisionTableHeadProvider from './DecisionTableHeadProvider';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ Translate ],
  __init__: [ 'decisionTableHeadProvider' ],
  decisionTableHeadProvider: [ 'type', DecisionTableHeadProvider ]
};