import AddInput from './components/AddInput';
import AddOutput from './components/AddOutput';


export default function AddInputOutputProvider(
    components, editorActions, eventBus
) {

  components.onGetComponent('cell-inner', (context = {}) => {
    const { cellType, index, inputsLength, outputsLength } = context;

    if (cellType === 'input-cell' && index === inputsLength - 1) {
      return AddInput;
    }

    if (cellType === 'output-cell' && index === outputsLength - 1) {
      return AddOutput;
    }
  });

  eventBus.on('addInput', (_, context) => {
    editorActions.trigger('addInput', context);
  });

  eventBus.on('addOutput', (_, context) => {
    editorActions.trigger('addOutput', context);
  });
}

AddInputOutputProvider.$inject = [
  'components',
  'editorActions',
  'eventBus'
];