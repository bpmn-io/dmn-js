import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class PostAddRuleBehavior extends CommandInterceptor {
  constructor(eventBus, selection) {
    super(eventBus);

    this.postExecuted('row.add', (event) => {

      eventBus.once('elements.changed', 500, function() {

        const firstColId = event.context.row.cells[0].id;
        selection.select(firstColId);

      });

    });
  }
}

PostAddRuleBehavior.$inject = [ 'eventBus', 'selection' ];
