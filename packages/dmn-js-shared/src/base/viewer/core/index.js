import ChangeSupport from './ChangeSupport';
import Components from './Components';
import EventBus from 'diagram-js/lib/core/EventBus';
import Renderer from './Renderer';

export default {
  __init__: [ 'changeSupport', 'components', 'renderer' ],
  changeSupport: [ 'type', ChangeSupport ],
  components: [ 'type', Components ],
  eventBus: [ 'type', EventBus ],
  renderer: [ 'type', Renderer ]
};