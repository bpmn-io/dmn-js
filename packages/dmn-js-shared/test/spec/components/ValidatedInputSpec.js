/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { render } from 'inferno';

import {
  findRenderedDOMElementWithClass,
} from 'inferno-test-utils';

import { triggerInputEvent } from 'test/util/EventUtil';


import ValidatedInput from 'src/components/ValidatedInput';


describe('components/ValidatedInput', function() {

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
    const renderedTree = renderIntoDocument(<ValidatedInput />);

    // then
    expect(
      findRenderedDOMElementWithClass(renderedTree, 'dms-validated-input')
    ).to.exist;
  });


  it('should render accessible label', function() {

    // when
    const renderedTree = renderIntoDocument(<ValidatedInput label="label" />);

    // then
    const element = findRenderedDOMElementWithClass(renderedTree, 'dms-validated-input');

    expect(element.querySelector('[aria-label]')).to.exist;
  });


  it('should notify on change', function() {

    // given
    const spy = sinon.spy();

    const renderedTree = renderIntoDocument(
      <ValidatedInput onInput={ spy } />
    );

    const input = findRenderedDOMElementWithClass(
      renderedTree, 'dms-validated-input'
    ).firstChild;

    // when
    triggerInputEvent(input, 'foo');

    // then
    expect(spy).to.have.been.calledWith({
      value: 'foo',
      isValid: true
    });
  });


  it('should validate', function() {

    // given
    const spy = sinon.spy();

    function validate() {
      return 'bar';
    }

    const renderedTree = renderIntoDocument(
      <ValidatedInput
        onInput={ spy }
        validate={ validate } />
    );

    const input = findRenderedDOMElementWithClass(
      renderedTree, 'dms-validated-input'
    ).firstChild;

    // when
    triggerInputEvent(input, 'foo');

    // then
    expect(spy).to.have.been.calledWith({
      value: 'foo',
      isValid: false
    });

    expect(
      findRenderedDOMElementWithClass(renderedTree, 'dms-validation-warning')
    ).to.exist;
  });

});