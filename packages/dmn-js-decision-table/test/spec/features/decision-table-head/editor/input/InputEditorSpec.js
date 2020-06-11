import { Component, render } from 'inferno';

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
      translate: () => {}
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

});


class Root extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      text: '',
      expressionLanguage: '',
      expressionLanguages: [],
      defaultExpressionLanguage: {
        value: 'feel',
        label: 'FEEL'
      },
      inputVariable: null,
      label: null
    };
  }

  handleChanged = (newProps) => {
    this.setState(newProps);
  }

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