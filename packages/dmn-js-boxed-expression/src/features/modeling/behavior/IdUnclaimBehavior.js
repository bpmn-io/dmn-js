import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isArray } from 'min-dash';


export default class IdUnclaimBehavior extends CommandInterceptor {

  constructor(eventBus, modeling) {
    super(eventBus);

    this._modeling = modeling;

    this.preExecute([ 'row.remove', 'col.remove' ], event => {
      const context = event.context,
            element = context.row || context.col;

      this.unclaimId(element.businessObject);

      if (element.cells) {
        element.cells.forEach(cell => this.unclaimId(cell.businessObject));
      }
    });
  }

  unclaimId(businessObject) {

    if (businessObject.id) {
      this._modeling.unclaimId(businessObject.id, businessObject);
    }

    businessObject.$descriptor.properties.forEach(property => {
      const value = businessObject[property.name];

      // not set
      if (!value) {
        return;
      }

      // array of moddle elements
      if (isArray(value)) {
        value.forEach(v => this.unclaimId(v));
      }

      // moddle element
      if (value.$type) {
        this.unclaimId(value);
      }
    });

  }
}

IdUnclaimBehavior.$inject = [ 'eventBus', 'modeling' ];