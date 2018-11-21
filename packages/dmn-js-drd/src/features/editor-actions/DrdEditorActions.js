import inherits from 'inherits';

import EditorActions from 'diagram-js/lib/features/editor-actions/EditorActions';


export default function DrdEditorActions(injector) {
  injector.invoke(EditorActions, this);
}

inherits(DrdEditorActions, EditorActions);

DrdEditorActions.$inject = [
  'injector'
];


/**
 * Register default actions.
 *
 * @param {Injector} injector
 */
DrdEditorActions.prototype._registerDefaultActions = function(injector) {

  // (0) invoke super method

  EditorActions.prototype._registerDefaultActions.call(this, injector);

  // (1) retrieve optional components to integrate with

  var canvas = injector.get('canvas', false);
  var elementRegistry = injector.get('elementRegistry', false);
  var selection = injector.get('selection', false);
  var lassoTool = injector.get('lassoTool', false);
  var directEditing = injector.get('directEditing', false);

  // (2) check components and register actions

  if (canvas && elementRegistry && selection) {
    this._registerAction('selectElements', function() {
      // select all elements except for the invisible
      // root element
      var rootElement = canvas.getRootElement();

      var elements = elementRegistry.filter(function(element) {
        return element !== rootElement;
      });

      selection.select(elements);

      return elements;
    });
  }

  if (lassoTool) {
    this._registerAction('lassoTool', function() {
      lassoTool.toggle();
    });
  }

  if (selection && directEditing) {
    this._registerAction('directEditing', function() {
      var currentSelection = selection.get();

      if (currentSelection.length) {
        directEditing.activate(currentSelection[0]);
      }
    });
  }
};