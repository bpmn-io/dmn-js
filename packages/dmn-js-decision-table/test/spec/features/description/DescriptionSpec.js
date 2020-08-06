import {
  bootstrapModeler,
  inject
} from 'test/helper';

import {
  queryEditor
} from 'dmn-js-shared/test/util/EditorUtil';

import {
  query as domQuery
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerClick,
  triggerInputEvent,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import simpleBooleanEditXML from './description.dmn';

import CoreModule from 'src/core';
import CellSelectionModule from 'src/features/cell-selection';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import DescriptionModule from 'src/features/description';
import ContextMenuModule from 'src/features/context-menu';
import AnnotationsEditorModule from 'src/features/annotations/editor';
import DecisionRuleIndicesModule from 'src/features/decision-rule-indices';


describe('description', function() {

  beforeEach(bootstrapModeler(simpleBooleanEditXML, {
    modules: [
      CoreModule,
      CellSelectionModule,
      ModelingModule,
      DecisionRulesEditorModule,
      DescriptionModule,
      ContextMenuModule,
      DecisionRuleIndicesModule,
      AnnotationsEditorModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function openDescriptionEditor(elementId) {
    const cellEl = domQuery(`[data-element-id="${ elementId }"]`, testContainer);

    expect(cellEl).to.exist;

    triggerClick(cellEl);

    const editorEl = queryEditor('.description-editor', testContainer);

    expect(editorEl).to.exist;

    return editorEl;
  }

  function clickContextMenuEntry(elementId, className) {
    const cell = domQuery(`[data-element-id="${ elementId }"]`, testContainer);

    triggerMouseEvent(cell, 'contextmenu');

    const contextmenu = domQuery('.context-menu', testContainer);

    const contextMenuEntry = domQuery(className, contextmenu);

    triggerClick(contextMenuEntry);
  }

  function hasDescriptionIndicator(elementId) {
    const cell = domQuery(`[data-element-id="${ elementId }"]`, testContainer);

    return !!domQuery('.description-indicator', cell);
  }


  it('should add description', inject(function(elementRegistry) {

    // given
    const inputEntry1 = elementRegistry.get('inputEntry1');

    // when
    clickContextMenuEntry('inputEntry1', '.add-description');

    // then
    expect(inputEntry1.businessObject.description).to.equal('');

    expect(hasDescriptionIndicator('inputEntry1')).to.be.true;
  }));


  it('should edit description', inject(function(elementRegistry) {

    // given
    const inputEntry2 = elementRegistry.get('inputEntry2');

    // when
    const editor = openDescriptionEditor('inputEntry2');

    triggerInputEvent(editor, 'bar');

    // then
    expect(inputEntry2.businessObject.description).to.equal('bar');
  }));


  it('should remove description if empty', inject(function(elementRegistry) {

    // given
    const inputEntry2 = elementRegistry.get('inputEntry2');

    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    const editor = openDescriptionEditor('inputEntry2');

    triggerInputEvent(editor, '');

    triggerClick(cell);

    // then
    expect(inputEntry2.businessObject.description).to.not.exist;

    expect(hasDescriptionIndicator('inputEntry2')).to.be.false;
  }));


  it('should remove description', inject(function(elementRegistry) {

    // given
    const inputEntry2 = elementRegistry.get('inputEntry2');

    // when
    clickContextMenuEntry('inputEntry2', '.remove-description');

    // then
    expect(inputEntry2.businessObject.description).to.not.exist;

    expect(hasDescriptionIndicator('inputEntry2')).to.be.false;
  }));


  it('should not open description editor for rule index', function() {

    // given
    const annotation = domQuery('.rule-index', testContainer);

    // when
    triggerClick(annotation);

    // then
    expect(queryEditor('.description-editor', testContainer)).to.not.exist;
  });


  it('should not open description editor for text annotation', function() {

    // given
    const annotation = domQuery('.annotation', testContainer);

    // when
    triggerClick(annotation);

    // then
    expect(queryEditor('.description-editor', testContainer)).to.not.exist;
  });
});