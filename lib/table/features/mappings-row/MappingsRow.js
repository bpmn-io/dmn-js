'use strict';

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach');

var exprTemplate = require('./ExpressionTemplate.html');

var ComboBox = require('table-js/lib/features/combo-box');

var PROP_NAME = '.expression .input-expression input[placeholder="propertyName"]',
    EXPR_IPT_VAR = '.expression .input-expression input[placeholder="cellInput"]',
    SCRPT_IPT_VAR = '.script .input-expression input[placeholder="cellInput"]',
    SCRPT_TEXT = '.script.region > textarea',
    IPT_VARS = [ EXPR_IPT_VAR, SCRPT_IPT_VAR ];

var OFFSET_X = 1, //20
    OFFSET_Y = -2; //194


function forEachSelector(node, arr, fn) {
  forEach(arr, function(elem) {
    fn(node.querySelector(elem));
  });
}


/**
 * Adds a control to the table to define the input- and output-mappings for clauses
 */
function MappingsRow(eventBus, sheet, elementRegistry, graphicsFactory, complexCell, config) {

  this.row = null;

  // add row when the sheet is initialized
  eventBus.on([ 'sheet.init', 'sheet.cleared' ], function(event) {

    if (this.row) {
      return;
    }

    eventBus.fire('mappingsRow.add', event);

    this.row = sheet.addRow({
      id: 'mappingsRow',
      isHead: true,
      isMappingsRow: true
    });

    eventBus.fire('mappingsRow.added', this.row);

    graphicsFactory.update('row', this.row, elementRegistry.getGraphics(this.row.id));
  }, this);

  // remove the row when the sheet is destroyed
  eventBus.on([ 'sheet.clear', 'sheet.destroy' ], function(event) {

    eventBus.fire('mappingsRow.destroy', this.row);

    sheet.removeRow({
      id: 'mappingsRow'
    });

    eventBus.fire('mappingsRow.destroyed', this.row);

    this.row = null;
  }, this);

  /**
   * Helper function to position and resize the template. This is needed for the switch between
   * the large format script editor and the small expression editor
   *
   * @param {DOMNode}   node        template root node
   * @param {TableCell} element     cell for which the template is opened
   * @param {boolean}   large       indicating whether to switch to large mode
   */
  var positionTemplate = function(node, element, large) {
    var table = sheet.getRootElement(),
        gfx = elementRegistry.getGraphics(element),
        tableDimensions, gfxDimensions;

    if (large) {
      tableDimensions = table.getBoundingClientRect();

      assign(node.style, {
        top: tableDimensions.top + 'px',
        left: tableDimensions.left + 'px',
        width: table.clientWidth + 'px'
      });

    } else {
      gfxDimensions = gfx.getBoundingClientRect();

      assign(node.style, {
        top: (gfxDimensions.top - node.offsetHeight + OFFSET_Y)  + 'px',
        left: (gfxDimensions.left + OFFSET_X) + 'px',
        width: 'auto',
        height: 'auto'
      });
    }
  };

  // when an input cell on the mappings row is added, setup the complex cell
  eventBus.on('cell.added', function(evt) {
    var element = evt.element,
        column = element.column,
        content = element.content,
        propertyName, parent, inputVariable;

    if (element.row.id === 'mappingsRow' &&
       column.businessObject &&
       column.businessObject.inputExpression) {

      // cell content is the input expression of the clause
      content = element.content = column.businessObject.inputExpression;

      var template = domify(exprTemplate);

      // initializing the comboBox
      var comboBox = new ComboBox({
        label: 'Language',
        classNames: [ 'dmn-combobox', 'language' ],
        options: [ 'javascript', 'groovy', 'python', 'jruby', 'juel', 'feel' ],
        dropdownClassNames: [ 'dmn-combobox-suggestions' ]
      });

      // When the inputExpression has a defined expressionLanguage, we assume that it is a script
      if (typeof content.expressionLanguage !== 'undefined') {
        template.querySelector(SCRPT_TEXT).value = content.text || '';
        comboBox.setValue(content.expressionLanguage);

      } else {
        propertyName = template.querySelector(PROP_NAME);

        propertyName.value = content.text || '';
      }

      parent = content.$parent;

      if (parent) {
        forEachSelector(template, IPT_VARS, function(elem) {
          elem.value = parent.inputVariable || '';
        });
      }

      // --- setup event listeners ---

      // click on close button closes the template
      template.querySelector('.dmn-icon-clear').addEventListener('click', function() {
        complexCell.close();
      });

      // click on Expression link switches to expression mode
      template.querySelector('.expression').addEventListener('click', function() {
        inputVariable = template.querySelector(SCRPT_IPT_VAR).value;

        domClasses(template.parentNode).remove('use-script');
        positionTemplate(template.parentNode, evt.element, false);

        // focus the script expression input field
        template.querySelector(PROP_NAME).focus();

        // synchronize inputVariable
        template.querySelector(EXPR_IPT_VAR).value = inputVariable;

        evt.element.complex.mappingType = 'expression';
      });

      // click on Script link switches to script mode
      template.querySelector('.script').addEventListener('click', function() {
        inputVariable = template.querySelector(EXPR_IPT_VAR).value;

        domClasses(template.parentNode).add('use-script');
        positionTemplate(template.parentNode, evt.element, true);

        // focus the script area
        template.querySelector(SCRPT_TEXT).focus();

        // synchronize inputVariable
        template.querySelector(SCRPT_IPT_VAR).value = inputVariable;

        evt.element.complex.mappingType = 'script';
      });

      // pressing enter in the input field closes the dialog
      forEachSelector(template, IPT_VARS.concat(PROP_NAME), function(elem) {
        elem.addEventListener('keydown', function(evt) {
          if (evt.keyCode === 13) {
            complexCell.close();
          }
        });
      });

      // add comboBox to the template
      template.querySelector('.script.region').insertBefore(
        comboBox.getNode(),
        template.querySelector('textarea')
      );

      // set the complex property to initialize complex-cell behavior
      evt.element.complex = {
        className: 'dmn-clauseexpression-setter',
        template: template,
        element: evt.element,
        mappingType: typeof content.expressionLanguage !== 'undefined' ? 'script' : 'expression',
        comboBox: comboBox,
        type: 'mapping'
      };

      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));

    } else if (evt.element.row.id === 'mappingsRow' && column.businessObject) {

      // setup output mappings as simple cells with inline editing
      evt.element.content = column.businessObject;
      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));
    }

  });

  // whenever an input mapping cell is opened, set the required mode (script vs. Expression)
  // and position the template accordingly
  eventBus.on('complexCell.open', function(evt) {
    var cfg = evt.config,
        container = evt.container,
        content = cfg.element.content,
        template, parent;

    if (cfg.type === 'mapping') {
      template = cfg.template;

      if (typeof content.expressionLanguage !== 'undefined') {
        cfg.mappingType = 'script';

        domClasses(container).add('use-script');
        positionTemplate(container, cfg.element, true);

        container.querySelector(SCRPT_TEXT).focus();

      } else {
        cfg.mappingType = 'expression';

        positionTemplate(container, cfg.element);

        container.querySelector(PROP_NAME).focus();
      }

      parent = content.$parent;

      if (parent) {
        forEachSelector(template, IPT_VARS, function(elem) {
          elem.value = parent.inputVariable || '';
        });
      }

      // disable input fields if inputMapping editing is not allowed
      if (!config.editingAllowed) {
        template.querySelector(PROP_NAME).setAttribute('disabled', 'true');

        forEachSelector(template, IPT_VARS, function(elem) {
          elem.setAttribute('disabled', 'true');
        });

        template.querySelector(SCRPT_TEXT).setAttribute('disabled', 'true');

        cfg.comboBox.disable();

        // also set a disabled css class on the template
        domClasses(template.parentNode).add('read-only');
      }
    }
  });

  // whenever an input mapping cell is closed, apply the changes to the underlying model
  eventBus.on('complexCell.close', function(evt) {
    var cfg = evt.config,
        template, element, expression, language, inputVariable;

    if (cfg.type === 'mapping') {
      template = cfg.template;
      element = cfg.element;

      if (cfg.mappingType === 'expression') {
        expression = template.querySelector(PROP_NAME).value;

        inputVariable = template.querySelector(EXPR_IPT_VAR).value;

      } else if (cfg.mappingType === 'script') {
        language = cfg.comboBox.getValue();

        inputVariable = template.querySelector(SCRPT_IPT_VAR).value;

        expression = template.querySelector(SCRPT_TEXT).value;
      }

      eventBus.fire('mappingsRow.editInputMapping', {
        element: element,
        attrs: {
          expression: expression,
          language: language,
          inputVariable: inputVariable
        }
      });
    }
  });
}

MappingsRow.$inject = [
  'eventBus',
  'sheet',
  'elementRegistry',
  'graphicsFactory',
  'complexCell',
  'config'
];

module.exports = MappingsRow;

MappingsRow.prototype.getRow = function() {
  return this.row;
};
