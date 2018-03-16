export default class ContextMenuCloseBehavior {
  constructor(contextMenu, eventBus) {
    eventBus.on('commandStack.executed', ({ command }) => {

      // close on every modeling operation except
      // updating properties (e.g. cell description)
      if (command !== 'updateProperties') {
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