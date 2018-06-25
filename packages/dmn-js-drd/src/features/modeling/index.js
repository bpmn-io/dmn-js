import ModelingBehavior from './behavior';
import Rules from '../rules';
import DefinitionPropertiesViewer from '../definition-properties/viewer';
import DiagramCommand from 'diagram-js/lib/command';
import DiagramSelection from 'diagram-js/lib/features/selection';
import DiagramChangeSupport from 'diagram-js/lib/features/change-support';

import DrdFactory from './DrdFactory';
import DrdUpdater from './DrdUpdater';
import ElementFactory from './ElementFactory';
import Modeling from './Modeling';
import DrdLayouter from './DrdLayouter';
import CroppingConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';

export default {
  __init__: [ 'modeling', 'drdUpdater' ],
  __depends__: [
    ModelingBehavior,
    Rules,
    DefinitionPropertiesViewer,
    DiagramCommand,
    DiagramSelection,
    DiagramChangeSupport
  ],
  drdFactory: [ 'type', DrdFactory ],
  drdUpdater: [ 'type', DrdUpdater ],
  elementFactory: [ 'type', ElementFactory ],
  modeling: [ 'type', Modeling ],
  layouter: [ 'type', DrdLayouter ],
  connectionDocking: [ 'type', CroppingConnectionDocking ]
};
