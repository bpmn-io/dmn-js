import { PoweredByComponent } from 'dmn-js-shared/lib/util/PoweredByUtil';

const HIGHER_PRIORITY = 2000;

export default class PoweredBy {
  constructor(components) {
    components.onGetComponent('viewer', HIGHER_PRIORITY, () => {
      return PoweredByComponent;
    });
  }
}

PoweredBy.$inject = [ 'components' ];