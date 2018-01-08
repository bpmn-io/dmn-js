import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerMouseEvent } from 'test/util/EventUtil';

import simpleXML from '../../simple.dmn';

import AddInputOutputModule from 'lib/features/add-input-output';
import CoreModule from 'lib/core';
import ModelingModule from 'lib/features/modeling';


describe('add input output', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      AddInputOutputModule,
      CoreModule,
      ModelingModule
    ]
  }));

  let testContainer;

  beforeEach(function() {    
    testContainer = TestContainer.get(this);
  });


  describe('add input', function() {

    it('should render add input cell', function() {
      
      // then
      expect(domQuery('.add-input', testContainer)).to.exist;
    });


    it('should add input on click', inject(function(sheet) {

      // given
      const cell = domQuery('.add-input', testContainer);

      // when
      triggerMouseEvent(cell, 'click');

      // then
      const root = sheet.getRoot();

      expect(root.cols).to.have.lengthOf(5);
    }));


    it('should update col span', inject(function(eventBus) {

      // when
      eventBus.fire('addInput');

      // then
      expect(domQuery('.add-input', testContainer).colSpan).to.equal(3);
    }));

  });


  describe('add output', function() {
    
    it('should render add output cell', function() {
      
      // then
      expect(domQuery('.add-output', testContainer)).to.exist;
    });


    it('should add output on click', inject(function(sheet) {
      
      // given
      const cell = domQuery('.add-output', testContainer);

      // when
      triggerMouseEvent(cell, 'click');

      // then
      const root = sheet.getRoot();

      expect(root.cols).to.have.lengthOf(5);
    }));


    it('should update col span', inject(function(eventBus) {
      
      // when
      eventBus.fire('addOutput');

      // then
      expect(domQuery('.add-output', testContainer).colSpan).to.equal(3);
    }));

  }); 

});