'use strict';

function ContextMenu(popupMenu, eventBus) {
  this._popupMenu = popupMenu;
  this._eventBus = eventBus;

  var self = this;

  eventBus.on('element.contextmenu', function(evt) {
    evt.preventDefault();
    self.open(evt.originalEvent.clientX, evt.originalEvent.clientY, event.element);
  });

  eventBus.on(['element.click'], function() {
    self.close();
  });

}

ContextMenu.$inject = [ 'popupMenu', 'eventBus' ];

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
          {id: 'clauseRemove', content: {label: 'remove', icon: 'minus'}, action: function() {
            console.log('yay, action', arguments);
          }}
        ]}},
        { id: 'rule', content: {label: 'Rule', linkClass: 'disabled', entries: [
          {id: 'ruleAdd', content: {label: 'add', icon: 'plus', entries: [
            {id: 'ruleAddAbove', content: {label: '', icon: 'above'}},
            {id: 'ruleAddBelow', content: {label: '', icon: 'below'}}
          ]}},
          {id: 'ruleRemove', content: {label: 'remove', icon: 'minus'}},
          {id: 'ruleClear', content: {label: 'clear', icon: 'clear'}}
        ]}}
      ]
    }
  );
};

ContextMenu.prototype.close = function() {
  this._popupMenu.close();
};
