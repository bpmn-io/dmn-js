'use strict';

var domify = require('min-dom/lib/domify');

var hasSecondaryModifier = require('diagram-js/lib/util/Mouse').hasSecondaryModifier;

var OFFSET_X = 2,
    OFFSET_Y = 2;


function Descriptions(eventBus, elementRegistry, sheet) {
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._sheet = sheet;

  var self = this;

  document.body.addEventListener('click', function(evt) {
    self.closePopover();
  });

  document.body.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 13 && self.openedPopover && !hasSecondaryModifier(evt)) {
      self.closePopover();
    }
  });

  eventBus.on('cell.render', function(event) {
    var data = event.data,
        gfx = event.gfx,
        indicator;

    if (data.content && data.content.description) {
      if (!gfx.querySelector('.description-indicator')) {
        indicator = domify('<div class="description-indicator"></div>');

        indicator.addEventListener('click', function(evt) {
          evt.stopPropagation();

          self.openPopover(data);
        });

        gfx.appendChild(indicator);
      }
    } else {
      indicator = gfx.querySelector('.description-indicator');
      if (indicator) {
        indicator.parentNode.removeChild(indicator);
      }
    }
  });
}

Descriptions.$inject = [ 'eventBus', 'elementRegistry', 'sheet' ];

module.exports = Descriptions;

Descriptions.prototype.closePopover = function() {
  var eventBus = this._eventBus;

  if (this.openedPopover) {
    this.openedPopover.parentNode.removeChild(this.openedPopover);
    this.openedPopover = null;

    eventBus.fire('description.popover.closed');
  }
};

Descriptions.prototype.openPopover = function(context) {
  var sheet = this._sheet,
      eventBus = this._eventBus,
      elementRegistry = this._elementRegistry;

  var container = sheet.getContainer(),
      gfx = elementRegistry.getGraphics(context),
      node = domify('<textarea class="descriptions-textarea"></textarea>');

  this.closePopover();

  eventBus.fire('description.popover.open', context);

  node.style.position = 'absolute';
  node.style.top = gfx.offsetTop + OFFSET_Y + 'px';
  node.style.left = gfx.offsetLeft + gfx.clientWidth + OFFSET_X + 'px';
  node.style.width = '200px';
  node.style.height = '80px';

  // setting textarea to disabled. Editing module will remove disabled attribute
  node.setAttribute('disabled', 'disabled');

  node.addEventListener('click', function(evt) {
    evt.stopPropagation();
  });

  container.appendChild(node);

  this.openedPopover = node;

  eventBus.fire('description.popover.opened', node, context);

  node.focus();

  node.textContent = context.content.description;
};
