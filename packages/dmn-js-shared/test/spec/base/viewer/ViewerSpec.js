import Viewer from 'src/base/viewer/Viewer';

import { domify, remove as domRemove } from 'min-dom';


describe('Viewer', function() {

  let container;

  beforeEach(function() {
    container = domify('<div></div>');

    document.body.appendChild(container);
  });

  afterEach(function() {
    domRemove(container);
  });


  it('should bootstrap', function() {

    // given
    const modules = [
      {
        foo: [ 'value', 1 ]
      }
    ];

    // when
    const base = new Viewer({
      renderer: {
        container
      },
      modules,
      bar: 'BAR'
    });

    // then
    expect(base.get('foo')).to.eql(1);

    expect(base.get('config')).to.eql({
      renderer: {
        container
      },
      bar: 'BAR'
    });
  });


  it('#destroy', function() {

    // when
    const base = new Viewer({
      renderer: {
        container
      }
    });

    // then
    expect(base.destroy).to.be.a('function');
  });


  it('#clear', function() {

    // when
    const base = new Viewer({
      renderer: {
        container
      }
    });

    // then
    expect(base.clear).to.be.a('function');
  });

});