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

});