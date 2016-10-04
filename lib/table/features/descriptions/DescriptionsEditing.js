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

  eventBus.on('popupmenu.cellActions', function(evt, actions, context) {
    if (context.row.isHead) {
      return;
    }

    actions.push({
      id: 'description',
      action: function(evt) {
        evt.stopPropagation();

        contextMenu.close();

        self.addComment(context);
      },
      content: {
        label: 'Add description',
        icon:'info'
      }
    });
  });

  eventBus.on('description.popover.open', function(evt, context) {
    selection.select(context);
    selection.freeze();
  });

  eventBus.on('description.popover.closed', function(evt) {
    selection.unfreeze();
    graphicsFactory.redraw();
  });

  eventBus.on('description.popover.opened', function(evt, node, context) {
    // removing disabled attribute from textarea
    node.removeAttribute('disabled');

    node.addEventListener('input', debounce(function(evt) {
      var value = evt.target.value;

      modeling.editDescription(context.content, value.trim());
    }, DEBOUNCE_DELAY));
  });
}

DescriptionsEditing.$inject = [ 'eventBus', 'modeling', 'graphicsFactory', 'selection', 'contextMenu', 'descriptions' ];

module.exports = DescriptionsEditing;

DescriptionsEditing.prototype.addComment = function(context) {
  var descriptions = this._descriptions;

  descriptions.openPopover(context);
};
