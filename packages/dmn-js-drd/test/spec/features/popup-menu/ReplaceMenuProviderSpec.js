import { expect } from 'chai';
import {
  bootstrapModeler,
  getDrdJS,
  inject
} from '../../../TestHelper';

import {
  getBoxedExpression,
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import replaceMenuProviderModule from 'src/features/popup-menu';
import customRulesModule from '../../../util/custom-rules';

import {
  createEvent as globalEvent
} from '../../../util/MockEvents';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';


describe('features/popup-menu - replace menu provider', function() {

  var diagramXMLReplace = require('./replaceMenu.dmn');

  var testModules = [
    coreModule,
    modelingModule,
    replaceMenuProviderModule,
    customRulesModule
  ];

  var openPopup = function(element, offset) {
    offset = offset || 100;

    getDrdJS().invoke(function(popupMenu) {

      var position = {
        x: element.x + offset,
        y: element.y + offset
      };

      popupMenu.open(
        element,
        'dmn-replace',
        position
      );
    });
  };


  describe('replace menu', function() {


    describe('decisions', function() {

      beforeEach(bootstrapModeler(diagramXMLReplace, { modules: testModules }));

      it('should contain all options except the current one',
        inject(function(drdReplace, elementRegistry) {

          // given
          var decision = elementRegistry.get('decision');

          // when
          openPopup(decision);

          // then
          expect(queryEntry('replace-with-empty-decision')).to.be.null;
          expect(queryEntries()).to.have.length(2);
        })
      );

    });


    describe('business knowledge models', function() {

      beforeEach(bootstrapModeler(diagramXMLReplace, { modules: testModules }));

      it('should contain all options except the current one',
        inject(function(elementRegistry) {

          // given
          var bkm = elementRegistry.get('bkm');

          // when
          openPopup(bkm);

          // then
          expect(queryEntry('replace-with-empty')).to.be.null;
          expect(queryEntries()).to.have.length(2);
        })
      );


      it('should offer decision table',
        inject(function(elementRegistry) {

          // given
          var bkm = elementRegistry.get('bkm');

          // when
          openPopup(bkm);

          // then
          expect(queryEntry('replace-with-decision-table')).to.exist;
        })
      );


      it('should NOT offer literal expression if BKM has literal expression',
        inject(function(elementRegistry) {

          // given
          var bkm = elementRegistry.get('bkmLiteral');

          // when
          openPopup(bkm);

          // then
          expect(queryEntry('replace-with-literal-expression')).to.be.null;
          expect(queryEntries()).to.have.length(2);
        })
      );


      it('should NOT offer decision table if BKM has decision table',
        inject(function(elementRegistry) {

          // given
          var bkm = elementRegistry.get('bkmTable');

          // when
          openPopup(bkm);

          // then
          expect(queryEntry('replace-with-decision-table')).to.be.null;
          expect(queryEntries()).to.have.length(2);
        })
      );

    });

  });


  describe('integration', function() {

    describe('business knowledge models', function() {

      beforeEach(bootstrapModeler(diagramXMLReplace, { modules: testModules }));

      it('should define decision table as body of encapsulated logic',
        inject(function(elementRegistry) {

          // given
          var bkm = elementRegistry.get('bkm');

          // when
          openPopup(bkm);

          triggerAction('replace-with-decision-table');

          // then
          var encapsulatedLogic = elementRegistry.get('bkm')
            .businessObject.encapsulatedLogic;

          expect(is(encapsulatedLogic, 'dmn:FunctionDefinition')).to.be.true;
          expect(is(encapsulatedLogic.body, 'dmn:DecisionTable')).to.be.true;
        })
      );


      it('should create decision table with input and output',
        inject(function(elementRegistry) {

          // given
          var bkm = elementRegistry.get('bkm');

          // when
          openPopup(bkm);

          triggerAction('replace-with-decision-table');

          // then
          var table = getBoxedExpression(elementRegistry.get('bkm').businessObject);

          expect(table.input).to.have.length(1);
          expect(table.output).to.have.length(1);
        })
      );


      it('should keep variable',
        inject(function(elementRegistry) {

          // given
          var bkm = elementRegistry.get('bkm');

          var variable = bkm.businessObject.variable;

          // when
          openPopup(bkm);

          triggerAction('replace-with-decision-table');

          // then
          expect(elementRegistry.get('bkm').businessObject.variable).to.equal(variable);
        })
      );


      it('should replace literal expression with decision table',
        inject(function(elementRegistry) {

          // given
          var bkm = elementRegistry.get('bkmLiteral');

          // when
          openPopup(bkm);

          triggerAction('replace-with-decision-table');

          // then
          bkm = elementRegistry.get('bkmLiteral');

          expect(
            is(getBoxedExpression(bkm.businessObject), 'dmn:DecisionTable')
          ).to.be.true;
        })
      );


      it('should replace decision table with literal expression',
        inject(function(elementRegistry) {

          // given
          var bkm = elementRegistry.get('bkmTable');

          // when
          openPopup(bkm);

          triggerAction('replace-with-literal-expression');

          // then
          bkm = elementRegistry.get('bkmTable');

          expect(
            is(getBoxedExpression(bkm.businessObject), 'dmn:LiteralExpression')
          ).to.be.true;
        })
      );

    });


    describe('decisions', function() {

      beforeEach(bootstrapModeler(diagramXMLReplace, { modules: testModules }));

      it('should replace empty decision with decision table',
        inject(function(drdReplace, elementRegistry) {

          // given
          var decision = elementRegistry.get('decision');

          // when
          openPopup(decision);

          triggerAction('replace-with-decision-table');

          // then
          decision = elementRegistry.get('decision');

          expect(
            is(decision.businessObject.decisionLogic, 'dmn:DecisionTable')
          ).to.be.true;
        })
      );


      it('should replace empty decision with literal expression',
        inject(function(drdReplace, elementRegistry) {

          // given
          var decision = elementRegistry.get('decision');

          // when
          openPopup(decision);

          triggerAction('replace-with-literal-expression');

          // then
          decision = elementRegistry.get('decision');

          expect(
            is(decision.businessObject.decisionLogic, 'dmn:LiteralExpression')
          ).to.be.true;
        })
      );

    });

  });
});


// helpers /////////////////

function queryEntry(id) {
  var container = getMenuContainer();

  return domQuery('.djs-popup [data-id="' + id + '"]', container);
}

function queryEntries() {
  var container = getMenuContainer();

  return domQueryAll('.djs-popup .entry', container);
}

function triggerAction(id) {
  var entry = queryEntry(id);

  if (!entry) {
    throw new Error('entry "' + id + '" not found in replace menu');
  }

  var popupMenu = getDrdJS().get('popupMenu');

  popupMenu.trigger(globalEvent(entry, { x: 0, y: 0 }));
}

function getMenuContainer() {
  const popup = getDrdJS().get('popupMenu');
  return popup._current.container;
}
