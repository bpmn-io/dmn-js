import Viewer from 'src/Viewer';

import DefaultExport from '../../src';


var diagram = require('./diagram.dmn');
var noDi = require('./no-di.dmn');

var dmn_11 = require('./dmn-11.dmn');


describe('Viewer', function() {

  var container;

  beforeEach(function() {
    container = document.createElement('div');
    container.className = 'test-container';

    document.body.appendChild(container);
  });

  false && afterEach(function() {
    document.body.removeChild(container);
  });


  it('should expose Viewer as library default', function() {
    expect(DefaultExport).to.equal(Viewer);
  });


  it('should allow to configure container size', function() {

    // when
    var editor = new Viewer({
      width: '300px',
      height: 200,
      position: 'absolute'
    });

    // then
    expect(editor._container.style).to.include({
      width: '300px',
      height: '200px',
      position: 'absolute'
    });
  });


  it('should open DMN table', function(done) {

    var editor = new Viewer({ container: container });

    editor.importXML(diagram, { open: false }, function(err) {

      if (err) {
        return done(err);
      }

      var views = editor.getViews();
      var decisionView = views.filter(v => v.type === 'decisionTable')[0];

      // can open decisions
      expect(decisionView.element.$instanceOf('dmn:Decision')).to.be.true;

      editor.open(decisionView, done);
    });

  });


  it('should open DMN literal expression', function(done) {

    var editor = new Viewer({ container: container });

    editor.importXML(diagram, { open: false }, function(err) {

      if (err) {
        return done(err);
      }

      var views = editor.getViews();
      var decisionView = views.filter(v => v.type === 'literalExpression')[0];

      // can open decisions
      expect(decisionView.element.$instanceOf('dmn:Decision')).to.be.true;

      editor.open(decisionView, done);
    });

  });


  it('should open DRD', function(done) {

    var editor = new Viewer({ container: container });

    editor.importXML(diagram, { open: false }, function(err) {

      if (err) {
        return done(err);
      }

      var views = editor.getViews();
      var drdView = views.filter(v => v.type === 'drd')[0];

      // can open decisions
      expect(drdView.element.$instanceOf('dmn:Definitions')).to.be.true;

      editor.open(drdView, done);
    });

  });


  it('should open Table (if no DI)', function(done) {

    var editor = new Viewer({ container: container });

    editor.importXML(noDi, function(err) {

      if (err) {
        return done(err);
      }

      var activeView = editor.getActiveView();

      expect(activeView.type).to.eql('decisionTable');
      expect(activeView.element.$instanceOf('dmn:Decision')).to.be.true;

      done();
    });

  });


  describe('DMN compatibility', function(done) {

    it('should indicate DMN 1.1 incompatibility', function(done) {

      var editor = new Viewer({ container: container });

      editor.importXML(dmn_11, function(err) {

        if (!err) {
          return done(new Error('expected error'));
        }

        expect(err.message).to.match(
          /unsupported DMN 1\.1 file detected; only DMN 1\.3 files can be opened/
        );

        done();
      });
    });

  });

});