import DiagramCommand from 'diagram-js/lib/command';
import DiagramChangeSupport from 'diagram-js/lib/features/change-support';
import DiagramDirectEditing from 'diagram-js-direct-editing';

import LabelEditingProvider from './LabelEditingProvider';

export default {
  __depends__: [
    DiagramCommand,
    DiagramChangeSupport,
    DiagramDirectEditing
  ],
  __init__: [ 'labelEditingProvider' ],
  labelEditingProvider: [ 'type', LabelEditingProvider ]
};
