import CoreModule from '../../core';
import ElementLogicModule from '../element-logic';
import RenderModule from '../../render';

import {
  DecisionTableComponentProvider
} from './components/DecisionTableComponent';

export default {
  __depends__: [ CoreModule, ElementLogicModule, RenderModule ],
  __init__: [ 'decisionTableComponent' ],
  decisionTableComponent: [ 'type', DecisionTableComponentProvider ]
};
