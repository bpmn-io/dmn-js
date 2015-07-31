'use strict';

var domify = require('min-dom/lib/domify');

var inherits = require('inherits');

var BaseModule = require('table-js/lib/features/table-name/TableName');
/**
 * Adds a header to the table containing the table name
 *
 * @param {EventBus} eventBus
 */
function TableName(eventBus, sheet, tableName, rules, modeling) {

  BaseModule.call(this, eventBus, sheet, tableName);

  this.node = domify('<header><h3>'+this.tableName+'</h3><div class="table-id"></div></header');

  var self = this;

  eventBus.on('tableName.init', function(event) {
    if(rules.allowed('name.edit')) {
      self.node.querySelector('.table-id').setAttribute('contenteditable', true);

      self.node.querySelector('.table-id').addEventListener('blur', function(evt) {
        var newId = evt.target.textContent;
        if(newId !== self.getId()) {
          modeling.editId(newId);
        }
      }, true);
    }
  });

  this.semantic = null;
}

inherits(TableName, BaseModule);

TableName.$inject = [ 'eventBus', 'sheet', 'config.tableName', 'rules', 'modeling' ];

module.exports = TableName;

TableName.prototype.setSemantic = function(semantic) {
  this.semantic = semantic;
  this.setName(semantic.name);
  this.setId(semantic.id);
};

TableName.prototype.setName = function(newName) {
  this.semantic.name = newName;
  this.node.querySelector('h3').textContent = newName;
};

TableName.prototype.getName = function() {
  return this.semantic.name;
};

TableName.prototype.setId = function(newId) {
  this.semantic.id = newId;
  this.node.querySelector('div').textContent = newId;
};

TableName.prototype.getId = function() {
  return this.semantic.id;
};
