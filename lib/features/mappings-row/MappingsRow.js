'use strict';

var fs = require('fs');

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    assign = require('lodash/object/assign'),
    ComboBox = require('table-js/lib/features/combo-box');

/**
 * Adds a control to the table to define the input- and output-mappings for clauses
 */
function MappingsRow(eventBus, sheet, elementRegistry, modeling, graphicsFactory, complexCell) {

  this.row = null;

  var self = this;

  // add row when the sheet is initialized
  eventBus.on('sheet.init', function(event) {

    eventBus.fire('mappingsRow.add', event);

    self.row = sheet.addRow({
      id: 'mappingsRow',
      isHead: true,
      isMappingsRow: true
    });

    eventBus.fire('mappingsRow.added', self.row);

    graphicsFactory.update('row', self.row, elementRegistry.getGraphics(self.row.id));
  });

  // remove the row when the sheet is destroyed
  eventBus.on('sheet.destroy', function(event) {

    eventBus.fire('mappingsRow.destroy', self.row);

    sheet.removeRow({
      id: 'mappingsRow'
    });

    eventBus.fire('mappingsRow.destroyed', self.row);
  });

  /**
   * Helper function to position and resize the template. This is needed for the switch between
   * the large format script editor and the small expression editor
   *
   * @param {DOMNode}   node        template root node
   * @param {TableCell} element     cell for which the template is opened
   * @param {boolean}   large       indicating whether to switch to large mode
   */
  var positionTemplate = function(node, element, large) {
    var table = sheet.getRootElement();
    if(large) {
      assign(node.style, {
        top: table.offsetTop + 'px',
        left: table.offsetLeft + 'px',
        width: table.clientWidth + 'px'
      });
    } else {
      var gfx = elementRegistry.getGraphics(element);

      // traverse the offset parent chain to find the offset sum
      var e = gfx;
      var offset = {x:0,y:0};
      while (e)
      {
          offset.x += e.offsetLeft;
          offset.y += e.offsetTop;
          e = e.offsetParent;
      }

      assign(node.style, {
        left: (offset.x + 2) + 'px',
        top: (offset.y - 72)  + 'px',
        width: 'auto',
        height: 'auto'
      });
    }
  };

  // when an input cell on the mappings row is added, setup the complex cell
  eventBus.on('cell.added', function(evt) {
    if(evt.element.row.id === 'mappingsRow' &&
       evt.element.column.businessObject &&
       evt.element.column.businessObject.inputExpression) {

      // cell content is the input expression of the clause
      evt.element.content = evt.element.column.businessObject.inputExpression;

      var template = domify(fs.readFileSync(__dirname + '/ExpressionTemplate.html', 'utf-8'));

      // initializing the comboBox
      var comboBox = new ComboBox({
        label: 'Language',
        classNames: ['dmn-combobox', 'language'],
        options: ['Javascript', 'Groovy', 'Python', 'Ruby'],
        dropdownClassNames: ['dmn-combobox-suggestions']
      });

      // When the inputExpression has a defined expressionLanguage, we assume that it is a script
      if(typeof evt.element.content.expressionLanguage !== 'undefined') {
        template.querySelector('textarea').value = evt.element.content.text || '';
        comboBox.setValue(evt.element.content.expressionLanguage);
      } else {
        template.querySelector('input').value = evt.element.content.text || '';
      }

      // --- setup event listeners ---

      // click on close button closes the template
      template.querySelector('.icon-clear').addEventListener('click', function() {
        complexCell.close();
      });

      // click on Expression link switches to expression mode
      template.querySelector('.expression').addEventListener('click', function() {
        domClasses(template.parentNode).remove('use-script');
        positionTemplate(template.parentNode, evt.element, false);
        evt.element.complex.mappingType = 'expression';
      });

      // click on Script link switches to script mode
      template.querySelector('.script').addEventListener('click', function() {
        domClasses(template.parentNode).add('use-script');
        positionTemplate(template.parentNode, evt.element, true);
        evt.element.complex.mappingType = 'script';
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
        mappingType: typeof evt.element.content.expressionLanguage !== 'undefined' ? 'script' : 'expression',
        comboBox: comboBox,
        type: 'mapping',
        offset: {
          x: 2,
          y: -72
        }
      };

      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));
    } else if(evt.element.row.id === 'mappingsRow' &&
              evt.element.column.businessObject) {

      // setup output mappings as simple cells with inline editing
      evt.element.content = evt.element.column.businessObject;
      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));
    }

  });

  // whenever an input mapping cell is opened, set the required mode (script vs. Expression)
  // and position the template accordingly
  eventBus.on('complexCell.open', function(evt) {
    if(evt.config.type === 'mapping') {
      if(typeof evt.config.element.content.expressionLanguage !== 'undefined') {
        evt.config.mappingType = 'script';
        domClasses(evt.container).add('use-script');
        positionTemplate(evt.container, evt.config.element, true);
      } else {
        evt.config.mappingType = 'expression';
      }
    }
  });

  // whenever an input mapping cell is closed, apply the changes to the underlying model
  eventBus.on('complexCell.close', function(evt) {
    if(evt.config.type === 'mapping') {
      var template = evt.config.template;
      if(evt.config.mappingType === 'expression') {
        modeling.editInputMapping(
          evt.config.element,
          template.querySelector('input[placeholder="propertyName"]').value
        );
      } else if(evt.config.mappingType === 'script') {
        modeling.editInputMapping(
          evt.config.element,
          template.querySelector('textarea').value,
          evt.config.comboBox.getValue()
        );
      }

    }
  });
}

MappingsRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling', 'graphicsFactory', 'complexCell' ];

module.exports = MappingsRow;

MappingsRow.prototype.getRow = function() {
  return this.row;
};
