'use strict';

var inherits = require('inherits');

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

/**
 * DRD specific modeling rule
 */
function DrdRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(DrdRules, RuleProvider);

DrdRules.$inject = [ 'eventBus' ];

module.exports = DrdRules;
