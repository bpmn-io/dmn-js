'use strict';

var domify = require('min-dom/lib/domify');
var template = require('./EditorTemplate.html');

var ComboBox = require('table-js/lib/features/combo-box');

function LiteralExpressionEditor(eventBus, sheet, rules) {
  this._eventBus = eventBus;
  this._sheet = sheet;
  this._rules = rules;

  eventBus.on('import.render.start', function() {
    // show table by default
    var container = sheet.getContainer();
    container.querySelector('table').style.display = '';

    // remove literal expression editor if exists
    var literalExpressionEditor = container.querySelector('.literal-expression-editor');
    if (literalExpressionEditor) {
      container.removeChild(literalExpressionEditor);
    }
  });

}

LiteralExpressionEditor.$inject = [ 'eventBus', 'sheet', 'rules' ];

module.exports = LiteralExpressionEditor;

LiteralExpressionEditor.prototype.show = function(decision) {

  var eventBus = this._eventBus;

  // get hide the table
  var container = this._sheet.getContainer();
  container.querySelector('table').style.display = 'none';

  // create the custom editor
  var editor = domify(template);

  // set the literal expression to the textarea
  editor.querySelector('textarea').value = decision.literalExpression.text || '';

  // add variable with name and type information
  var typeBox = new ComboBox({
    label: 'Variable Type',
    classNames: [ 'dmn-combobox', 'datatype' ],
    options: [ 'string', 'boolean', 'integer', 'long', 'double', 'date' ],
    dropdownClassNames: [ 'dmn-combobox-suggestions' ]
  });
  editor.querySelector('.variable-type').appendChild(typeBox.getNode());

  if (decision.variable) {
    editor.querySelector('.variable-name').value = decision.variable.name || '';
    typeBox.setValue(decision.variable.typeRef || '');
  }

  //add expression language combobox
  var languageBox = new ComboBox({
    label: 'Expression Language',
    classNames: [ 'dmn-combobox', 'expression-language' ],
    options: [ 'javascript', 'groovy', 'python', 'jruby', 'juel', 'feel' ],
    dropdownClassNames: [ 'dmn-combobox-suggestions' ]
  });
  editor.querySelector('.expression-language').appendChild(languageBox.getNode());
  languageBox.setValue(decision.literalExpression.expressionLanguage || '');


  var saveExpression = function(evt) {
    eventBus.fire('literalExpression.edit', {
      decision: decision,
      text: editor.querySelector('textarea').value,
      variableName: editor.querySelector('.variable-name').value,
      variableType: typeBox.getValue(),
      language: languageBox.getValue()
    });
  };


  // if editing is not allowed, disable all input fields, otherwise, listen for changes
  var canEdit = this._rules.allowed('literalExpression.edit');

  var inputs = editor.querySelectorAll('input');
  for (var i = 0; i < inputs.length; i++) {
    if (canEdit) {
      inputs[i].addEventListener('input', saveExpression);
    } else {
      inputs[i].setAttribute('disabled', 'true');
    }
  }

  if (canEdit) {
    editor.querySelector('textarea').addEventListener('input', saveExpression);
    typeBox.addEventListener('valueChanged', saveExpression);
    languageBox.addEventListener('valueChanged', saveExpression);
  } else {
    editor.querySelector('textarea').setAttribute('disabled', 'true');
    typeBox.disable();
    languageBox.disable();
  }

  container.appendChild(editor);

};
