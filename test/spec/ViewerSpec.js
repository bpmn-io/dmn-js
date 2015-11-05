'use strict';

var Viewer = require('../../lib/Viewer');

var fs = require('fs');

describe('Viewer', function() {

  var container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    container.parentNode.removeChild(container);
  });


  function createViewer(xml, done) {
    var viewer = new Viewer({ container: container });

    viewer.importXML(xml, function(err, warnings) {
      done(err, warnings, viewer);
    });
  }


  it('should import simple process', function(done) {
    var xml = fs.readFileSync(__dirname + '/../fixtures/dmn/simple.dmn', 'utf-8');
    createViewer(xml, done);
  });


  it('should import empty definitions', function(done) {
    var xml = fs.readFileSync(__dirname + '/../fixtures/dmn/empty-definitions.dmn', 'utf-8');
    createViewer(xml, done);
  });

  it('should import missing id on decision', function(done) {
    var xml = fs.readFileSync(__dirname + '/../fixtures/dmn/no-decision-id.dmn', 'utf-8');
    createViewer(xml, function(err, warnings, viewer) {
      expect(viewer.definitions.decision[0].id).to.eql(undefined);
      done();
    });
  });

  it('should repair empty id on decision', function(done) {
    var xml = fs.readFileSync(__dirname + '/../fixtures/dmn/empty-decision-id.dmn', 'utf-8');
    createViewer(xml, function(err, warnings, viewer) {
      expect(viewer.definitions.decision[0].id).to.not.eql(undefined);
      expect(viewer.definitions.decision[0].id).to.not.eql('');
      done();
    });
  });


  it('should re-import simple process', function(done) {

    var xml = fs.readFileSync(__dirname + '/../fixtures/dmn/simple.dmn', 'utf-8');

    // given
    createViewer(xml, function(err, warnings, viewer) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      viewer.importXML(xml, function(err, warnings) {

        // then
        expect(err).to.eql(null);
        expect(warnings.length).to.eql(0);

        done();
      });

    });
  });

  describe('defaults', function() {

    it('should use <body> as default parent', function(done) {

      var xml = fs.readFileSync(__dirname + '/../fixtures/dmn/simple.dmn', 'utf-8');

      var viewer = new Viewer();

      viewer.importXML(xml, function(err, warnings) {

        expect(viewer.container.parentNode).to.eql(document.body);

        done(err, warnings);
      });
    });

  });


  describe('import events', function() {

    it('should fire <import.*> events', function(done) {

      // given
      var viewer = new Viewer({ container: container });

      var xml = fs.readFileSync(__dirname + '/../fixtures/dmn/empty-definitions.dmn', 'utf-8');

      var events = [];

      viewer.on('import.start', function() {
        events.push('import.start');
      });

      viewer.on('import.success', function() {
        events.push('import.success');
      });

      viewer.on('import.error', function() {
        events.push('import.error');
      });

      // when
      viewer.importXML(xml, function(err) {

        // then
        expect(events).to.eql([
          'import.start',
          'import.success'
        ]);

        done(err);
      });
    });

  });

});
