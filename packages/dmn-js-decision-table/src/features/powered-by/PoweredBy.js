import { PoweredByComponent } from 'dmn-js-shared/lib/util/PoweredByUtil';

export default class PoweredBy {
  constructor(components) {
    components.onGetComponent('table.before', () => {
      return PoweredByComponent;
    });
  }
}

PoweredBy.$inject = [ 'components' ];