'use strict';

var domify = require('min-dom/lib/domify');

function Descriptions(eventBus, elementRegistry) {
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;

  var self = this;
  document.body.addEventListener('click', function(evt) {
    self.closePopover();
  });

  this._eventBus.on('cell.render', function(event) {
    var data = event.data,
        gfx = event.gfx,
        indicator;

    if (data.content && data.content.description) {
      if (!gfx.querySelector('.description-indicator')) {
        indicator = domify('<div class="description-indicator"></div>');
        indicator.addEventListener('click', function(evt) {
          self.openPopover(data);
          evt.stopPropagation();
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

Descriptions.$inject = [ 'eventBus', 'elementRegistry' ];

module.exports = Descriptions;

Descriptions.prototype.closePopover = function() {
  if (this.openedPopover) {
    this.openedPopover.parentNode.removeChild(this.openedPopover);
    this.openedPopover = null;

    this._eventBus.fire('description.popover.closed');
  }
};

Descriptions.prototype.openPopover = function(context) {

  this.closePopover();

  this._eventBus.fire('description.popover.open', context);

  // calculate position for popover
  var gfx = this._elementRegistry.getGraphics(context);

  // traverse the offset parent chain to find the offset sum
  var e = gfx;
  var offset = { x:0,y:0 };
  while (e)
  {
    offset.x += e.offsetLeft;
    offset.y += e.offsetTop;
    e = e.offsetParent;
  }

  // now also traverse the complete parent chain to determine the full scroll offset
  e = gfx;
  while (e && typeof e.scrollTop === 'number' && typeof e.scrollLeft === 'number')
  {
    offset.x -= e.scrollLeft;
    offset.y -= e.scrollTop;
    e = e.parentNode;
  }

  // add the global scroll offset
  offset.x += window.pageXOffset;
  offset.y += window.pageYOffset;

  var node = domify('<textarea></textarea>');
  node.style.position = 'absolute';
  node.style.top = offset.y + 'px';
  node.style.left = offset.x + gfx.clientWidth + 'px';
  node.style.width = '200px';
  node.style.height = '80px';

  // setting textarea to disabled. Editing module will remove disabled attribute
  node.setAttribute('disabled', 'disabled');

  node.addEventListener('click', function(evt) {
    evt.stopPropagation();
  });

  document.body.appendChild(node);

  this.openedPopover = node;

  this._eventBus.fire('description.popover.opened', node, context);

  node.focus();

  node.textContent = context.content.description;
};
