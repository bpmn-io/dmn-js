import Modeler from 'lib/Modeler';

import { insertCSS } from 'test/helper';

insertCSS('dmn-js.css', require('dmn-js-drd/assets/css/dmn-js.css'));

insertCSS('dmn-decision-table.css', require('dmn-js-decision-table/assets/css/dmn-decision-table.css'));

insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));

insertCSS('dmn-js-testing.css',
  '.test-container .dmn-js-parent { height: 500px; }'
);


describe('Modeler', function() {

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


  it('should open DMN table', function(done) {

    var editor = new Modeler({ container: container });

    editor.importXML(diagram, { open: false }, function(err) {

      if (err) {
        return done(err);
      }

      var views = editor.getViews();
      var decisionView = views[1];

      // can open decisions
      expect(decisionView.element.$instanceOf('dmn:Decision')).to.be.true;

      editor.open(decisionView, done);
    });

  });


  it('should open DRD', function(done) {

    var editor = new Modeler({ container: container });

    editor.importXML(diagram, { open: false }, function(err) {

      if (err) {
        return done(err);
      }

      var views = editor.getViews();
      var drdView = views[0];

      // can open decisions
      expect(drdView.element.$instanceOf('dmn:Definitions')).to.be.true;

      editor.open(drdView, done);
    });

  });

});

