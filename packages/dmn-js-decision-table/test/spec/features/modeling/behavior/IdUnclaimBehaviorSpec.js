import { bootstrapModeler, inject } from 'test/helper';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';

import diagramXML from './id-claim-unclaim.dmn';

describe('IdUnclaimBehavior', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  it('should unclaim ID on row.remove', inject(
    function(elementRegistry, moddle, modeling) {

      // given
      const row = elementRegistry.get('rule1');

      const { ids } = moddle;

      // when
      modeling.removeRow(row);

      // then
      expect(ids.assigned('rule1')).to.be.false;
      expect(ids.assigned('inputEntry1')).to.be.false;
      expect(ids.assigned('inputEntry2')).to.be.false;
      expect(ids.assigned('outputEntry1')).to.be.false;
      expect(ids.assigned('outputEntry2')).to.be.false;
    }
  ));


  it('should unclaim ID on col.remove', inject(
    function(elementRegistry, moddle, modeling) {

      // given
      const col = elementRegistry.get('input1');

      const { ids } = moddle;

      // when
      modeling.removeCol(col);

      // then
      expect(ids.assigned('input1')).to.be.false;
      expect(ids.assigned('inputEntry1')).to.be.false;
      expect(ids.assigned('inputEntry3')).to.be.false;
      expect(ids.assigned('inputEntry5')).to.be.false;
      expect(ids.assigned('inputEntry7')).to.be.false;
    }
  ));

});