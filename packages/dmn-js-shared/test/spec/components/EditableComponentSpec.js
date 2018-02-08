/* global sinon */

// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

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
import EditableComponent from 'lib/components/EditableComponent';


describe('EditableComponent', function() {

  it('should render', function() {

    // given
    var value = 'FOO <br/> BAR';

    // when
    const node = render(
      <TestComponent value={ value } className="test-component" />
    );

    // then
    expect(node).to.exist;
    expect(node.innerText).to.eql(value);

    expect(matches(node, '.test-component')).to.be.true;
  });


  it('should render without value', function() {

    // when
    const node = render(
      <TestComponent value={ null } />
    );

    // then
    expect(node.innerText).to.eql('-');
  });


  describe('hooks', function() {

    it('should dispatch onFocus / onBlur', function() {

      // given
      var onBlur = sinon.spy();
      var onFocus = sinon.spy();

      const node = render(
        <TestComponent
          onFocus={ onFocus }
          onBlur={ onBlur } />
      );

      const editor = node.querySelector('.content-editable');

      // when
      editor.focus();

      // then
      expect(onFocus).to.have.been.called;
      expect(onBlur).not.to.have.been.called;

      // when (2)
      editor.blur();

      // then
      expect(onBlur).to.have.been.called;
    });


    it('should dispatch onFocus / onBlur', function() {

      // given
      var onChange = sinon.spy();

      const node = render(
        <TestComponent onChange={ onChange } />
      );

      const editor = node.querySelector('.content-editable');

      // when
      triggerInputEvent(editor, 'FOO');

      // then
      expect(onChange).to.have.been.calledWith('FOO');
    });


    it('should validate', function() {

      // given
      var onChange = sinon.spy();

      var validate = sinon.spy(function(value) {

        if (value === 'i') {
          return new Error('i not allowed');
        }
      });

      const node = render(
        <TestComponent
          onChange={ onChange }
          validate={ validate } />
      );

      const editor = node.querySelector('.content-editable');

      // when
      triggerInputEvent(editor, 'i');

      // then
      // text got updated
      expect(editor.innerText).to.eql('i');

      expect(matches(node, '.invalid')).to.be.true;

      expect(validate).to.have.been.calledWith('i');

      // parent was not notified
      expect(onChange).not.to.have.been.called;


      // but when
      triggerInputEvent(editor, 'ABC');

      // then
      expect(validate).to.have.been.calledWith('ABC');
      expect(onChange).to.have.been.calledWith('ABC');

      expect(matches(node, '.invalid')).to.be.false;
    });

  });

});


function render(vnode) {
  const tree = renderIntoDocument(
    <TestContext>
      { vnode }
    </TestContext>
  );

  return findRenderedDOMElementWithClass(tree, 'editable');
}


class TestComponent extends EditableComponent {

  render() {
    return (
      <div className={ this.getClassName() }>
        { this.getEditor() }
      </div>
    );
  }

}


class TestContext extends Component {

  getChildContext() {

    const fakeInjector = {
      get(str) {
        if (str === 'debounceInput') {
          return function(fn) {
            return fn;
          };
        }

        throw new Error('unexpected Injectior#get : ' + str);
      }
    };

    return {
      injector: fakeInjector
    };
  }

  render() {
    return this.props.children;
  }

}