import ElementRegistry from 'src/core/ElementRegistry';
import EventBus from 'diagram-js/lib/core/EventBus';

/* global sinon */
const {
  spy
} = sinon;


describe('core - ElementRegistry', function() {

  var viewer;
  var elementRegistry;
  var eventBus;

  var decision;

  beforeEach(function() {
    eventBus = new EventBus();

    decision = {
      id: 'foo'
    };

    viewer = {
      getRootElement() {
        return decision;
      }
    };

    elementRegistry = new ElementRegistry(viewer, eventBus);
  });


  it('should update decision id', function() {

    // given
    var updateSpy = spy(function(event) {

      expect(event.element).to.equal(decision);
      expect(decision.id).to.eql('foo');
      expect(event.newId).to.eql('bar');
    });

    eventBus.on('element.updateId', updateSpy);


    // assume
    expect(function() {
      elementRegistry.updateId({ id: 'other' }, '110');
    }).to.throw('element !== rootElement');

    // when
    elementRegistry.updateId(decision, 'bar');

    // then
    expect(decision.id).to.eql('bar');

    expect(updateSpy).to.have.been.calledOnce;
  });

});