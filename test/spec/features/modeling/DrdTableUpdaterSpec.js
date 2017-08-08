'use strict';

var Modeler = require('../../../../lib/Modeler');

var xml = require('../../../fixtures/dmn/di.dmn');

var TestContainer = require('mocha-test-container-support');


describe('features/modeling - DRD/decision view integration', function() {

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  function createModeler(xml, done) {
    var viewer = new Modeler({ container: container });

    viewer.importXML(xml, function(err, warnings) {
      done(err, warnings, viewer);
    });
  }

  it('should update ID', function(done) {

    // given
    createModeler(xml, function(err, warnings, viewer) {
      viewer.showDecision(viewer.getDecisions()[0]);

      var elementRegistry = viewer.get('elementRegistry');

      var element = elementRegistry.get('dish-decision');

      var modeling = viewer.get('table').get('modeling');

      // when
      modeling.editId('foo');

      // then
      expect(element.id).to.eql('foo');

      done();
    });

  });

  it('should update ID [undo]', function(done) {

    // given
    createModeler(xml, function(err, warnings, viewer) {
      viewer.showDecision(viewer.getDecisions()[0]);

      var elementRegistry = viewer.get('elementRegistry');

      var element = elementRegistry.get('dish-decision');

      var commandStack = viewer.get('table').get('commandStack'),
          modeling = viewer.get('table').get('modeling');

      modeling.editId('foo');

      // when
      commandStack.undo();

      // then
      expect(element.id).to.eql('dish-decision');

      done();
    });

  });

});
