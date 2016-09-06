'use strict';

var getEntriesType = require('../../util/SelectionUtil').getEntriesType;

function ContextMenu(popupMenu, eventBus, modeling, elementRegistry, editorActions, selection, sheet) {

  this._popupMenu = popupMenu;
  this._eventBus = eventBus;
  this._modeling = modeling;
  this._elementRegistry = elementRegistry;
  this._editorActions = editorActions;
  this._selection = selection;
  this._sheet = sheet;

  var self = this;

  eventBus.on('element.contextmenu', function(evt) {
    var element = evt.element,
        originalEvent = evt.originalEvent;

    // Do not open context menu on table footer
    if (!element.row.isFoot && (element.column.id !== 'utilityColumn')) {
      evt.preventDefault();
      evt.gfx.firstChild.focus();

      self.open(originalEvent.pageX,
                originalEvent.pageY, element);
    }
  });

  var preventFunction = function(evt) {
    evt.preventDefault();
  };
  eventBus.on('popupmenu.open', function(evt) {
    evt.container.addEventListener('contextmenu', preventFunction);
    selection.freeze();
  });

  eventBus.on('popupmenu.close', function(evt) {
    evt.container.removeEventListener('contextmenu', preventFunction);
    selection.unfreeze();
  });


  document.addEventListener('click', function(evt) {
    if (!evt.customHandler) {
      self.close();
    }
  });

}

ContextMenu.$inject = [ 'popupMenu', 'eventBus', 'modeling', 'elementRegistry', 'editorActions', 'selection', 'sheet' ];

module.exports = ContextMenu;

ContextMenu.prototype.getRuleActions = function(context) {
  return { id: 'rule', content: { label: 'Rule', linkClass: 'disabled', entries: [
          { id: 'ruleAdd', action: this.ruleAddAction.bind(this),
           content: { label: 'add', icon: 'plus', entries: [
            { id: 'ruleAddAbove', content: { label: '', icon: 'above' },
            action: this.ruleAddAction.bind(this, 'above') },
            { id: 'ruleAddBelow', content: { label: '', icon: 'below' },
            action: this.ruleAddAction.bind(this, 'below') }
           ] } },
          { id: 'ruleCopy', action: this.ruleCopyAction.bind(this),
           content: { label: 'copy', icon: 'plus', entries: [
            { id: 'ruleCopyAbove', content: { label: '', icon: 'above' },
            action: this.ruleCopyAction.bind(this, 'above') },
            { id: 'ruleCopyBelow', content: { label: '', icon: 'below' },
            action: this.ruleCopyAction.bind(this, 'below') }
           ] } },
          { id: 'ruleRemove', content: { label: 'remove', icon: 'minus' },
            action: this.ruleRemoveAction.bind(this) },
          { id: 'ruleClear', content: { label: 'clear', icon: 'clear' },
            action: this.ruleClearAction.bind(this) }
  ] } };
};

var isLastColumn = function(column) {
      var type = column.businessObject.$type;

  // return false when the previous or the next column is of the same type
      return !(column.next.businessObject     && column.next.businessObject.$type === type ||
           column.previous.businessObject && column.previous.businessObject.$type === type);
    },
    noop = function() {};


ContextMenu.prototype.getInputActions = function(context) {
  var lastColumn = isLastColumn(context.column);
  return { id: 'clause', content: { label: 'Input', linkClass: 'disabled', icon:'input', entries: [
          { id: 'clauseAdd', action: this.clauseAddInput.bind(this),
           content: { label: 'add', icon:'plus', entries: [
            { id: 'clauseAddLeft', content: { label: '', icon: 'left' },
            action: this.clauseAddAction.bind(this, 'left') },
            { id: 'clauseAddRight', content: { label: '', icon: 'right' },
            action: this.clauseAddAction.bind(this, 'right') }
           ] } },
          { id: 'clauseRemove', content: { label: 'remove', icon: 'minus', linkClass: lastColumn ? 'disabled' : '' },
            action: lastColumn ? noop : this.clauseRemoveAction.bind(this) }
  ] } };
};

ContextMenu.prototype.getOutputActions = function(context) {
  var lastColumn = isLastColumn(context.column);
  return { id: 'clause', content: { label: 'Output', linkClass: 'disabled', icon:'output', entries: [
          { id: 'clauseAdd', action: this.clauseAddOutput.bind(this),
           content: { label: 'add', icon:'plus', entries: [
            { id: 'clauseAddLeft', content: { label: '', icon: 'left' },
            action: this.clauseAddAction.bind(this, 'left') },
            { id: 'clauseAddRight', content: { label: '', icon: 'right' },
            action: this.clauseAddAction.bind(this, 'right') }
           ] } },
          { id: 'clauseRemove', content: { label: 'remove', icon: 'minus', linkClass: lastColumn ? 'disabled' : '' },
            action: lastColumn ? noop : this.clauseRemoveAction.bind(this) }
  ] } };
};

ContextMenu.prototype.getActions = function(context) {
  var activeEntriesType = getEntriesType(context),
      out = [];

  if (activeEntriesType.rule) {
    out.push(this.getRuleActions(context));
  }

  if (activeEntriesType.input) {
    out.push(this.getInputActions(context));
  }

  if (activeEntriesType.output) {
    out.push(this.getOutputActions(context));
  }

  var cellActions = [];
  this._eventBus.fire('popupmenu.cellActions', cellActions, context);
  out = out.concat(cellActions);

  return out;
};

ContextMenu.prototype.open = function(x, y, context) {
  var selection = this._selection,
      popupMenu = this._popupMenu;

  var actions = this.getActions(context);

  selection.select(context);

  if (actions.length > 0) {
    popupMenu.open({
      position: { x: x, y: y },
      entries: actions
    });
  }
};

ContextMenu.prototype.close = function() {
  var popupMenu = this._popupMenu;

  popupMenu.close();
};

ContextMenu.prototype.clauseRemoveAction = function() {
  var editorActions = this._editorActions;

  editorActions.trigger('clauseRemove');

  this.close();
};

ContextMenu.prototype.clauseAddInput = function() {
  var editorActions = this._editorActions;

  editorActions.trigger('clauseAdd', 'input');

  this.close();
};

ContextMenu.prototype.clauseAddOutput = function() {
  var editorActions = this._editorActions;

  editorActions.trigger('clauseAdd', 'output');

  this.close();
};

ContextMenu.prototype.clauseAddAction = function(position) {
  var editorActions = this._editorActions;

  if (position === 'left') {
    editorActions.trigger('clauseAddLeft');

  } else if (position === 'right') {
    editorActions.trigger('clauseAddRight');
  }

  this.close();
};

ContextMenu.prototype.ruleRemoveAction = function() {
  this._editorActions.trigger('ruleRemove');

  this.close();
};

ContextMenu.prototype.ruleAddAction = function(position) {
  var editorActions = this._editorActions;

  if (position === 'above') {
    editorActions.trigger('ruleAddAbove');

  } else if (position === 'below') {
    editorActions.trigger('ruleAddBelow');
  } else {
    editorActions.trigger('ruleAdd');
  }

  this.close();
};

ContextMenu.prototype.ruleCopyAction = function(position) {
  var editorActions = this._editorActions;

  if (position === 'above') {
    editorActions.trigger('ruleCopyAbove');
  } else if (position === 'below') {
    editorActions.trigger('ruleCopyBelow');
  } else {
    editorActions.trigger('ruleCopy');
  }

  this.close();
};

ContextMenu.prototype.ruleClearAction = function() {
  this._editorActions.trigger('ruleClear');

  this.close();
};
