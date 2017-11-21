import Manager from 'lib/base/Manager';

import View from 'lib/base/View';

class DummyView extends View {

  constructor(options) {

    super(options);

    this._modules = options.additionalModules || [];
  }

  // mock DI api
  get(name) {

    return this._modules.reduce(function(s, module) {

      if (s) {
        return s;
      }

      if (name in module) {
        // unwrap [ 'value', someValue ]
        return module[name][1];
      }
    }, null);
  }

}

class DummyViewer extends Manager {

  _getViewProviders() {
    return [
      {
        id: 'decision',
        opens: 'dmn:Decision',
        constructor: DummyView
      },
      {
        id: 'drd',
        opens: 'dmn:Definitions',
        constructor: DummyView
      }
    ];
  }

}

var diagramXML = require('./diagram.dmn');


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
      var manager = new DummyViewer();

      // when
      manager.importXML(diagramXML, function(err) {

        // then
        // we show the first active view
        expect(manager.getActiveView()).to.eql(manager.getViews()[0]);

        done(err);
      });

    });


    it('should import DMN file', function(done) {

      // given
      var manager = new DummyViewer();

      // when
      manager.importXML(diagramXML, { open: false }, function(err) {

        // then
        // we don't show anything yet
        expect(manager.getActiveView()).not.to.exist;

        done(err);
      });

    });


    describe('events', function() {

      it('should emit <import.*> events', function(done) {

        // given
        var viewer = new DummyViewer();

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

    });

  });


  describe('error handling', function() {

    it('should indicate no view to display', function(done) {

      // given
      var manager = new Manager();

      // when
      manager.importXML(diagramXML, function(err) {

        expect(err.message).to.match(/no view to display/);

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

    var manager = new DummyViewer();


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
          return view.element.id;
        });

        expect(elementIds).to.eql([
          'dish',
          'dish-decision',
          'season',
          'guestCount'
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


  describe('export', function() {

    it('should indicate nothing imported', function(done) {

      // given
      var viewer = new DummyViewer();

      // then
      viewer.saveXML(function(err, xml) {

        expect(err.message).to.match(/no definitions loaded/);

        done();
      });

    });


    it('should export XML', function(done) {

      // given
      var viewer = new DummyViewer();

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

  });


  it('should advertise self as <_parent> to viewers', function(done) {

    // given
    var dummy = new DummyViewer();

    dummy.importXML(diagramXML, function(err, warnings) {

      if (err) {
        return done(err);
      }

      // when
      var activeViewer = dummy.getActiveViewer();

      // then
      expect(activeViewer).is.instanceOf(DummyView);

      expect(activeViewer.get('_parent')).to.equal(dummy);

      done();
    });
  });

});