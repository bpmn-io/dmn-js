'use strict';

var domClasses = require('min-dom/lib/classes');

function MappingsRowRenderer(
    eventBus,
    mappingsRow) {

  eventBus.on('row.render', function(event) {
    if (event.data === mappingsRow.getRow()) {
      domClasses(event.gfx).add('mappings');
    }
  });

  eventBus.on('cell.render', function(event) {
    if (event.data.row === mappingsRow.getRow() && event.data.content &&
        event.data.column.businessObject.inputExpression) {
      event.gfx.childNodes[0].textContent = event.data.content.text;
    } else if (event.data.row === mappingsRow.getRow() && event.data.content) {
      event.gfx.childNodes[0].textContent = event.data.content.output;
    }
  });

}

MappingsRowRenderer.$inject = [
  'eventBus',
  'mappingsRow'
];

module.exports = MappingsRowRenderer;
