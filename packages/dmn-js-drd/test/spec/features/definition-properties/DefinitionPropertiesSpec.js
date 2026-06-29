import { expect } from 'chai';
import {
  classes as domClasses,
  query as domQuery
} from 'min-dom';

import { waitFor } from '@testing-library/dom';

import { getBusinessObject } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  bootstrapModeler,
  inject,
  injectAsync
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import paletteProviderModule from 'src/features/palette';
import defPropsViewerModule from 'src/features/definition-properties/viewer';
import defPropsModelerModule from 'src/features/definition-properties/modeler';
import coreModule from 'src/core';

import {
  inputEvent
} from 'test/util/EventUtils';

describe('features/definition-properties', function() {

  var testModules = [
    coreModule,
    paletteProviderModule,
    defPropsViewerModule,
    defPropsModelerModule,
    modelingModule
  ];

  var diagramXML = require('./definitionProperties.dmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should display the definitions name', inject(function(definitionPropertiesView) {

    // given
    var nameContainer = domQuery(
      '.dmn-definitions-name',
      definitionPropertiesView._container
    );

    // when

    // then
    expect(nameContainer.textContent).to.eql('drd-name');
  }));


  it('should display the definitions id', inject(function(definitionPropertiesView) {

    // given
    var nameContainer = domQuery(
      '.dmn-definitions-id',
      definitionPropertiesView._container
    );

    // when

    // then
    expect(nameContainer.textContent).to.eql('drd-id');
  }));


  it('should apply changes from updated definitions', inject(
    function(definitionPropertiesView, canvas) {

      // given
      var definitions = canvas.getRootElement().businessObject;
      var nameContainer = domQuery(
        '.dmn-definitions-name',
        definitionPropertiesView._container
      );

      // when
      definitions.name = 'new Name';
      definitionPropertiesView.update();

      // then
      expect(nameContainer.textContent).to.eql('new Name');
    }
  ));


  it('should react to definition name updates', inject(
    function(definitionPropertiesView, definitionPropertiesEdit) {

      // given
      var nameContainer = domQuery(
        '.dmn-definitions-name',
        definitionPropertiesView._container
      );

      // when
      definitionPropertiesEdit.update('name', 'new Name');

      // then
      expect(nameContainer.textContent).to.eql('new Name');
    }
  ));


  it('should undo', inject(
    function(definitionPropertiesView, definitionPropertiesEdit, commandStack) {

      // given
      var nameContainer = domQuery(
        '.dmn-definitions-name',
        definitionPropertiesView._container
      );
      definitionPropertiesEdit.update('name', 'new Name');

      // when
      commandStack.undo();

      // then
      expect(nameContainer.textContent).to.eql('drd-name');
    }
  ));


  it('should redo', inject(
    function(definitionPropertiesView, definitionPropertiesEdit, commandStack) {

      // given
      var nameContainer = domQuery(
        '.dmn-definitions-name',
        definitionPropertiesView._container
      );
      definitionPropertiesEdit.update('name', 'new Name');

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(nameContainer.textContent).to.eql('new Name');
    }
  ));


  it('should be responsive', inject(function(canvas, eventBus, definitionPropertiesView) {

    // given
    var parent = canvas.getContainer();

    var propertiesContainer = definitionPropertiesView._container;

    // assume
    expect(propertiesContainer.offsetLeft).to.eql(80);

    // when
    parent.style.height = '160px';

    canvas.resized();

    // then
    expect(propertiesContainer.offsetLeft).to.equal(130);
  }));


  describe('editing', function() {

    it('should edit definition name', injectAsync(function(done) {
      return function(canvas, definitionPropertiesView, eventBus) {

        // given
        var definitions = canvas.getRootElement().businessObject;
        var nameContainer = domQuery(
          '.dmn-definitions-name',
          definitionPropertiesView._container
        );

        nameContainer.focus();

        // when
        eventBus.on('commandStack.element.updateProperties.postExecute', function() {

          // then
          expect(definitions.name).to.equal('hello');

          done();
        });

        nameContainer.textContent = 'hello';
        inputEvent(nameContainer, 'hello');
        nameContainer.blur();
      };
    }));


    it('should not update definition name on input alone', inject(
      function(canvas, definitionPropertiesView, eventBus) {

        // given
        var definitions = canvas.getRootElement().businessObject;
        var nameContainer = domQuery(
          '.dmn-definitions-name',
          definitionPropertiesView._container
        );

        var updated = false;

        eventBus.on('commandStack.element.updateProperties.postExecute', function() {
          updated = true;
        });

        nameContainer.focus();

        // when
        nameContainer.textContent = 'hello';
        inputEvent(nameContainer, 'hello');

        // then
        expect(definitions.name).to.equal('drd-name');
        expect(updated).to.be.false;
      }
    ));


    it('should not create a command when blurred unchanged', inject(
      function(definitionPropertiesView, commandStack) {

        // given
        var nameContainer = domQuery(
          '.dmn-definitions-name',
          definitionPropertiesView._container
        );

        nameContainer.focus();

        // when
        nameContainer.blur();

        // then
        expect(commandStack.canUndo()).to.be.false;
      }
    ));


    describe('id', function() {

      it('should edit definition ID', injectAsync(function(done) {
        return function(canvas, definitionPropertiesView, eventBus) {

          // given
          var definitions = canvas.getRootElement().businessObject;
          var idContainer = domQuery(
            '.dmn-definitions-id',
            definitionPropertiesView._container
          );

          idContainer.focus();

          // when
          eventBus.on('commandStack.element.updateProperties.postExecute', function() {

            // then
            expect(definitions.id).to.equal('world');

            done();
          });

          idContainer.textContent = 'world';
          inputEvent(idContainer, 'world');
          idContainer.blur();
        };
      }));


      it('should revert definition ID on invalid commit', inject(
        function(canvas, definitionPropertiesView) {

          // given
          var definitions = canvas.getRootElement().businessObject;
          var idContainer = domQuery(
            '.dmn-definitions-id',
            definitionPropertiesView._container
          );

          idContainer.focus();

          // when
          idContainer.textContent = 'invalid id';
          inputEvent(idContainer, 'invalid id');
          idContainer.blur();

          // then
          var errorMessage = domQuery(
            '.dmn-definitions-error-message',
            definitionPropertiesView._container
          );

          expect(errorMessage).to.exist;
          expect(idContainer.textContent).to.equal(definitions.id);
        }
      ));


      it('should not edit definition ID and show error message (ID not unique)', inject(
        function(canvas, definitionPropertiesEdit, definitionPropertiesView) {

          // given
          var rootElement = canvas.getRootElement(),
              id = getBusinessObject(rootElement).get('id');

          var idContainer = domQuery(
            '.dmn-definitions-id',
            definitionPropertiesView._container
          );

          // when
          definitionPropertiesEdit.update('id', 'decision');

          // then
          var errorMessage = domQuery(
            '.dmn-definitions-error-message',
            definitionPropertiesView._container
          );

          expect(errorMessage).to.exist;
          expect(errorMessage.textContent).to.equal('Element must have unique ID.');
          expect(getBusinessObject(rootElement).get('id')).to.equal(id);
          expect(idContainer.textContent).to.equal(id);
          expect(domClasses(idContainer).has('dmn-definitions-error')).to.be.true;
        }
      ));


      it('should not edit definition ID and show error message (ID empty)', inject(
        function(canvas, definitionPropertiesEdit, definitionPropertiesView) {

          // given
          var rootElement = canvas.getRootElement(),
              id = getBusinessObject(rootElement).get('id');

          var idContainer = domQuery(
            '.dmn-definitions-id',
            definitionPropertiesView._container
          );

          // when
          definitionPropertiesEdit.update('id', '');

          // then
          var errorMessage = domQuery(
            '.dmn-definitions-error-message',
            definitionPropertiesView._container
          );

          expect(errorMessage).to.exist;
          expect(errorMessage.textContent).to.equal('Element must have ID.');
          expect(getBusinessObject(rootElement).get('id')).to.equal(id);
          expect(idContainer.textContent).to.equal(id);
          expect(domClasses(idContainer).has('dmn-definitions-error')).to.be.true;
        }
      ));


      it('should edit definition ID and clear error message', inject(
        function(canvas, definitionPropertiesEdit, definitionPropertiesView) {

          // given
          var rootElement = canvas.getRootElement();

          var idContainer = domQuery(
            '.dmn-definitions-id',
            definitionPropertiesView._container
          );

          // when
          definitionPropertiesEdit.update('id', 'decision');
          definitionPropertiesEdit.update('id', 'foo');

          // then
          var errorMessage = domQuery(
            '.dmn-definitions-error-message',
            definitionPropertiesView._container
          );

          expect(errorMessage).not.to.exist;
          expect(getBusinessObject(rootElement).get('id')).to.equal('foo');
          expect(idContainer.textContent).to.equal('foo');
          expect(domClasses(idContainer).has('dmn-definitions-error')).to.be.false;
        }
      ));


      it('should clear error message on blur', inject(
        async function(definitionPropertiesEdit, definitionPropertiesView) {

          // given
          var idContainer = domQuery(
            '.dmn-definitions-id',
            definitionPropertiesView._container
          );

          idContainer.focus();

          // when
          definitionPropertiesEdit.update('id', 'decision');

          idContainer.blur();

          // then
          await waitFor(() => {
            var errorMessage = domQuery(
              '.dmn-definitions-error-message',
              definitionPropertiesView._container
            );

            expect(errorMessage).not.to.exist;
            expect(domClasses(idContainer).has('dmn-definitions-error')).to.be.false;
          });
        }
      ));

    });

  });

});
