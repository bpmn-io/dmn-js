'use strict';

function convertOperators(operator) {
  switch(operator) {
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
      event.gfx.childNodes[0].textContent = hitPolicy.getHitPolicy().charAt(0) + convertOperators(hitPolicy.getAggregation());
    }
  });

}

HitPolicyRenderer.$inject = [
  'eventBus',
  'hitPolicy'
];

module.exports = HitPolicyRenderer;
