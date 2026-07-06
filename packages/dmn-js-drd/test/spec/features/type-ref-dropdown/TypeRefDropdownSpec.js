import { expect } from 'chai';

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery, queryAll as domQueryAll } from 'min-dom';

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import typeRefDropdownModule from 'src/features/type-ref-dropdown';

const diagramXML = require('./TypeRefDropdown.dmn');


describe('features - type-ref-dropdown', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  const testModules = [
    coreModule,
    modelingModule,
    typeRefDropdownModule
  ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('overlay', function() {

    describe('open', function() {

      it('should show overlay when InputData is selected', inject(
        function(elementRegistry, selection) {

          // given
          const element = elementRegistry.get('withVariable_id');

          // when
          selection.select(element);

          // then
          expect(queryOverlay('withVariable_id')).to.exist;
        }
      ));


      it('should NOT show overlay when non-InputData is selected', inject(
        function(elementRegistry, selection) {

          // given
          const element = elementRegistry.get('someDecision_id');

          // when
          selection.select(element);

          // then
          expect(queryOverlay('someDecision_id')).to.be.null;
        }
      ));


      it('should close overlay when selection is cleared', inject(
        function(elementRegistry, selection) {

          // given
          const element = elementRegistry.get('withVariable_id');
          selection.select(element);

          // when
          selection.select([]);

          // then
          expect(queryOverlay('withVariable_id')).to.be.null;
        }
      ));


      it('should close and reopen when selection switches to another InputData', inject(
        function(elementRegistry, selection) {

          // given
          const first = elementRegistry.get('withVariable_id');
          const second = elementRegistry.get('noVariable_id');

          selection.select(first);

          // when
          selection.select(second);

          // then
          expect(queryOverlay('withVariable_id')).to.be.null;
          expect(queryOverlay('noVariable_id')).to.exist;
        }
      ));


      it('should NOT show overlay for multi-selection', inject(
        function(elementRegistry, selection) {

          // given
          const first = elementRegistry.get('withVariable_id');
          const second = elementRegistry.get('noVariable_id');

          // when
          selection.select([ first, second ]);

          // then
          expect(queryOverlay('withVariable_id')).to.be.null;
          expect(queryOverlay('noVariable_id')).to.be.null;
        }
      ));

    });


    describe('content', function() {

      it('should populate options from all data types', inject(
        function(elementRegistry, selection, dataTypes) {

          // given
          const element = elementRegistry.get('withVariable_id');

          // when
          selection.select(element);

          // then
          const selectEl = querySelect('withVariable_id');
          expect(domQueryAll('option', selectEl)).to.have.length(dataTypes.getAll().length);
        }
      ));


      it('should pre-select the current typeRef', inject(
        function(elementRegistry, selection) {

          // given
          const element = elementRegistry.get('withVariable_id');

          // when
          selection.select(element);

          // then
          const selectEl = querySelect('withVariable_id');
          expect(selectEl.value).to.equal('boolean');
        }
      ));


      it('should pre-select "Any" when no variable exists', inject(
        function(elementRegistry, selection) {

          // given
          const element = elementRegistry.get('noVariable_id');

          // when
          selection.select(element);

          // then
          const selectEl = querySelect('noVariable_id');
          expect(selectEl.value).to.equal('Any');
        }
      ));


      it('should show value when variable typeRef is not in data types', inject(
        function(elementRegistry, selection) {

          // given
          const element = elementRegistry.get('unknownTypeRef_id');

          // when
          selection.select(element);

          // then
          const selectEl = querySelect('unknownTypeRef_id');
          expect(selectEl.value).to.equal('integer');
        }
      ));


      it('should pre-select "Any" when variable has no typeRef', inject(
        function(elementRegistry, selection) {

          // given
          const element = elementRegistry.get('noTypeRef_id');

          // when
          selection.select(element);

          // then
          const selectEl = querySelect('noTypeRef_id');
          expect(selectEl.value).to.equal('Any');
        }
      ));


      it('should have accessible aria-label', inject(
        function(elementRegistry, selection) {

          // given
          const element = elementRegistry.get('withVariable_id');

          // when
          selection.select(element);

          // then
          const selectEl = querySelect('withVariable_id');
          expect(selectEl.ariaLabel).to.equal('Type');
        }
      ));

    });

  });


  describe('setTypeRef', function() {

    it('should update typeRef when variable exists', inject(
      function(elementRegistry, selection) {

        // given
        const element = elementRegistry.get('withVariable_id');
        const bo = getBusinessObject(element);
        selection.select(element);

        // when
        triggerSelectChange(querySelect('withVariable_id'), 'number');

        // then
        expect(bo.variable.typeRef).to.equal('number');
      }
    ));


    it('should create new variable when none exists', inject(
      function(elementRegistry, selection) {

        // given
        const element = elementRegistry.get('noVariable_id');
        const bo = getBusinessObject(element);
        selection.select(element);

        // when
        triggerSelectChange(querySelect('noVariable_id'), 'string');

        // then
        expect(bo.variable).to.exist;
        expect(bo.variable.typeRef).to.equal('string');
        expect(bo.variable.name).to.equal(bo.get('name'));
      }
    ));


    it('should undo typeRef update', inject(
      function(elementRegistry, selection, commandStack) {

        // given
        const element = elementRegistry.get('withVariable_id');
        const bo = getBusinessObject(element);
        selection.select(element);
        triggerSelectChange(querySelect('withVariable_id'), 'number');

        // when
        commandStack.undo();

        // then
        expect(bo.variable.typeRef).to.equal('boolean');
      }
    ));


    it('should redo typeRef update', inject(
      function(elementRegistry, selection, commandStack) {

        // given
        const element = elementRegistry.get('withVariable_id');
        const bo = getBusinessObject(element);
        selection.select(element);
        triggerSelectChange(querySelect('withVariable_id'), 'number');
        commandStack.undo();

        // when
        commandStack.redo();

        // then
        expect(bo.variable.typeRef).to.equal('number');
      }
    ));


    it('should undo variable creation', inject(
      function(elementRegistry, selection, commandStack) {

        // given
        const element = elementRegistry.get('noVariable_id');
        const bo = getBusinessObject(element);
        selection.select(element);
        triggerSelectChange(querySelect('noVariable_id'), 'string');

        // when
        commandStack.undo();

        // then
        expect(bo.variable).not.to.exist;
      }
    ));

  });


  describe('external changes', function() {

    it('should update select value on undo', inject(
      function(elementRegistry, selection, commandStack) {

        // given
        const element = elementRegistry.get('withVariable_id');
        selection.select(element);
        triggerSelectChange(querySelect('withVariable_id'), 'number');

        // when
        commandStack.undo();

        // then
        expect(querySelect('withVariable_id').value).to.equal('boolean');
      }
    ));


    it('should update select value on redo', inject(
      function(elementRegistry, selection, commandStack) {

        // given
        const element = elementRegistry.get('withVariable_id');
        selection.select(element);
        triggerSelectChange(querySelect('withVariable_id'), 'number');
        commandStack.undo();

        // when
        commandStack.redo();

        // then
        expect(querySelect('withVariable_id').value).to.equal('number');
      }
    ));

  });


  // helpers //////////////

  function queryOverlay(elementId) {
    const containerEl = domQuery('[data-container-id="' + elementId + '"]', container);
    return containerEl && domQuery('.dms-type-ref-dropdown', containerEl);
  }

  function querySelect(elementId) {
    const overlay = queryOverlay(elementId);
    return overlay && domQuery('select', overlay);
  }

  function triggerSelectChange(selectEl, value) {
    selectEl.value = value;
    selectEl.dispatchEvent(new Event('change'));
  }

});
