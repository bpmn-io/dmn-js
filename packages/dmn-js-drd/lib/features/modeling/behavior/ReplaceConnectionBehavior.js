import inherits from 'inherits';

import {
  filter
} from 'min-dash';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


export default function ReplaceConnectionBehavior(eventBus, modeling, drdRules) {

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

  this.postExecuted('connection.reconnectStart', function(event) {

    // remove old di information from target
    var extensionElements =
      event.context.connection.target.businessObject.extensionElements.values;

    var extension = filter(extensionElements, function(extension) {
      return (
        extension.$type === 'biodi:Edge' &&
        extension.source === event.context.oldSource.id
      );
    })[0];

    if (extension) {
      extensionElements.splice(extensionElements.indexOf(extension), 1);
    }
  });

  this.postExecuted([
    'connection.reconnectStart',
    'connection.reconnectEnd'
  ], function(event) {

    var connection = event.context.connection;

    fixConnection(connection);
  });

}

inherits(ReplaceConnectionBehavior, CommandInterceptor);

ReplaceConnectionBehavior.$inject = [
  'eventBus',
  'modeling',
  'drdRules'
];
