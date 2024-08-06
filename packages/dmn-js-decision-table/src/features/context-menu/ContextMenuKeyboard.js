import { query, queryAll, classes } from 'min-dom';

export default class ContextMenuKeyboard {

  constructor(eventBus) {
    eventBus.on('contextMenu.open', () => this.addEventListeners());

    eventBus.on('contextMenu.close', () => this.removeEventListeners());
    eventBus.on('commandStack.executed', () => this.removeEventListeners());
  }

  addEventListeners = () => {
    document.addEventListener('keydown', this.handleKeyEvent);
    document.addEventListener('mouseover', this.handleMouseOver);
  };

  removeEventListeners = () => {
    document.removeEventListener('keydown', this.handleKeyEvent);
    document.removeEventListener('mouseover', this.handleMouseOver);
  };

  handleKeyEvent = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.move(event.target, -1);

    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.move(event.target, 1);
    }

    else if (event.key === 'Enter') {
      event.preventDefault();
      this.open();
    }
  };

  handleMouseOver = () => {
    const entries = this.getEntries();
    entries.forEach(entry => resetHoverStyle(entry));

    const { focused } = this.getActiveEntries(document);
    focused && classes(focused).remove('focused');
  };

  getEntries = () => {
    return Array.from(
      queryAll('.context-menu-group-entry')
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

    if (!current) {
      const next = entries[0];
      classes(next).add('focused');
      return;
    }

    const index = entries.indexOf(current) + direction;
    if (index >= entries.length || index < 0) return;

    const next = entries[index];

    hover && disableHoverStyle(hover);
    classes(current).remove('focused');
    classes(next).add('focused');

    // If mouse is currently over the entry that we are moving to...
    next.style.removeProperty('background-color');
  };

  open = () => {
    const { current } = this.getActiveEntries(document);
    if (current) current.click();
  };
}

ContextMenuKeyboard.$inject = [ 'eventBus' ];


// Helper functions
function disableHoverStyle(element) {
  element.style.setProperty('pointer-events', 'none');
  element.style.setProperty('background-color', 'transparent');
}

function resetHoverStyle(element) {
  element.style.removeProperty('background-color');
  element.style.removeProperty('pointer-events');
}