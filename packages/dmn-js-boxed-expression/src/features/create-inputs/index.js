import CreateInputsProvider from './CreateInputsProvider';
import EditorActions from '../editor-actions';

export default {
  __depends__: [ EditorActions ],
  __init__: [
    'createInputsProvider'
  ],
  createInputsProvider: [ 'type', CreateInputsProvider ]
};