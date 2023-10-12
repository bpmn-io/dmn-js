import {
  bootstrapViewer,
  inject
} from 'test/TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import dmnSearchModule from 'src/features/search';


describe('features - DMN search provider', function() {

  const testModules = [
    coreModule,
    modelingModule,
    dmnSearchModule
  ];


  const diagramXML = require('./dmn-search.dmn');

  beforeEach(bootstrapViewer(diagramXML, { modules: testModules }));


  it('find should return all elements that match label or ID', inject(
    function(dmnSearch) {

      // given
      const pattern = 'Decision';

      // when
      const elements = dmnSearch.find(pattern);

      // then
      expect(elements).length(2);
      elements.forEach(function(e) {
        expect(e).to.have.property('element');
        expect(e).to.have.property('primaryTokens');
        expect(e).to.have.property('secondaryTokens');
      });
    })
  );


  it('matches IDs', inject(function(dmnSearch) {

    // given
    const pattern = 'Decision_id';

    // when
    const elements = dmnSearch.find(pattern);

    // then
    expect(elements[0].primaryTokens).to.eql([
      { normal: 'Decision 1' }
    ]);
    expect(elements[0].secondaryTokens).to.eql([
      { matched: 'Decision_id' },
      { normal: '_1' }
    ]);
  }));


  it('should not return root element (definitions)', inject(function(dmnSearch) {

    // given
    const pattern = 'Definitions';

    // when
    const elements = dmnSearch.find(pattern);

    // then
    expect(elements).to.have.length(0);
  }));


  describe('should split result into matched and non matched tokens', function() {

    it('matched all', inject(function(dmnSearch) {

      // given
      const pattern = 'Start Middle End';

      // when
      const elements = dmnSearch.find(pattern);

      // then
      expect(elements[0].primaryTokens).to.eql([
        { matched: 'Start Middle End' }
      ]);
    }));


    it('matched start', inject(function(dmnSearch) {

      // given
      const pattern = 'Start';

      // when
      const elements = dmnSearch.find(pattern);

      // then
      expect(elements[0].primaryTokens).to.eql([
        { matched: 'Start' },
        { normal: ' Middle End' }
      ]);
    }));


    it('matched middle', inject(function(dmnSearch) {

      // given
      const pattern = 'Middle';

      // when
      const elements = dmnSearch.find(pattern);

      // then
      expect(elements[0].primaryTokens).to.eql([
        { normal: 'Start ' },
        { matched: 'Middle' },
        { normal: ' End' }
      ]);
    }));


    it('matched end', inject(function(dmnSearch) {

      // given
      const pattern = 'End';

      // when
      const elements = dmnSearch.find(pattern);

      // then
      expect(elements[0].primaryTokens).to.eql([
        { normal: 'Start Middle ' },
        { matched: 'End' }
      ]);
    }));

  });
});
