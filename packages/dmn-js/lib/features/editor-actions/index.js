'use strict';

module.exports = {
  __depends__: [
    require('diagram-js/lib/features/editor-actions'),
    require('diagram-js/lib/features/lasso-tool')
  ],
  editorActions: [ 'type', require('./DrdEditorActions') ]
};
