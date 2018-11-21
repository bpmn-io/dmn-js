import EditorActionsModule from 'diagram-js/lib/features/editor-actions';

import DrdEditorActions from './DrdEditorActions';

export default {
  __depends__: [
    EditorActionsModule
  ],
  editorActions: [ 'type', DrdEditorActions ]
};
