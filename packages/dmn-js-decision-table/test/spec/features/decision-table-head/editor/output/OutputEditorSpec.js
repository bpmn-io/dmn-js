import { Component, render } from 'inferno';

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

});


class Root extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      text: '',
      expressionLanguage: '',
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