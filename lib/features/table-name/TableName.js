'use strict';

var domify = require('min-dom/lib/domify');

var inherits = require('inherits');

var BaseModule = require('table-js/lib/features/table-name/TableName');
/**
 * Adds a header to the table containing the table name
 *
 * @param {EventBus} eventBus
 */
function TableName(eventBus, sheet, tableName) {

  BaseModule.call(this, eventBus, sheet, tableName);

  this.semantic = null;
}

inherits(TableName, BaseModule);

TableName.$inject = [ 'eventBus', 'sheet', 'config.tableName' ];

module.exports = TableName;

TableName.prototype.setSemantic = function(semantic) {
  this.semantic = semantic;
  this.setName(semantic.name);
};

TableName.prototype.setName = function(newName) {
  this.semantic.name = newName;
  this.node.querySelector('h3').textContent = newName;
};

TableName.prototype.getName = function() {
  return this.semantic.name;
};
