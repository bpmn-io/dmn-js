/* global sinon */

// eslint-disable-next-line
import Inferno from 'inferno';

import { findRenderedDOMElementWithClass, scryRenderedDOMElementsWithClass, scryRenderedDOMElementsWithTag, renderIntoDocument } from 'inferno-test-utils';

import { triggerMouseEvent } from 'test/util/EventUtil';

// eslint-disable-next-line
import ListComponent from 'lib/components/ListComponent';

describe('ListComponent', function() {

  it('should render', function() {

    // when
    const renderedTree = renderIntoDocument(<ListComponent />);

    // then
    expect(findRenderedDOMElementWithClass(renderedTree, 'list-component')).to.exist;
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

      renderedTree = renderIntoDocument(<ListComponent items={ items } onChange={ spy } type="checkbox" />);
    });


    it('should render', function() {

      // then
      expect(scryRenderedDOMElementsWithTag(renderedTree, 'input')).to.have.lengthOf(3);

      expect(scryRenderedDOMElementsWithClass(renderedTree, 'item')).to.have.lengthOf(3);
    });


    it('should notify - check', function() {

      // given
      const checkbox = scryRenderedDOMElementsWithTag(renderedTree, 'input')[0];

      // when
      triggerMouseEvent(checkbox, 'click');

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
      triggerMouseEvent(checkbox, 'click');

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
      triggerMouseEvent(checkbox, 'mouseup');

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

      renderedTree = renderIntoDocument(<ListComponent items={ items } onChange={ spy } type="radio" />);
    });


    it('should render', function() {

      // then
      expect(scryRenderedDOMElementsWithTag(renderedTree, 'input')).to.have.lengthOf(3);

      expect(scryRenderedDOMElementsWithClass(renderedTree, 'item')).to.have.lengthOf(3);
    });


    it('should notify - check', function() {

      // given
      const checkbox = scryRenderedDOMElementsWithTag(renderedTree, 'input')[0];

      // when
      triggerMouseEvent(checkbox, 'click');

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
      triggerMouseEvent(checkbox, 'mouseup');

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

      renderedTree = renderIntoDocument(<ListComponent items={ items } onChange={ spy } type="radio" />);
    });


    it('should render', function() {

      // then
      expect(scryRenderedDOMElementsWithClass(renderedTree, 'item')).to.have.lengthOf(3);
    });


    it('should notify - remove', function() {

      // given
      const checkbox = scryRenderedDOMElementsWithClass(renderedTree, 'remove')[0];

      // when
      triggerMouseEvent(checkbox, 'mouseup');

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