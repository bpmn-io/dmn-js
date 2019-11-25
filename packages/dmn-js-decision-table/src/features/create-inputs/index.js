import CreateInputsProvider from './CreateInputsProvider';
import EditorActions from '../editor-actions';

export default {
  __depends__: [ EditorActions, 'translate' ],
  __init__: [
    'createInputsProvider'
  ],
  createInputsProvider: [ 'type', CreateInputsProvider ]
};