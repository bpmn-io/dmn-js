var inherits = require('inherits');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');

/**
 * A command interceptor responsible for updating elements after they've
 * been changed in the decision view.
 */
function DrdTableUpdater(elementRegistry, table) {
  var eventBus = table.get('eventBus');

  CommandInterceptor.call(this, eventBus);

  function updateId(oldId, newId) {
    var element = elementRegistry.get(oldId);

    elementRegistry.updateId(element, newId);
  }

  this.executed([ 'id.edit' ], function(evt) {
    var context = evt.context,
        oldId = context.oldId,
        newId = context.newId;

    updateId(oldId, newId);
  });

  this.reverted([ 'id.edit' ], function(evt) {
    var context = evt.context,
        oldId = context.oldId,
        newId = context.newId;

    updateId(newId, oldId);
  });
}

inherits(DrdTableUpdater, CommandInterceptor);

module.exports = DrdTableUpdater;

DrdTableUpdater.$inject = [ 'elementRegistry', 'table' ];
