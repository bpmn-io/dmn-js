/* global sinon */

// eslint-disable-next-line
import Inferno from 'inferno';

import {
  findRenderedDOMElementWithClass,
  scryRenderedDOMElementsWithClass,
  renderIntoDocument
} from 'inferno-test-utils';

import { triggerInputEvent } from 'test/util/EventUtil';

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
  

  it('should notify on change', function() {

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

});