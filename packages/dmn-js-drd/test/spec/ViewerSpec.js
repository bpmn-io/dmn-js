import exampleXML from '../fixtures/dmn/di.dmn';
import emptyDefsXML from '../fixtures/dmn/empty-definitions.dmn';

import TestContainer from 'mocha-test-container-support';

import DrdViewer from '../helper/DrdViewer';

import DefaultExport from '../../src';
import DrdView from 'src/Viewer';

import { keys } from 'min-dash';


describe('Viewer', function() {

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  function createViewer(xml, done) {
    var viewer = new DrdViewer({ container });

    viewer.importXML(xml, function(err, warnings) {
      done(err, warnings, viewer);
    });
  }


  it('should expose Viewer as library default', function() {
    expect(DefaultExport).to.equal(DrdView);
  });


  it('should import simple DRD', function(done) {
    createViewer(exampleXML, done);
  });


  it('should re-import simple DRD', function(done) {

    // given
    createViewer(exampleXML, function(err, warnings, viewer) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      viewer.importXML(exampleXML, function(err, warnings) {

        // then
        expect(err).to.not.exist;
        expect(warnings).to.have.length(0);

        done();
      });

    });

  });


  describe('import events', function() {

    it('should emit <import.*> events', function(done) {

      // given
      var viewer = new DrdViewer({ container: container });

      var events = [];

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
      viewer.importXML(exampleXML, function(err) {

        // then
        expect(events).to.eql([
          [ 'import.parse.start', [ 'xml' ] ],
          [ 'import.parse.complete', ['error', 'definitions', 'context' ] ],
          [ 'import.render.start', [ 'view', 'element' ] ],
          [ 'import.render.complete', [ 'view', 'error', 'warnings' ] ],
          [ 'import.done', [ 'error', 'warnings' ] ]
        ]);

        done(err);
      });

    });

  });


  describe('export', function() {

    function expectValidSVG(svg) {
      var expectedStart = '<?xml version="1.0" encoding="utf-8"?>';
      var expectedEnd = '</svg>';

      expect(svg.indexOf(expectedStart)).to.equal(0);
      expect(svg.indexOf(expectedEnd)).to.equal(svg.length - expectedEnd.length);

      // ensure correct rendering of SVG contents
      expect(svg.indexOf('undefined')).to.equal(-1);

      // expect header to be written only once
      expect(svg.indexOf('<svg width="100%" height="100%">')).to.equal(-1);
      expect(svg.indexOf('<g class="viewport"')).to.equal(-1);

      var parser = new DOMParser();
      var svgNode = parser.parseFromString(svg, 'image/svg+xml');

      // [comment, <!DOCTYPE svg>, svg]
      expect(svgNode.childNodes).to.have.length(3);

      // no error body
      expect(svgNode.body).not.to.exist;
    }


    it('should export svg', function(done) {

      // given
      createViewer(exampleXML, function(err, warnings, viewer) {

        if (err) {
          return done(err);
        }

        // when
        viewer.getActiveViewer().saveSVG(function(err, svg) {

          if (err) {
            return done(err);
          }

          // then
          expectValidSVG(svg);

          done();
        });
      });

    });

  });


  describe('error handling', function() {

    it('should throw error due to missing diagram', function(done) {

      // when
      createViewer(emptyDefsXML, function(err) {

        // then
        expect(err.message).to.eql('no dmndi:DMNDI');

        done();
      });
    });

  });

});
