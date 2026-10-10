import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import Editor from 'test/helper/Editor';

import simpleXML from '../../simple.dmn';


describe('features/decision-table - configuration', function() {

  let testContainer, dmnJS;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  afterEach(function() {
    dmnJS.destroy();
  });

  async function createViewer(options) {
    dmnJS = new Editor({
      container: testContainer,
      ...options
    });

    await dmnJS.importXML(simpleXML);

    return dmnJS.getActiveViewer();
  }


  it('should bind keyboard by default', async function() {

    // when
    const viewer = await createViewer();

    // then
    expect(viewer.get('keyboard').getBinding()).to.exist;
  });


  [ 'common', 'boxedExpression' ].forEach(function(scope) {

    describe(`<${ scope }>`, function() {

      function createViewerWith(options) {
        return createViewer({ [scope]: options });
      }


      it('should not bind keyboard if <keyboard.bind> is false', async function() {

        // when
        const viewer = await createViewerWith({ keyboard: { bind: false } });

        // then
        expect(viewer.get('keyboard').getBinding()).not.to.exist;
      });


      it('should not throttle if <throttle> is false', async function() {

        // given
        const fn = () => {};

        // when
        const viewer = await createViewerWith({ throttle: false });

        // then
        expect(viewer.get('throttle')(fn)).to.equal(fn);
      });


      it('should not debounce input if <debounceInput> is false', async function() {

        // given
        const fn = () => {};

        // when
        const viewer = await createViewerWith({ debounceInput: false });

        // then
        expect(viewer.get('debounceInput')(fn)).to.equal(fn);
      });


      it('should use <dataTypes>', async function() {

        // when
        const viewer = await createViewerWith({ dataTypes: [ 'double', 'long' ] });

        // then
        expect(viewer.get('dataTypes').getAll()).to.eql([ 'double', 'long' ]);
      });


      it('should use <expressionLanguages>', async function() {

        // given
        const options = [
          { value: 'feel', label: 'FEEL' },
          { value: 'juel', label: 'JUEL' }
        ];

        // when
        const viewer = await createViewerWith({
          expressionLanguages: {
            options,
            defaults: { editor: 'juel' }
          }
        });

        // then
        const expressionLanguages = viewer.get('expressionLanguages');

        expect(expressionLanguages.getAll()).to.eql(options);
        expect(expressionLanguages.getDefault().value).to.eql('juel');
      });


      it('should use <defaultInputExpressionLanguage>', async function() {

        // when
        const viewer = await createViewerWith({
          expressionLanguages: {
            options: [
              { value: 'feel', label: 'FEEL' },
              { value: 'juel', label: 'JUEL' }
            ]
          },
          defaultInputExpressionLanguage: 'juel'
        });

        // then
        expect(viewer.get('expressionLanguages').getDefault('inputCell').value)
          .to.eql('juel');
      });


      it('should use <feelLanguageContext>', async function() {

        // when
        const viewer = await createViewerWith({
          feelLanguageContext: { parserDialect: 'camunda' }
        });

        // then
        expect(viewer.get('feelLanguageContext').getConfig())
          .to.eql({ parserDialect: 'camunda' });
      });

    });

  });

});
