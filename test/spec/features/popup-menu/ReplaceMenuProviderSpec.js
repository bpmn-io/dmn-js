'use strict';

/* global bootstrapModeler, inject */

var TestHelper = require('../../TestHelper');

var coreModule = require('../../../../lib/core'),
    modelingModule = require('../../../../lib/features/modeling'),
    replaceMenuProviderModule = require('../../../../lib/features/popup-menu'),
    customRulesModule = require('../../../util/custom-rules');

var domQuery = require('min-dom/lib/query'),
    find = require('lodash/collection/find');

function queryEntry(popupMenu, id) {
  return queryPopup(popupMenu, '[data-id="' + id + '"]');
}

function queryPopup(popupMenu, selector) {
  return domQuery(selector, popupMenu._current.container);
}

/**
 * Gets all menu entries from the current open popup menu
 *
 * @param  {PopupMenu} popupMenu
 *
 * @return {<Array>}
 */
function getEntries(popupMenu) {
  var element = popupMenu._current.element;

  return popupMenu._current.provider.getEntries(element);
}

function triggerAction(entries, id) {
  var entry = find(entries, { id: id });

  if (!entry) {
    throw new Error('entry "'+ id +'" not found in replace menu');
  }

  entry.action();
}


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

    TestHelper.getDrdJS().invoke(function(popupMenu) {

      popupMenu.create('dmn-replace', element);

      popupMenu.open({ x: element.x + offset, y: element.y + offset });

    });
  };


  describe('replace menu', function() {


    describe('decisions', function() {

      beforeEach(bootstrapModeler(diagramXMLReplace, { modules: testModules }));

      it('should contain all options except the current one',
        inject(function(popupMenu, drdReplace, elementRegistry) {

          // given
          var decision = elementRegistry.get('decision');

          // when
          openPopup(decision);

          // then
          expect(queryEntry(popupMenu, 'replace-with-empty-decision')).to.be.null;
          expect(getEntries(popupMenu)).to.have.length(2);
        })
      );

    });

  });

  describe('integration', function() {


    describe('decisions', function() {

      beforeEach(bootstrapModeler(diagramXMLReplace, { modules: testModules }));

      it('should replace empty decision with decision table',
          inject(function(popupMenu, drdReplace, elementRegistry) {

            // given
            var decision = elementRegistry.get('decision');

            // when
            openPopup(decision);
            var entries = getEntries(popupMenu);
            triggerAction(entries, 'replace-with-decision-table');

            // then
            decision = elementRegistry.get('decision');
            expect(decision.businessObject.decisionTable).to.exist;
          })
        );

      it('should replace empty decision with literal expression',
          inject(function(popupMenu, drdReplace, elementRegistry) {

            // given
            var decision = elementRegistry.get('decision');

            // when
            openPopup(decision);
            var entries = getEntries(popupMenu);
            triggerAction(entries, 'replace-with-literal-expression');

            // then
            decision = elementRegistry.get('decision');
            expect(decision.businessObject.literalExpression).to.exist;
          })
        );

    });

  });
});
