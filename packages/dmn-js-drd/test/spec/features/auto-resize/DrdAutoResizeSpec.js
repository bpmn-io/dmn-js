import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import autoResizeModule from 'src/features/auto-resize';
import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';


describe('features/auto-resize', function() {

  var diagramXML = require('./auto-resize.dmn');

  var testModules = [
    autoResizeModule,
    coreModule,
    modelingModule
  ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('rules', function() {

    it('should allow auto-resize on dmn:DecisionService with dmn:Decision',
      inject(function(drdAutoResizeProvider, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1'),
            decision = elementRegistry.get('Decision_Inside');

        // when
        var canResize = drdAutoResizeProvider.canResize([ decision ], decisionService);

        // then
        expect(canResize).to.be.true;
      })
    );


    it('should NOT allow auto-resize on non dmn:DecisionService target',
      inject(function(drdAutoResizeProvider, elementRegistry, canvas) {

        // given
        var root = canvas.getRootElement(),
            decision = elementRegistry.get('Decision_Inside');

        // when
        var canResize = drdAutoResizeProvider.canResize([ decision ], root);

        // then
        expect(canResize).to.be.false;
      })
    );


    it('should NOT allow auto-resize for non dmn:Decision elements',
      inject(function(drdAutoResizeProvider, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1'),
            inputData = elementRegistry.get('InputData_Outside');

        // when
        var canResize = drdAutoResizeProvider.canResize([ inputData ], decisionService);

        // then
        expect(canResize).to.be.false;
      })
    );

  });


  describe('behavior', function() {

    it('should expand dmn:DecisionService when child moved near right edge',
      inject(function(modeling, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1'),
            decision = elementRegistry.get('Decision_Inside');

        var oldWidth = decisionService.width;

        // when
        modeling.moveElements([ decision ], { x: 110, y: 0 }, decisionService);

        // then
        expect(decisionService.width).to.be.above(oldWidth);
        expect(decisionService.x + decisionService.width)
          .to.be.at.least(decision.x + decision.width);
      })
    );


    it('should expand dmn:DecisionService when child moved near bottom edge',
      inject(function(modeling, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1'),
            decision = elementRegistry.get('Decision_Inside');

        var oldHeight = decisionService.height;

        // when
        modeling.moveElements([ decision ], { x: 0, y: 180 }, decisionService);

        // then
        expect(decisionService.height).to.be.above(oldHeight);
        expect(decisionService.y + decisionService.height)
          .to.be.at.least(decision.y + decision.height);
      })
    );


    it('should NOT expand dmn:DecisionService when child stays inside padding',
      inject(function(modeling, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1'),
            decision = elementRegistry.get('Decision_Inside');

        var oldBounds = {
          x: decisionService.x,
          y: decisionService.y,
          width: decisionService.width,
          height: decisionService.height
        };

        // when
        modeling.moveElements([ decision ], { x: 20, y: 20 }, decisionService);

        // then
        expect(decisionService.x).to.equal(oldBounds.x);
        expect(decisionService.y).to.equal(oldBounds.y);
        expect(decisionService.width).to.equal(oldBounds.width);
        expect(decisionService.height).to.equal(oldBounds.height);
      })
    );


    it('should undo auto-resize',
      inject(function(modeling, elementRegistry, commandStack) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1'),
            decision = elementRegistry.get('Decision_Inside');

        var oldBounds = {
          x: decisionService.x,
          y: decisionService.y,
          width: decisionService.width,
          height: decisionService.height
        };

        modeling.moveElements([ decision ], { x: 110, y: 0 }, decisionService);

        // when
        commandStack.undo();

        // then
        expect(decisionService.x).to.equal(oldBounds.x);
        expect(decisionService.y).to.equal(oldBounds.y);
        expect(decisionService.width).to.equal(oldBounds.width);
        expect(decisionService.height).to.equal(oldBounds.height);
      })
    );

  });

});