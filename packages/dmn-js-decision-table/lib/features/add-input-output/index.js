import AddInputOutputProvider from './AddInputOutputProvider';
import EditorActions from '../editor-actions';

export default {
  __depends__: [ EditorActions ],
  __init__: [
    'addInputOutputProvider'
  ],
  addInputOutputProvider: [ 'type', AddInputOutputProvider ]
};