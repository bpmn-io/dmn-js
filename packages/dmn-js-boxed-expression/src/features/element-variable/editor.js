import ElementVariableEditor from './ElementVariableEditor';
import ElementVariableEditorComponent from './components/ElementVariableEditorComponent';

export default {
  __init__: [ 'elementVariable', 'elementVariableComponent' ],
  elementVariable: [ 'type', ElementVariableEditor ],
  elementVariableComponent: [ 'type', ElementVariableEditorComponent ]
};