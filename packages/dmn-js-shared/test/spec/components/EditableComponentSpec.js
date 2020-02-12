/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { Component } from 'inferno';

import {
  matches
} from 'min-dom';

import { render } from 'inferno';

import {
  findRenderedDOMElementWithClass,
} from 'inferno-test-utils';

import {
  triggerInputEvent
} from 'test/util/EventUtil';

import EditableComponent from 'src/components/EditableComponent';


describe('components/EditableComponent', function() {

  var container, vTree;

  function renderIntoDocument(vNode) {
    vTree = render(vNode, container);
    return vTree;
  }

  function renderToNode(vnode, props) {
    const tree = renderIntoDocument(
      <TestContext { ...props }>
        { vnode }
      </TestContext>
    );

    return findRenderedDOMElementWithClass(tree, 'editable');
  }

  beforeEach(function() {
    container = TestContainerSupport.get(this);
  });

  afterEach(function() {
    render(null, container);
  });


  it('should render', function() {

    // given
    var value = 'FOO <br/> BAR';

    // when
    const node = renderToNode(
      <TestComponent value={ value } className="test-component" />
    );

    // then
    expect(node).to.exist;
    expect(innerText(node)).to.eql(value);

    expect(matches(node, '.test-component')).to.be.true;
  });


  it('should render without value', function() {

    // when
    const node = renderToNode(
      <TestComponent value={ null } />
    );

    // then
    expect(innerText(node)).to.eql('');
  });


  it('should render with placeholder value', function() {

    // when
    const node = renderToNode(
      <TestComponent value={ null } placeholder="-" />
    );

    // then
    expect(innerText(node)).to.eql('-');
  });


  describe('hooks', function() {

    it('should dispatch onFocus / onBlur', function() {

      // given
      var onBlur = sinon.spy();
      var onFocus = sinon.spy();

      const node = renderToNode(
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

      const node = renderToNode(
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

      const node = renderToNode(
        <TestComponent
          onChange={ onChange }
          validate={ validate } />
      );

      const editor = node.querySelector('.content-editable');

      // when
      triggerInputEvent(editor, 'i');

      // then
      // text got updated
      expect(innerText(editor)).to.eql('i');

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


    it('should cache invalid user input', function() {

      // given
      var debounceInput = createDebouncer();

      function validate(value) {

        if (value === 'i') {
          return new Error('i not allowed');
        }
      }

      const node = renderToNode(
        <PersistentTestContainer validate={ validate } />,
        { debounceInput }
      );

      const editor = node.querySelector('.content-editable');

      // when
      triggerInputEvent(editor, 'ab');

      triggerInputEvent(editor, 'i');

      // first onChange + redraw cycle
      debounceInput.releaseOnce();

      // then
      // text got updated
      expect(innerText(editor)).to.eql('i');

      expect(matches(node, '.invalid')).to.be.true;

      // but when...
      triggerInputEvent(editor, 'ccc');

      // second onChange + redraw cycle
      debounceInput.releaseOnce();

      // then
      // text got updated
      expect(innerText(editor)).to.eql('ccc');

      expect(matches(node, '.invalid')).to.be.false;
    });
  });

});


class PersistentTestContainer extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: ''
    };
  }

  handleChange = (newValue) => {
    this.setState({
      value: newValue
    });
  }

  render() {
    return (
      <TestComponent
        onChange={ this.handleChange }
        value={ this.state.value }
        validate={ this.props.validate } />
    );
  }
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

    var self = this;

    const fakeInjector = {
      get(str) {
        if (str === 'debounceInput') {
          return self.props.debounceInput || function(fn) {
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


function innerText(el) {
  return el.innerText.replace(/\n$/, '');
}


function createDebouncer() {

  var lastCalls = [];

  function debounce(fn) {

    return function(...args) {

      lastCalls.push([ fn, args ]);
    };
  }

  debounce.releaseOnce = function() {

    var call = lastCalls.shift();

    expect(call).to.exist;

    var [ fn, args ] = call;

    fn(...args);
  };

  return debounce;
}
