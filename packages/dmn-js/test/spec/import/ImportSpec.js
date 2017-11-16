'use strict';

var Modeler = require('../../../lib/Modeler');

var exampleXML = require('../../fixtures/dmn/di.dmn'),
    multipleDecisionsXML = require('../../fixtures/dmn/multiple-decisions.dmn');

var TestContainer = require('mocha-test-container-support');

var pick = require('lodash/object/pick');


function expectConnection(connection, type) {
  var businessObject = connection.businessObject,
      edge;

  expect(connection.type).to.equal(type);
  expect(connection.waypoints).to.have.length.of(2);

  expect(businessObject.$type).to.equal(type);

  if (type === 'dmn:Association') {
    edge = businessObject.extensionElements.values[0];
  } else {
    edge = connection.target.businessObject.extensionElements.values[1];
  }

  expect(edge.$type).to.equal('biodi:Edge');
  expect(edge.waypoints).to.have.length.of(2);
}

describe('DRD - Import', function() {

  var modeler, elementRegistry;

  describe('connection types', function() {

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

      modeler = new Modeler({ container: container });

      modeler.importXML(exampleXML, function() {
        elementRegistry = modeler.get('elementRegistry');
        done();
      });
    });

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

  it('should crop connections', function(done) {

    var connection, waypoints;

    var container = TestContainer.get(this);

    modeler = new Modeler({ container: container });

    modeler.importXML(multipleDecisionsXML, function() {
      var modeling = modeler.get('modeling'),
          elementRegistry = modeler.get('elementRegistry');

      connection = modeling.connect(elementRegistry.get('guestCount'), elementRegistry.get('season'));

      waypoints = connection.waypoints.slice();

      modeler.saveXML(function(err, xml) {

        modeler.importXML(xml, function() {
          var decision;

          elementRegistry = modeler.get('elementRegistry');

          decision = elementRegistry.get('guestCount');
          connection = decision.outgoing[0];

          expect(pick(connection.waypoints[0], [ 'x', 'y' ])).to.eql(pick(waypoints[0], [ 'x', 'y' ]));
          expect(pick(connection.waypoints[1], [ 'x', 'y' ])).to.eql(pick(waypoints[1], [ 'x', 'y' ]));

          done();
        });
      });
    });

  });

});
