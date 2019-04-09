import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';

/* global sinon */

describe('features/modeling - DrdUpdater', function() {

  var testModules = [ coreModule, modelingModule ];

  var diagramXML = require('../../../fixtures/dmn/reconnect.dmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  afterEach(sinon.restore);


  describe('connection cropping', function() {

    it('should crop the connection only once per reconnect', inject(
      function(modeling, elementRegistry, connectionDocking, commandStack) {
        // given
        var source = elementRegistry.get('decision2'),
            connection = source.outgoing[0],
            target = elementRegistry.get('decision3'),
            cropSpy = sinon.spy(connectionDocking, 'getCroppedWaypoints');

        // when
        modeling.reconnectEnd(
          connection, target, { x: 447, y: 35 }
        );

        // then
        expect(cropSpy.withArgs(connection)).to.have.been.calledOnce;
      }
    ));

  });

});