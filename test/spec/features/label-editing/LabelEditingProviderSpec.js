'use strict';

require('../../TestHelper');

/* global bootstrapViewer, inject */


var labelEditingModule = require('../../../../lib/features/label-editing'),
    modelingModule = require('../../../../lib/features/modeling'),
    coreModule = require('../../../../lib/core'),
    draggingModule = require('diagram-js/lib/features/dragging');

var LabelUtil = require('../../../../lib/features/label-editing/LabelUtil');


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

  var testModules = [ labelEditingModule, coreModule, draggingModule, modelingModule ];

  beforeEach(bootstrapViewer(diagramXML, { modules: testModules }));

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

    it('should register on dblclick', inject(function(elementRegistry, directEditing, eventBus) {

      // given
      var shape = elementRegistry.get('dish-decision');

      // when
      eventBus.fire('element.dblclick', { element: shape });

      // then
      expect(directEditing.isActive()).to.be.true;
    }));


    it('should cancel on <ESC>', inject(function(elementRegistry, directEditing, eventBus) {

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
    }));


    it('should complete on drag start', inject(function(elementRegistry, directEditing, dragging) {

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
    }));

  });


  describe('elements', function() {

    it('should edit InputData', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('dayType_id');

      // when
      setText(shape, 'FOO');

      // then
      expect(LabelUtil.getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.name).to.equal('FOO');

    }));


    it('should edit KnowledgeSource', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('guest_ks');

      // when
      setText(shape, 'FOO');

      // then
      expect(LabelUtil.getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.name).to.equal('FOO');
    }));


    it('should edit BusinessKnowledgeModel', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('elMenu');

      // when
      setText(shape, 'FOO');

      // then
      expect(LabelUtil.getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.name).to.equal('FOO');
    }));


    it('should edit Decision', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('dish-decision');

      // when
      setText(shape, 'FOO');

      // then
      expect(LabelUtil.getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.name).to.equal('FOO');
    }));


    it('should edit Text-Annotation', inject(function(elementRegistry) {

      // given
      var shape = elementRegistry.get('TextAnnotation_1t4zaz9');

      // when
      setText(shape, 'FOO');

      // then
      expect(LabelUtil.getLabel(shape)).to.equal('FOO');
      expect(shape.businessObject.text).to.equal('FOO');
    }));

    it('should not activate directEditing - Root', inject(function(canvas, eventBus, directEditing) {

      // given
      var shape = canvas.getRootElement();

      // when
      eventBus.fire('element.dblclick', { element: shape });

      // then
      expect(directEditing.isActive()).to.be.false;
    }));

    it('should not activate directEditing - Connection', inject(function(eventBus, elementRegistry, directEditing) {

      // given
      var shape = elementRegistry.get('Association_1c4jixb');

      // when
      eventBus.fire('element.dblclick', { element: shape });

      // then
      expect(directEditing.isActive()).to.be.false;
    }));

  });

});
