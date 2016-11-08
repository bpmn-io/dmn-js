'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var ElementsUtil = require('../../../util/ElementsUtil'),
    queryElement = ElementsUtil.queryElement;

var DOMEvents = require('table-js/test/util/DOMEvents'),
    mouseEvent = DOMEvents.performMouseEvent;

var drillDownModule = require('../../../../lib/features/drill-down'),
    coreModule = require('../../../../lib/core'),
    modelingModule = require('../../../../lib/features/modeling');

describe('features - drill-down', function() {

  var testModules = [
    coreModule,
    modelingModule,
    drillDownModule
  ];

  var diagramXML = require('../../../fixtures/dmn/multiple-decisions.dmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should add drill down overlays', inject(function(elementRegistry) {

    // given
    var elements = queryElement('.djs-overlays', true);

    // then
    expect(elements).to.have.length(3);
  }));


  it('should drill down to a decision table', inject(function(elementRegistry, eventBus) {

    // given
    var decisionElement = elementRegistry.get('dish-decision'),
        drillDownOverlay = queryElement('[data-container-id="dish-decision"] div div');

    eventBus.on('decision.open', function(context) {
      var decision = context.decision;

      // then
      expect(decision).to.equal(decisionElement.businessObject);
      expect(decision.decisionTable).to.exist;
    });

    // when
    mouseEvent('click', drillDownOverlay);
  }));


  it('should drill down to a literal expression', inject(function(elementRegistry, eventBus) {

    // given
    var decisionElement = elementRegistry.get('season'),
        drillDownOverlay = queryElement('[data-container-id="season"] div div');

    eventBus.on('decision.open', function(context) {
      var decision = context.decision;

      // then
      expect(decision).to.equal(decisionElement.businessObject);
      expect(decision.literalExpression).to.exist;
    });

    // when
    mouseEvent('click', drillDownOverlay);
  }));


  it('should have the drill-down overlay after deletion of element is undone', inject(function(elementRegistry, modeling, commandStack) {
    // given
    var decisionElement = elementRegistry.get('dish-decision'),
        elements;

    modeling.removeShape(decisionElement);

    // when
    commandStack.undo();

    // then
    elements = queryElement('.djs-overlays', true);
    expect(elements).to.have.length(3);
  }));

});
