'use strict';

function IoLabelRenderer(
    eventBus,
    ioLabel) {

  eventBus.on('cell.render', function(event) {
    if (event.data.row === ioLabel.getRow() &&
        event.data.content &&
        !event.gfx.childNodes[0].firstChild) {
      event.gfx.childNodes[0].appendChild(event.data.content);
    }
  });

}

IoLabelRenderer.$inject = [
  'eventBus',
  'ioLabel'
];

module.exports = IoLabelRenderer;
