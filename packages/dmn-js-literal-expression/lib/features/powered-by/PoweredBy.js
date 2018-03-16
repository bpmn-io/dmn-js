import PoweredByLogoComponent from './components/PoweredByLogoComponent';
import PoweredByOverlayComponent from './components/PoweredByOverlayComponent';

const HIGHER_PRIORITY = 2000;

export default class PoweredBy {
  constructor(components, eventBus) {
    components.onGetComponent('viewer', HIGHER_PRIORITY, () => {
      return PoweredByLogoComponent;
    });

    components.onGetComponent('viewer', () => {
      return PoweredByOverlayComponent;
    });
  }
}

PoweredBy.$inject = [ 'components', 'eventBus' ];