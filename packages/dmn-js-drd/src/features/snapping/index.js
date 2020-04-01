import DrdConnectSnapping from './DrdConnectSnapping';
import SnappingModule from 'diagram-js/lib/features/snapping';

export default {
  __depends__: [ SnappingModule ],
  __init__: [
    'connectSnapping',
  ],
  connectSnapping: [ 'type', DrdConnectSnapping ]
};