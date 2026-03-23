import {
  bootstrapModeler,
  inject
} from '../../../TestHelper';

import modelingModule from 'src/features/modeling';
import paletteModule from 'src/features/palette';
import coreModule from 'src/core';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';
import overlaysModule from 'diagram-js/lib/features/overlays';
import dataTypesModule from 'dmn-js-shared/lib/features/data-types';


describe('features/palette', function() {

  var diagramXML = require('../../../fixtures/dmn/input-data.dmn');

  var testModules = [
    coreModule,
    modelingModule,
    paletteModule,
    overlaysModule,
    dataTypesModule
  ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should provide DMN modeling palette', inject(function(canvas, palette) {

    // when
    var paletteElement = domQuery('.djs-palette', canvas._container);
    var entries = domQueryAll('.entry', paletteElement);

    // then
    expect(entries.length).to.equal(6);
  }));


  it('should provide title for each palette entry', inject(function(canvas) {

    // when
    var paletteElement = domQuery('.djs-palette', canvas._container);
    var entries = domQueryAll('.entry', paletteElement);

    // then
    entries.forEach(function(entry) {
      expect(entry).to.have.property('title');
      expect(entry.title).to.have.lengthOf.above(0);
    });
  }));

});
