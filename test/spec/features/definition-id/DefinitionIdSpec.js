'use strict';

var domQuery = require('min-dom/lib/query');

require('../../TestHelper');

/* global bootstrapModeler, inject */

var modelingModule = require('../../../../lib/features/modeling'),
    paletteProviderModule = require('../../../../lib/features/palette'),
    definitionIdViewerModule = require('../../../../lib/features/definition-id/viewer'),
    definitionIdModelerModule = require('../../../../lib/features/definition-id/modeler'),
    coreModule = require('../../../../lib/core');

describe('features/definition-id', function() {

  var testModules = [
    coreModule,
    paletteProviderModule,
    definitionIdViewerModule,
    definitionIdModelerModule,
    modelingModule
  ];

  var diagramXML = require('./definitionId.dmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  it('should display the definitions name', inject(function(definitionIdView) {
    // given
    var nameContainer = domQuery('.dmn-definitions-name', definitionIdView._container);

    // when

    // then
    expect(nameContainer.textContent).to.eql('drd-name');
  }));


  it('should display the definitions id', inject(function(definitionIdView) {
    // given
    var nameContainer = domQuery('.dmn-definitions-id', definitionIdView._container);

    // when

    // then
    expect(nameContainer.textContent).to.eql('drd-id');
  }));


  it('should apply changes from updated definitions', inject(function(definitionIdView, canvas) {
    // given
    var definitions = canvas.getRootElement().businessObject;
    var nameContainer = domQuery('.dmn-definitions-name', definitionIdView._container);

    // when
    definitions.name = 'new Name';
    definitionIdView.update();

    // then
    expect(nameContainer.textContent).to.eql('new Name');
  }));


  it('should react to definition name updates', inject(function(definitionIdView, definitionIdEdit) {
    // given
    var nameContainer = domQuery('.dmn-definitions-name', definitionIdView._container);

    // when
    definitionIdEdit.update('name', 'new Name');

    // then
    expect(nameContainer.textContent).to.eql('new Name');
  }));


  it('should undo', inject(function(definitionIdView, definitionIdEdit, commandStack) {
    // given
    var nameContainer = domQuery('.dmn-definitions-name', definitionIdView._container);
    definitionIdEdit.update('name', 'new Name');

    // when
    commandStack.undo();

    // then
    expect(nameContainer.textContent).to.eql('drd-name');
  }));


  it('should redo', inject(function(definitionIdView, definitionIdEdit, commandStack) {
    // given
    var nameContainer = domQuery('.dmn-definitions-name', definitionIdView._container);
    definitionIdEdit.update('name', 'new Name');

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    expect(nameContainer.textContent).to.eql('new Name');
  }));


  it('should be responsive', inject(function(canvas, eventBus, definitionIdView) {
    // given
    var parent = canvas.getContainer();

    parent.style.height = '600px';

    // when
    canvas.resized();

    // then
    expect(definitionIdView._container.offsetLeft).to.equal(130);
  }));

});
