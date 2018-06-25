import DiagramEditorActions from 'diagram-js/lib/features/editor-actions';
import DiagramLassoTool from 'diagram-js/lib/features/lasso-tool';

import DrdEditorActions from './DrdEditorActions';

export default {
  __depends__: [
    DiagramEditorActions,
    DiagramLassoTool
  ],
  editorActions: [ 'type', DrdEditorActions ]
};
