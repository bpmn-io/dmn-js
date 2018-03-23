import {
  closest as domClosest
} from 'min-dom';


const CloseBehavior = {

  closeContextMenu() {
    this.contextMenu.close();
  },

  handleKey(event) {

    var key = event.which;

    var hasModifier = event.ctrlKey || event.metaKey;

    // ESC || ENTER
    if (key === 27 || key === 13) {
      if (!hasModifier) {
        event.stopPropagation();
        event.preventDefault();

        this.closeContextMenu();
      }
    }
  },

  handleFocusOut(event) {

    var newTarget = event.relatedTarget;

    var menu = newTarget && domClosest(newTarget, '.context-menu-container');

    if (!menu) {
      this.closeContextMenu();
    }
  },

  getCloseProps() {

    // TODO(nikku): to be discussed whether we should
    // close on focusOut, too:

    // onFocusOut: this.handleFocusOut
    return {
      onKeydown: this.handleKey
    };
  }

};

CloseBehavior.$inject = [ 'contextMenu' ];

export default CloseBehavior;