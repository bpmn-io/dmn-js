/* global sinon */

import { bootstrapViewer, inject } from 'test/helper';

import boxedContextXML from './boxed-context.dmn';

import BoxedContextModule from 'src/features/boxedContext';

import { waitFor } from '@testing-library/dom';

describe('BoxedContext', function() {

  const variableResolver = {
    getVariables: () => [
      { name: 'Variable', typeRef: 'string' }
    ],
    registerProvider: () => {}
  };

  beforeEach(bootstrapViewer(boxedContextXML, {
    additionalModules: [
      BoxedContextModule,
      {
        variableResolver: [ 'value', variableResolver ]
      }
    ]
  }));


  it('should display boxed context', function() {

  });
});
