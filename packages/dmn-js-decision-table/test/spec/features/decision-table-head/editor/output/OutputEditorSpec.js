import { Component, render } from 'inferno';
import {
  findRenderedDOMElementWithClass
} from 'inferno-test-utils';

import TestContainerSupport from 'mocha-test-container-support';

import Editor
  from 'src/features/decision-table-head/editor/components/OutputEditor';


describe('features/decision-table-head - OutputEditor', function() {

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
    const tree = renderIntoDocument(
      <Root />
    );

    // then
    expect(tree).to.exist;
  });


  it('should render accessible label for output label', function() {

    // when
    const tree = renderIntoDocument(
      <Root />
    );

    // then
    const node = findRenderedDOMElementWithClass(tree, 'dms-output-label');

    expect(node.getAttribute('aria-label')).to.exist;
  });


  it('should render accessible label for output name', function() {

    // when
    const tree = renderIntoDocument(
      <Root />
    );

    // then
    const node = findRenderedDOMElementWithClass(tree, 'ref-output-name');

    expect(node.getAttribute('aria-label')).to.exist;
  });

});


class Root extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      text: '',
      expressionLanguage: '',
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