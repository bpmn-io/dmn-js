import {
  bootstrapViewer
} from 'test/TestHelper';


describe('draw - DrdRenderer', function() {

  it('Knowledge Source', function(done) {
    var xml = require('../../fixtures/dmn/knowledge-source.dmn');

    bootstrapViewer(xml)(done);
  });

  it('Business Knowledge Model', function(done) {
    var xml = require('../../fixtures/dmn/business-knowledge.dmn');

    bootstrapViewer(xml)(done);
  });

  it('Input Data', function(done) {
    var xml = require('../../fixtures/dmn/input-data.dmn');

    bootstrapViewer(xml)(done);
  });

  it('Literal Expression', function(done) {
    var xml = require('../../fixtures/dmn/literal-expression.dmn');

    bootstrapViewer(xml, { loadDiagram: true })(done);

  });

  it('Text Annotation', function(done) {
    var xml = require('../../fixtures/dmn/text-annotation.dmn');

    bootstrapViewer(xml, { loadDiagram: true })(done);
  });

});
