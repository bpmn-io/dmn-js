import inherits from 'inherits-browser';

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

  const canvas = injector.get('canvas', false),
        elementRegistry = injector.get('elementRegistry', false),
        selection = injector.get('selection', false),
        lassoTool = injector.get('lassoTool', false),
        handTool = injector.get('handTool', false),
        directEditing = injector.get('directEditing', false),
        distributeElements = injector.get('distributeElements', false),
        alignElements = injector.get('alignElements', false),
        searchPad = injector.get('searchPad', false);

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

  if (selection && distributeElements) {
    this._registerAction('distributeElements', function(opts) {
      var currentSelection = selection.get(),
          type = opts.type;

      if (currentSelection.length > 2) {
        distributeElements.trigger(currentSelection, type);
      }
    });
  }

  if (selection && alignElements) {
    this._registerAction('alignElements', function(opts) {
      var currentSelection = selection.get(),
          type = opts.type;

      if (currentSelection.length > 1) {
        alignElements.trigger(currentSelection, type);
      }
    });
  }

  if (lassoTool) {
    this._registerAction('lassoTool', function() {
      lassoTool.toggle();
    });
  }

  if (handTool) {
    this._registerAction('handTool', function() {
      handTool.toggle();
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

  if (selection && searchPad) {
    this._registerAction('find', function() {
      searchPad.toggle();
    });
  }
};
