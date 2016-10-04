'use strict';

require('../TestHelper');

/* global bootstrapModeler, inject */

var simpleXML = require('../../../fixtures/dmn/simple.dmn');

var ElementUtils = require('../util/ElementUtils'),
    dragElement = require('../util/EventUtils').dragElement,
    getBounds = ElementUtils.getBounds;


describe('integration/row-drag', function() {

  beforeEach(bootstrapModeler(simpleXML));

  it('should move row to a new place',
    inject(function(elementRegistry) {
      // given
      var rule1 = elementRegistry.getGraphics('cell_utilityColumn_rule1'),
          rule4 = elementRegistry.getGraphics('cell_utilityColumn_rule4'),
          rule4Bounds = getBounds(rule4),
          rule3;

      // when
      dragElement(rule1, rule4, { clientX: rule4Bounds.left, clientY: rule4Bounds.top });

      rule1 = elementRegistry.get('cell_utilityColumn_rule1');
      rule3 = elementRegistry.get('cell_utilityColumn_rule3');

      // then
      expect(rule1.row.previous).to.eql(rule3.row);
    }));

});
