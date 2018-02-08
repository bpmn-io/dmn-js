/* global sinon */

// eslint-disable-next-line
import Inferno from 'inferno';

import {
  findRenderedDOMElementWithClass,
  renderIntoDocument
} from 'inferno-test-utils';

import { triggerInputEvent } from 'test/util/EventUtil';

// eslint-disable-next-line
import ValidatedInput from 'lib/components/ValidatedInput';

describe('ValidatedInput', function() {

  it('should render', function() {

    // when
    const renderedTree = renderIntoDocument(<ValidatedInput />);

    // then
    expect(
      findRenderedDOMElementWithClass(renderedTree, 'validated-text-input-component')
    ).to.exist;
  });


  it('should notify on change', function() {

    // given
    const spy = sinon.spy();

    const renderedTree = renderIntoDocument(
      <ValidatedInput onInput={ spy } />
    );

    const input = findRenderedDOMElementWithClass(
      renderedTree, 'validated-text-input-component'
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
      renderedTree, 'validated-text-input-component'
    ).firstChild;

    // when
    triggerInputEvent(input, 'foo');

    // then
    expect(spy).to.have.been.calledWith({
      value: 'foo',
      isValid: false
    });

    expect(
      findRenderedDOMElementWithClass(renderedTree, 'validation-warning')
    ).to.exist;
  });

});