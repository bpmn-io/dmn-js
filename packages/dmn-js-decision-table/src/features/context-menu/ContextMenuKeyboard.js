import { query, queryAll, classes } from 'min-dom';

/**
 * Context menu keyboard navigation.
 */
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
      this.clickCurrentEntry();
    }
  };

  /**
   * When mouse moves over the context menu, it takes over navigation from keyboard.
   */
  handleMouseOver = () => {
    const entries = this.getEntries();
    entries.forEach(entry => resetHoverStyle(entry));

    const { focused } = this.getActiveEntries(document);
    focused && classes(focused).remove('focused');
  };

  /**
   * Get all context menu entries that aren't disabled.
   * @returns {HTMLElement[]}
   */
  getEntries = () => {
    return Array.from(
      queryAll('.context-menu-group-entry')
    ).filter(entry => !classes(entry).has('disabled'));
  };

  /**
   * Get hovered with mouse, focused with keyboard
   * and currently active context menu entries.
   * @param {HTMLElement} container - Context menu container.
   * @returns {Object}
   */
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

  /**
   * Move focus to the next or previous menu entry.
   * @param {HTMLElement} menu - Context menu container.
   * @param {Number} direction - 1 for moving down, -1 for moving up.
   */
  move = (menu, direction) => {
    const entries = this.getEntries();
    const { current, hover } = this.getActiveEntries(menu);

    if (!current) {
      const next = entries[0];
      classes(next).add('focused');
      return;
    }

    const index = entries.indexOf(current) + direction;
    let next = entries[index];

    if (index < 0) {
      next = entries[entries.length - 1];
    }

    if (index >= entries.length) {
      next = entries[0];
    }

    hover && disableHoverStyle(hover);
    classes(current).remove('focused');
    classes(next).add('focused');

    // If mouse is currently over the entry that we are moving to...
    next.style.removeProperty('background-color');
  };

  clickCurrentEntry = () => {
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