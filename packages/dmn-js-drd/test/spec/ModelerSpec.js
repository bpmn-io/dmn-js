var exampleXML = require('../fixtures/dmn/di.dmn'),
    emptyDefsXML = require('../fixtures/dmn/empty-definitions.dmn');

var TestContainer = require('mocha-test-container-support');

import DrdModeler from '../helper/DrdModeler';


describe('Modeler', function() {

  var container, modeler;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  function createModeler(xml, done) {
    modeler = new DrdModeler({ container: container });

    modeler.importXML(xml, function(err, warnings) {
      done(err, warnings, modeler);
    });
  }


  it('should import simple DRD', function(done) {
    createModeler(exampleXML, done);
  });


  it('should import empty definitions', function(done) {
    createModeler(emptyDefsXML, done);
  });


  it('should re-import simple DRD', function(done) {
    // given
    createModeler(exampleXML, function(err, warnings, modeler) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      modeler.importXML(exampleXML, function(err, warnings) {

        // then
        expect(err).to.not.exist;
        expect(warnings).to.have.length(0);

        done();
      });

    });

  });


  describe('import events', function() {

    it('should emit <import.*> events', function(done) {

      // given
      var modeler = new DrdModeler({ container: container });

      var events = [];

      modeler.on([
        'import.parse.start',
        'import.parse.complete',
        'import.render.start',
        'import.render.complete',
        'import.done'
      ], function(e) {
        // log event type + event arguments
        events.push([
          e.type,
          Object.keys(e).filter(function(key) {
            return key !== 'type';
          })
        ]);
      });

      // when
      modeler.importXML(exampleXML, function(err) {

        // then
        expect(events).to.eql([
          [ 'import.parse.start', [ 'xml' ] ],
          [ 'import.parse.complete', ['error', 'definitions', 'context' ] ],
          [ 'import.render.start', [ 'view', 'element' ] ],
          [ 'import.render.complete', [ 'view', 'error', 'warnings' ] ],
          [ 'import.done', [ 'error', 'warnings' ] ]
        ]);

        done(err);
      });
    });

  });


  describe('decisions without DI', function() {

    // ...

  });

});
