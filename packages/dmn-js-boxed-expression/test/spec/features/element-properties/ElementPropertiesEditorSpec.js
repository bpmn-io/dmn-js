import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

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
