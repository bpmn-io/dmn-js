import { bootstrap, inject } from 'test/spec/base/viewer/TestHelper';

describe('Components', function() {

  beforeEach(bootstrap());


  it('should add listener', inject(function(components) {

    // given
    const listener = () => {};

    // when
    components.onGetComponent('foo', 1000, listener);

    // then
    expect(components._listeners).to.eql({
      foo: [
        {
          priority: 1000,
          callback: listener
        }
      ]
    });
  }));


  it('should remove listener', inject(function(components) {

    // given
    const listener = () => {};

    components.onGetComponent('foo', listener);

    // when
    components.offGetComponent('foo', listener);

    // then
    expect(components._listeners).to.eql({
      foo: []
    });
  }));


  it('should remove all listeners', inject(function(components) {

    // given
    components.onGetComponent('foo', () => {});
    components.onGetComponent('foo', () => {});

    // when
    components.offGetComponent('foo');

    // then
    expect(components._listeners).to.eql({
      foo: []
    });
  }));


  describe('get component/s', function() {

    beforeEach(inject(function(components) {
      components.onGetComponent('foo', 1000, () => 'bar');

      components.onGetComponent('foo', 2000, () => 'baz');
    }));


    it('should get component with highest priority', inject(function(components) {

      // when
      // then
      expect(components.getComponent('foo')).to.eql('baz');
    }));


    it('should get all components', inject(function(components) {

      // when
      // then
      expect(components.getComponents('foo')).to.eql([
        'baz',
        'bar'
      ]);
    }));

  });

});