import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isArray } from 'min-dash';


export default class IdClaimBehavior extends CommandInterceptor {

  constructor(eventBus, moddle, modeling) {
    super(eventBus);

    this._ids = moddle.ids;
    this._modeling = modeling;

    this.preExecute([
      'row.add',
      'col.add'
    ], event => {
      const context = event.context,
            element = context.row || context.col;

      this.claimId(element.businessObject);

      if (element.cells) {
        element.cells.forEach(cell => this.claimId(cell.businessObject));
      }
    });
  }

  claimId(businessObject) {

    if (businessObject.id && !this._ids.assigned(businessObject.id)) {
      this._modeling.claimId(businessObject.id, businessObject);
    }

    businessObject.$descriptor.properties.forEach(property => {
      const value = businessObject[property.name];

      // not set
      if (!value) {
        return;
      }

      // array of moddle elements
      if (isArray(value)) {
        value.forEach(v => this.claimId(v));
      }

      // moddle element
      if (value.$type) {
        this.claimId(value);
      }
    });

  }
}

IdClaimBehavior.$inject = [ 'eventBus', 'moddle', 'modeling' ];