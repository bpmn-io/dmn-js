import { query as domQuery } from 'min-dom';

import { bootstrap, inject } from 'test/spec/base/viewer/TestHelper';

import TestContainer from 'mocha-test-container-support';


describe('Renderer', function() {

  let testContainer;

  beforeEach(bootstrap());

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should mount', inject(function(eventBus) {

    // when
    eventBus.fire('renderer.mount');

    // then
    expect(domQuery('.viewer-container')).to.exist;
  }));


  it('should unmount', inject(function(eventBus) {

    // given
    eventBus.fire('renderer.mount');

    // when
    eventBus.fire('renderer.unmount');

    // then
    expect(domQuery('.viewer-container', testContainer)).to.not.exist;
  }));


  it('should remount', inject(function(eventBus) {

    // given
    eventBus.fire('renderer.mount');

    eventBus.fire('renderer.unmount');

    // when
    eventBus.fire('renderer.mount');

    // then
    expect(domQuery('.viewer-container', testContainer)).to.exist;
  }));


  it('should return container', inject(function(renderer) {

    // when
    const container = renderer.getContainer();

    // then
    expect(container).to.exist;
  }));

});