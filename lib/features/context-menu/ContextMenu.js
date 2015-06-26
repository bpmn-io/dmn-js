'use strict';

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
        { id: 'clause', content: {label: 'Input', linkClass: 'disabled', icon:'input', entries: [
          {id: 'clauseAdd', content: {label: 'add', icon:'plus', entries: [
            {id: 'clauseAddLeft', content: {label: '', icon: 'left'}},
            {id: 'clauseAddRight', content: {label: '', icon: 'right'}}
          ]}},
          {id: 'clauseRemove', content: {label: 'remove', icon: 'minus'},
            action: this.clauseRemoveAction.bind(this, context)}
        ]}},
        { id: 'rule', content: {label: 'Rule', linkClass: 'disabled', entries: [
          {id: 'ruleAdd', content: {label: 'add', icon: 'plus', entries: [
            {id: 'ruleAddAbove', content: {label: '', icon: 'above'}},
            {id: 'ruleAddBelow', content: {label: '', icon: 'below'}}
          ]}},
          {id: 'ruleRemove', content: {label: 'remove', icon: 'minus'},
            action: this.ruleRemoveAction.bind(this, context)},
          {id: 'ruleClear', content: {label: 'clear', icon: 'clear'}}
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
