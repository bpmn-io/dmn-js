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

    var content = event.data.content;
    if (event.data.row === typeRow.getRow() && content) {
      if (content.inputExpression) {
        event.gfx.childNodes[0].textContent = content.inputExpression.typeRef || '';
      } else {
        event.gfx.childNodes[0].textContent = content.typeRef || '';
      }
    }
  });

}

TypeRowRenderer.$inject = [
  'eventBus',
  'typeRow'
];

module.exports = TypeRowRenderer;
