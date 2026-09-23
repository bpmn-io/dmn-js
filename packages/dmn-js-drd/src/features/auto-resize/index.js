import AutoResizeModule from 'diagram-js/lib/features/auto-resize';
import RulesModule from '../rules';
import DrdAutoResizeProvider from './DrdAutoResizeProvider';
import DrdAutoResize from './DrdAutoResize';

export default {
  __depends__: [ AutoResizeModule,	RulesModule ],
  __init__: [ 'drdAutoResizeProvider' ],
  autoResize: [ 'type', DrdAutoResize ],
  drdAutoResizeProvider: [ 'type', DrdAutoResizeProvider ]
};