/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { render } from 'inferno';

import DiContainer from './DiContainer';

import {
  findRenderedDOMElementWithClass
} from 'inferno-test-utils';

import {
  createInjector
} from 'test/util/InjectorUtil';

import {
  triggerClick,
  triggerInputEvent,
  triggerKeyEvent,
  triggerFocusIn,
  triggerMouseEvent
} from 'test/util/EventUtil';

import InputSelect from 'src/components/InputSelect';

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


    it('should hide options on blur', function() {

      // given
      const renderedTree = renderIntoDocument(
        <DiContainer injector={ injector }>
          <InputSelect
            options={ OPTIONS } />
          <input type="text" className="external-input" />
        </DiContainer>
      );

      const inputSelect =
        findRenderedDOMElementWithClass(renderedTree, 'dms-input-select');

      triggerClick(inputSelect);

      const options = findRenderedDOMElementWithClass(renderedTree, 'options');

      // when
      triggerFocusIn(options);

      // then
      // options still exists
      expect(
        findRenderedDOMElementWithClass(renderedTree, 'options')
      ).to.exist;

      // when
      triggerFocusIn(inputSelect);

      // when
      triggerFocusIn(
        findRenderedDOMElementWithClass(renderedTree, 'external-input')
      );

      // then
      // options is hidden
      expect(
        findRenderedDOMElementWithClass(renderedTree, 'options')
      ).not.to.exist;
    });


    describe('keyboard controls', function() {

      const ARROW_DOWN_KEY = 40;
      const ARROW_UP_KEY = 38;
      const ENTER_KEY = 13;
      const ESC_KEY = 27;

      const MULTIPLE_OPTIONS = [
        {
          label: 'Foo',
          value: 'foo'
        },
        {
          label: 'Bar',
          value: 'bar'
        }
      ];


      [ true, false ].forEach(function(noInput) {

        describe('noInput = ' + noInput, function() {

          it('should hide options on ENTER', function() {

            // given
            const renderedTree = renderIntoDocument(
              <DiContainer injector={ injector }>
                <InputSelect noInput={ noInput } options={ MULTIPLE_OPTIONS } />
              </DiContainer>
            );

            const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

            triggerClick(input);

            // when
            triggerKeyEvent(input, 'keydown', ENTER_KEY);

            // then
            const options = findRenderedDOMElementWithClass(renderedTree, 'options');

            expect(options).to.not.exist;
          });


          it('should hide options on ENTER', function() {

            // given
            const renderedTree = renderIntoDocument(
              <DiContainer injector={ injector }>
                <InputSelect noInput={ noInput } options={ MULTIPLE_OPTIONS } />
              </DiContainer>
            );

            const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

            triggerClick(input);

            // when
            triggerKeyEvent(input, 'keydown', ESC_KEY);

            // then
            const options = findRenderedDOMElementWithClass(renderedTree, 'options');

            expect(options).to.not.exist;
          });


          it('should open options on keydown', function() {

            // given
            const renderedTree = renderIntoDocument(
              <DiContainer injector={ injector }>
                <InputSelect noInput={ noInput } options={ OPTIONS } />
              </DiContainer>
            );

            const input =
              findRenderedDOMElementWithClass(renderedTree, 'dms-input');

            // when
            triggerKeyEvent(input, 'keydown', ARROW_DOWN_KEY);

            // then
            expect(
              findRenderedDOMElementWithClass(renderedTree, 'options')
            ).to.exist;
          });


          it('should change options on keydown', function() {

            let value;

            // given
            const renderedTree = renderIntoDocument(
              <DiContainer injector={ injector }>
                <InputSelect
                  noInput={ noInput }
                  options={ MULTIPLE_OPTIONS }
                  onChange={ (_value) => value = _value } />
              </DiContainer>
            );

            const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

            triggerClick(input);

            // when
            // options open
            triggerKeyEvent(input, 'keydown', ARROW_UP_KEY);

            // when
            // select next value
            triggerKeyEvent(input, 'keydown', ARROW_DOWN_KEY);

            // then
            expect(value).to.eql('foo');

            // when
            // select previous value
            triggerKeyEvent(input, 'keydown', ARROW_UP_KEY);

            // then
            expect(value).to.eql('bar');
          });

        });

      });

    });


    it('should hide options on global ESC', function() {

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


  describe('integration', function() {

    it('should not allow the mousedown events to propagate when selecting option',
      function() {

        // given
        const injector = createInjector({
          keyboard: getKeyboardMock(testContainer),
          renderer: getRendererMock(testContainer)
        });

        const spy = sinon.spy();
        const renderedTree = renderIntoDocument(
          <DiContainer injector={ injector } onMousedown={ spy }>
            <InputSelect
              options={ OPTIONS }
            />
          </DiContainer>
        );

        // when
        const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

        triggerClick(input);

        const option = findRenderedDOMElementWithClass(renderedTree, 'option');

        // when
        triggerMouseEvent(option, 'mousedown');
        triggerMouseEvent(option, 'mouseup');
        triggerMouseEvent(option, 'click');

        // then
        expect(spy).to.not.have.been.called;
      }
    );
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