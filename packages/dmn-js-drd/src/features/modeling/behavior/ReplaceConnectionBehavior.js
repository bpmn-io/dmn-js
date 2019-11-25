import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


export default function ReplaceConnectionBehavior(injector, modeling, rules) {
  injector.invoke(CommandInterceptor, this);

  this.preExecute('connection.reconnect', function(context) {
    var connection = context.connection,
        source = context.newSource || connection.source,
        target = context.newTarget || connection.target,
        waypoints = connection.waypoints.slice();

    var allowed = rules.allowed('connection.reconnect', {
      connection: connection,
      source: source,
      target: target
    });

    if (!allowed || allowed.type === connection.type) {
      return;
    }

    context.connection = modeling.connect(source, target, {
      type: allowed.type,
      waypoints: waypoints
    });

    modeling.removeConnection(connection);
  }, true);
}

inherits(ReplaceConnectionBehavior, CommandInterceptor);

ReplaceConnectionBehavior.$inject = [
  'injector',
  'modeling',
  'rules'
];