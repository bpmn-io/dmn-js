/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { render } from 'inferno';

import {
  DiContainer
} from 'table-js/lib/components';

import {
  findRenderedDOMElementWithClass
} from 'inferno-test-utils';

import {
  createInjector
} from 'test/util/InjectorUtil';

import {
  triggerClick,
  triggerInputEvent,
  triggerKeyEvent
} from 'test/util/EventUtil';

import InputSelect from 'lib/components/InputSelect';

const OPTIONS =[{
  label: 'Foo',
  value: 'foo'
}];


describe('components/InputSelect', function() {

  let testContainer, vTree;

  function renderIntoDocument(vNode) {
    vTree = render(vNode, testContainer);
    return vTree;
  }

  beforeEach(function() {
    testContainer = TestContainerSupport.get(this);
  });

  afterEach(function() {
    render(null, testContainer);
  });


  it('should render', function() {

    // given
    const injector = createInjector({
      keyboard: getKeyboardMock(testContainer),
      renderer: getRendererMock(testContainer)
    });

    // when
    const renderedTree = renderIntoDocument(
      <DiContainer injector={ injector }>
        <InputSelect />
      </DiContainer>
    );

    // then
    expect(
      findRenderedDOMElementWithClass(renderedTree, 'dms-input-select')
    ).to.exist;
  });


  describe('interaction', function() {

    let injector;

    let testContainer;

    beforeEach(function() {
      testContainer = TestContainerSupport.get(this);

      injector = createInjector({
        keyboard: getKeyboardMock(testContainer),
        renderer: getRendererMock(testContainer)
      });
    });


    it('should show options on input click', function() {

      // given
      const renderedTree = renderIntoDocument(
        <DiContainer injector={ injector }>
          <InputSelect
            options={ OPTIONS } />
        </DiContainer>
      );

      const inputSelect =
        findRenderedDOMElementWithClass(renderedTree, 'dms-input-select');

      // when
      triggerClick(inputSelect);

      // then
      const options = findRenderedDOMElementWithClass(renderedTree, 'options');

      expect(options).to.exist;
    });


    it('should close options on ESC', function() {

      // given
      const renderedTree = renderIntoDocument(
        <DiContainer injector={ injector }>
          <InputSelect
            options={ OPTIONS } />
        </DiContainer>
      );

      const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

      triggerClick(input);

      // when
      // ESC
      triggerKeyEvent(testContainer, 'keydown', 27);

      // then
      const options = findRenderedDOMElementWithClass(renderedTree, 'options');

      expect(options).to.not.exist;
    });


    it('should notify on change - input', function() {

      // given
      const spy = sinon.spy();

      const renderedTree = renderIntoDocument(
        <DiContainer injector={ injector }>
          <InputSelect
            onChange={ spy } />
        </DiContainer>
      );

      const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(spy).to.have.been.called;
    });


    it('should notify on change - select', function() {

      // given
      const spy = sinon.spy();

      const renderedTree = renderIntoDocument(
        <DiContainer injector={ injector }>
          <InputSelect
            onChange={ spy }
            options={ OPTIONS } />
        </DiContainer>
      );

      const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

      triggerClick(input);

      const option = findRenderedDOMElementWithClass(renderedTree, 'option');

      // when
      triggerClick(option);

      // then
      expect(spy).to.have.been.called;
    });

  });

});

// helpers //////////

function getKeyboardMock(testContainer) {
  let listener;

  testContainer.addEventListener('keydown', ({ keyCode }) => {
    listener && listener(keyCode);
  });

  return {
    addListener(listenerFn) {
      listener = listenerFn;
    },

    removeListener() {}
  };
}

function getRendererMock(testContainer) {
  return {
    getContainer() {
      return testContainer;
    }
  };
}