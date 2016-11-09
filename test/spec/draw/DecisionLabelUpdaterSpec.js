'use strict';

require('../TestHelper');

/* global bootstrapModeler, inject */

var coreModule = require('../../../lib/core');

describe('draw/DecisionLabelUpdater', function() {

  var diagramXML = require('../../fixtures/dmn/di.dmn');

  var testModules = [ coreModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should update the Decision Label', inject(function(eventBus, canvas, elementRegistry) {

    // given
    elementRegistry.get('dish-decision').businessObject.name = 'FOO BAR';

    // when
    eventBus.fire('view.switch');

    // then
    expect(elementRegistry.getGraphics('dish-decision').textContent).to.eql('FOO BAR');
  }));

});
