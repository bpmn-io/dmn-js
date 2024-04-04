import { Component, render } from 'inferno';
import {
  findRenderedDOMElementWithClass
} from 'inferno-test-utils';

import TestContainerSupport from 'mocha-test-container-support';

import {
  createInjector
} from 'dmn-js-shared/test/util/InjectorUtil';
import { DiContainer } from 'table-js/lib/components';

import Editor from 'src/features/decision-table-head/editor/components/InputEditor';


describe('decision-table-head/editor - InputEditor', function() {

  var container, vTree, injector;

  function renderIntoDocument(vNode) {
    vTree = render(vNode, container);
    return vTree;
  }

  beforeEach(function() {
    container = TestContainerSupport.get(this);

    injector = createInjector({
      keyboard: getKeyboardMock(container),
      renderer: getRendererMock(container),
      translate: value => value
    });
  });

  afterEach(function() {
    render(null, container);
  });


  it('should render', function() {

    // when
    const tree = renderIntoDocument(
      <DiContainer injector={ injector }>
        <Root />
      </DiContainer>
    );

    // then
    expect(tree).to.exist;
  });


  it('should render accessible label for input label', function() {

    // when
    const tree = renderIntoDocument(
      <DiContainer injector={ injector }>
        <Root />
      </DiContainer>
    );

    // then
    const node = findRenderedDOMElementWithClass(tree, 'dms-input-label');

    expect(node.getAttribute('aria-label')).to.exist;
  });


  it('should render accessible label for input name', function() {

    // when
    const tree = renderIntoDocument(
      <DiContainer injector={ injector }>
        <Root />
      </DiContainer>
    );

    // then
    const node = findRenderedDOMElementWithClass(tree, 'ref-text');

    expect(node.querySelector('[aria-label]')).to.exist;
  });

});


class Root extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      text: '',
      label: null
    };
  }

  handleChanged = (newProps) => {
    this.setState(newProps);
  };

  render() {
    return (
      <Editor
        { ...this.state }
        onChange={ this.handleChanged } />
    );
  }

}


// helpers //////////

function getKeyboardMock(testContainer) {
  let listener;

  testContainer.addEventListener('keydown', ({ keyCode }) => {
    listener && listener(keyCode);
  });

  return {
    addListener(listenerFn) {
      listener = listenerFn;
    },

    removeListener() {}
  };
}

function getRendererMock(testContainer) {
  return {
    getContainer() {
      return testContainer;
    }
  };
}