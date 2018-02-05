/* global sinon */

// eslint-disable-next-line
import Inferno from 'inferno';

import {
  findRenderedDOMElementWithClass,
  renderIntoDocument
} from 'inferno-test-utils';

import { triggerInputEvent, triggerKeyEvent } from 'test/util/EventUtil';

// eslint-disable-next-line
import Input from 'lib/components/Input';


describe('Input', function() {

  it('should render', function() {

    // when
    const renderedTree = renderIntoDocument(<Input />);

    // then
    expect(
      findRenderedDOMElementWithClass(renderedTree, 'input')
    ).to.exist;
  });


  it('should notify on input', function() {

    // given
    const spy = sinon.spy();

    const renderedTree = renderIntoDocument(
      <Input
        onInput={ spy } />
    );

    const input = findRenderedDOMElementWithClass(renderedTree, 'input');

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

    const input = findRenderedDOMElementWithClass(renderedTree, 'input');

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

    const input = findRenderedDOMElementWithClass(renderedTree, 'input');

    // when
    triggerKeyEvent(input, 'keyup', 13);

    // then
    expect(spy).to.have.been.called;
  });

});