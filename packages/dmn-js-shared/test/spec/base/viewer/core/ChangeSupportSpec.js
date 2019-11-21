import { bootstrap, inject } from '../TestHelper';

import CoreModule from 'src/base/viewer/core';


/* global sinon */

describe('ChangeSupport', function() {

  beforeEach(bootstrap({
    modules: [
      {
        elementRegistry: [ 'type', MockRegistry ]
      },
      CoreModule
    ]
  }));


  it('should add listener', inject(function(changeSupport) {

    // given
    const listener = () => {};

    // when
    changeSupport.onElementsChanged('foo', listener);

    // then
    expect(changeSupport._listeners).to.eql({
      foo: [
        listener
      ]
    });
  }));


  it('should remove listener', inject(function(changeSupport) {

    // given
    const listener = () => {};

    changeSupport.onElementsChanged('foo', listener);

    // when
    changeSupport.offElementsChanged('foo', listener);

    // then
    expect(changeSupport._listeners).to.eql({
      foo: []
    });
  }));


  it('should remove all listeners', inject(function(changeSupport) {

    // given
    changeSupport.onElementsChanged('foo', () => {});
    changeSupport.onElementsChanged('foo', () => {});

    // when
    changeSupport.offElementsChanged('foo');

    // then
    expect(changeSupport._listeners).to.eql({
      foo: []
    });
  }));


  describe('elements change', function() {

    let spy;

    beforeEach(inject(function(changeSupport) {
      spy = sinon.spy();

      changeSupport.onElementsChanged('foo', spy);
    }));


    it('should call listener', inject(function(eventBus) {

      // when
      eventBus.fire('elements.changed', {
        elements: [{
          id: 'foo'
        }]
      });

      // then
      expect(spy).to.have.been.called;
    }));


    it('should not call listener', inject(function(eventBus) {

      // when
      eventBus.fire('elements.changed', {
        elements: [{
          id: 'bar'
        }]
      });

      // then
      expect(spy).to.not.have.been.called;
    }));

  });


  describe('update ID', function() {

    it('should update on elements change after updating ID', inject(
      function(eventBus, elementRegistry, changeSupport) {

        // given
        const spy = sinon.spy();

        const element = {
          id: 'foo'
        };

        changeSupport.onElementsChanged(element.id, spy);

        // when
        elementRegistry.updateId(element, 'bar');

        eventBus.fire('elements.changed', {
          elements: [ element ]
        });

        // then
        expect(spy).to.have.been.calledOnce;
      })
    );

  });

});


// helpers /////////////////////


/**
 * Mocked for test purposes; provided by libraries as appropriate.
 */
function MockRegistry(eventBus) {

  this.updateId = function(element, id) {

    eventBus.fire('element.updateId', {
      element: element,
      newId: id
    });

    element.id = id;
  };

}