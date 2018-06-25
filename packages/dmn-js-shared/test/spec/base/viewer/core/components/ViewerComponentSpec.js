import { Component, render } from 'inferno';

import TestContainerSupport from 'mocha-test-container-support';

import {
  findRenderedDOMElementWithClass,
} from 'inferno-test-utils';

import { inject, bootstrap } from 'test/spec/base/viewer/TestHelper';

import ViewerComponent from 'src/base/viewer/core/components/ViewerComponent';


describe('ViewerComponent', function() {

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

  beforeEach(bootstrap({}));


  it('should render viewer', inject(function(injector) {

    // when
    const tree = renderIntoDocument(<ViewerComponent injector={ injector } />);

    // then
    const node = findRenderedDOMElementWithClass(tree, 'viewer-container');

    expect(node).to.exist;
  }));


  it('should render components', inject(function(components, injector) {

    // given
    components.onGetComponent('viewer', () => () => <div className="foo"></div>);

    // when
    const tree = renderIntoDocument(<ViewerComponent injector={ injector } />);

    // then
    expect(findRenderedDOMElementWithClass(tree, 'foo')).to.exist;
  }));


  it('should provide child context', inject(function(components, injector) {

    // given
    class Foo extends Component {
      componentWillMount() {

        // then
        expect(this.context.injector).to.exist;
      }
    }

    components.onGetComponent('viewer', () => Foo);

    // when
    renderIntoDocument(<ViewerComponent injector={ injector } />);
  }));

});