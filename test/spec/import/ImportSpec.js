'use strict';

var Viewer = require('../../../lib/Viewer');

var exampleXML = require('../../fixtures/dmn/di.dmn');

var TestContainer = require('mocha-test-container-support');

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

  beforeEach(function(done) {
    TestContainer.get(this);
    viewer = new Viewer();
    viewer.importXML(exampleXML, function() {
      elementRegistry = viewer.get('elementRegistry');
      done();
    });
  });

  describe('connection types', function() {
    it('should connect decisions with information requirement', function() {
      var conn = getElementWithSourceAndTargetType('dmn:Decision', 'dmn:Decision');
      expect(conn.type).to.eql('dmn:InformationRequirement');
    });
    it('should connect business knowledge model to decisions with knowledge requirement', function() {
      var conn = getElementWithSourceAndTargetType('dmn:BusinessKnowledgeModel', 'dmn:Decision');
      expect(conn.type).to.eql('dmn:KnowledgeRequirement');
    });
    it('should connect knowledge source to decisions with authority requirement', function() {
      var conn = getElementWithSourceAndTargetType('dmn:KnowledgeSource', 'dmn:Decision');
      expect(conn.type).to.eql('dmn:AuthorityRequirement');
    });
    it('should connect input data to decisions with information requirement', function() {
      var conn = getElementWithSourceAndTargetType('dmn:InputData', 'dmn:Decision');
      expect(conn.type).to.eql('dmn:InformationRequirement');
    });

  });

});
