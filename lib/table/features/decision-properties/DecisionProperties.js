'use strict';

var domify = require('min-dom/lib/domify');

var inherits = require('inherits');

var BaseModule = require('table-js/lib/features/table-name/TableName');

/**
 * View and edit decision properties.
 * Extends TableName by adding a table ID.
 *
 * @param {EventBus} eventBus
 */
function DecisionProperties(eventBus, sheet, tableName) {

  BaseModule.call(this, eventBus, sheet, tableName);

  this.node = domify(
    '<header><h3>' +
    this.tableName +
    '</h3><div class="tjs-table-id mappings"></div></header'
  );

  var self = this;

  eventBus.on('tableName.allowEdit', function(event) {
    if (event.editAllowed) {
      self.node.querySelector('.tjs-table-id').setAttribute('contenteditable', true);

      self.node.querySelector('.tjs-table-id').addEventListener('blur', function(evt) {
        var newId = evt.target.textContent;
        if (newId !== self.getId()) {
          eventBus.fire('tableName.editId', {
            newId: newId
          });
        }
      }, true);
    }
  });

  this.semantic = null;
}

inherits(DecisionProperties, BaseModule);

DecisionProperties.$inject = [ 'eventBus', 'sheet', 'config.tableName' ];

module.exports = DecisionProperties;

DecisionProperties.prototype.setSemantic = function(semantic) {
  this.semantic = semantic;
  this.setName(semantic.name);
  this.setId(semantic.id);
};

DecisionProperties.prototype.setName = function(newName) {
  this.semantic.name = newName;
  this.node.querySelector('h3').textContent = newName || '';
};

DecisionProperties.prototype.getName = function() {
  return this.semantic.name;
};

DecisionProperties.prototype.setId = function(newId) {
  if (newId) {
    this.semantic.id = newId;
  }
  
  this.node.querySelector('div').textContent = this.semantic.id || '';
};

DecisionProperties.prototype.getId = function() {
  return this.semantic.id;
};
