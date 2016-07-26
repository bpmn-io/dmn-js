'use strict';

function convertOperators(operator) {
  switch (operator) {
  case 'LIST': return '';
  case 'SUM': return '+';
  case 'MIN': return '<';
  case 'MAX': return '>';
  case 'COUNT': return '#';
  }
}

function HitPolicyRenderer(
    eventBus,
    hitPolicy) {

  eventBus.on('cell.render', function(event) {
    if (event.data === hitPolicy.getCell()) {
      var policy = hitPolicy.getHitPolicy(),
          aggregation = hitPolicy.getAggregation();

      event.gfx.childNodes[0].textContent = policy.charAt(0) + convertOperators(aggregation);
    }
  });

}

HitPolicyRenderer.$inject = [
  'eventBus',
  'hitPolicy'
];

module.exports = HitPolicyRenderer;
