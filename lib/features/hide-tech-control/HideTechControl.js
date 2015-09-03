'use strict';

var domClasses = require('min-dom/lib/classes');
/**
 *  The controls module adds a container to the top-right corner of the table which holds
 *  some control elements
 */
function HideTechControl(eventBus, sheet) {

  eventBus.on('controls.init', function(evt) {

    var node;

    eventBus.on('controls.added', function(evt) {
      node = evt.node;
    });

    evt.controls.addControl('Hide mappings', function() {
      if(!domClasses(sheet.getContainer().parentNode).list.contains('hide-mappings')) {
        domClasses(sheet.getContainer().parentNode).add('hide-mappings');
        node.textContent = 'Show mappings';
      } else {
        domClasses(sheet.getContainer().parentNode).remove('hide-mappings');
        node.textContent = 'Hide mappings';
      }
    });

  });

}

HideTechControl.$inject = [ 'eventBus', 'sheet' ];

module.exports = HideTechControl;
