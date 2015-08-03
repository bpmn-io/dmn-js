'use strict';

var domClasses = require('min-dom/lib/classes');

function TypeRowRenderer(
    eventBus,
    typeRow) {

  // row has class 'mappings'
  eventBus.on('row.render', function(event) {
    if (event.data === typeRow.getRow()) {
      domClasses(event.gfx).add('values');
    }
  });

  eventBus.on('cell.render', function(event) {
    if (event.data.row === typeRow.getRow() && event.data.content) {
      event.gfx.childNodes[0].textContent = event.data.content.typeDefinition;
    }
  });

}

TypeRowRenderer.$inject = [
  'eventBus',
  'typeRow'
];

module.exports = TypeRowRenderer;
