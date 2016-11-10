'use strict';

var TestHelper = require('../../TestHelper');

var TestContainer = require('mocha-test-container-support');

var domQuery = require('min-dom/lib/query');

var is = require('../../../../lib/util/ModelUtil').is;


/* global bootstrapModeler, inject */


var contextPadModule = require('../../../../lib/features/context-pad'),
    coreModule = require('../../../../lib/core'),
    modelingModule = require('../../../../lib/features/modeling'),
    createModule = require('diagram-js/lib/features/create'),
    customRulesModule = require('../../../util/custom-rules');


describe('features - context-pad', function() {

  var testModules = [
    coreModule,
    modelingModule,
    contextPadModule,
    createModule,
    customRulesModule
  ];


  describe('remove action rules', function() {

    var diagramXML = require('../../../fixtures/dmn/input-data.dmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


    var deleteAction;

    beforeEach(inject(function(contextPad) {

      deleteAction = function(element) {
        return padEntry(contextPad.getPad(element).html, 'delete');
      };
    }));


    it('should add delete action by default', inject(function(elementRegistry, contextPad) {

      // given
      var element = elementRegistry.get('dayType_id');

      // when
      contextPad.open(element);

      // then
      expect(deleteAction(element)).to.exist;
    }));


    it('should include delete action when rule returns true',
      inject(function(elementRegistry, contextPad, customRules) {

        // given
        customRules.addRule('elements.delete', 1500, function() {
          return true;
        });

        var element = elementRegistry.get('dayType_id');

        // when
        contextPad.open(element);

        // then
        expect(deleteAction(element)).to.exist;
      })
    );


    it('should NOT include delete action when rule returns false',
      inject(function(elementRegistry, contextPad, customRules) {

        // given
        customRules.addRule('elements.delete', 1500, function() {
          return false;
        });

        var element = elementRegistry.get('dayType_id');

        // when
        contextPad.open(element);

        // then
        expect(deleteAction(element)).to.not.exist;
      })
    );


    it('should call rules with [ element ]', inject(function(elementRegistry, contextPad, customRules) {

      // given
      var element = elementRegistry.get('dayType_id');

      customRules.addRule('elements.delete', 1500, function(context) {

        // element array is actually passed
        expect(context.elements).to.eql([ element ]);

        return true;
      });

      // then
      expect(function() {
        contextPad.open(element);
      }).not.to.throw;
    }));


    it('should include delete action when [ element ] is returned from rule',
      inject(function(elementRegistry, contextPad, customRules) {

        // given
        customRules.addRule('elements.delete', 1500, function(context) {
          return context.elements;
        });

        var element = elementRegistry.get('dayType_id');

        // when
        contextPad.open(element);

        // then
        expect(deleteAction(element)).to.exist;
      })
    );


    it('should NOT include delete action when [ ] is returned from rule',
      inject(function(elementRegistry, contextPad, customRules) {

        // given
        customRules.addRule('elements.delete', 1500, function() {
          return [];
        });

        var element = elementRegistry.get('dayType_id');

        // when
        contextPad.open(element);

        // then
        expect(deleteAction(element)).to.not.exist;
      })
    );

  });


  describe('available entries', function() {

    var diagramXML = require('./ContextPad.dmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    function expectContextPadEntries(elementOrId, expectedEntries) {

      TestHelper.getDrdJS().invoke(function(elementRegistry, contextPad) {

        var element = typeof elementOrId === 'string' ? elementRegistry.get(elementOrId) : elementOrId;

        contextPad.open(element, true);

        var entries = contextPad._current.entries;

        expect(Object.keys(entries)).to.have.length(Object.keys(expectedEntries).length);

        expectedEntries.forEach(function(name) {

          if (name.charAt(0) === '!') {
            name = name.substring(1);

            expect(entries).not.to.have.property(name);
          } else {
            expect(entries).to.have.property(name);
          }
        });
      });
    }


    it('should provide entries for Decision', inject(function() {

      expectContextPadEntries('guestCount', [
        'connect',
        'replace',
        'delete',
        'append.knowledge-source',
        'append.input-data',
        'append.text-annotation',
        'append.decision'
      ]);
    }));


    it('should provide entries for InputData', inject(function() {

      expectContextPadEntries('dayType_id', [
        'connect',
        'delete',
        'append.text-annotation',
        'append.knowledge-source',
        'append.decision'
      ]);
    }));


    it('should provide entries for KnowledgeSource', inject(function() {

      expectContextPadEntries('host_ks', [
        'connect',
        'delete',
        'append.text-annotation',
        'append.knowledge-source',
        'append.decision',
        'append.business-knowledge-model'
      ]);
    }));


    it('should provide entries for BusinessKnowledgeModel', inject(function() {

      expectContextPadEntries('elMenu', [
        'connect',
        'delete',
        'append.text-annotation',
        'append.decision',
        'append.business-knowledge-model'
      ]);
    }));


    it('should provide entries for TextAnnotation', inject(function() {

      expectContextPadEntries('TextAnnotation_1t4zaz9', [
        'delete'
      ]);
    }));

  });

  describe('replace', function() {

    var diagramXML = require('./ContextPad.dmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    var container;

    beforeEach(function() {
      container = TestContainer.get(this);
    });


    it('should show popup menu in the correct position', inject(function(elementRegistry, contextPad) {

      // given
      var element = elementRegistry.get('guestCount'),
          padding = 5,
          replaceMenuRect,
          padMenuRect;

      contextPad.open(element);
      padMenuRect = contextPad.getPad(element).html.getBoundingClientRect();

      // mock event
      var event = {
        target: padEntry(container, 'replace'),
        preventDefault: function() {}
      };

      // when
      contextPad.trigger('click', event);
      replaceMenuRect = domQuery('.dmn-replace', container).getBoundingClientRect();

      // then
      expect(replaceMenuRect.left).to.be.at.most(padMenuRect.left);
      expect(replaceMenuRect.top).to.be.at.most(padMenuRect.bottom + padding);
    }));


    it('should not include control if replacement is disallowed',
      inject(function(elementRegistry, contextPad, customRules) {

        // given
        var element = elementRegistry.get('guestCount');

        // disallow replacement
        customRules.addRule('shape.replace', function(context) {
          return !is(context.element, 'dmn:Decision');
        });

        // when
        contextPad.open(element);

        var padNode = contextPad.getPad(element).html;

        // then
        expect(padEntry(padNode, 'replace')).not.to.exist;
      }));

  });

});


function padEntry(element, name) {
  return domQuery('[data-action="' + name + '"]', element);
}
