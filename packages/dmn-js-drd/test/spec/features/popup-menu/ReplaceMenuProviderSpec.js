import {
  bootstrapModeler,
  getDrdJS,
  inject
} from '../../../TestHelper';

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

  });


  describe('integration', function() {


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
          expect(decision.businessObject.decisionTable).to.exist;
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
          expect(decision.businessObject.literalExpression).to.exist;
        })
      );

    });

  });
});


// helpers /////////////////

function queryEntry(id) {
  var container = getDrdJS().get('canvas').getContainer();

  return domQuery('.djs-popup [data-id="' + id + '"]', container);
}

function queryEntries() {
  var container = getDrdJS().get('canvas').getContainer();

  return domQueryAll('.djs-popup .entry', container);
}

function triggerAction(id) {
  var entry = queryEntry(id);

  if (!entry) {
    throw new Error('entry "'+ id +'" not found in replace menu');
  }

  var popupMenu = getDrdJS().get('popupMenu');

  popupMenu.trigger(globalEvent(entry, { x: 0, y: 0 }));
}
