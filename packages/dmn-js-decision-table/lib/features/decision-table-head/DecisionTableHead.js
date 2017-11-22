import DecisionTableHeadComponent from './components/DecisionTableHeadComponent';
import InputLabelComponent from './components/InputLabelComponent';
import OutputLabelComponent from './components/OutputLabelComponent';

export default class DecisionTableHead {
  constructor(components) {
    components.onGetComponent('table.head', () => DecisionTableHeadComponent);

    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'input-label') {
        return InputLabelComponent;
      } else if (cellType === 'output-label') {
        return OutputLabelComponent;
      }
    });
  }
}

DecisionTableHead.$inject = [ 'components' ];