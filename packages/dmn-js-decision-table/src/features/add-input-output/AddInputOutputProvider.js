import AddInput from './components/AddInput';
import AddOutput from './components/AddOutput';


export default function AddInputOutputProvider(
    components, editorActions, eventBus
) {

  components.onGetComponent('cell', ({ cellType }) => {
    if (cellType === 'input-label') {
      return AddInput;
    }

    if (cellType === 'output-label') {
      return AddOutput;
    }
  });

  eventBus.on('addInput', () => {
    editorActions.trigger('addInput');
  });

  eventBus.on('addOutput', () => {
    editorActions.trigger('addOutput');
  });
}

AddInputOutputProvider.$inject = [
  'components',
  'editorActions',
  'eventBus'
];