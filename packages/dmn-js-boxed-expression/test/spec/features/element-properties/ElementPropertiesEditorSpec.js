import * as sinon from 'sinon';
import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import { query as domQuery } from 'min-dom';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';
import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import decisionXML from '../../simple.dmn';


describe('features/element-properties - editor', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(decisionXML, {
    debounceInput: false
  }));


  afterEach(function() {
    sinon.restore();
  });


  it('should render', function() {

    // then
    expect(domQuery('.element-name', testContainer)).to.exist;
  });


  it('should have accessible label', function() {

    // then
    expect(domQuery('.element-name [aria-label]', testContainer)).to.exist;
  });


  it('should reset scroll on blur', function() {

    // given
    const name = queryEditor('.element-name', testContainer);

    name.focus();

    const scrollSpy = sinon.spy(name, 'scroll');

    // when
    name.blur();

    // then
    expect(scrollSpy).to.have.been.calledOnceWith(0, 0);
  });


  it('should edit name', inject(function(viewer) {

    // given
    const name = queryEditor('.element-name', testContainer);

    name.focus();

    // when
    triggerInputEvent(name, 'foo');

    // then
    expect(viewer.getRootElement().name).to.equal('foo');
  }));


  it('should edit name - line breaks', inject(function(viewer) {

    // given
    const name = queryEditor('.element-name', testContainer);

    name.focus();

    // when
    triggerInputEvent(name, 'foo<br>bar<br>');

    name.blur();

    // then
    expect(viewer.getRootElement().name).to.equal('foo\nbar');
  }));

});
