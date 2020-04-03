import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';

import {
  asTRBL,
  getMid
} from 'diagram-js/lib/layout/LayoutUtil';
import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';


describe('features/modeling - layout connection', function() {

  var diagramXML = require('./LayoutConnection.dmn');

  var testModules = [
    coreModule,
    modelingModule
  ];

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  describe('dmn:InformationRequirement', function() {

    var decision1,
        decision2,
        informationRequirement,
        informationRequirementDi;

    beforeEach(inject(function(canvas, elementFactory, elementRegistry, modeling) {
      decision1 = elementRegistry.get('Decision_1');
      decision2 = elementRegistry.get('Decision_2');

      informationRequirement = elementFactory.createConnection({
        type: 'dmn:InformationRequirement',
        source: decision2,
        target: decision1,
        waypoints: [
          getMid(decision2),
          getMid(decision1)
        ]
      });

      informationRequirementDi = getBusinessObject(informationRequirement).di;

      canvas.addConnection(informationRequirement, canvas.getRootElement());

      modeling.layoutConnection(informationRequirement, {
        connectionStart: {
          x: getMid(decision2).x,
          y: asTRBL(decision2).top
        },
        connectionEnd: {
          x: getMid(decision1).x,
          y: asTRBL(decision1).bottom
        }
      });
    }));


    it('<do>', function() {

      // then
      expect(informationRequirement.waypoints).to.eql([{
        original: {
          x: 290,
          y: 200
        },
        x: 290,
        y: 200
      }, {
        x: 90,
        y: 100
      }, {
        original: {
          x: 90,
          y: 80
        },
        x: 90,
        y: 80
      }]);

      expect(informationRequirementDi.waypoint[ 0 ]).to.include({
        x: 290,
        y: 200
      });

      expect(informationRequirementDi.waypoint[ 1 ]).to.include({
        x: 90,
        y: 100
      });

      expect(informationRequirementDi.waypoint[ 2 ]).to.include({
        x: 90,
        y: 80
      });
    });


    it('<undo>', inject(function(commandStack) {

      // when
      commandStack.undo();

      // then
      expect(informationRequirement.waypoints).to.eql([
        getMid(decision2),
        getMid(decision1)
      ]);

      expect(informationRequirementDi.waypoint[ 0 ]).to.include(getMid(decision2));

      expect(informationRequirementDi.waypoint[ 1 ]).to.include(getMid(decision1));
    }));


    it('<redo>', inject(function(commandStack) {

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(informationRequirement.waypoints).to.eql([{
        original: {
          x: 290,
          y: 200
        },
        x: 290,
        y: 200
      }, {
        x: 90,
        y: 100
      }, {
        original: {
          x: 90,
          y: 80
        },
        x: 90,
        y: 80
      }]);

      expect(informationRequirementDi.waypoint[ 0 ]).to.include({
        x: 290,
        y: 200
      });

      expect(informationRequirementDi.waypoint[ 1 ]).to.include({
        x: 90,
        y: 100
      });

      expect(informationRequirementDi.waypoint[ 2 ]).to.include({
        x: 90,
        y: 80
      });
    }));

  });


  describe('dmn:AuthorityRequirement', function() {

    var decision2,
        knowledgeSource,
        authorityRequirement,
        authorityRequirementDi;

    beforeEach(inject(function(canvas, elementFactory, elementRegistry, modeling) {
      decision2 = elementRegistry.get('Decision_2');
      knowledgeSource = elementRegistry.get('KnowledgeSource_1');

      authorityRequirement = elementFactory.createConnection({
        type: 'dmn:AuthorityRequirement',
        source: knowledgeSource,
        target: decision2,
        waypoints: [
          getMid(knowledgeSource),
          getMid(decision2)
        ]
      });

      authorityRequirementDi = getBusinessObject(authorityRequirement).di;

      canvas.addConnection(authorityRequirement, canvas.getRootElement());

      modeling.layoutConnection(authorityRequirement, {
        connectionStart: {
          x: getMid(knowledgeSource).x,
          y: asTRBL(knowledgeSource).top
        },
        connectionEnd: {
          x: getMid(decision2).x,
          y: asTRBL(decision2).bottom
        }
      });
    }));


    it('<do>', function() {

      // then
      expect(authorityRequirement.waypoints).to.eql([{
        original: {
          x: 50,
          y: 400
        },
        x: 50,
        y: 400
      }, {
        original: {
          x: 290,
          y: 280
        },
        x: 290,
        y: 280
      }]);

      expect(authorityRequirementDi.waypoint[ 0 ]).to.include({
        x: 50,
        y: 400
      });

      expect(authorityRequirementDi.waypoint[ 1 ]).to.include({
        x: 290,
        y: 280
      });

    });


    it('<undo>', inject(function(commandStack) {

      // when
      commandStack.undo();

      // then
      expect(authorityRequirement.waypoints).to.eql([
        getMid(knowledgeSource),
        getMid(decision2)
      ]);

      expect(authorityRequirementDi.waypoint[ 0 ]).to.include(getMid(knowledgeSource));

      expect(authorityRequirementDi.waypoint[ 1 ]).to.include(getMid(decision2));
    }));


    it('<redo>', inject(function(commandStack) {

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(authorityRequirement.waypoints).to.eql([{
        original: {
          x: 50,
          y: 400
        },
        x: 50,
        y: 400
      }, {
        original: {
          x: 290,
          y: 280
        },
        x: 290,
        y: 280
      }]);

      expect(authorityRequirementDi.waypoint[ 0 ]).to.include({
        x: 50,
        y: 400
      });

      expect(authorityRequirementDi.waypoint[ 1 ]).to.include({
        x: 290,
        y: 280
      });
    }));

  });

});
