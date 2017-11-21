import DmnEditor from 'lib/DmnEditor';


describe('DmnEditor', function() {

  var diagram = require('./diagram.dmn');


  it.skip('should open DMN table', function(done) {

    var editor = new DmnEditor();

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

    var editor = new DmnEditor();

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