'use strict';

var getEntriesType = require('../../util/SelectionUtil').getEntriesType;

function ContextMenu(popupMenu, eventBus, modeling, elementRegistry, editorActions, selection) {

  this._popupMenu = popupMenu;
  this._eventBus = eventBus;
  this._modeling = modeling;
  this._elementRegistry = elementRegistry;
  this._editorActions = editorActions;

  var self = this;

  eventBus.on('element.contextmenu', function(evt) {
    // Do not open context menu on table footer
    if(!evt.element.row.isFoot) {
      evt.preventDefault();
      evt.gfx.firstChild.focus();
      self.open(evt.originalEvent.pageX, evt.originalEvent.pageY, evt.element);
    }
  });

  var preventFunction = function(evt) {
    evt.preventDefault();
  };
  eventBus.on('popupmenu.open', function(evt) {
    evt.container.addEventListener('contextmenu', preventFunction);
  });

  eventBus.on('popupmenu.close', function(evt) {
    evt.container.removeEventListener('contextmenu', preventFunction);
  });


  document.addEventListener('click', function(evt) {
    self.close();
  });

}

ContextMenu.$inject = [ 'popupMenu', 'eventBus', 'modeling', 'elementRegistry', 'editorActions' ];

module.exports = ContextMenu;

ContextMenu.prototype.getRuleActions = function(context) {
  return { id: 'rule', content: {label: 'Rule', linkClass: 'disabled', entries: [
          {id: 'ruleAdd', action: this.ruleAddAction.bind(this),
           content: {label: 'add', icon: 'plus', entries: [
            {id: 'ruleAddAbove', content: {label: '', icon: 'above'},
            action: this.ruleAddAction.bind(this, 'above')},
            {id: 'ruleAddBelow', content: {label: '', icon: 'below'},
            action: this.ruleAddAction.bind(this, 'below')}
          ]}},
          {id: 'ruleRemove', content: {label: 'remove', icon: 'minus'},
            action: this.ruleRemoveAction.bind(this)},
          {id: 'ruleClear', content: {label: 'clear', icon: 'clear'},
            action: this.ruleClearAction.bind(this)}
        ]}};
};

var isLastColumn = function(column) {
  var type = column.businessObject.$type;

  // return false when the previous or the next column is of the same type
  return !(column.next.businessObject     && column.next.businessObject.$type === type ||
           column.previous.businessObject && column.previous.businessObject.$type === type);
},
noop = function(){};


ContextMenu.prototype.getInputActions = function(context) {
  var lastColumn = isLastColumn(context.column);
  return { id: 'clause', content: {label: 'Input', linkClass: 'disabled', icon:'input', entries: [
          {id: 'clauseAdd', action: this.clauseAddInput.bind(this),
           content: {label: 'add', icon:'plus', entries: [
            {id: 'clauseAddLeft', content: {label: '', icon: 'left'},
            action: this.clauseAddAction.bind(this, 'left')},
            {id: 'clauseAddRight', content: {label: '', icon: 'right'},
            action: this.clauseAddAction.bind(this, 'right')}
          ]}},
          {id: 'clauseRemove', content: {label: 'remove', icon: 'minus', linkClass: lastColumn ? 'disabled' : ''},
            action: lastColumn ? noop : this.clauseRemoveAction.bind(this)}
        ]}};
};

ContextMenu.prototype.getOutputActions = function(context) {
  var lastColumn = isLastColumn(context.column);
  return { id: 'clause', content: {label: 'Output', linkClass: 'disabled', icon:'output', entries: [
          {id: 'clauseAdd', action: this.clauseAddOutput.bind(this),
           content: {label: 'add', icon:'plus', entries: [
            {id: 'clauseAddLeft', content: {label: '', icon: 'left'},
            action: this.clauseAddAction.bind(this, 'left')},
            {id: 'clauseAddRight', content: {label: '', icon: 'right'},
            action: this.clauseAddAction.bind(this, 'right')}
          ]}},
          {id: 'clauseRemove', content: {label: 'remove', icon: 'minus', linkClass: lastColumn ? 'disabled' : ''},
            action: lastColumn ? noop : this.clauseRemoveAction.bind(this)}
        ]}};
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
  return out;
};

ContextMenu.prototype.open = function(x, y, context) {
  var actions = this.getActions(context);

  if(actions.length > 0) {
    this._popupMenu.open({
      position: { x: x, y: y },
      entries: actions
    });
  }
};

ContextMenu.prototype.close = function() {
  this._popupMenu.close();
};

ContextMenu.prototype.clauseRemoveAction = function() {
  this._editorActions.trigger('clauseRemove');

  this.close();
};

ContextMenu.prototype.clauseAddInput = function() {
  this._editorActions.trigger('clauseAdd', 'input');

  this.close();
};

ContextMenu.prototype.clauseAddOutput = function() {
  this._editorActions.trigger('clauseAdd', 'output');

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

  } else if (position === 'below'){
    editorActions.trigger('ruleAddBelow');
  } else {
    editorActions.trigger('ruleAdd');
  }

  this.close();
};

ContextMenu.prototype.ruleClearAction = function() {
  this._editorActions.trigger('ruleClear');

  this.close();
};
