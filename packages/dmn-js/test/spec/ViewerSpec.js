'use strict';

var Viewer = require('../../lib/Viewer');

var exampleXML = require('../fixtures/dmn/di.dmn'),
    namespaceXML = require('../fixtures/dmn/namespace.dmn'),
    emptyDefsXML = require('../fixtures/dmn/empty-definitions.dmn');

var TestContainer = require('mocha-test-container-support');


describe('Viewer', function() {

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  function createViewer(xml, done) {
    var viewer = window.viewer = new Viewer({ container: container });

    viewer.importXML(xml, function(err, warnings) {
      done(err, warnings, viewer);
    });
  }


  it('should import simple DRD', function(done) {
    createViewer(exampleXML, done);
  });


  it('should import empty definitions', function(done) {
    createViewer(emptyDefsXML, done);
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


  it('should fix the namespace from "dmn11.xsd" to "dmn.xsd"', function(done) {

    createViewer(namespaceXML, function(err, warnings, modeler) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      modeler.saveXML(function(err, xml) {
        if (err) {
          return done(err);
        }

        // then
        expect(err).to.not.exist;
        expect(xml.indexOf('xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd')).to.exist;

        done();
      });

    });

  });


  describe('defaults', function() {


    it('should use <body> as default parent', function(done) {

      var viewer = new Viewer();

      viewer.importXML(exampleXML, function(err, warnings) {

        expect(viewer.container.parentNode).to.eql(document.body);

        done(err, warnings);
      });
    });

  });


  describe('import events', function() {

    it('should emit <import.*> events', function(done) {

      // given
      var viewer = new Viewer({ container: container });

      var events = [];

      viewer.on([
        'import.parse.start',
        'import.parse.complete',
        'import.render.start',
        'import.render.complete',
        'import.done'
      ], function(e) {
        // log event type + event arguments
        events.push([
          e.type,
          Object.keys(e).filter(function(key) {
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
          [ 'import.render.start', [ 'definitions' ] ],
          [ 'import.render.complete', [ 'error', 'warnings' ] ],
          [ 'import.done', [ 'error', 'warnings' ] ]
        ]);

        done(err);
      });

    });

  });


  describe('export', function() {

    function validSVG(svg) {
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

      // FIXME(nre): make matcher
      return true;
    }



    it('should export XML', function(done) {

      // given
      createViewer(exampleXML, function(err, warnings, viewer) {

        if (err) {
          return done(err);
        }

        // when
        viewer.saveXML({ format: true }, function(err, xml) {

          if (err) {
            return done(err);
          }

          // then
          expect(xml).to.contain('<?xml version="1.0" encoding="UTF-8"?>');
          expect(xml).to.contain('definitions');
          expect(xml).to.contain('  ');

          done();
        });
      });

    });


    it('should export svg', function(done) {

      // given
      createViewer(exampleXML, function(err, warnings, viewer) {

        if (err) {
          return done(err);
        }

        // when
        viewer.saveSVG(function(err, svg) {

          if (err) {
            return done(err);
          }

          // then
          expect(validSVG(svg)).to.be.true;

          done();
        });
      });
    });

  });

});
