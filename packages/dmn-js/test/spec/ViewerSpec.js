import Viewer from 'lib/Viewer';

import DefaultExport from '../../';


describe('Viewer', function() {

  var diagram = require('./diagram.dmn');

  var container;

  beforeEach(function() {
    container = document.createElement('div');
    container.className = 'test-container';

    document.body.appendChild(container);
  });

  /*
  afterEach(function() {
    document.body.removeChild(container);
  });
  */

  it('should expose Viewer as library default', function() {
    expect(DefaultExport).to.equal(Viewer);
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

});