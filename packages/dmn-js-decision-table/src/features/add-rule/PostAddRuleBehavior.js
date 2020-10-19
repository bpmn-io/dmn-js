import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { query as domQuery } from 'min-dom';

export default class PostAddRuleBehavior extends CommandInterceptor {
  constructor(eventBus) {
    super(eventBus);

    this.postExecuted('row.add', (event) => {
      const firstColId = event.context.row.businessObject.inputEntry[0].id;

      console.log(firstColId);
      console.log(domQuery(`[data-element-id=${firstColId}]`));
    });
  }
}

PostAddRuleBehavior.$inject = [ 'eventBus' ];