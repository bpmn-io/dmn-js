/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { render } from 'inferno';

import { fireEvent, waitFor } from '@testing-library/dom';

import {
  findRenderedDOMElementWithClass
} from 'inferno-test-utils';

import { triggerInputEvent, triggerKeyEvent } from 'test/util/EventUtil';

import Input from 'src/components/Input';


describe('components/Input', function() {

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


  it('should render accessible label', function() {

    // when
    const renderedTree = renderIntoDocument(<Input label="label" />);

    // then
    const node = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

    expect(node.getAttribute('aria-label')).to.eql('label');
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


  it('should notify on change', function() {

    // given
    const spy = sinon.spy();

    const renderedTree = renderIntoDocument(
      <Input
        onChange={ spy } />
    );

    const input = findRenderedDOMElementWithClass(renderedTree, 'dms-input');

    // when
    fireEvent.change(input, { target: { value: 'foo' } });

    // then
    expect(spy).to.have.been.called;
  });


  it('should pass id', function() {

    // given
    const id = `id-${(Math.random() * 1000).toFixed(0)}`;

    // when
    renderIntoDocument(
      <Input
        id={ id } />
    );

    // then
    const input = container.querySelector('#' + id);

    expect(input).to.exist;
  });


  it('should rerender on external change', function() {

    // given
    renderIntoDocument(
      <Input
        value="initial" />
    );

    // when
    const tree = renderIntoDocument(
      <Input
        value="newValue" />);

    // then
    return waitFor(() => {
      const input = findRenderedDOMElementWithClass(tree, 'dms-input');

      expect(input).to.have.property('value', 'newValue');
    });
  });
});
