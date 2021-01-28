import Modeler from 'src/Modeler';

import { insertCSS } from 'test/helper';

insertCSS('dmn-js-drd.css', require('dmn-js-drd/assets/css/dmn-js-drd.css'));

insertCSS('dmn-js-decision-table.css',
  require('dmn-js-decision-table/assets/css/dmn-js-decision-table.css')
);

insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));

insertCSS('dmn-js-testing.css',
  '.test-container { height: 500px; }'
);

var singleStart = window.__env__ && window.__env__.SINGLE_START === 'modeler';


describe('Modeler', function() {

  var diagram = require('./diagram.dmn');
  var noDi = require('./no-di.dmn');
  var noDisplayableContents = require('./no-displayable-contents.dmn');

  var container;
  var editor;

  beforeEach(function() {
    container = document.createElement('div');
    container.className = 'test-container';

    document.body.appendChild(container);

    editor = new Modeler({
      container: container,
      common: {
        keyboard: {
          bindTo: document
        }
      }
    });
  });

  singleStart || afterEach(function() {
    if (editor) {
      editor.destroy();

      editor = null;
    }

    document.body.removeChild(container);
  });


  it('should open DMN table', function(done) {

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


  (singleStart ? it.only : it)('should open DRD', function(done) {

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


  describe('should open Table (if no DI)', function() {

    it('initial open', function(done) {

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


    it('on re-import', function(done) {

      editor.importXML(diagram, function(err) {

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

    });

  });


  describe('should open DRD (if no DI / no displayable contents)', function() {

    it('initial open', function(done) {

      editor.importXML(noDisplayableContents, function(err) {

        if (err) {
          return done(err);
        }

        var activeView = editor.getActiveView();

        expect(activeView.type).to.eql('drd');
        expect(activeView.element.$instanceOf('dmn:Definitions')).to.be.true;

        done();
      });

    });


    it('on re-import', function(done) {

      editor.importXML(diagram, function(err) {

        editor.importXML(noDisplayableContents, function(err) {

          if (err) {
            return done(err);
          }

          var activeView = editor.getActiveView();

          expect(activeView.type).to.eql('drd');
          expect(activeView.element.$instanceOf('dmn:Definitions')).to.be.true;

          done();
        });
      });

    });

  });


  it('should keep view on re-import', function(done) {

    editor.importXML(diagram, function(err) {

      var views = editor.getViews();
      var tableView = views.filter(v => v.type === 'decisionTable')[0];

      editor.open(tableView, function(err) {

        editor.importXML(diagram, function(err) {

          var activeView = editor.getActiveView();

          var element = activeView.element;

          expect(activeView.type).to.eql('decisionTable');
          expect(element.$instanceOf('dmn:Decision')).to.be.true;
          expect(element.id).to.eql(tableView.element.id);

          done();
        });
      });

    });

  });

});

