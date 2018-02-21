/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { render } from 'inferno';

import {
  findRenderedDOMElementWithClass
} from 'inferno-test-utils';

import { triggerInputEvent, triggerKeyEvent } from 'test/util/EventUtil';

// eslint-disable-next-line
import Input from 'lib/components/Input';


describe('Input', function() {

  var container, vTree;

  function renderIntoDocument(vNode) {
    vTree = render(vNode, container);
    return vTree;
  }

  beforeEach(function() {
    container = TestContainerSupport.get(this);
  });

  afterEach(function() {
    render(null, container);
  });


  it('should render', function() {

    // when
    const renderedTree = renderIntoDocument(<Input />);

    // then
    expect(
      findRenderedDOMElementWithClass(renderedTree, 'dms-input')
    ).to.exist;
  });


  it('should notify on input', function() {

    // given
    const spy = sinon.spy();

    const renderedTree = renderIntoDocument(
      <Input
        onInput={ spy } />
    );

    const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

    // when
    triggerInputEvent(input, 'foo');

    // then
    expect(spy).to.have.been.called;
  });


  it('should notify on key down', function() {

    // given
    const spy = sinon.spy();

    const renderedTree = renderIntoDocument(
      <Input
        onKeyDown={ spy } />
    );

    const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

    // when
    triggerKeyEvent(input, 'keydown', 13);

    // then
    expect(spy).to.have.been.called;
  });


  it('should notify on key up', function() {

    // given
    const spy = sinon.spy();

    const renderedTree = renderIntoDocument(
      <Input
        onKeyUp={ spy } />
    );

    const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

    // when
    triggerKeyEvent(input, 'keyup', 13);

    // then
    expect(spy).to.have.been.called;
  });

});