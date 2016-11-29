'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var drdRulesModule = require('../../../../lib/features/rules'),
    coreModule = require('../../../../lib/core');


describe('features/rules', function() {

  var diagramXML = require('../../../fixtures/dmn/connections.dmn');

  var testModules = [ coreModule, drdRulesModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  it('should not allow connecting from or to definitions', inject(function(drdRules, elementRegistry) {
    // given
    var definitions = elementRegistry.get('dish'),
        textAnnotation = elementRegistry.get('annotation_1'),
        canConnectFrom, canConnectTo;

    // when
    canConnectFrom = drdRules.canConnect(definitions, textAnnotation);
    canConnectTo = drdRules.canConnect(textAnnotation, definitions);

    // then
    expect(canConnectFrom).to.be.false;
    expect(canConnectTo).to.be.false;
  }));

});
