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

const diagramXML = require('./diagram.dmn');

const dmn_11 = require('./dmn-11.dmn');
const dmn_12 = require('./dmn-12.dmn');


describe('EditingManager', function() {

  it('should detect view changes', function(done) {

    const viewer = new TestViewer();

    viewer.importXML(diagramXML);

    viewer.once('import.done', function() {

      const activeEditor = viewer.getActiveViewer();

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

    it('should indicate DMN 1.1 incompatibility', function() {

      // given
      const dummy = new TestViewer();

      // when
      return dummy.importXML(dmn_11).then(function() {
        throw new Error('expected error');
      }).catch(function(err) {

        // then
        expect(err.message).to.match(
          /unsupported DMN 1\.1 file detected; only DMN 1\.3 files can be opened/
        );
      });
    });


    it('should indicate DMN 1.2 incompatibility', function() {

      // given
      const dummy = new TestViewer();


      // when
      return dummy.importXML(dmn_12).then(function() {
        throw new Error('expected error');
      }).catch(function(err) {

        // then
        expect(err.message).to.match(
          /unsupported DMN 1\.2 file detected; only DMN 1\.3 files can be opened/
        );
      });
    });

  });
});
