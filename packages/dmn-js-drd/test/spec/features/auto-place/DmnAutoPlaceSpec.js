import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import autoPlaceModule from 'lib/features/auto-place';
import coreModule from 'lib/core';
import labelEditingModule from 'lib/features/label-editing';
import modelingModule from 'lib/features/modeling';
import selectionModule from 'diagram-js/lib/features/selection';

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';


describe('features/auto-place', function() {

  describe('element placement', function() {

    var diagramXML = require('./DmnAutoPlace.dmn');

    before(bootstrapModeler(diagramXML, {
      modules: [
        coreModule,
        modelingModule,
        autoPlaceModule,
        selectionModule
      ]
    }));


    describe('should place dmn:Decision', function() {

      describe('should place dmn:Decision', function() {

        it('at default distance after Decision_1', autoPlace({
          element: 'dmn:Decision',
          behind: 'Decision_1',
          expectedBounds: {
            x: 160,
            y: 330,
            width: 180,
            height: 80
          }
        }));


        it('at default distance after Decision_2 next to Decision_3', autoPlace({
          element: 'dmn:Decision',
          behind: 'Decision_2',
          expectedBounds: {
            x: 580,
            y: 330,
            width: 180,
            height: 80
          }
        }));


        it('at distance of Decision_5 after Decision_4 next to Decision_5', autoPlace({
          element: 'dmn:Decision',
          behind: 'Decision_4',
          expectedBounds: {
            x: 880,
            y: 370,
            width: 180,
            height: 80
          }
        }));


        it('at default distance of Decision_6 ignoring Decision_7', autoPlace({
          element: 'dmn:Decision',
          behind: 'Decision_6',
          expectedBounds: {
            x: 790,
            y: 330,
            width: 180,
            height: 80
          }
        }));

      });

    });


    describe('should place dmn:TextAnnotation', function() {

      it('top right of source', autoPlace({
        element: 'dmn:TextAnnotation',
        behind: 'Decision_1',
        expectedBounds: {
          x: 340,
          y: 70,
          width: 100,
          height: 80
        }
      }));


      it('above existing', autoPlace({
        element: 'dmn:TextAnnotation',
        behind: 'Decision_2',
        expectedBounds: {
          x: 550,
          y: -30,
          width: 100,
          height: 80
        }
      }));

    });

  });


  describe('integration', function() {

    var diagramXML = require('./DmnAutoPlace.dmn');

    before(bootstrapModeler(diagramXML, {
      modules: [
        autoPlaceModule,
        coreModule,
        labelEditingModule,
        modelingModule,
        selectionModule
      ]
    }));


    it('should complete direct edit on autoPlace', inject(
      function(autoPlace, directEditing, elementFactory, elementRegistry) {

        // given
        var element = elementFactory.createShape({ type: 'dmn:Decision' });

        var source = elementRegistry.get('Decision_1');

        directEditing.activate(source);

        directEditing._textbox.content.textContent = 'foo';

        // when
        autoPlace.append(source, element);

        // then
        expect(getBusinessObject(source).name).to.equal('foo');
      }
    ));


    it('should select + direct edit on autoPlace', inject(
      function(autoPlace, elementRegistry, elementFactory, selection, directEditing) {

        // given
        var element = elementFactory.createShape({ type: 'dmn:Decision' });

        var source = elementRegistry.get('Decision_1');

        // when
        var newShape = autoPlace.append(source, element);

        // then
        expect(selection.get()).to.eql([ newShape ]);

        expect(directEditing.isActive()).to.be.true;
        expect(directEditing._active.element).to.equal(newShape);
      }
    ));

  });

});


// helpers //////////

function autoPlace(cfg) {

  var element = cfg.element,
      behind = cfg.behind,
      expectedBounds = cfg.expectedBounds;

  return inject(function(autoPlace, elementRegistry, elementFactory) {

    var sourceEl = elementRegistry.get(behind);

    // assume
    expect(sourceEl).to.exist;

    if (typeof element === 'string') {
      element = { type: element };
    }

    var shape = elementFactory.createShape(element);

    // when
    var placedShape = autoPlace.append(sourceEl, shape, {
      connectionTarget: sourceEl
    });

    // then
    expect(placedShape).to.have.bounds(expectedBounds);
  });
}
