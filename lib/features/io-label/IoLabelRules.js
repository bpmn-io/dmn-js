'use strict';

var inherits = require('inherits');

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

/**
 * LineNumber specific modeling rule
 */
function IoLabelRules(eventBus, ioLabel) {
  RuleProvider.call(this, eventBus);

  this._ioLabel = ioLabel;
}

inherits(IoLabelRules, RuleProvider);

IoLabelRules.$inject = [ 'eventBus', 'ioLabel' ];

module.exports = IoLabelRules;

IoLabelRules.prototype.init = function() {
  var self = this;
  this.addRule('cell.edit', function(context) {
    if (context.row === self._ioLabel.row) {
      return false;
    }
  });

};
