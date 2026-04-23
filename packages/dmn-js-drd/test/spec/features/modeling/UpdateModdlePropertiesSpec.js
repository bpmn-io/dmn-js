/* global sinon */

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';
import overlaysModule from 'diagram-js/lib/features/overlays';
import dataTypesModule from 'dmn-js-shared/lib/features/data-types';

var testModules = [ coreModule, modelingModule, overlaysModule, dataTypesModule ];


describe('features/modeling - update moddle properties', function() {

  describe('updating dmn:Decision', function() {

    var diagramXML = require('./UpdateModdleProperties.dmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


    it('should update', inject(function(elementRegistry, modeling, eventBus) {

      // given
      var decision = elementRegistry.get('Decision_1'),
          businessObject = getBusinessObject(decision);

      var changedElements;

      var elementsChangedListener = sinon.spy(function(event) {
        changedElements = event.elements;
      });

      eventBus.on('elements.changed', elementsChangedListener);

      // assume
      expect(businessObject.get('name')).to.eql('Decision 1');

      // when
      modeling.updateModdleProperties(decision, businessObject, { name: 'Decision 2' });

      // then
      expect(businessObject.get('name')).to.eql('Decision 2');

      // changed affected elements
      expect(changedElements).to.eql([
        decision
      ]);
    }));

  });

});