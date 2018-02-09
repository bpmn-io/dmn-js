/* global sinon */

// eslint-disable-next-line
import Inferno from 'inferno';

import {
  findRenderedDOMElementWithClass,
  scryRenderedDOMElementsWithClass,
  renderIntoDocument
} from 'inferno-test-utils';

import { triggerChangeEvent } from 'test/util/EventUtil';

// eslint-disable-next-line
import SelectComponent from 'lib/components/SelectComponent';


describe('SelectComponent', function() {

  it('should render', function() {

    // when
    const renderedTree = renderIntoDocument(<SelectComponent />);

    // then
    expect(
      findRenderedDOMElementWithClass(renderedTree, 'select')
    ).to.exist;
  });


  it('should render options', function() {

    // given
    const options = [{
      label: 'Foo',
      value: 'foo'
    }, {
      label: 'Bar',
      value: 'bar'
    }];

    // when
    const renderedTree = renderIntoDocument(<SelectComponent options={ options } />);

    // then
    expect(
      scryRenderedDOMElementsWithClass(renderedTree, 'option')
    ).to.have.lengthOf(2);
  });


  it('should notify on change', function() {

    // given
    const options = [{
      label: 'Foo',
      value: 'foo'
    }, {
      label: 'Bar',
      value: 'bar'
    }];

    const spy = sinon.spy();

    const renderedTree = renderIntoDocument(
      <SelectComponent
        onChange={ spy }
        options={ options } />
    );

    const select = findRenderedDOMElementWithClass(renderedTree, 'select');

    // when
    triggerChangeEvent(select, 'bar');

    // then
    expect(spy).to.have.been.called;
  });

});