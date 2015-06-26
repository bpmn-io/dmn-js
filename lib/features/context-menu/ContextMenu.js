'use strict';

var ids = new (require('diagram-js/lib/util/IdGenerator'))('table');

function ContextMenu(popupMenu, eventBus, modeling) {
  this._popupMenu = popupMenu;
  this._eventBus = eventBus;
  this._modeling = modeling

  var self = this;

  eventBus.on('element.contextmenu', function(evt) {
    evt.preventDefault();
    self.open(evt.originalEvent.clientX, evt.originalEvent.clientY, evt.element);
  });

  eventBus.on(['element.click', 'selection.changed'], function() {
    self.close();
  });

}

ContextMenu.$inject = [ 'popupMenu', 'eventBus', 'modeling' ];

module.exports = ContextMenu;

ContextMenu.prototype.open = function(x, y, context) {
  this._popupMenu.open(
    {
      position: { x: x, y: y },
      entries: [
        { id: 'rule', content: {label: 'Rule', linkClass: 'disabled', entries: [
          {id: 'ruleAdd', action: this.ruleAddAction.bind(this, context),
           content: {label: 'add', icon: 'plus', entries: [
            {id: 'ruleAddAbove', content: {label: '', icon: 'above'},
            action: this.ruleAddAction.bind(this, context, 'above')},
            {id: 'ruleAddBelow', content: {label: '', icon: 'below'},
            action: this.ruleAddAction.bind(this, context, 'below')}
          ]}},
          {id: 'ruleRemove', content: {label: 'remove', icon: 'minus'},
            action: this.ruleRemoveAction.bind(this, context)},
          {id: 'ruleClear', content: {label: 'clear', icon: 'clear'}}
        ]}},
        { id: 'clause', content: {label: 'Input', linkClass: 'disabled', icon:'input', entries: [
          {id: 'clauseAdd', content: {label: 'add', icon:'plus', entries: [
            {id: 'clauseAddLeft', content: {label: '', icon: 'left'}},
            {id: 'clauseAddRight', content: {label: '', icon: 'right'}}
          ]}},
          {id: 'clauseRemove', content: {label: 'remove', icon: 'minus'},
            action: this.clauseRemoveAction.bind(this, context)}
        ]}}
      ]
    }
  );
};

ContextMenu.prototype.close = function() {
  this._popupMenu.close();
};

ContextMenu.prototype.clauseRemoveAction = function(context) {
  this._modeling.deleteColumn(context.column);
};

ContextMenu.prototype.ruleRemoveAction = function(context) {
  this._modeling.deleteRow(context.row);
};

ContextMenu.prototype.ruleAddAction = function(context, position) {
  console.log(context, position);
  var newRow = {id: ids.next()};
  if(position === 'above') {
    newRow.next = context.row;
  } else if(position === 'below') {
    newRow.previous = context.row;
  }
  this._modeling.createRow(newRow);
  this.close();
};
