import { is } from '../../util/ModelUtil';

export default class DecisionTableViewer {
  constructor(drillDown, eventBus) {
    drillDown.registerProvider(this, 'dmn-icon-decision-table');
  
    eventBus.on('drillDown.editElement', context => console.log('edit element'));
  }

  // TODO: this should be inherited from a parent class
  attach() {}
  
  detach() {}

  canEdit(businessObject) {
    return is(businessObject, 'dmn:Decision') && businessObject.decisionTable;
  }

  import() {

  }
}

DecisionTableViewer.$inject = [ 'drillDown', 'eventBus' ];