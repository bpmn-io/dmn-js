import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import labelEditingModule from 'src/features/label-editing';
import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';
import createModule from 'diagram-js/lib/features/create';
import draggingModule from 'diagram-js/lib/features/dragging';

import {
  getLabel
} from 'src/features/label-editing/LabelUtil';

import {
  createCanvasEvent as canvasEvent
} from 'test/util/MockEvents';


function triggerKeyEvent(element, event, code) {
  var e = document.createEvent('Events');

  if (e.initEvent) {
    e.initEvent(event, true, true);
  }

  e.keyCode = code;
  e.which = code;

  return element.dispatchEvent(e);
}

describe('features - label-editing', function() {

  var diagramXML = require('../../../fixtures/dmn/di.dmn');

  var testModules = [
    modelingModule,
    labelEditingModule,
    coreModule,
    createModule,
    draggingModule
  ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  var setText;

  beforeEach(inject(function(eventBus, directEditing, elementRegistry) {

    setText = function(shape, value) {
      eventBus.fire('element.dblclick', { element: shape });

      // get the textBox Content (a <div> element)
      var textBoxContent = directEditing._textbox.content;
      textBoxContent.textContent = value;

      directEditing.complete();
    };

  }));


  describe('basics', function() {

    it('should register on dblclick', inject(
      function(elementRegistry, directEditing, eventBus) {

        // given
        var shape = elementRegistry.get('dish-decision');

        // when
        eventBus.fire('element.dblclick', { element: shape });

        // then
        expect(directEditing.isActive()).to.be.true;
      }
    ));


    it('should cancel on <ESC>', inject(
      function(elementRegistry, directEditing, eventBus) {

        // given
        var shape = elementRegistry.get('dish-decision'),
            decision = shape.businessObject;

        var oldName = decision.name;

        // activate
        eventBus.fire('element.dblclick', { element: shape });

        // get the textBox Content (a <div> element)
        var textBoxContent = directEditing._textbox.content;

        // when
        // change + ESC is pressed
        textBoxContent.textContent = 'new value';
        triggerKeyEvent(textBoxContent, 'keydown', 27);

        // then
        expect(directEditing.isActive()).to.be.false;
        expect(decision.name).to.equal(oldName);
      }
    ));


    it('should complete on drag start', inject(
      function(elementRegistry, directEditing, dragging) {

        // given
        var shape = elementRegistry.get('dish-decision'),
            decision = shape.businessObject;

        directEditing.activate(shape);

        // get the textBox Content (a <div> element)
        var textBoxContent = directEditing._textbox.content;
        textBoxContent.textContent = 'FOO BAR';

        // when
        dragging.init(null, { x: 0, y: 0 }, 'foo');

        // then
        expect(decision.name).to.equal('FOO BAR');
      }
    ));

  });


  describe('elements', function() {

    it('should edit InputData', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('dayType_id');

      // when
      setText(shape, 'FOO');

      // then
      expect(getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.name).to.equal('FOO');

    }));


    it('should edit KnowledgeSource', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('guest_ks');

      // when
      setText(shape, 'FOO');

      // then
      expect(getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.name).to.equal('FOO');
    }));


    it('should edit BusinessKnowledgeModel', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('elMenu');

      // when
      setText(shape, 'FOO');

      // then
      expect(getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.name).to.equal('FOO');
    }));


    it('should edit Decision', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('dish-decision');

      // when
      setText(shape, 'FOO');

      // then
      expect(getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.name).to.equal('FOO');
    }));


    it('should edit Text-Annotation', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('TextAnnotation_1t4zaz9');

      // when
      setText(shape, 'FOO');

      // then
      expect(getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.text).to.equal('FOO');
    }));


    it('should not activate directEditing - Root', inject(
      function(canvas, eventBus, directEditing) {

        // given
        var shape = canvas.getRootElement();

        // when
        eventBus.fire('element.dblclick', { element: shape });

        // then
        expect(directEditing.isActive()).to.be.false;
      }
    ));


    it('should not activate directEditing - Connection', inject(
      function(eventBus, elementRegistry, directEditing) {

        // given
        var shape = elementRegistry.get('Association_1c4jixb');

        // when
        eventBus.fire('element.dblclick', { element: shape });

        // then
        expect(directEditing.isActive()).to.be.false;
      }
    ));

  });

  describe('after create', function() {

    var createElement;

    beforeEach(inject(
      function(canvas, create, dragging, elementFactory, elementRegistry) {

        createElement = function(type) {

          var shape = elementFactory.create('shape', { type: type }),
              parent = canvas.getRootElement(),
              parentGfx = elementRegistry.getGraphics(parent);

          create.start(canvasEvent({ x: 0, y: 0 }), shape);

          dragging.hover({
            element: parent,
            gfx: parentGfx
          });

          dragging.move(canvasEvent({ x: 400, y: 250 }));
          dragging.end();
        };
      }
    ));

    it('should activate on Decision', inject(function(directEditing) {

      // when
      createElement('dmn:Decision');

      // then
      expect(directEditing.isActive()).to.be.true;
    }));


    it('should activate on InputData', inject(function(directEditing) {

      // when
      createElement('dmn:InputData');

      // then
      expect(directEditing.isActive()).to.be.true;
    }));


    it('should activate on BusinessKnowledgeModel', inject(function(directEditing) {

      // when
      createElement('dmn:BusinessKnowledgeModel');

      // then
      expect(directEditing.isActive()).to.be.true;
    }));


    it('should activate on KnowledgeSource', inject(function(directEditing) {

      // when
      createElement('dmn:KnowledgeSource');

      // then
      expect(directEditing.isActive()).to.be.true;
    }));


    it('should activate on TextAnnotation', inject(function(directEditing) {

      // when
      createElement('dmn:TextAnnotation');

      // then
      expect(directEditing.isActive()).to.be.true;
    }));

  });

});
