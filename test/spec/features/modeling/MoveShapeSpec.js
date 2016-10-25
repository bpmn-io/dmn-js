'use strict';

var pick = require('lodash/object/pick');

require('../../TestHelper');

/* global bootstrapModeler, inject */


var modelingModule = require('../../../../lib/features/modeling'),
    coreModule = require('../../../../lib/core');


describe('features/modeling - move shape', function() {

  var testModules = [ coreModule, modelingModule ];

  var knowledgeSourceXML = require('../../../fixtures/dmn/knowledge-source.dmn');

  beforeEach(bootstrapModeler(knowledgeSourceXML, { modules: testModules }));


  it('should move', inject(function(elementRegistry, modeling, drdFactory) {

    // given
    var knowledgeSource = elementRegistry.get('host_ks'),
        businessObject = knowledgeSource.businessObject,
        bounds = businessObject.extensionElements.values[0];

    var oldPosition = {
      x: knowledgeSource.x,
      y: knowledgeSource.y
    };

    // when
    modeling.moveShape(knowledgeSource, { x: 0, y: 50 });

    // then
    expect(pick(bounds, [ 'x', 'y' ])).to.eql({
      x: oldPosition.x,
      y: oldPosition.y + 50
    });
  }));


  it('should undo', inject(function(elementRegistry, commandStack, modeling) {

    // given
    var knowledgeSource = elementRegistry.get('host_ks'),
        businessObject = knowledgeSource.businessObject,
        bounds = businessObject.extensionElements.values[0];

    var oldPosition = {
      x: knowledgeSource.x,
      y: knowledgeSource.y
    };

    modeling.moveShape(knowledgeSource, { x: 0, y: 50 });

    // when
    commandStack.undo();

    // then
    expect(pick(bounds, [ 'x', 'y' ])).to.eql(oldPosition);
  }));


  it('should redo', inject(function(elementRegistry, commandStack, modeling) {

    // given
    var knowledgeSource = elementRegistry.get('host_ks'),
        businessObject = knowledgeSource.businessObject,
        bounds = businessObject.extensionElements.values[0];


    modeling.moveShape(knowledgeSource, { x: 0, y: 50 });

    var newPosition = {
      x: knowledgeSource.x,
      y: knowledgeSource.y
    };

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    expect(pick(bounds, [ 'x', 'y' ])).to.eql(newPosition);
  }));

});
