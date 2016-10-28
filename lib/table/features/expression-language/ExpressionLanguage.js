'use strict';

var ComboBox = require('table-js/lib/features/combo-box');

var debounce = require('lodash/function/debounce');
var DEBOUNCE_DELAY = 300;

var getDefaultLanguageFor = function(context) {
  if (context.column.type === 'dmn:OutputClause') {
    return 'juel';
  }
  if (context.column.type === 'dmn:InputClause') {
    return 'feel';
  }
};

function ExpressionLanguage(eventBus, modeling, contextMenu, elementRegistry, selection) {
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;

  this._eventBus.on('popupmenu.cellActions', function(evt, actions, context) {

    if (!context.content || context.row.isHead) {
      return;
    }

    // initializing the comboBox
    var comboBox = new ComboBox({
      label: '',
      classNames: ['dmn-combobox', 'expression-language'],
      options: [ 'javascript', 'groovy', 'python', 'jruby', 'juel', 'feel' ],
      dropdownClassNames: ['dmn-combobox-suggestions'],
      disableKeyboard: true
    });
    comboBox.setValue(context.content.expressionLanguage || getDefaultLanguageFor(context));

    var content = comboBox.getNode();

    eventBus.once('popupmenu.close', function() {
      comboBox._closeDropdown();
    });
    comboBox.addEventListener('valueChanged', function(evt) {
      if (evt.newValue !== evt.oldValue) {
        modeling.editCellExpressionLanguage(context.content, evt.newValue);
      }
    });

    content.addEventListener('click', function(evt) {
      evt.customHandler = true;
    });
    content.addEventListener('mousedown', function(evt) {
      evt.customHandler = true;
    });
    content.addEventListener('keydown', function(evt) {
      if (evt.keyCode === 13) {
        evt.preventDefault();
        contextMenu.close();
        elementRegistry.getGraphics(context.id).firstChild.focus();
      }
    });
    content.addEventListener('input', debounce(function(evt) {
      modeling.editCellExpressionLanguage(context.content, evt.target.value);
    }, DEBOUNCE_DELAY));

    actions.push({
      id: 'expressionLanguage',
      content: {
        label: 'Expression Language',
        linkClass: 'disabled',
        icon:'language',
        entries: [
          { id: 'expressionLanguageEdit', content: content }
        ]
      }
    });
  });
}

ExpressionLanguage.$inject = [ 'eventBus', 'modeling', 'contextMenu', 'elementRegistry', 'selection' ];

module.exports = ExpressionLanguage;
