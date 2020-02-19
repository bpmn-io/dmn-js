import Manager from 'src/base/Manager';

import TestView from './TestView';

import { spy } from 'sinon';


class TestViewer extends Manager {

  constructor(viewProviders=[ DECISION_TABLE_VIEW, DRD_VIEW ], options={}) {
    super(options);

    this._viewProviders = viewProviders;
  }

  _getViewProviders() {
    return this._viewProviders;
  }

}

const DECISION_TABLE_VIEW = {
  id: 'decisionTable',
  opens: 'dmn:Decision',
  constructor: TestView
};

const DRD_VIEW = {
  id: 'drd',
  opens: 'dmn:Definitions',
  constructor: TestView
};


var diagramXML = require('./diagram.dmn');

var dmn_11 = require('./dmn-11.dmn');
var dmn_12 = require('./dmn-12.dmn');


describe('Manager', function() {

  describe('instantiation', function() {

    it('should create without options', function() {

      // when
      var manager = new Manager();

      // then
      expect(manager).to.be.instanceOf(Manager);
    });

  });


  describe('import', function() {

    it('should import and open DMN file', function(done) {

      // given
      var manager = new TestViewer();

      // assume
      expect(manager.getDefinitions()).not.to.exist;

      // when
      manager.importXML(diagramXML, function(err) {

        var activeView = manager.getActiveView();

        // then
        // we show the first active view
        expect(activeView).to.eql(manager.getViews()[0]);
        expect(activeView.type).to.eql('drd');

        expect(manager.getDefinitions()).to.equal(manager._definitions);

        done(err);
      });

    });


    it('should import DMN file', function(done) {

      // given
      var manager = new TestViewer();

      // when
      manager.importXML(diagramXML, { open: false }, function(err) {

        // then
        // we don't show anything yet
        expect(manager.getActiveView()).not.to.exist;

        done(err);
      });

    });


    describe('events', function() {

      it('should emit <attach> event', function() {

        // given
        var container = document.createElement('div');
        var viewer = new TestViewer();

        var events = [];

        viewer.on('attach', function(event) {

          // log event type + event arguments
          events.push(event);
        });

        // when
        viewer.attachTo(container);

        // then
        expect(events).to.have.lengthOf(1);
      });


      it('should emit <detach> event', function() {

        // given
        var container = document.createElement('div');
        var viewer = new TestViewer({ container });

        var events = [];

        viewer.on('detach', function(event) {

          // log event type + event arguments
          events.push(event);
        });

        // when
        viewer.detach();

        // then
        expect(events).to.have.lengthOf(1);
      });


      it('should emit <import.*> events', function(done) {

        // given
        var viewer = new TestViewer();

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
        viewer.importXML(diagramXML, function(err) {

          if (err) {
            return done(err);
          }

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


      describe('<views.changed>', function() {

        it('should emit on import', function(done) {

          // given
          var manager = new TestViewer();

          // when
          manager.importXML(diagramXML);

          // then
          // expect single views.changed event
          manager.on('views.changed', function(event) {

            var { views, activeView } = event;

            expect(views).to.eql(manager.getViews());
            expect(activeView).to.eql(manager.getActiveView());

            done();
          });
        });


        it('should emit on open', function(done) {

          // given
          var manager = new TestViewer();

          // when
          manager.importXML(diagramXML);

          manager.once('import.done', function() {

            manager.on('views.changed', function(event) {

              var { views, activeView } = event;

              expect(views).to.eql(manager.getViews());
              expect(activeView).to.eql(manager.getActiveView());

              done();
            });

            manager.open(manager.getViews()[1]);
          });
        });

      });

    });

  });


  describe('error handling', function() {

    it('should indicate no displayable contents', function(done) {

      // given
      var manager = new Manager();

      // when
      manager.importXML(diagramXML, function(err) {

        expect(err.message).to.match(/no displayable contents/);

        done();
      });

    });


    it('should indicate broken XML', function(done) {

      // given
      var manager = new Manager();

      // when
      manager.importXML('<foo&&', function(err) {

        expect(err).to.exist;
        expect(err.message).to.match(/unparsable content <foo&& detected/);

        done();
      });

    });

  });


  describe('views', function() {

    var manager = new TestViewer();


    it('should expose views', function(done) {

      // when
      manager.importXML(diagramXML, function(err) {
        if (err) {
          return done(err);
        }

        var views = manager.getViews();

        // then
        expect(views).to.have.length(4);
        expect(manager.getActiveView()).to.eql(views[0]);

        var elementIds = views.map(function(view) {
          return { type: view.type, element: view.element.id };
        });

        expect(elementIds).to.eql([
          { type: 'drd', element: 'dish' },
          { type: 'decisionTable', element: 'dish-decision' },
          { type: 'decisionTable', element: 'season' },
          { type: 'decisionTable', element: 'guestCount' }
        ]);

        done();
      });
    });


    it('should switch', function(done) {

      manager.importXML(diagramXML, function(err) {
        if (err) {
          return done(err);
        }

        var views = manager.getViews();

        // when
        manager.open(views[3], function(err) {

          if (err) {
            return done(err);
          }

          // then
          expect(manager.getActiveView()).to.eql(manager.getViews()[3]);

          done();
        });

      });

    });


    it('should update on re-import', function(done) {

      // given
      var otherXML = require('./one-decision.dmn');

      manager.importXML(diagramXML, function(err) {
        if (err) {
          return done(err);
        }

        // when
        manager.importXML(otherXML, function(err) {

          if (err) {
            return done(err);
          }

          // then
          expect(manager.getViews()).to.have.length(2);

          done();
        });

      });

    });

  });


  describe('viewers', function() {

    it('should destroy on manager destruction', function(done) {

      // given
      var manager = new TestViewer();

      var destroySpies = [];

      manager.on('viewer.created', (event) => {
        var viewer = event.viewer;
        var destroySpy = spy(viewer, 'destroy');

        destroySpies.push(destroySpy);
      });


      manager.importXML(diagramXML, function(err) {
        if (err) {
          return done(err);
        }

        manager.open(manager.getViews()[1], function() {

          // when
          manager.destroy();

          // then
          destroySpies.forEach(function(destroySpy) {
            expect(destroySpy).to.have.been.calledOnce;
          });

          done();
        });

      });

    });

  });


  describe('export', function() {

    it('should indicate nothing imported', function(done) {

      // given
      var viewer = new TestViewer();

      // then
      viewer.saveXML(function(err, xml) {

        expect(err.message).to.match(/no definitions loaded/);

        done();
      });

    });


    it('should export XML', function(done) {

      // given
      var viewer = new TestViewer();

      viewer.importXML(diagramXML, function(err, warnings) {

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


    it('should emit <saveXML.*> events', function(done) {

      var viewer = new TestViewer();

      var events = [];

      viewer.on([
        'saveXML.start',
        'saveXML.serialized',
        'saveXML.done'
      ], function(e) {

        // log event type + event arguments
        events.push([
          e.type,
          Object.keys(e).filter(function(key) {
            return key !== 'type';
          })
        ]);
      });

      viewer.importXML(diagramXML, function(err) {

        // when
        viewer.saveXML(function(err) {

          // then
          expect(events).to.eql([
            [ 'saveXML.start', [ 'definitions' ] ],
            [ 'saveXML.serialized', ['error', 'xml' ] ],
            [ 'saveXML.done', ['error', 'xml' ] ]
          ]);

          done(err);
        });
      });
    });

  });


  it('should provide { _parent, moddle } to viewers', function(done) {

    // given
    var dummy = new TestViewer([ DECISION_TABLE_VIEW ]);

    dummy.importXML(diagramXML, function(err, warnings) {

      if (err) {
        return done(err);
      }

      // when
      var activeViewer = dummy.getActiveViewer();

      // then
      expect(activeViewer).is.instanceOf(TestView);

      expect(activeViewer.get('_parent')).to.equal(dummy);
      expect(activeViewer.get('moddle')).to.equal(dummy._moddle);

      done();
    });
  });


  it('should provide options to viewers', function(done) {

    // given
    var dummy = new TestViewer([ DECISION_TABLE_VIEW ], {
      common: {
        blub: {},
        common: true
      },
      decisionTable: {
        foo: 'BAR',
        blub: 'AAA'
      }
    });

    dummy.importXML(diagramXML, function(err, warnings) {

      if (err) {
        return done(err);
      }

      // when
      var activeViewer = dummy.getActiveViewer();

      var config = activeViewer.get('config');

      // then
      expect(config).to.eql({
        blub: 'AAA',
        common: true,
        foo: 'BAR'
      });

      done();
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