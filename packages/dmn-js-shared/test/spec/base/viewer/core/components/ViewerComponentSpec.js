// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { findRenderedDOMElementWithClass, renderIntoDocument } from 'inferno-test-utils';

import { inject, bootstrap } from 'test/spec/base/viewer/TestHelper';

import ViewerComponent from 'lib/base/viewer/core/components/ViewerComponent';


describe('ViewerComponent', function() {

  beforeEach(bootstrap({}));


  it('should render viewer', inject(function(injector) {

    // when
    const renderedTree = renderIntoDocument(<ViewerComponent injector={ injector } />);

    // then
    const node = findRenderedDOMElementWithClass(renderedTree, 'viewer-container');

    expect(node).to.exist;
  }));


  it('should render components', inject(function(components, injector) {

    // given
    components.onGetComponent('viewer', () => () => <div className="foo"></div>);

    // when
    const renderedTree = renderIntoDocument(<ViewerComponent injector={ injector } />);

    // then
    expect(findRenderedDOMElementWithClass(renderedTree, 'foo')).to.exist;
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