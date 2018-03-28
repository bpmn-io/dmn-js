/**
 * DRD specific key bindings.
 *
 * @param {Keyboard} keyboard
 * @param {EditorActions} editorActions
 */
export default function DrdKeyBindings(keyboard, editorActions) {

  keyboard.addListener(function(key, modifiers) {

    // ctrl + a -> select all elements
    if (key === 65 && keyboard.isCmd(modifiers)) {
      editorActions.trigger('selectElements');

      return true;
    }

    if (keyboard.hasModifier(modifiers)) {
      return;
    }

    // l -> activate lasso tool
    if (key === 76) {
      editorActions.trigger('lassoTool');

      return true;
    }

    // e -> activate direct editing
    if (key === 69) {
      editorActions.trigger('directEditing');

      return true;
    }
  });
}

DrdKeyBindings.$inject = [
  'keyboard',
  'editorActions'
];