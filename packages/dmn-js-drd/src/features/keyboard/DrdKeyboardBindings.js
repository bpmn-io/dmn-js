import inherits from 'inherits';

import KeyboardBindings from 'diagram-js/lib/features/keyboard/KeyboardBindings';


/**
 * DRD specific key bindings.
 *
 * @param {Keyboard} keyboard
 * @param {EditorActions} editorActions
 */
export default function DrdKeyboardBindings(injector) {
  injector.invoke(KeyboardBindings, this);
}

inherits(DrdKeyboardBindings, KeyboardBindings);

DrdKeyboardBindings.$inject = [
  'injector'
];


/**
 * Register available keyboard bindings.
 *
 * @param {Keyboard} keyboard
 * @param {EditorActions} editorActions
 */
DrdKeyboardBindings.prototype.registerBindings = function(keyboard, editorActions) {

  // inherit default bindings
  KeyboardBindings.prototype.registerBindings.call(this, keyboard, editorActions);

  /**
   * Add keyboard binding if respective editor action
   * is registered.
   *
   * @param {string} action name
   * @param {Function} fn that implements the key binding
   */
  function addListener(action, fn) {

    if (editorActions.isRegistered(action)) {
      keyboard.addListener(fn);
    }
  }

  // select all elements
  // CTRL + A
  addListener('selectElements', function(context) {

    var event = context.keyEvent;

    if (keyboard.isKey(['a', 'A'], event) && keyboard.isCmd(event)) {
      editorActions.trigger('selectElements');

      return true;
    }
  });

  // activate lasso tool
  // L
  addListener('lassoTool', function(context) {

    var event = context.keyEvent;

    if (keyboard.hasModifier(event)) {
      return;
    }

    if (keyboard.isKey(['l', 'L'], event)) {
      editorActions.trigger('lassoTool');

      return true;
    }
  });

  // activate hand tool
  // H
  addListener('handTool', function(context) {

    var event = context.keyEvent;

    if (keyboard.hasModifier(event)) {
      return;
    }

    if (keyboard.isKey(['h', 'H'], event)) {
      editorActions.trigger('handTool');

      return true;
    }
  });

  // activate direct editing
  // E
  addListener('directEditing', function(context) {

    var event = context.keyEvent;

    if (keyboard.hasModifier(event)) {
      return;
    }

    if (keyboard.isKey(['e', 'E'], event)) {
      editorActions.trigger('directEditing');

      return true;
    }
  });

};