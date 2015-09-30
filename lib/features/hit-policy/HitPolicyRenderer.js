'use strict';

function HitPolicyRenderer(
    eventBus,
    hitPolicy) {

  eventBus.on('cell.render', function(event) {
    if (event.data === hitPolicy.getCell()) {
      event.gfx.childNodes[0].textContent = hitPolicy.getHitPolicy().charAt(0);
    }
  });

}

HitPolicyRenderer.$inject = [
  'eventBus',
  'hitPolicy'
];

module.exports = HitPolicyRenderer;
