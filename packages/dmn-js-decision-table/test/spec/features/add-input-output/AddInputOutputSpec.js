import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import simpleXML from '../../simple.dmn';

import AddInputOutputModule from 'src/features/add-input-output';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTableHeadEditorModule from 'src/features/decision-table-head/editor';
import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';


describe('features/add-input-output', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      AddInputOutputModule,
      CoreModule,
      DecisionTableHeadModule,
      DecisionTableHeadEditorModule,
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
      triggerClick(cell);

      // then
      const root = sheet.getRoot();

      expect(root.cols).to.have.lengthOf(5);
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
      triggerClick(cell);

      // then
      const root = sheet.getRoot();

      expect(root.cols).to.have.lengthOf(5);
    }));
  });

});