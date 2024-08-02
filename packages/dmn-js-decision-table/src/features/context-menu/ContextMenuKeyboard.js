import { query, classes } from 'min-dom';

export default class ContextMenuKeyboard {

  DIRECTION_UP = -1;
  DIRECTION_DOWN = 1;

  constructor(eventBus) {
    eventBus.on('contextMenu.open', () => {
      document.addEventListener('keydown', this.handleKeyEvent);
      document.addEventListener('mouseover', this.handleMouseOver);
    });

    eventBus.on('contextMenu.close', () => {
      document.removeEventListener('keydown', this.handleKeyEvent);
      document.removeEventListener('mouseover', this.handleMouseOver);
    });
  }

  handleKeyEvent = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.move(event.target, this.DIRECTION_UP);

    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.move(event.target, this.DIRECTION_DOWN);
    }

    else if (event.key === 'Enter') {
      event.preventDefault();
      this.open();
    }
  };

  handleMouseOver = () => {
    const entries = this.getEntries();
    entries.forEach(entry => addHoverStyle(entry));

    const focused = query('.context-menu-group-entry.focused', document);
    if (!focused) return;
    classes(focused).remove('focused');
  };

  getEntries = () => {
    return Array.from(
      document.getElementsByClassName('context-menu-group-entry')
    ).filter(entry => !classes(entry).has('disabled'));
  };

  getActiveEntries = (container) => {
    const hover = query('.context-menu-group-entry:hover', container);
    const focused = query('.context-menu-group-entry.focused', container);
    const current = focused || hover;

    return {
      hover,
      focused,
      current
    };
  };

  move = (menu, direction) => {
    const entries = this.getEntries();
    const { current, hover } = this.getActiveEntries(menu);

    if (hover) {
      removeHoverStyle(hover);
    }

    if (!current) {
      const next = entries[0];
      classes(next).add('focused');
      return;
    }

    const index = entries.indexOf(current);
    const newIndex = index + direction;
    if (newIndex >= entries.length || newIndex < 0) return;

    const next = entries[newIndex];
    classes(current).remove('focused');
    classes(next).add('focused');

    // If mouse is currently over the entry that we are moving to...
    next.style.removeProperty('background-color');
  };

  open = () => {
    const { current } = this.getActiveEntries(document);

    if (!current) return;
    current.click();
  };
}

ContextMenuKeyboard.$inject = [ 'eventBus' ];

// Helper functions
function removeHoverStyle(element) {
  element.style.pointerEvents = 'none';
  element.style.backgroundColor = 'transparent';
}

function addHoverStyle(element) {
  element.style.removeProperty('background-color');
  element.style.removeProperty('pointer-events');
}