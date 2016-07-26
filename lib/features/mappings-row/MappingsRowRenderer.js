'use strict';

var domClasses = require('min-dom/lib/classes');

function MappingsRowRenderer(
    eventBus,
    mappingsRow) {

  // row has class 'mappings'
  eventBus.on('row.render', function(event) {
    if (event.data === mappingsRow.getRow()) {
      domClasses(event.gfx).add('mappings');
    }
  });

  eventBus.on('cell.render', function(event) {
    // input cell contains the expression or the expression language for scripts
    if (event.data.row === mappingsRow.getRow() && event.data.content &&
        event.data.column.businessObject.inputExpression) {
      if (event.data.content.expressionLanguage) {
        event.gfx.childNodes[0].textContent = event.data.content.expressionLanguage || '';
      } else {
        event.gfx.childNodes[0].textContent = event.data.content.text || '';
      }
    // output cell contains variable name
    } else if (event.data.row === mappingsRow.getRow() && event.data.content) {
      event.gfx.childNodes[0].textContent = event.data.content.name || '';
    }
  });

}

MappingsRowRenderer.$inject = [
  'eventBus',
  'mappingsRow'
];

module.exports = MappingsRowRenderer;
