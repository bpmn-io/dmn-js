/* global sinon */

import exampleXML from '../fixtures/dmn/di.dmn';
import emptyDefsXML from '../fixtures/dmn/empty-definitions.dmn';

import TestContainer from 'mocha-test-container-support';

import DrdViewer from '../helper/DrdViewer';

import DefaultExport from '../../src';
import DrdView from 'src/Viewer';

import { keys } from 'min-dash';


describe('Viewer', function() {

  let container, viewer;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  function createViewer(xml) {
    viewer = new DrdViewer({ container });

    return viewer.importXML(xml);
  }


  it('should expose Viewer as library default', function() {
    expect(DefaultExport).to.equal(DrdView);
  });


  it('should import simple DRD', function() {
    return createViewer(exampleXML);
  });


  it('should re-import simple DRD', async function() {

    // given
    await createViewer(exampleXML);


    // when
    // mimic re-import of same diagram
    const { warnings } = await viewer.importXML(exampleXML);

    // then
    expect(warnings).to.have.length(0);
  });


  describe('import events', function() {

    it('should emit <import.*> events', async function() {

      // given
      const viewer = new DrdViewer({ container: container });

      const events = [];

      viewer.on([
        'import.parse.start',
        'import.parse.complete',
        'import.render.start',
        'import.render.complete',
        'import.done'
      ], function(event) {
        events.push([
          event.type,
          keys(event).filter(function(key) {
            return key !== 'type';
          })
        ]);
      });

      // when
      await viewer.importXML(exampleXML);

      // then
      expect(events).to.eql([
        [ 'import.parse.start', [ 'xml' ] ],
        [ 'import.parse.complete', [ 'error', 'definitions', 'elementsById',
          'references', 'warnings', 'context' ] ],
        [ 'import.render.start', [ 'view', 'element' ] ],
        [ 'import.render.complete', [ 'view', 'error', 'warnings' ] ],
        [ 'import.done', [ 'error', 'warnings' ] ]
      ]);

    });

  });


  describe('export', function() {

    function expectValidSVG(svg) {
      const expectedStart = '<?xml version="1.0" encoding="utf-8"?>';
      const expectedEnd = '</svg>';

      expect(svg.indexOf(expectedStart)).to.equal(0);
      expect(svg.indexOf(expectedEnd)).to.equal(svg.length - expectedEnd.length);

      // ensure correct rendering of SVG contents
      expect(svg.indexOf('undefined')).to.equal(-1);

      // expect header to be written only once
      expect(svg.indexOf('<svg width="100%" height="100%">')).to.equal(-1);
      expect(svg.indexOf('<g class="viewport"')).to.equal(-1);

      const parser = new DOMParser();
      const svgNode = parser.parseFromString(svg, 'image/svg+xml');

      // [comment, <!DOCTYPE svg>, svg]
      expect(svgNode.childNodes).to.have.length(3);

      // no error body
      expect(svgNode.body).not.to.exist;
    }


    it('should export svg', async function() {

      // given
      await createViewer(exampleXML);

      // when
      const { svg } = await viewer.getActiveViewer().saveSVG();

      // then
      expectValidSVG(svg);
    });

  });


  describe('error handling', function() {

    it('should throw error due to missing diagram', function() {

      // when
      return createViewer(emptyDefsXML).then(function() {
        throw new Error('should not have rejected');
      }).catch(function(err) {

        // then
        expect(err.message).to.eql('no dmndi:DMNDI');
      });
    });

  });


  describe('Callback compatibility', function() {

    describe('#saveSVG', function() {

      beforeEach(function() {
        sinon.spy(console, 'warn');
      });

      afterEach(function() {
        console.warn.restore();
      });


      describe('resolve', function() {

        it('should allow Promise based call without warning', async function() {

          // given
          await createViewer(exampleXML);

          // when
          const { svg } = await viewer.getActiveViewer().saveSVG();

          // then
          expect(svg).to.exist;

          // should not be empty
          expect(svg.includes('viewBox="0 0 0 0"')).to.be.false;
          expect(console.warn).to.not.have.been.called;
        });


        it('should log warning on Callback based call', function(done) {


          // given
          createViewer(exampleXML).then(() => {

            // when
            viewer.getActiveViewer().saveSVG({}, function(err, svg) {

              // then
              expect(svg).to.exist;

              expect(console.warn).to.have.been.calledOnce;

              done();
            });
          });
        });

      });

    });

  });

});
