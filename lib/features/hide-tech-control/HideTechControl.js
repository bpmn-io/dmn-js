'use strict';

var domClasses = require('min-dom/lib/classes');
/**
 *  The controls module adds a container to the top-right corner of the table which holds
 *  some control elements
 */
function HideTechControl(eventBus, sheet, config) {

  this._sheet = sheet;

  var self = this;

  eventBus.on('controls.init', function(evt) {

    eventBus.on('controls.added', function(evt) {
      self._node = evt.node;
      if(config.hideDetails) {
        self.hide();
      }
    });

    evt.controls.addControl('Hide Details', function() {
      if(!domClasses(sheet.getContainer().parentNode).list.contains('hide-mappings')) {
        self.hide();
      } else {
        self.show();
      }
    });

  });

}

HideTechControl.$inject = [ 'eventBus', 'sheet', 'config' ];

module.exports = HideTechControl;

HideTechControl.prototype.hide = function() {
  if(!this._node) return;
  domClasses(this._sheet.getContainer().parentNode).add('hide-mappings');
  this._node.textContent = 'Show details';
};

HideTechControl.prototype.show = function() {
  if(!this._node) return;
  domClasses(this._sheet.getContainer().parentNode).remove('hide-mappings');
  this._node.textContent = 'Hide details';
};
