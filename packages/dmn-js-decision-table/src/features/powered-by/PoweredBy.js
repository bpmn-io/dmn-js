import PoweredByLogoComponent from './components/PoweredByLogoComponent';
import PoweredByOverlayComponent from './components/PoweredByOverlayComponent';

export default class PoweredBy {
  constructor(components, eventBus) {
    components.onGetComponent('table.before', () => {
      return PoweredByLogoComponent;
    });

    components.onGetComponent('table.before', () => {
      return PoweredByOverlayComponent;
    });
  }
}

PoweredBy.$inject = [ 'components', 'eventBus' ];