import {
  isUndo,
  isRedo
} from 'diagram-js/lib/features/keyboard/KeyboardUtil';

export class KeyboardBindings {
  static $inject = [ 'editorActions', 'keyboard' ];

  constructor(editorActions, keyboard) {
    this.registerBindings(keyboard, editorActions);
  }

  /**
   * Register available keyboard bindings.
   *
   * @param {Keyboard} keyboard
   * @param {EditorActions} editorActions
   */
  registerBindings(keyboard, editorActions) {


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

    // undo
    // (CTRL|CMD) + Z
    addListener('undo', function(context) {

      const event = context.keyEvent;

      if (isUndo(event)) {
        editorActions.trigger('undo');

        return true;
      }
    });

    // redo
    // CTRL + Y
    // CMD + SHIFT + Z
    addListener('redo', function(context) {

      const event = context.keyEvent;

      if (isRedo(event)) {
        editorActions.trigger('redo');

        return true;
      }
    });
  }
}


