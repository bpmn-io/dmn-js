/* global sinon */

// eslint-disable-next-line
import Inferno from 'inferno';

import {
  matches
} from 'min-dom';

import {
  findRenderedDOMElementWithClass,
  renderIntoDocument
} from 'inferno-test-utils';

import {
  triggerInputEvent
} from 'test/util/EventUtil';

// eslint-disable-next-line
import ContentEditable from 'lib/components/ContentEditable';


describe('ContentEditable', function() {

  it('should render', function() {

    // given
    // text + whitespace + to-be-escaped HTML snippet
    var text = 'FOO <br/> BAR';

    // when
    const node = render(<ContentEditable className={ 'other' } text={ text } />);

    // then
    expect(node).to.exist;
    expect(node.innerText).to.eql(text);

    expect(matches(node, '.other')).to.be.true;
  });


  describe('hooks', function() {

    it('should dispatch onFocus / onBlur', function() {

      // given
      var onBlur = sinon.spy();
      var onFocus = sinon.spy();

      const node = render(
        <ContentEditable
          onFocus={ onFocus }
          onBlur={ onBlur }
          text={ 'FOO' } />
      );

      // when
      node.focus();

      // then
      expect(onFocus).to.have.been.called;
      expect(onBlur).not.to.have.been.called;

      // when (2)
      node.blur();

      // then
      expect(onBlur).to.have.been.called;
    });


    it('should dispatch onInput', function() {

      // given
      var onInput = sinon.spy();

      const node = render(<ContentEditable onInput={ onInput } text={ 'FOO' } />);

      // when
      triggerInputEvent(node, 'BLUB');

      // then
      expect(node.innerText).to.eql('BLUB');

      expect(onInput).to.have.been.calledWith('BLUB');
    });

  });

});


function render(vnode) {
  const tree = renderIntoDocument(vnode);

  return findRenderedDOMElementWithClass(tree, 'content-editable');
}