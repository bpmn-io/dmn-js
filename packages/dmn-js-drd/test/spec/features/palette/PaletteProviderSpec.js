import {
  bootstrapModeler,
  inject
} from '../../../TestHelper';

import modelingModule from 'lib/features/modeling';
import paletteModule from 'lib/features/palette';
import coreModule from 'lib/core';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';


describe('features/palette', function() {

  var diagramXML = require('../../../fixtures/dmn/input-data.dmn');

  var testModules = [ coreModule, modelingModule, paletteModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should provide DMN modeling palette', inject(function(canvas, palette) {

    // when
    var paletteElement = domQuery('.djs-palette', canvas._container);
    var entries = domQueryAll('.entry', paletteElement);

    // then
    expect(entries.length).to.equal(5);
  }));

});
