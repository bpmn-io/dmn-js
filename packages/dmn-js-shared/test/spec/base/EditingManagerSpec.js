import EditingManager from 'src/base/EditingManager';

import TestView from './TestView';


class TestViewer extends EditingManager {

  _getViewProviders() {
    return [
      {
        id: 'drd',
        opens: 'dmn:Definitions',
        constructor: TestView
      }
    ];
  }

}

var diagramXML = require('./diagram.dmn');

var dmn_11 = require('./dmn-11.dmn');
var dmn_12 = require('./dmn-12.dmn');


describe('EditingManager', function() {

  it('should detect view changes', function(done) {

    var viewer = new TestViewer();

    viewer.importXML(diagramXML);

    viewer.once('import.done', function() {

      var activeEditor = viewer.getActiveViewer();

      activeEditor._emit('elements.changed', {
        elements: [

          // fake element
          { businessObject: viewer._definitions }
        ]
      });

      viewer.on('views.changed', function(event) {

        // then expect we're done
        done();
      });
    });

  });


  describe('DMN compatibility', function() {

    it('should indicate DMN 1.1 incompatibility', function(done) {

      var dummy = new TestViewer();

      dummy.importXML(dmn_11, function(err) {

        if (!err) {
          return done(new Error('expected error'));
        }

        expect(err.message).to.match(
          /unsupported DMN 1\.1 file detected; only DMN 1\.3 files can be opened/
        );

        done();
      });
    });


    it('should indicate DMN 1.2 incompatibility', function(done) {

      var dummy = new TestViewer();

      dummy.importXML(dmn_12, function(err) {

        if (!err) {
          return done(new Error('expected error'));
        }

        expect(err.message).to.match(
          /unsupported DMN 1\.2 file detected; only DMN 1\.3 files can be opened/
        );

        done();
      });
    });

  });
});