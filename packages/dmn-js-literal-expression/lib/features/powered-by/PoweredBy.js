import PoweredByLogoComponent from './components/PoweredByLogoComponent';
import PoweredByOverlayComponent from './components/PoweredByOverlayComponent';

export default class PoweredBy {
  constructor(components, eventBus) {
    components.onGetComponent('viewer', () => {
      return PoweredByLogoComponent;
    });

    components.onGetComponent('viewer', () => {
      return PoweredByOverlayComponent;
    });
  }
}

PoweredBy.$inject = [ 'components', 'eventBus' ];