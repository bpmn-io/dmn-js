/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { render } from 'inferno';

import {
  findRenderedDOMElementWithClass,
  scryRenderedDOMElementsWithClass,
  scryRenderedDOMElementsWithTag
} from 'inferno-test-utils';

import {
  triggerMouseEvent,
  triggerClick
} from 'test/util/EventUtil';

import List from 'src/components/List';


describe('components/List', function() {

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
    const renderedTree = renderIntoDocument(<List />);

    // then
    expect(
      findRenderedDOMElementWithClass(renderedTree, 'dms-list-component')
    ).to.exist;
  });


  it('should render with custom label', function() {

    // given
    function CustomLabel(label) {
      return <label className="custom-label">{ label }</label>;
    }
    const items = [
      { value: 1, group: 'a' }
    ];

    // when
    const renderedTree = renderIntoDocument(
      <List items={ items } labelComponent={ CustomLabel } />);

    // then
    expect(
      findRenderedDOMElementWithClass(renderedTree, 'custom-label')
    ).to.exist;
  });


  describe('checkboxes', function() {

    let renderedTree,
        spy;

    beforeEach(function() {
      const items = [{
        value: 'foo1',
        isChecked: false,
        group: 'foo',
        isRemovable: true
      }, {
        value: 'foo2',
        isChecked: true,
        group: 'foo'
      }, {
        value: 'bar',
        isChecked: true,
        group: 'bar'
      }];

      spy = sinon.spy();

      renderedTree = renderIntoDocument(
        <List
          items={ items }
          onChange={ spy }
          type="checkbox" />
      );
    });


    it('should render', function() {

      // then
      expect(
        scryRenderedDOMElementsWithTag(renderedTree, 'input')
      ).to.have.lengthOf(3);

      expect(
        scryRenderedDOMElementsWithClass(renderedTree, 'item')
      ).to.have.lengthOf(3);
    });


    it('should notify - check', function() {

      // given
      const checkbox = scryRenderedDOMElementsWithTag(renderedTree, 'input')[0];

      // when
      triggerClick(checkbox);

      // then
      expect(spy).to.have.been.calledWith([{
        value: 'foo1',
        isChecked: true,
        group: 'foo',
        isRemovable: true
      }, {
        value: 'foo2',
        isChecked: true,
        group: 'foo'
      }, {
        value: 'bar',
        isChecked: true,
        group: 'bar'
      }]);
    });


    it('should notify - uncheck', function() {

      // given
      const checkbox = scryRenderedDOMElementsWithTag(renderedTree, 'input')[1];

      // when
      triggerClick(checkbox);

      // then
      expect(spy).to.have.been.calledWith([{
        value: 'foo1',
        isChecked: false,
        group: 'foo',
        isRemovable: true
      }, {
        value: 'foo2',
        isChecked: false,
        group: 'foo'
      }, {
        value: 'bar',
        isChecked: true,
        group: 'bar'
      }]);
    });


    it('should notify - remove', function() {

      // given
      const checkbox = scryRenderedDOMElementsWithClass(renderedTree, 'remove')[0];

      // when
      triggerMouseEvent(checkbox, 'click');

      // then
      expect(spy).to.have.been.calledWith([{
        value: 'foo2',
        isChecked: true,
        group: 'foo'
      }, {
        value: 'bar',
        isChecked: true,
        group: 'bar'
      }]);
    });

  });


  describe('radio buttons', function() {

    let renderedTree,
        spy;

    beforeEach(function() {
      const items = [{
        value: 'foo1',
        isChecked: false,
        group: 'foo',
        isRemovable: true
      }, {
        value: 'foo2',
        isChecked: true,
        group: 'foo'
      }, {
        value: 'bar',
        isChecked: false,
        group: 'bar'
      }];

      spy = sinon.spy();

      renderedTree = renderIntoDocument(
        <List
          items={ items }
          onChange={ spy }
          type="radio" />
      );
    });


    it('should render', function() {

      // then
      expect(
        scryRenderedDOMElementsWithTag(renderedTree, 'input')
      ).to.have.lengthOf(3);

      expect(
        scryRenderedDOMElementsWithClass(renderedTree, 'item')
      ).to.have.lengthOf(3);
    });


    it('should notify - check', function() {

      // given
      const checkbox = scryRenderedDOMElementsWithTag(renderedTree, 'input')[0];

      // when
      triggerClick(checkbox);

      // then
      expect(spy).to.have.been.calledWith([{
        value: 'foo1',
        isChecked: true,
        group: 'foo',
        isRemovable: true
      }, {
        value: 'foo2',
        isChecked: false,
        group: 'foo'
      }, {
        value: 'bar',
        isChecked: false,
        group: 'bar'
      }]);
    });


    it('should notify - remove', function() {

      // given
      const checkbox = scryRenderedDOMElementsWithClass(renderedTree, 'remove')[0];

      // when
      triggerMouseEvent(checkbox, 'click');

      // then
      expect(spy).to.have.been.calledWith([{
        value: 'foo2',
        isChecked: true,
        group: 'foo'
      }, {
        value: 'bar',
        isChecked: false,
        group: 'bar'
      }]);
    });

  });


  describe('no checkboxes/radio buttons', function() {

    let renderedTree,
        spy;

    beforeEach(function() {
      const items = [{
        value: 'foo1',
        group: 'foo',
        isRemovable: true
      }, {
        value: 'foo2',
        group: 'foo'
      }, {
        value: 'bar',
        group: 'bar'
      }];

      spy = sinon.spy();

      renderedTree = renderIntoDocument(
        <List
          items={ items }
          onChange={ spy }
          type="radio" />
      );
    });


    it('should render', function() {

      // then
      expect(scryRenderedDOMElementsWithClass(renderedTree, 'item')).to.have.lengthOf(3);
    });


    it('should notify - remove', function() {

      // given
      const checkbox = scryRenderedDOMElementsWithClass(renderedTree, 'remove')[0];

      // when
      triggerMouseEvent(checkbox, 'click');

      // then
      expect(spy).to.have.been.calledWith([{
        value: 'foo2',
        group: 'foo'
      }, {
        value: 'bar',
        group: 'bar'
      }]);
    });

  });

});