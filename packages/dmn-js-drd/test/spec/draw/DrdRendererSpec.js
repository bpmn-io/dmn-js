import {
  bootstrapViewer
} from 'test/TestHelper';


describe('draw - DrdRenderer', function() {

  it('Knowledge Source', function() {
    var xml = require('../../fixtures/dmn/knowledge-source.dmn');

    return bootstrapViewer(xml);
  });

  it('Business Knowledge Model', function() {
    var xml = require('../../fixtures/dmn/business-knowledge.dmn');

    return bootstrapViewer(xml);
  });

  it('Input Data', function() {
    var xml = require('../../fixtures/dmn/input-data.dmn');

    return bootstrapViewer(xml);
  });

  it('Literal Expression', function() {
    var xml = require('../../fixtures/dmn/literal-expression.dmn');

    return bootstrapViewer(xml, { loadDiagram: true });

  });

  it('Text Annotation', function() {
    var xml = require('../../fixtures/dmn/text-annotation.dmn');

    return bootstrapViewer(xml, { loadDiagram: true });
  });

});
