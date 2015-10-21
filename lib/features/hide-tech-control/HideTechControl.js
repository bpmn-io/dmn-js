'use strict';

var domClasses = require('min-dom/lib/classes');
/**
 *  The controls module adds a container to the top-right corner of the table which holds
 *  some control elements
 */
function HideTechControl(eventBus, sheet, config) {

  this._sheet = sheet;
  this._eventBus = eventBus;
  this.hidden = false;

  var self = this;

  eventBus.on('controls.init', function(evt) {

    eventBus.on('controls.added', function(evt) {
      self._node = evt.node;
      if(config.hideDetails) {
        self.hide();
      }
    });

    evt.controls.addControl('Hide Details', function() {
      if(!domClasses(sheet.getContainer().parentNode).contains('hide-mappings')) {
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
  this.hidden = true;
  this._eventBus.fire('details.hidden');
};

HideTechControl.prototype.show = function() {
  if(!this._node) return;
  domClasses(this._sheet.getContainer().parentNode).remove('hide-mappings');
  this._node.textContent = 'Hide details';
  this.hidden = false;
  this._eventBus.fire('details.shown');
};

HideTechControl.prototype.isHidden = function() {
  return this.hidden;
};
