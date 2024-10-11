/* global sinon */

import Manager from 'src/base/Manager';
import { is } from 'src/util/ModelUtil';

import TestView from './TestView';

import { spy } from 'sinon';


import { find } from 'min-dash';

class TestViewer extends Manager {

  constructor(
      viewProviders = [ DECISION_TABLE_VIEW, DRD_VIEW ],
      options = {}) {
    super(options);

    this._viewProviders = viewProviders;
  }

  _getViewProviders() {
    return this._viewProviders;
  }

}

class ReturnWarningsView extends TestView {

  constructor(options) {
    super(options);
  }

  open(view) {
    return new Promise(function(resolve, reject) {
      resolve({ warnings: [ 'warning1', 'warning2' ] });
    });
  }

}

class ReturnErrorView extends TestView {

  constructor(options) {
    super(options);
  }

  open(view) {
    return new Promise(function(resolve, reject) {
      const err = new Error('foobar');
      err.warnings = [ 'warning1', 'warning2' ];

      reject(err);
    });
  }

}

const DECISION_TABLE_VIEW = {
  id: 'decisionTable',
  opens(element) {
    return is(element, 'dmn:Decision') && is(element.decisionLogic, 'dmn:DecisionTable');
  },
  constructor: TestView
};

const DRD_VIEW = {
  id: 'drd',
  opens: 'dmn:Definitions',
  constructor: TestView
};

const LOG_WARNING_VIEW = {
  id: 'drd',
  opens: 'dmn:Definitions',
  constructor: ReturnWarningsView
};

const ERRORS_VIEW = {
  id: 'drd',
  opens: 'dmn:Definitions',
  constructor: ReturnErrorView
};


const diagramXML = require('./diagram.dmn');

const dmn_11 = require('./dmn-11.dmn');
const dmn_12 = require('./dmn-12.dmn');
const drdOnly = require('./drd-only.dmn');


describe('Manager', function() {

  describe('instantiation', function() {

    it('should create without options', function() {

      // when
      const manager = new Manager();

      // then
      expect(manager).to.be.instanceOf(Manager);
    });

  });


  describe('import', function() {

    it('should import and open DMN file', async function() {

      // given
      const manager = new TestViewer();

      // assume
      expect(manager.getDefinitions()).not.to.exist;

      // when
      await manager.importXML(diagramXML);

      const activeView = manager.getActiveView();

      // then
      // we show the first active view
      expect(activeView).to.eql(manager.getViews()[0]);
      expect(activeView.type).to.eql('drd');

      expect(manager.getDefinitions()).to.equal(manager._definitions);
    });


    it('should import DMN file', async function() {

      // given
      const manager = new TestViewer();

      // when
      await manager.importXML(diagramXML, { open: false });

      // then
      // we don't show anything yet
      expect(manager.getActiveView()).not.to.exist;
    });


    describe('events', function() {

      it('should emit <attach> event', function() {

        // given
        const container = document.createElement('div');
        const viewer = new TestViewer();

        const events = [];

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
        const container = document.createElement('div');
        const viewer = new TestViewer({ container });

        const events = [];

        viewer.on('detach', function(event) {

          // log event type + event arguments
          events.push(event);
        });

        // when
        viewer.detach();

        // then
        expect(events).to.have.lengthOf(1);
      });


      it('should emit <import.*> events', async function() {

        // given
        const viewer = new TestViewer();

        const events = [];

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
        await viewer.importXML(diagramXML);

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


      // TODO: remove with future dmn-js version
      it('should wrap deprecated context in <import.parse.complete> event',
        async function() {

          // given
          const viewer = new TestViewer();

          let parseCompleteEvent;

          viewer.on([
            'import.parse.complete'
          ], function(e) {

            parseCompleteEvent = e;
          });

          // when
          await viewer.importXML(diagramXML);

          // then
          const context = parseCompleteEvent.context;

          expect(parseCompleteEvent).to.exist;

          expect(context).to.exist;

          expect(context.warnings).to.equal(parseCompleteEvent.warnings);
          expect(context.elementsById).to.equal(parseCompleteEvent.elementsById);
          expect(context.references).to.equal(parseCompleteEvent.references);
        });


      it('should include warnings in <import.done> events', async function() {

        // given
        const viewer = new TestViewer();

        let doneEvent;

        viewer.on([ 'import.done' ], function(e) {
          doneEvent = e;
        });

        // when
        await viewer.importXML(diagramXML, { open: false });

        // then
        expect(doneEvent).to.exist;

        expect(doneEvent.error).to.be.null;
        expect(doneEvent.warnings).to.exist;
      });


      it('should accept xml modifications on <import.parse.start>', function(done) {

        // given
        const viewer = new TestViewer();

        const findElement = function(elements, id) {
          return !!find(elements, function(element) {
            return element.id === id;
          });
        };

        viewer.once('import.parse.start', function(event) {
          const xml = event.xml;

          return xml.replace('dish-decision', 'dish-decision1');
        });

        viewer.on('import.parse.complete', function(event) {
          const definitions = event.definitions,
                drgElements = definitions.get('drgElement');

          // then
          expect(findElement(drgElements, 'dish-decision')).to.be.false;
          expect(findElement(drgElements, 'dish-decision1')).to.be.true;

          done();
        });

        // when
        viewer.importXML(diagramXML);
      });


      describe('<views.changed>', function() {

        it('should emit on import', function(done) {

          // given
          const manager = new TestViewer();

          // when
          manager.importXML(diagramXML);

          // then
          // expect single views.changed event
          manager.on('views.changed', function(event) {

            const { views, activeView } = event;

            expect(views).to.eql(manager.getViews());
            expect(activeView).to.eql(manager.getActiveView());

            done();
          });
        });


        it('should emit on open', function(done) {

          // given
          const manager = new TestViewer();

          // when
          manager.importXML(diagramXML);

          manager.once('import.done', function() {

            manager.on('views.changed', function(event) {

              const { views, activeView } = event;

              expect(views).to.eql(manager.getViews());
              expect(activeView).to.eql(manager.getActiveView());

              done();
            });

            manager.open(manager.getViews()[1]);
          });
        });


        it('should NOT emit if no changes', function(done) {

          // given
          const manager = new TestViewer();

          manager.once('import.done', function() {
            const viewsChangedSpy = sinon.spy(manager, '_viewsChanged');

            const dishDecisionView = manager.getViews().find(({ id }) => {
              return id === 'dish-decision';
            });

            manager.open(dishDecisionView);

            // assume
            expect(manager.getActiveView().id).to.equal('dish-decision');

            // when
            manager._updateViews();

            // then
            expect(viewsChangedSpy).to.not.have.been.called;

            expect(manager.getActiveView().id).to.equal('dish-decision');
            expect(manager.getViews()).to.length(4);

            done();
          });

          manager.importXML(diagramXML);
        });


        it('should emit if name changed', function(done) {

          // given
          const manager = new TestViewer();

          manager.once('import.done', function() {
            const viewsChangedSpy = sinon.spy(manager, '_viewsChanged');

            const dishDecisionView = manager.getViews().find(({ id }) => {
              return id === 'dish-decision';
            });

            manager.open(dishDecisionView);

            // assume
            expect(manager.getActiveView().id).to.equal('dish-decision');

            // when
            dishDecisionView.element.name = 'Foo';

            manager._updateViews();

            // then
            expect(viewsChangedSpy).to.have.been.called;

            expect(manager.getActiveView().id).to.equal('dish-decision');
            expect(manager.getViews()).to.length(4);

            done();
          });

          manager.importXML(diagramXML);
        });

      });

    });

  });


  describe('error handling', function() {

    it('should indicate no displayable contents', function() {

      // given
      const manager = new Manager();

      // when
      return manager.importXML(diagramXML).then(function(importXMLResult) {
        throw new Error('#importXML should not resolve when no displayable conents');
      }).catch(function(error) {

        // then
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.match(/no displayable contents/);
      });
    });


    it('should emit <import.parse.start>,' +
      ' <import.parse.complete> and <import.done> when no displayable contents',
    function() {

      // given
      const manager = new Manager();

      const events = [];

      manager.on([
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

      let err;

      manager.on([
        'import.done'
      ], function(e) {

        err = e.error;
      });

      // when
      return manager.importXML(diagramXML).then(function(importXMLResult) {
        throw new Error('#importXML should not resolve when no displayable conents');
      }).catch(function(error) {

        // then
        expect(error).to.exist;
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.match(/no displayable contents/);

        expect(events).to.eql([
          [ 'import.parse.start', [ 'xml' ] ],
          [ 'import.parse.complete', [ 'error', 'definitions', 'elementsById',
            'references', 'warnings', 'context' ] ],
          [ 'import.done', [ 'error', 'warnings' ] ]
        ]);

        expect(err).to.exist;
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.match(/no displayable contents/);
      });
    });


    it('should indicate broken XML', function() {

      // given
      const manager = new Manager();

      // when
      return manager.importXML('<foo&&').then(function(importXMLResult) {
        throw new Error('#importXML should not resolve when XML is broken');
      }).catch(function(err) {

        // then
        expect(err).to.exist;
        expect(err.message).to.match(/unparsable content <foo&& detected/);
      });
    });


    it('should emit <import.parse.start>, <import.parse.complete>' +
        ' and <import.done> events with broken XML',
    function() {

      // given
      const manager = new Manager();

      const events = [];

      manager.on([
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

      let err;

      manager.on([
        'import.done'
      ], function(e) {

        err = e.error;
      });

      // when
      return manager.importXML('<foo&&').then(function(importXMLResult) {
        throw new Error('#importXML should not resolve when XML is broken');
      }).catch(function(error) {

        // then
        expect(error).to.exist;
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.match(/unparsable content <foo&& detected/);

        expect(events).to.eql([
          [ 'import.parse.start', [ 'xml' ] ],
          [ 'import.parse.complete', [ 'error', 'warnings', 'context' ] ],
          [ 'import.done', [ 'error', 'warnings' ] ]
        ]);

        expect(err).to.exist;
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.match(/unparsable content <foo&& detected/);
      });
    });


    it('should emit <import.done> when diagram clear fails', async function() {

      // given
      class ClearErrorView extends TestView {
        clear() {
          throw new Error('clear failed');
        }
      }

      const manager = new TestViewer([ {
        id: 'drd',
        opens: 'dmn:Definitions',
        constructor: ClearErrorView
      } ]);
      await manager.importXML(diagramXML);

      const events = [];
      manager.on([
        'import.parse.start',
        'import.parse.complete',
        'import.render.start',
        'import.render.complete',
        'import.done'
      ], event => {
        events.push(event.type);
      });

      // when
      return manager.importXML(diagramXML).then(() => {
        throw new Error('should not resolve');
      }, error => {

        // then
        expect(error.message).to.eql('clear failed');
        expect(error.warnings).to.eql([]);
        expect(events).to.eql([ 'import.done' ]);
      });
    });
  });


  describe('views', function() {

    const manager = new TestViewer();


    it('should expose views', async function() {

      // when
      await manager.importXML(diagramXML);

      const views = manager.getViews();

      // then
      expect(views).to.have.length(4);
      expect(manager.getActiveView()).to.eql(views[0]);

      const elementIds = views.map(function(view) {
        return { type: view.type, element: view.element.id };
      });

      expect(elementIds).to.eql([
        { type: 'drd', element: 'dish' },
        { type: 'decisionTable', element: 'dish-decision' },
        { type: 'decisionTable', element: 'season' },
        { type: 'decisionTable', element: 'guestCount' }
      ]);
    });


    it('should switch', async function() {

      await manager.importXML(diagramXML);

      const views = manager.getViews();

      // when
      manager.open(views[3])
        .then(function(result) {
          expect(manager.getActiveView()).to.eql(manager.getViews()[3]);
        });
    });


    it('should update on re-import', async function() {

      // given
      const otherXML = require('./one-decision.dmn');

      await manager.importXML(diagramXML);

      // when
      await manager.importXML(otherXML);

      // then
      expect(manager.getViews()).to.have.length(2);
    });

  });


  describe('viewers', function() {

    it('should destroy on manager destruction', async function() {

      // given
      const manager = new TestViewer();

      const destroySpies = [];

      manager.on('viewer.created', function(event) {
        const viewer = event.viewer;
        const destroySpy = spy(viewer, 'destroy');

        destroySpies.push(destroySpy);
      });


      await manager.importXML(diagramXML);

      manager.open(manager.getViews()[1])
        .then(function(result) {

          // when
          manager.destroy();

          // then
          destroySpies.forEach(function(destroySpy) {
            expect(destroySpy).to.have.been.calledOnce;
          });

        });
    });


    it('should provide warnings on resolve', async function() {

      // given
      const manager = new TestViewer([ LOG_WARNING_VIEW ]);

      await manager.importXML(diagramXML);

      // when
      manager.open(manager.getViews()[0])
        .then(function(result) {

          // then
          expect(result.warnings).to.exist;
          expect(result.warnings).to.be.an.instanceof(Array);
          expect(result.warnings).to.have.length(2);
        });
    });


    it('should provide error and warnings on reject', async function() {

      // given
      const manager = new TestViewer([ ERRORS_VIEW ]);

      // when
      return manager.importXML(diagramXML).then(function(openResult) {
        throw new Error('getViews should not resolve given  error');
      }).catch(function(openError) {

        // then
        expect(openError).to.exist;
        expect(openError).to.be.an.instanceof(Error);
        expect(openError.message).to.equal('foobar');

        expect(openError.warnings).to.exist;
        expect(openError.warnings).to.be.an.instanceof(Array);
        expect(openError.warnings).to.have.length(2);
      });

    });

  });


  describe('export', function() {

    it('should indicate nothing imported', function() {

      // given
      const viewer = new TestViewer();

      // then
      return viewer.saveXML().then(function(saveXMLResult) {
        throw new Error('#saveXML should not resolve when nothing was imported');
      }).catch(function(error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.match(/no definitions loaded/);
      });
    });


    it('should export XML', async function() {

      // given
      const viewer = new TestViewer();

      await viewer.importXML(diagramXML);

      // when
      const { xml } = await viewer.saveXML({ format: true });

      // then
      expect(xml).to.contain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).to.contain('definitions');
      expect(xml).to.contain('  ');
    });


    it('should emit <saveXML.*> events', async function() {

      const viewer = new TestViewer();

      const events = [];

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

      await viewer.importXML(diagramXML);

      // when
      await viewer.saveXML();

      // then
      expect(events).to.eql([
        [ 'saveXML.start', [ 'definitions' ] ],
        [ 'saveXML.serialized', [ 'xml' ] ],
        [ 'saveXML.done', [ 'xml' ] ]
      ]);
    });


    it('should error only not emitting events when nothing was imported',
      async function() {

        // given
        const viewer = new TestViewer();

        const events = [];

        viewer.on([
          'saveXML.start',
          'saveXML.serialized',
          'saveXML.done'
        ], function(e) {

          events.push(e);
        });

        // then
        return viewer.saveXML().then(function(saveXMLResult) {
          throw new Error('should not resolve given nothing was imported');
        }).catch(function(err) {
          expect(err.message).to.match(/no definitions loaded/);
          expect(events).to.have.length(0);
        });

      });


    it('should allow to hook into <saveXML.serialzied> event, updating the xml',
      async function() {

        // given
        const viewer = new TestViewer();

        viewer.on([
          'saveXML.serialized',
        ], function(e) {

          return 'my invalid xml';
        });

        await viewer.importXML(diagramXML);

        // when
        const { xml } = await viewer.saveXML();

        // then
        expect(xml).to.equal('my invalid xml');
      });


    it('should allow to handle errors thrown hooked into <saveXML.serialzied> event',
      async function() {

        // given
        const viewer = new TestViewer();

        const userGeneratedError = new Error('user generated error');

        viewer.on([
          'saveXML.serialized',
        ], function(e) {

          throw userGeneratedError;
        });

        let doneEvent;

        viewer.on([
          'saveXML.done',
        ], function(e) {

          doneEvent = e;
        });

        await viewer.importXML(diagramXML);

        // when
        return viewer.saveXML().then(function(saveXMLResult) {
          throw new Error('saveXMl should not resolve given an error');
        }).catch(function(err) {

          // then
          expect(err).to.equal(userGeneratedError);

          expect(doneEvent).to.exist;
          expect(doneEvent.xml).to.not.exist;
          expect(doneEvent.error).to.equal(userGeneratedError);
        });
      });

  });


  it('should provide { _parent, moddle } to viewers', async function() {

    // given
    const dummy = new TestViewer([ DECISION_TABLE_VIEW ]);

    await dummy.importXML(diagramXML);

    // when
    const activeViewer = dummy.getActiveViewer();

    // then
    expect(activeViewer).is.instanceOf(TestView);

    expect(activeViewer.get('_parent')).to.equal(dummy);
    expect(activeViewer.get('moddle')).to.equal(dummy._moddle);
  });


  it('should provide options to viewers', async function() {

    // given
    const dummy = new TestViewer([ DECISION_TABLE_VIEW ], {
      common: {
        blub: {},
        common: true
      },
      decisionTable: {
        foo: 'BAR',
        blub: 'AAA'
      }
    });

    await dummy.importXML(diagramXML);

    // when
    const activeViewer = dummy.getActiveViewer();

    const config = activeViewer.get('config');

    // then
    expect(config).to.eql({
      blub: 'AAA',
      common: true,
      foo: 'BAR'
    });
  });


  describe('DMN compatibility', function() {

    it('should indicate DMN 1.1 incompatibility', function() {

      // given
      const dummy = new TestViewer();

      // when
      return dummy.importXML(dmn_11).then(function(importXMLResult) {
        throw new Error('should not resolve given incompatability');
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
      return dummy.importXML(dmn_12).then(function(importXMLResult) {
        throw new Error('should not resolve given incompatability');
      }).catch(function(err) {

        // then
        expect(err.message).to.match(
          /unsupported DMN 1\.2 file detected; only DMN 1\.3 files can be opened/
        );
      });

    });

  });


  describe('Callback compatibility', function() {

    describe('#open', function() {

      beforeEach(function() {
        sinon.spy(console, 'warn');
      });

      afterEach(function() {
        console.warn.restore();
      });


      describe('resolve', function() {

        it('should allow Promise based call without warning', function(done) {

          // given
          const manager = new TestViewer([ LOG_WARNING_VIEW ]);

          manager.importXML(diagramXML).then(() => {

            // when
            manager.open(manager.getViews()[0])
              .then(function(result) {

                // then
                expect(result.warnings).to.exist;
                expect(result.warnings).to.be.an.instanceof(Array);
                expect(result.warnings).to.have.length(2);

                expect(console.warn).to.not.have.been.called;

                done();
              })
              .catch(function(error) {
                done(error);
              });
          });
        });


        it('should log warning on Callback based call', function(done) {

          // given
          const manager = new TestViewer([ LOG_WARNING_VIEW ]);

          manager.importXML(diagramXML).then(() => {

            // when
            manager.open(manager.getViews()[0], function(err, warnings) {

              // then
              expect(err).not.to.exist;

              expect(warnings).to.exist;
              expect(warnings).to.be.an.instanceof(Array);
              expect(warnings).to.have.length(2);

              expect(console.warn).to.have.been.calledOnce;

              done();
            });
          });

        });

      });


      describe('reject', function() {

        it('should allow Promise based call without warning', function(done) {

          // given
          const manager = new TestViewer([ ERRORS_VIEW ]);

          manager.importXML(diagramXML).catch(() => {

            // don't handle the error during import, we want to test #open

            // when
            manager.open(manager.getViews()[0])
              .then(result => done(result))
              .catch(function(error) {

                // then
                expect(error).to.exist;
                expect(error).to.be.an.instanceof(Error);

                expect(error.warnings).to.exist;
                expect(error.warnings).to.be.an.instanceof(Array);
                expect(error.warnings).to.have.length(2);

                expect(console.warn).to.not.have.been.called;

                done();
              }
              );
          });
        });


        it('should log warning on Callback based call', function(done) {

          // given
          const manager = new TestViewer([ ERRORS_VIEW ]);

          manager.importXML(diagramXML).catch(() => {

            // don't handle the error during import, we want to test #open

            // when
            manager.open(manager.getViews()[0], function(err, warnings) {

              // then
              expect(err).to.exist;
              expect(err).to.be.an.instanceof(Error);

              expect(warnings).to.exist;
              expect(warnings).to.be.an.instanceof(Array);
              expect(warnings).to.have.length(2);

              expect(console.warn).to.have.been.calledOnce;

              done();
            });

          });

        });

      });

    });


    describe('#importXML', function() {

      beforeEach(function() {
        sinon.spy(console, 'warn');
      });

      afterEach(function() {
        console.warn.restore();
      });


      describe('resolve', function() {

        it('should allow Promise based call without warning', async function() {

          // given
          const manager = new TestViewer([ LOG_WARNING_VIEW ]);

          // when
          const { warnings } = await manager.importXML(diagramXML);

          // then
          expect(warnings).to.exist;
          expect(warnings).to.be.an.instanceof(Array);
          expect(warnings).to.have.length(2);

          expect(console.warn).to.not.have.been.called;
        });


        it('should log warning on Callback based call', function(done) {

          // given
          const manager = new TestViewer([ LOG_WARNING_VIEW ]);

          // when
          manager.importXML(diagramXML, function(err, warnings) {

            // then
            expect(err).not.to.exist;

            expect(warnings).to.exist;
            expect(warnings).to.be.an.instanceof(Array);
            expect(warnings).to.have.length(2);

            expect(console.warn).to.have.been.calledOnce;

            done();
          });

        });


        it('should detach old active view during re-import', async function() {

          // given
          const manager = new TestViewer();
          await manager.importXML(diagramXML);
          const views = manager.getViews(),
                activeView = manager.getActiveView(),
                activeViewer = manager.getActiveViewer();
          const detachSpy = sinon.spy(activeViewer, 'detach');

          // when
          await manager.importXML(drdOnly);
          const newViews = manager.getViews(),
                newActiveView = manager.getActiveView();

          // then
          expect(newViews).not.to.eql(views);
          expect(newActiveView).not.to.eql(activeView);
          expect(detachSpy).to.have.been.calledOnce;
        });
      });


      describe('reject', function() {

        it('should allow Promise based call without warning', function() {

          // given
          const manager = new TestViewer([ ERRORS_VIEW ]);

          // when
          return manager.importXML(diagramXML).catch(error => {

            // then
            expect(error).to.exist;
            expect(error).to.be.an.instanceof(Error);

            expect(error.warnings).to.exist;
            expect(error.warnings).to.be.an.instanceof(Array);
            expect(error.warnings).to.have.length(2);

            expect(console.warn).to.not.have.been.called;
          });

        });


        it('should log warning on Callback based call', function(done) {

          // given
          const manager = new TestViewer([ ERRORS_VIEW ]);

          manager.importXML(diagramXML, function(err, warnings) {

            // then
            expect(err).to.exist;
            expect(err).to.be.an.instanceof(Error);

            expect(warnings).to.exist;
            expect(warnings).to.be.an.instanceof(Array);
            expect(warnings).to.have.length(2);

            expect(console.warn).to.have.been.calledOnce;

            done();
          });

        });

      });

    });


    describe('#saveXML', function() {

      beforeEach(function() {
        sinon.spy(console, 'warn');
      });

      afterEach(function() {
        console.warn.restore();
      });


      describe('resolve', function() {

        it('should allow Promise based call without warning', async function() {

          // given
          const manager = new TestViewer();

          await manager.importXML(diagramXML);

          // when
          await manager.saveXML();

          // then
          expect(console.warn).to.not.have.been.called;
        });


        it('should log warning on Callback based call', function(done) {

          // given
          const manager = new TestViewer();

          manager.importXML(diagramXML).then(function() {

            // when
            manager.saveXML({ format: true }, function(err, xml) {

              // then
              expect(err).not.to.exist;

              expect(xml).to.exist;

              expect(console.warn).to.have.been.calledOnce;

              done();
            });
          });

        });

      });


      describe('reject', function() {

        it('should allow Promise based call without warning', function() {

          // given
          const manager = new TestViewer();

          // when
          return manager.saveXML({ format: true }).catch((error) => {

            // then
            expect(error).to.exist;
            expect(error).to.be.an.instanceof(Error);


            expect(console.warn).to.not.have.been.called;
          });

        });


        it('should log warning on Callback based call', function(done) {

          // given
          const manager = new TestViewer();

          // when
          manager.saveXML({ format: true }, function(err, xml) {

            // then
            expect(err).to.exist;

            expect(console.warn).to.have.been.calledOnce;

            done();
          });
        });

      });

    });

  });

});
