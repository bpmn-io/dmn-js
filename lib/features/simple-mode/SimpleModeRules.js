'use strict';

var inherits = require('inherits');

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

/**
 * LineNumber specific modeling rule
 */
function SimpleModeRules(eventBus, simpleMode, elementRegistry) {
  RuleProvider.call(this, eventBus);

  this._simpleMode = simpleMode;
  this._elementRegistry = elementRegistry;
}

inherits(SimpleModeRules, RuleProvider);

SimpleModeRules.$inject = [ 'eventBus', 'simpleMode', 'elementRegistry' ];

module.exports = SimpleModeRules;

SimpleModeRules.prototype.init = function() {
  var self = this;
  this.addRule('cell.edit', function(context) {
    if(self._simpleMode.isSimple() && self._simpleMode.hasComplexContent(context)) {
      return false;
    }
  });

};
