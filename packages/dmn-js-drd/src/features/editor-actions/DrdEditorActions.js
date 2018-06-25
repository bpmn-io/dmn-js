import inherits from 'inherits';

import EditorActions from 'diagram-js/lib/features/editor-actions/EditorActions';


export default function DrdEditorActions(
    injector,
    canvas,
    elementRegistry,
    selection,
    lassoTool,
    directEditing) {

  injector.invoke(EditorActions, this);

  this.register({
    selectElements: function() {
      // select all elements except for the invisible
      // root element
      var rootElement = canvas.getRootElement();

      var elements = elementRegistry.filter(function(element) {
        return element !== rootElement;
      });

      selection.select(elements);

      return elements;
    },
    lassoTool: function() {
      lassoTool.toggle();
    },
    directEditing: function() {
      var currentSelection = selection.get();

      if (currentSelection.length) {
        directEditing.activate(currentSelection[0]);
      }
    }
  });
}

inherits(DrdEditorActions, EditorActions);

DrdEditorActions.$inject = [
  'injector',
  'canvas', 'elementRegistry', 'selection',
  'lassoTool',
  'directEditing'
];
