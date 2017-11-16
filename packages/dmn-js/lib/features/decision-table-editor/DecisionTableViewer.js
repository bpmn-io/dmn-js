import { is } from '../../util/ModelUtil';

class TableEditor {
  import(element) {
    console.log('import element', element);
  }
}

export default class DecisionTableViewer {
  constructor(dmnjs, drillDown, eventBus) {

    // TODO: initialize actual decision table editor
    const tableEditor = new TableEditor();

    drillDown.registerProvider(this, 'dmn-icon-decision-table');
  
    eventBus.on('drillDown.editElement', ({ element }) => {
      tableEditor.import(element);

      dmnjs.detach();

      const button = document.createElement('button');
      button.textContent = 'Show DRD';

      button.addEventListener('click', () => {
        while (dmnjs._parentContainer.firstChild) {
          dmnjs._parentContainer.removeChild(dmnjs._parentContainer.firstChild);
        }

        dmnjs.attach();
      });

      dmnjs._parentContainer.appendChild(button);
    });
  }

  canEdit(businessObject) {
    return is(businessObject, 'dmn:Decision') && businessObject.decisionTable;
  }
}

DecisionTableViewer.$inject = [ 'dmnjs', 'drillDown', 'eventBus' ];