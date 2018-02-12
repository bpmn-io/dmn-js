export default class FooProvider {
  constructor(components, simpleMode) {
    simpleMode.registerProvider(() => {
      return true;
    });

    components.onGetComponent('context-menu', () => {
      return () => <div className="foo">FOO</div>;
    });
  }
}

FooProvider.$inject = [ 'components', 'simpleMode' ];