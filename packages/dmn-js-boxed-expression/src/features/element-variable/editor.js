import ElementVariableEditor from './ElementVariableEditor';
import ElementVariableEditorComponent from './components/ElementVariableEditorComponent';

export default {
  __init__: [ 'elementVariableComponent' ],
  elementVariable: [ 'type', ElementVariableEditor ],
  elementVariableComponent: [ 'type', ElementVariableEditorComponent ]
};