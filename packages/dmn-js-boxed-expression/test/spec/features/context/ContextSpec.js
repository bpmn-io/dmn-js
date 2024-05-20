import { bootstrapViewer, inject } from 'test/TestHelper';

import contextXML from 'test/spec/context.dmn';

import contextModule from 'src/features/context';

describe('Context', function() {

  beforeEach(bootstrapViewer(contextXML, {
    modules: [
      contextModule
    ]
  }));


  it('should return context entries', inject(function(context, viewer) {

    // given
    const element = viewer.getRootElement().get('decisionLogic');

    // when
    const entries = context.getEntries(element);

    // then
    expect(entries).to.have.length(2);
  }));


  it('should return context entry key', inject(function(context, viewer) {

    // given
    const element = viewer.getRootElement().get('decisionLogic');
    const entries = context.getEntries(element);

    // when
    const key = context.getKey(entries[0]);

    // then
    expect(key).to.have.property('name', 'basic');
  }));


  it('should return null as key for result entry', inject(function(context, viewer) {

    // given
    const element = viewer.getRootElement().get('decisionLogic');
    const entries = context.getEntries(element);

    // when
    const key = context.getKey(entries[1]);

    // then
    expect(key).to.be.null;
  }));


  it('should return context entry expression', inject(function(context, viewer) {

    // given
    const element = viewer.getRootElement().get('decisionLogic');
    const entries = context.getEntries(element);

    // when
    const expression = context.getExpression(entries[0]);

    // then
    expect(expression).to.exist;
  }));
});