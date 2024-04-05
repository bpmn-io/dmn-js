/* global sinon */

import {
  bootstrapViewer,
  inject
} from 'test/TestHelper';

import TestContainer from 'mocha-test-container-support';

import coreModule from 'src/core';
import drillDownModule from 'src/features/drill-down';

import {
  query,
  queryAll,
  matches
} from 'min-dom';

import {
  triggerClick,
  triggerFocusIn,
  triggerKeyEvent
} from 'dmn-js-shared/test/util/EventUtil';

var diagramXML = require('./DrillDown.dmn');


describe('features - drilldown', function() {

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  describe('interactive', function() {

    beforeEach(bootstrapViewer(diagramXML, {
      modules: [
        coreModule,
        drillDownModule
      ]
    }));


    describe('overlays', function() {

      it('should show overlays', function() {

        // when
        var drillDownOverlayEls = queryAll('.drill-down-overlay', container);

        // then
        expect(drillDownOverlayEls).to.have.length(2);
      });


      describe('should show correct icon', function() {

        verify(
          'decision table',
          'Decision_Table',
          'dmn-icon-decision-table'
        );

        verify(
          'literal expression',
          'Decision_LiteralExpression',
          'dmn-icon-literal-expression'
        );


        function verify(title, element, iconCls) {

          it(title, function() {

            // when
            var overlayEl = queryOverlay(element);
            var iconEl = query('.' + iconCls, overlayEl);

            // then
            expect(matches(overlayEl, '.interactive')).to.be.true;
            expect(iconEl).to.exist;
          });

        }

      });


      describe('accessibility', function() {

        verify(
          'decision table',
          'Decision_Table',
          'Open decision table'
        );

        verify(
          'literal expression',
          'Decision_LiteralExpression',
          'Open literal expression'
        );

        function verify(type, element, title) {

          it(`has an accessible title for ${type}`, function() {

            // when
            var overlayEl = queryOverlay(element);
            var button = query('button', overlayEl);

            // then
            expect(button).to.have.property('title', title);
          });

        }
      });

    });


    describe('interaction', function() {

      describe('should drill down', function() {

        it('on click', inject(
          function(eventBus, drillDown, elementRegistry) {

            // given
            var drillSpy = sinon.spy(drillDown, 'drillDown');

            var overlayEl = queryOverlay('Decision_Table');
            var element = elementRegistry.get('Decision_Table');

            // when
            triggerClick(overlayEl);

            // then
            expect(drillSpy).to.have.been.calledOnce;

            expect(drillSpy).to.have.been.calledWith(element);
          }
        ));


        it('emitting drillDown.click event', inject(
          function(eventBus, elementRegistry) {

            // given
            var element = elementRegistry.get('Decision_Table');

            var listener = sinon.spy(function(event) {
              expect(event.element).to.equal(element);
            });

            eventBus.on('drillDown.click', listener);

            var overlayEl = queryOverlay('Decision_Table');

            // when
            triggerClick(overlayEl);

            // then
            expect(listener).to.have.been.calledOnce;
          }
        ));


        it('optionally preventing default action', inject(
          function(eventBus, drillDown) {

            // given
            var drillSpy = sinon.spy(drillDown, 'drillDown');

            eventBus.on('drillDown.click', function(event) {

              // prevent default drillDown action
              event.preventDefault();
            });

            var overlayEl = queryOverlay('Decision_Table');

            // when
            triggerClick(overlayEl);

            // then
            expect(drillSpy).not.to.have.been.called;
          }
        ));

      });

    });

  });


  describe('non-interactive', function() {

    beforeEach(bootstrapViewer(diagramXML, {
      modules: [
        coreModule,
        drillDownModule
      ],
      drillDown: {
        enabled: false
      }
    }));


    describe('overlays', function() {

      it('should show overlays', function() {

        // when
        var drillDownOverlayEls = queryAll('.drill-down-overlay', container);

        // then
        expect(drillDownOverlayEls).to.have.length(2);
      });


      describe('should show correct icon', function() {

        verify(
          'decision table',
          'Decision_Table',
          'dmn-icon-decision-table'
        );

        verify(
          'literal expression',
          'Decision_LiteralExpression',
          'dmn-icon-literal-expression'
        );


        function verify(title, element, iconCls) {

          it(title, function() {

            // when
            var overlayEl = queryOverlay(element);
            var iconEl = query('.' + iconCls, overlayEl);

            // then
            expect(matches(overlayEl, '.interactive')).to.be.false;
            expect(query('button', overlayEl)).to.be.null;
            expect(iconEl).to.exist;
          });

        }

      });

    });

  });


  describe('API', function() {

    beforeEach(bootstrapViewer(diagramXML, {
      modules: [
        coreModule,
        drillDownModule
      ]
    }));


    it('should allow manual drillDown into element', inject(
      function(elementRegistry, drillDown) {

        // given
        var element = elementRegistry.get('Decision_Table');

        // when
        var success = drillDown.drillDown(element);

        // then
        // no drill down, as no Decision Table editor is mounted
        expect(success).to.be.false;
      }
    ));

    // TODO(@barmac): browser emits 'click' event on ENTER key press
    // but not for synthetic events
    it.skip('on Enter key pressed', inject(
      function(eventBus, drillDown, elementRegistry) {

        // given
        var drillSpy = sinon.spy(drillDown, 'drillDown');

        var overlayEl = queryOverlay('Decision_Table');
        console.log(overlayEl.innerHTML);

        // when
        // press ENTER
        triggerFocusIn(overlayEl);
        triggerKeyEvent(overlayEl, 'keydown', 13);

        // then
        expect(drillSpy).to.have.been.calledOnce;

        expect(drillSpy).to.have.been.calledWith(overlayEl);
      }
    ));

  });


  // helpers //////////////

  function queryOverlay(elementId) {
    var containerEl = query('[data-container-id="' + elementId + '"]', container);

    return query('.drill-down-overlay', containerEl);
  }

});
