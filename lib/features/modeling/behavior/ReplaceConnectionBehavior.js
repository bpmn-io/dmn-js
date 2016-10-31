'use strict';

var inherits = require('inherits');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');

function ReplaceConnectionBehavior(eventBus, modeling, drdRules) {

  CommandInterceptor.call(this, eventBus);

  function fixConnection(connection) {

    var source = connection.source,
        target = connection.target,
        parent = connection.parent,
        replacementAttrs;

    // do not do anything if connection
    // is already deleted (may happen due to other
    // behaviors plugged-in before)
    if (!parent) {
      return;
    }

    replacementAttrs = drdRules.canConnect(source, target) || { type: 'dmn:Association' };
    replacementAttrs.waypoints = connection.waypoints.slice();

    // create a new connection
    modeling.removeConnection(connection);
    modeling.connect(source, target, replacementAttrs);
  }

  this.postExecuted([
    'connection.reconnectStart',
    'connection.reconnectEnd'
  ], function(event) {

    var connection = event.context.connection;

    fixConnection(connection);
  });

}

inherits(ReplaceConnectionBehavior, CommandInterceptor);

ReplaceConnectionBehavior.$inject = [ 'eventBus', 'modeling', 'drdRules' ];

module.exports = ReplaceConnectionBehavior;
