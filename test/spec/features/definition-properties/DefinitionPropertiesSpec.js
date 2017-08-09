'use strict';

var domQuery = require('min-dom/lib/query');

require('../../TestHelper');

/* global bootstrapModeler, inject */

var modelingModule = require('../../../../lib/features/modeling'),
    paletteProviderModule = require('../../../../lib/features/palette'),
    definitionPropertiesViewerModule = require('../../../../lib/features/definition-properties/viewer'),
    definitionPropertiesModelerModule = require('../../../../lib/features/definition-properties/modeler'),
    coreModule = require('../../../../lib/core');

describe('features/definition-properties', function() {

  var testModules = [
    coreModule,
    paletteProviderModule,
    definitionPropertiesViewerModule,
    definitionPropertiesModelerModule,
    modelingModule
  ];

  var diagramXML = require('./definitionProperties.dmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  it('should display the definitions name', inject(function(definitionPropertiesView) {
    // given
    var nameContainer = domQuery('.dmn-definitions-name', definitionPropertiesView._container);

    // when

    // then
    expect(nameContainer.textContent).to.eql('drd-name');
  }));


  it('should display the definitions id', inject(function(definitionPropertiesView) {
    // given
    var nameContainer = domQuery('.dmn-definitions-id', definitionPropertiesView._container);

    // when

    // then
    expect(nameContainer.textContent).to.eql('drd-id');
  }));


  it('should apply changes from updated definitions', inject(function(definitionPropertiesView, canvas) {
    // given
    var definitions = canvas.getRootElement().businessObject;
    var nameContainer = domQuery('.dmn-definitions-name', definitionPropertiesView._container);

    // when
    definitions.name = 'new Name';
    definitionPropertiesView.update();

    // then
    expect(nameContainer.textContent).to.eql('new Name');
  }));


  it('should react to definition name updates', inject(function(definitionPropertiesView, definitionPropertiesEdit) {
    // given
    var nameContainer = domQuery('.dmn-definitions-name', definitionPropertiesView._container);

    // when
    definitionPropertiesEdit.update('name', 'new Name');

    // then
    expect(nameContainer.textContent).to.eql('new Name');
  }));


  it('should undo', inject(function(definitionPropertiesView, definitionPropertiesEdit, commandStack) {
    // given
    var nameContainer = domQuery('.dmn-definitions-name', definitionPropertiesView._container);
    definitionPropertiesEdit.update('name', 'new Name');

    // when
    commandStack.undo();

    // then
    expect(nameContainer.textContent).to.eql('drd-name');
  }));


  it('should redo', inject(function(definitionPropertiesView, definitionPropertiesEdit, commandStack) {
    // given
    var nameContainer = domQuery('.dmn-definitions-name', definitionPropertiesView._container);
    definitionPropertiesEdit.update('name', 'new Name');

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    expect(nameContainer.textContent).to.eql('new Name');
  }));


  it('should be responsive', inject(function(canvas, eventBus, definitionPropertiesView) {
    // given
    var parent = canvas.getContainer();

    parent.style.height = '600px';

    // when
    canvas.resized();

    // then
    expect(definitionPropertiesView._container.offsetLeft).to.equal(130);
  }));

});
