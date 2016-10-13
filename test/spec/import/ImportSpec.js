'use strict';

var Viewer = require('../../../lib/Viewer');

var exampleXML = require('../../fixtures/dmn/di.dmn');

var TestContainer = require('mocha-test-container-support');


function expectConnection(connection, type) {
  var businessObject = connection.businessObject;

  expect(connection.type).to.equal(type);
  expect(connection.waypoints).to.have.length.of(2);

  expect(businessObject.$type).to.equal(type);
  expect(businessObject.di.$type).to.equal('biodi:Edge');
  expect(businessObject.di.waypoints).to.have.length.of(2);
}

describe('DRD - Import', function() {

  var viewer, elementRegistry;

  var getElementWithSourceAndTargetType = function(sourceType, targetType) {
    var match;

    elementRegistry.forEach(function(el) {
      if (el.source && el.source.type === sourceType &&
         el.target && el.target.type === targetType) {
        match = el;
      }
    });

    return match;
  };

  before(function(done) {
    var container = TestContainer.get(this);

    viewer = new Viewer({ container: container });

    viewer.importXML(exampleXML, function() {
      elementRegistry = viewer.get('elementRegistry');
      done();
    });
  });

  describe('connection types', function() {

    it('should connect decisions with information requirement', function() {
      var connection = getElementWithSourceAndTargetType('dmn:Decision', 'dmn:Decision');

      expectConnection(connection, 'dmn:InformationRequirement');
    });


    it('should connect business knowledge model to decisions with knowledge requirement', function() {
      var connection = getElementWithSourceAndTargetType('dmn:BusinessKnowledgeModel', 'dmn:Decision');

      expectConnection(connection, 'dmn:KnowledgeRequirement');
    });


    it('should connect knowledge source to decisions with authority requirement', function() {
      var connection = getElementWithSourceAndTargetType('dmn:KnowledgeSource', 'dmn:Decision');

      expectConnection(connection, 'dmn:AuthorityRequirement');
    });


    it('should connect input data to decisions with information requirement', function() {
      var connection = getElementWithSourceAndTargetType('dmn:InputData', 'dmn:Decision');

      expectConnection(connection, 'dmn:InformationRequirement');
    });


    it('should connect input data to text annotation with an association', function() {
      var connection = getElementWithSourceAndTargetType('dmn:InputData', 'dmn:TextAnnotation');

      expectConnection(connection, 'dmn:Association');
    });

  });

});
