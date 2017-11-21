import { is } from '../../util/ModelUtil';

class TableEditor {
  import(element) {
    console.log('import element', element);
  }
}

export default class DecisionTableViewer {
  constructor(drd, drillDown, eventBus) {

    // TODO: initialize actual decision table editor
    const tableEditor = new TableEditor();

    drillDown.registerProvider(this, 'dmn-icon-decision-table');

    eventBus.on('drillDown.editElement', ({ element }) => {
      tableEditor.import(element);

      drd.detach();

      const button = document.createElement('button');
      button.textContent = 'Show DRD';

      button.addEventListener('click', () => {
        while (drd._parentContainer.firstChild) {
          drd._parentContainer.removeChild(drd._parentContainer.firstChild);
        }

        drd.attach();
      });

      drd._parentContainer.appendChild(button);
    });
  }

  canEdit(businessObject) {
    return is(businessObject, 'dmn:Decision') && businessObject.decisionTable;
  }
}

DecisionTableViewer.$inject = [ 'drd', 'drillDown', 'eventBus' ];