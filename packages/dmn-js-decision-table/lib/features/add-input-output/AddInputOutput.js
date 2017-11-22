
// eslint-disable-next-line
import Inferno from 'inferno';

import AddInputCellComponent from './components/AddInputCellComponent';
import AddOutputCellComponent from './components/AddOutputCellComponent';

const HIGH_PRIORITY = 1500;


export default class AddInputOutput {
  constructor(components, editorActions, eventBus, modeling, sheet) {
    components.onGetComponent('cell', HIGH_PRIORITY, ({ cellType }) => {      
      if (cellType === 'input-label') {
        return AddInputCellComponent;
      } else if (cellType === 'output-label') {
        return AddOutputCellComponent;
      }
    });

    eventBus.on('addInput', () => {
      editorActions.trigger('addInput');
    });

    eventBus.on('addOutput', () => {
      editorActions.trigger('addOutput');
    });
  }
}

AddInputOutput.$inject = [ 'components', 'editorActions', 'eventBus', 'modeling', 'sheet' ];