import {
  bootstrapViewer,
  inject
} from 'test/TestHelper';

import { query as domQuery } from 'min-dom';


describe('draw - DrdRenderer', function() {

  it('Knowledge Source', function() {
    var xml = require('../../fixtures/dmn/knowledge-source.dmn');

    return bootstrapViewer(xml).call(this);
  });

  it('Business Knowledge Model', function() {
    var xml = require('../../fixtures/dmn/business-knowledge.dmn');

    return bootstrapViewer(xml).call(this);
  });

  it('Input Data', function() {
    var xml = require('../../fixtures/dmn/input-data.dmn');

    return bootstrapViewer(xml).call(this);
  });

  it('Literal Expression', function() {
    var xml = require('../../fixtures/dmn/literal-expression.dmn');

    return bootstrapViewer(xml).call(this);
  });

  it('Text Annotation', function() {
    var xml = require('../../fixtures/dmn/text-annotation.dmn');

    return bootstrapViewer(xml).call(this);
  });


  describe('colors', function() {

    it('should render default colors without configuration ', async function() {

      // given
      var viewer = await bootstrapViewer(require('../../fixtures/dmn/di.dmn'))
            .call(this),
          elementRegistry = viewer.getActiveViewer().get('elementRegistry');

      // when
      var gfx = elementRegistry.getGraphics('dish-decision'),
          visual = domQuery('.djs-visual', gfx);

      // then
      expect(domQuery('rect', visual).style.fill).to.equal('white');
      expect(domQuery('rect', visual).style.stroke).to.equal('rgb(34, 36, 42)');
      expect(domQuery('text', visual).style.fill).to.equal('rgb(34, 36, 42)');
    });


    describe('with configuration', function() {

      beforeEach(bootstrapViewer(require('../../fixtures/dmn/di.dmn'), {
        drdRenderer: {
          defaultFillColor: 'yellow',
          defaultStrokeColor: 'red',
          defaultLabelColor: 'blue'
        }
      }));


      it('should render colors as configured (decision)', inject(
        function(elementRegistry) {

          // given
          // when
          var gfx = elementRegistry.getGraphics('dish-decision'),
              visual = domQuery('.djs-visual', gfx);

          // then
          expect(domQuery('rect', visual).style.fill).to.equal('yellow');
          expect(domQuery('rect', visual).style.stroke).to.equal('red');
          expect(domQuery('text', visual).style.fill).to.equal('blue');
        }
      ));


      it('should render colors as configured (input data)', inject(
        function(elementRegistry) {

          // when
          var gfx = elementRegistry.getGraphics('dayType_id'),
              visual = domQuery('.djs-visual', gfx);

          // then
          expect(domQuery('rect', visual).style.fill).to.equal('yellow');
          expect(domQuery('rect', visual).style.stroke).to.equal('red');
          expect(domQuery('text', visual).style.fill).to.equal('blue');
        }
      ));


      it('should render colors as configured (knowledge source)', inject(
        function(elementRegistry) {

          // when
          var gfx = elementRegistry.getGraphics('host_ks'),
              visual = domQuery('.djs-visual', gfx);

          // then
          expect(domQuery('path', visual).style.fill).to.equal('yellow');
          expect(domQuery('path', visual).style.stroke).to.equal('red');
          expect(domQuery('text', visual).style.fill).to.equal('blue');
        }
      ));


      it('should render colors as configured (bkm)', inject(
        function(elementRegistry) {

          // when
          var gfx = elementRegistry.getGraphics('elMenu'),
              visual = domQuery('.djs-visual', gfx);

          // then
          expect(domQuery('path', visual).style.fill).to.equal('yellow');
          expect(domQuery('path', visual).style.stroke).to.equal('red');
          expect(domQuery('text', visual).style.fill).to.equal('blue');
        }
      ));


      it('should render colors as configured (information requirement)', inject(
        function(elementRegistry) {

          // when
          var gfx = elementRegistry.getGraphics('InformationRequirement_0f1lgbl'),
              visual = domQuery('.djs-visual', gfx);

          // then
          expect(domQuery('path', visual).style.stroke).to.equal('red');
        }
      ));


      it('should render colors as configured (knowledge requirement)', inject(
        function(elementRegistry) {

          // when
          var gfx = elementRegistry.getGraphics('KnowledgeRequirement_0rapvwi'),
              visual = domQuery('.djs-visual', gfx);

          // then
          expect(domQuery('path', visual).style.stroke).to.equal('red');
        }
      ));


      it('should render colors as configured (authority requirement)', inject(
        function(elementRegistry) {

          // when
          var gfx = elementRegistry.getGraphics('AuthorityRequirement_1q4ah0l'),
              visual = domQuery('.djs-visual', gfx);

          // then
          expect(domQuery('path', visual).style.stroke).to.equal('red');
        }
      ));


      it('should render colors as configured (text annotation)', inject(
        function(elementRegistry) {

          // when
          var gfx = elementRegistry.getGraphics('TextAnnotation_1t4zaz9'),
              visual = domQuery('.djs-visual', gfx);

          // then
          expect(domQuery('path', visual).style.stroke).to.equal('red');
          expect(domQuery('text', visual).style.fill).to.equal('blue');
        }
      ));


      it('should render colors as configured (association)', inject(
        function(elementRegistry) {

          // when
          var gfx = elementRegistry.getGraphics('Association_1c4jixb'),
              visual = domQuery('.djs-visual', gfx);

          // then
          expect(domQuery('path', visual).style.stroke).to.equal('red');
        }
      ));


      describe('markers', function() {

        it('should render colors as configured (information requirement)', inject(
          function(canvas) {

            // given
            var container = canvas.getContainer();

            // when
            var gfx = domQuery('defs marker[id^=information-requirement-end]', container);

            // then
            expect(domQuery('path', gfx).style.fill).to.equal('red');
          }));


        it('should render colors as configured (knowledge requirement)', inject(
          function(canvas) {

            // given
            var container = canvas.getContainer();

            // when
            var gfx = domQuery('defs marker[id^=knowledge-requirement-end]', container);

            // then
            expect(domQuery('path', gfx).style.stroke).to.equal('red');
          }));


        it('should render colors as configured (authority requirement)', inject(
          function(canvas) {

            // given
            var container = canvas.getContainer();

            // when
            var gfx = domQuery('defs marker[id^=authority-requirement-end]', container);

            // then
            expect(domQuery('circle', gfx).style.fill).to.equal('red');
          }));
      });
    });
  });
});
