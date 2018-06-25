import { bootstrapModeler, inject } from 'test/helper';

import { Cell } from 'table-js/lib/model';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';

import diagramXML from './id-claim-unclaim.dmn';

describe('IdClaimBehavior', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  it('should claim ID on row.add', inject(function(dmnFactory, moddle, modeling) {

    // given
    const { ids } = moddle;

    // when
    modeling.addRow({
      id: 'row',
      type: 'dmn:DecisionRule',
      cells: [
        new Cell({
          id: 'cell1',
          businessObject: dmnFactory.create('dmn:UnaryTests')
        }),
        new Cell({
          id: 'cell2',
          businessObject: dmnFactory.create('dmn:UnaryTests')
        }),
        new Cell({
          id: 'cell3',
          businessObject: dmnFactory.create('dmn:LiteralExpression')
        }),
        new Cell({
          id: 'cell4',
          businessObject: dmnFactory.create('dmn:LiteralExpression')
        })
      ]
    });

    // then
    expect(ids.assigned('row')).to.exist;
    expect(ids.assigned('cell1')).to.exist;
    expect(ids.assigned('cell2')).to.exist;
    expect(ids.assigned('cell3')).to.exist;
    expect(ids.assigned('cell4')).to.exist;
  }));


  it('should claim ID on col.add', inject(function(dmnFactory, moddle, modeling) {

    // given
    const { ids } = moddle;

    // when
    modeling.addCol({
      id: 'row',
      type: 'dmn:InputClause',
      cells: [
        new Cell({
          id: 'cell1',
          businessObject: dmnFactory.create('dmn:UnaryTests')
        }),
        new Cell({
          id: 'cell2',
          businessObject: dmnFactory.create('dmn:UnaryTests')
        }),
        new Cell({
          id: 'cell3',
          businessObject: dmnFactory.create('dmn:UnaryTests')
        }),
        new Cell({
          id: 'cell4',
          businessObject: dmnFactory.create('dmn:UnaryTests')
        })
      ]
    });

    // then
    expect(ids.assigned('row')).to.exist;
    expect(ids.assigned('cell1')).to.exist;
    expect(ids.assigned('cell2')).to.exist;
    expect(ids.assigned('cell3')).to.exist;
    expect(ids.assigned('cell4')).to.exist;
  }));

});