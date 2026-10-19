const COMMANDS = [
  'row.add',
  'row.remove',
  'col.add',
  'col.remove'
];

export default class ContextMenuCloseBehavior {
  constructor(contextMenu, eventBus) {
    eventBus.on('commandStack.executed', ({ command }) => {

      // close on certain modeling operations
      if (COMMANDS.indexOf(command) !== -1) {
        contextMenu.close();
      }

    });

    // always close on undo
    eventBus.on('commandStack.reverted', () => {
      contextMenu.close();
    });
  }
}

ContextMenuCloseBehavior.$inject = [ 'contextMenu', 'eventBus' ];