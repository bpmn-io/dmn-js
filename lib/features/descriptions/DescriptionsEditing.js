'use strict';

var debounce = require('lodash/function/debounce');
var DEBOUNCE_DELAY = 300;

function DescriptionsEditing(eventBus, modeling, graphicsFactory, selection, contextMenu, descriptions) {
  this._eventBus = eventBus;
  this._graphicsFactory = graphicsFactory;
  this._contextMenu = contextMenu;
  this._descriptions = descriptions;
  this._selection = selection;
  this._modeling = modeling;

  var self = this;
  this._eventBus.on('popupmenu.cellActions', function(evt, actions, context) {

    if (context.row.isHead) {
      return;
    }

    actions.push({
      id: 'description',
      action: function(evt) {
        evt.stopPropagation();
        self._contextMenu.close();
        self.addComment(context);
      },
      content: {
        label: 'Add description',
        icon:'info'
      }
    });
  });

  this._eventBus.on('description.popover.open', function(evt, context) {
    self._selection.select(context);
    self._selection.freeze();
  });

  this._eventBus.on('description.popover.closed', function(evt) {
    self._selection.unfreeze();
    self._graphicsFactory.redraw();
  });

  this._eventBus.on('description.popover.opened', function(evt, node, context) {
    // removing disabled attribute from textarea
    node.removeAttribute('disabled');


    node.addEventListener('input', debounce(function(evt) {
      self._modeling.editDescription(context.content, evt.target.value);
    }, DEBOUNCE_DELAY));
  });
}

DescriptionsEditing.$inject = [ 'eventBus', 'modeling', 'graphicsFactory', 'selection', 'contextMenu', 'descriptions' ];

module.exports = DescriptionsEditing;

DescriptionsEditing.prototype.addComment = function(context) {
  // add the indicator
  if (!context.content.description) {
    context.content.description = 'description';
    this._graphicsFactory.redraw();
    context.content.description = '';
  }
  this._descriptions.openPopover(context);
};
