/* global sinon */

import { bootstrapModeler, inject } from 'test/helper';

import boxedContextXML from './boxed-context.dmn';

import BoxedContextModule from 'src/features/boxedContext/editor';

import { waitFor } from '@testing-library/dom';

describe('BoxedContextEditor', function() {

  const variableResolver = {
    getVariables: () => [
      { name: 'Variable', typeRef: 'string' }
    ],
    registerProvider: () => {}
  };

  beforeEach(bootstrapModeler(boxedContextXML, {
    additionalModules: [
      BoxedContextModule,
      {
        variableResolver: [ 'value', variableResolver ]
      }
    ]
  }));


  it.only('should display boxed context', function() {

  });
});
