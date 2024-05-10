/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { fireEvent, waitFor } from '@testing-library/dom';

import { Component, render } from 'inferno';

import {
  setRange,
  getRange
} from 'selection-ranges';

import {
  matches
} from 'min-dom';

import {
  findRenderedDOMElementWithClass,
  findVNodeWithType
} from 'inferno-test-utils';

import {
  triggerKeyEvent
} from 'test/util/EventUtil';

import LiteralExpression from 'src/components/LiteralExpression';


describe('components/LiteralExpression', function() {

  var container, vTree;

  function renderToNode(vnode) {
    const tree = renderIntoDocument(vnode);

    return findRenderedDOMElementWithClass(tree, 'literal-expression');
  }

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

    // given
    // text + whitespace + to-be-escaped HTML snippet
    var value = 'FOO\nBAR';

    // when
    const node = renderToNode(
      <LiteralExpression
        className={ 'other' }
        value={ value } />
    );

    // then
    expect(node).to.exist;
    expect(innerText(node)).to.eql(value);

    expect(matches(node, '.other')).to.be.true;
  });


  it('should render label', function() {

    // given
    var label = 'label';

    // when
    const node = renderToNode(
      <LiteralExpression
        value={ '' }
        label={ label } />
    );

    // then
    const editor = getEditor(node);

    expect(editor).to.exist;
    expect(matches(editor, '[aria-label=label]')).to.be.true;
  });


  it('should update on value change', async function() {

    // given
    const onInput = sinon.spy();
    class Parent extends Component {
      constructor(props, context) {
        super(props, context);

        this.state = { value: props.value };
      }

      onInput = (value) => {
        this.setState({ value });
        this.props.onInput(value);
      };

      render() {
        return <LiteralExpression onInput={ this.onInput } value={ this.state.value } />;
      }
    }

    const tree = renderIntoDocument(
      <Parent onInput={ onInput } value={ 'FOO' } />);

    // when
    await new Promise(resolve => tree.setState({ value: 'BAR' }, () => {
      resolve();
    }));

    // then
    expect(onInput).to.have.been.calledOnceWithExactly('BAR');
  });


  // not supported in bpmn-io/feel-editor
  it.skip('should render placeholder', function() {

    // given
    const placeholder = 'placeholder';

    // when
    const node = renderToNode(
      <LiteralExpression
        className={ 'other' }
        value={ '' }
        placeholder={ placeholder }
      />
    );

    // then
    expect(node).to.exist;
    expect(innerText(node)).to.eql('');

    expect(matches(node, '.content-editable.placeholder.other')).to.be.true;
  });


  // selection is handled differently in bpmn-io/feel-editor
  describe.skip('selection', function() {

    it('should update on value change', function() {

      // given
      class ParentComponent extends Component {
        constructor(props, context) {
          super(props, context);

          this.state = {
            value: 'FOO'
          };
        }

        render() {
          const { value } = this.state;

          return <LiteralExpression value={ value } />;
        }
      }

      const vTree = <ParentComponent />;

      const parentComponent = findVNodeWithType(vTree, ParentComponent);

      const node = renderToNode(vTree);
      const editor = getEditor(node);

      editor.focus();

      // scenario (1): add line break

      // select F[OO]
      setRange(editor, { start: 1, end: 3 });

      // when
      parentComponent.children.setState({
        value: 'FOO\nAAA'
      });

      // then
      expect(getRange(editor)).to.eql({
        start: 7,
        end: 7
      });


      // scenario (2): remove content + line break mid string

      // select FO[O\nAA]A
      setRange(editor, { start: 2, end: 6 });

      // when
      parentComponent.children.setState({
        value: 'FOA'
      });

      // then
      expect(getRange(editor)).to.eql({
        start: 2,
        end: 2
      });
    });

  });


  describe('hooks', function() {

    it('should dispatch onFocus / onBlur', function() {

      // given
      var onBlur = sinon.spy();
      var onFocus = sinon.spy();

      const node = renderToNode(
        <LiteralExpression
          onFocus={ onFocus }
          onBlur={ onBlur }
          value={ 'FOO' } />
      );
      const editor = getEditor(node);

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


    it('should dispatch onInput', async function() {

      // given
      var onInput = sinon.spy();

      const node = renderToNode(
        <LiteralExpression onInput={ onInput } value={ 'FOO' } />);
      const editor = getEditor(node);

      // when
      await changeInput(editor, 'BLUB');

      // then
      expect(innerText(editor)).to.eql('BLUB');

      expect(onInput).to.have.been.calledWith('BLUB');
    });


    it('should dispatch onChange when content and focus changed', async function() {

      // given
      const onChange = sinon.spy();
      const onInput = sinon.spy();
      const node = renderToNode(
        <LiteralExpression onChange={ onChange } onInput={ onInput } value={ 'FOO' } />);
      const editor = getEditor(node);
      fireEvent.focus(editor);

      // when
      changeInput(editor, 'BLUB');
      await waitFor(() => {
        expect(onInput).to.have.been.called;
      });

      // assume
      expect(onChange).not.to.have.been.called;
      fireEvent.focusOut(node);

      // then
      await waitFor(() => {
        expect(innerText(editor)).to.eql('BLUB');
        expect(onChange).to.have.been.calledWith('BLUB');
      });
    });


    it('should NOT dispatch onChange when content is unchanged', async function() {

      // given
      const onChange = sinon.spy();
      const onInput = sinon.spy();
      const node = renderToNode(
        <LiteralExpression onChange={ onChange } onInput={ onInput } value={ 'FOO' } />);
      const editor = getEditor(node);
      fireEvent.focus(editor);

      // when
      changeInput(editor, 'BLUB');
      await waitFor(() => {
        expect(onInput).to.have.been.called;
      });
      changeInput(editor, 'FOO');
      await waitFor(() => {
        expect(onInput).to.have.been.called;
      });

      // assume
      expect(onChange).not.to.have.been.called;
      fireEvent.focusOut(node);

      // then
      await waitFor(() => {
        expect(innerText(editor)).to.eql('FOO');
        expect(onChange).not.to.have.been.called;
      });
    });
  });


  // not implemented
  describe.skip('newline behavior', function() {

    const ENTER_KEY = 13;

    let onInput;
    let globalOnKeydown;

    beforeEach(function() {
      onInput = sinon.spy();
      globalOnKeydown = sinon.spy();

      document.addEventListener('keydown', globalOnKeydown);
    });

    afterEach(function() {
      document.removeEventListener('keydown', globalOnKeydown);
    });


    describe('singleLine', function() {

      it('should NOT insert newline on Enter', function() {

        // given
        const node = renderToNode(
          <LiteralExpression
            singleLine
            onInput={ onInput }
            value={ 'FOO' } />
        );
        const editor = getEditor(node);

        setRange(editor, { start: 1, end: 1 });

        // when
        const execDefault = triggerKeyEvent(editor, 'keydown', {
          which: ENTER_KEY
        });

        // then
        expect(execDefault).to.be.false;

        expect(onInput).not.to.have.been.called;
        expect(globalOnKeydown).to.have.been.called;
      });


      // Cannot be tested due to paste events not affecting document's contents per
      // default.
      // Cf. https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
      it.skip('should NOT insert newline on paste');
    });


    describe('ctrlForNewline = false', function() {

      it('should insert newline', function() {

        // given
        const node = renderToNode(
          <LiteralExpression
            onInput={ onInput }
            value={ 'FOO' } />
        );
        const editor = getEditor(node);

        setRange(editor, { start: 1, end: 1 });

        // when
        const execDefault = triggerKeyEvent(editor, 'keydown', {
          which: ENTER_KEY
        });

        // then
        expect(execDefault).to.be.false;

        expect(onInput).to.have.been.calledWith('F\nOO');
        expect(globalOnKeydown).not.to.have.been.called;
      });

    });


    describe('ctrlForNewline = true', function() {

      it('should insert newline', function() {

        // given
        const node = renderToNode(
          <LiteralExpression
            onInput={ onInput }
            ctrlForNewline={ true }
            value={ 'FOO' } />
        );
        const editor = getEditor(node);

        setRange(editor, { start: 1, end: 1 });

        // when
        const execDefault = triggerKeyEvent(editor, 'keydown', {
          which: ENTER_KEY,
          ctrlKey: true
        });

        // then
        expect(execDefault).to.be.false;

        expect(onInput).to.have.been.calledWith('F\nOO');
        expect(globalOnKeydown).not.to.have.been.called;
      });


      it('should insert newline / metaKey', function() {

        // given
        const node = renderToNode(
          <LiteralExpression
            onInput={ onInput }
            ctrlForNewline={ true }
            value={ 'FOO' } />
        );
        const editor = getEditor(node);

        setRange(editor, { start: 1, end: 1 });

        // when
        const execDefault = triggerKeyEvent(editor, 'keydown', {
          which: ENTER_KEY,
          metaKey: true
        });

        // then
        expect(execDefault).to.be.false;

        expect(onInput).to.have.been.calledWith('F\nOO');
        expect(globalOnKeydown).not.to.have.been.called;
      });


      it('should ignore + prevent default without CTRL', function() {

        // given
        const node = renderToNode(
          <LiteralExpression
            onInput={ onInput }
            ctrlForNewline={ true }
            value={ 'FOO' } />
        );
        const editor = getEditor(node);

        setRange(editor, { start: 1, end: 1 });

        // when
        const execDefault = triggerKeyEvent(editor, 'keydown', {
          which: ENTER_KEY
        });

        // then
        expect(execDefault).to.be.false;

        expect(onInput).not.to.have.been.called;
        expect(globalOnKeydown).to.have.been.called;
      });

    });

  });

});


function innerText(node) {
  return node.innerText.replace(/\n$/, '');
}

function getEditor(node) {
  return node.querySelector('[role="textbox"]');
}

/**
 * @param {HTMLElement} input
 * @param {string} value
 */
function changeInput(input, value) {
  fireEvent.change(input, { target: {
    textContent: value
  } });
}
