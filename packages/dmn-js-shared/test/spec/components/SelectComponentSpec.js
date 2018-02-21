/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { render } from 'inferno';

import {
  findRenderedDOMElementWithClass,
  scryRenderedDOMElementsWithClass
} from 'inferno-test-utils';

import { triggerChangeEvent } from 'test/util/EventUtil';

// eslint-disable-next-line
import SelectComponent from 'lib/components/SelectComponent';


describe('SelectComponent', function() {

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
    const renderedTree = renderIntoDocument(<SelectComponent />);

    // then
    expect(
      findRenderedDOMElementWithClass(renderedTree, 'dms-select')
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

    const select = findRenderedDOMElementWithClass(renderedTree, 'dms-select');

    // when
    triggerChangeEvent(select, 'bar');

    // then
    expect(spy).to.have.been.called;
  });

});