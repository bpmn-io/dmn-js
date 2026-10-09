import { expect } from 'chai';

import {
  bootstrapModeler,
  getBoxedExpressionViewer,
  inject
} from 'test/TestHelper';

import { triggerKeyEvent } from 'dmn-js-shared/test/util/EventUtil';

import bkmXML from '../../bkm-decision-table.dmn';


describe('features/modeling - unified undo', function() {

  let bkm, cell;

  beforeEach(bootstrapModeler(bkmXML));

  beforeEach(inject(function(viewer, elementRegistry) {
    bkm = viewer.getRootElement();
    cell = elementRegistry.get('UnaryTests_1');
  }));

  beforeEach(inject(function(modeling, functionDefinition) {
    modeling.updateProperties(bkm, { name: 'Renamed' });
    modeling.editCell(cell, '> 17');
    functionDefinition.addParameter(bkm.encapsulatedLogic);
  }));


  function getParameters() {
    return bkm.encapsulatedLogic.formalParameter;
  }


  it('should undo header, table and parameter edits in reverse order', inject(
    function(commandStack) {

      // when
      commandStack.undo();
      commandStack.undo();
      commandStack.undo();

      // then
      expect(getParameters()).to.have.length(1);
      expect(cell.businessObject.text).to.eql('< 18');
      expect(bkm.name).to.eql('Discount');
    }
  ));


  it('should redo header, table and parameter edits in order', inject(
    function(commandStack) {

      // given
      commandStack.undo();
      commandStack.undo();
      commandStack.undo();

      // when
      commandStack.redo();
      commandStack.redo();
      commandStack.redo();

      // then
      expect(bkm.name).to.eql('Renamed');
      expect(cell.businessObject.text).to.eql('> 17');
      expect(getParameters()).to.have.length(2);
    }
  ));


  it('should undo last edit via editor action', inject(function(editorActions) {

    // when
    editorActions.trigger('undo');

    // then
    expect(getParameters()).to.have.length(1);
    expect(cell.businessObject.text).to.eql('> 17');
  }));


  it('should undo last edit on <CTRL + Z>', function() {

    // when
    triggerKeyEvent(getBoxedExpressionViewer()._container, 'keydown', {
      keyCode: 90,
      ctrlKey: true
    });

    // then
    expect(getParameters()).to.have.length(1);
    expect(cell.businessObject.text).to.eql('> 17');
  });


  it('should redo last undone edit on <CTRL + Y>', inject(function(commandStack) {

    // given
    commandStack.undo();

    // when
    triggerKeyEvent(getBoxedExpressionViewer()._container, 'keydown', {
      keyCode: 89,
      ctrlKey: true
    });

    // then
    expect(getParameters()).to.have.length(2);
  }));

});
