import { bootstrapModeler, inject } from 'test/TestHelper';

import contextXML from 'test/spec/context.dmn';

import contextModule from 'src/features/context/editor';
import coreModule from 'src/core';

describe('ContextEditor', function() {

  beforeEach(bootstrapModeler(contextXML, {
    modules: [
      coreModule,
      contextModule
    ]
  }));


  it('should add context entry', inject(function(context, viewer) {

    // given
    const element = viewer.getRootElement().get('decisionLogic');

    // when
    context.addEntry(element);

    // then
    expect(context.getEntries(element)).to.have.length(3);
  }));


  it('should remove context entry', inject(function(context, viewer) {

    // given
    const element = viewer.getRootElement().get('decisionLogic');
    const entries = context.getEntries(element);

    // when
    context.removeEntry(element, entries[0]);

    // then
    expect(context.getEntries(element)).to.have.length(1);
  }));


  it('should update context entry key', inject(function(context, viewer) {

    // given
    const element = viewer.getRootElement().get('decisionLogic');
    const entries = context.getEntries(element);

    // when
    context.updateKey(entries[0], { name: 'foo', typeRef: 'number' });

    // then
    const key = context.getKey(entries[0]);
    expect(key).to.have.property('name', 'foo');
    expect(key).to.have.property('typeRef', 'number');
  }));
});