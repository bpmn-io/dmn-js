'use strict';

var fs = require('fs');

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    assign = require('lodash/object/assign'),
    ComboBox = require('table-js/lib/features/combo-box');

/**
 * Adds a control to the table to define the input- and output-mappings for clauses
 */
function MappingsRow(eventBus, sheet, elementRegistry, graphicsFactory, complexCell, rules) {

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
    var table = sheet.getRootElement(),
        gfx = elementRegistry.getGraphics(element),
        e, offset;

    if(large) {
      e = table;
      offset = {x:0,y:0};

      while (e)
      {
          offset.x += e.offsetLeft;
          offset.y += e.offsetTop;
          e = e.offsetParent;
      }

      // now also traverse the complete parent chain to determine the full scroll offset
      e = gfx;
      while (e && typeof e.scrollTop === 'number' && typeof e.scrollLeft === 'number')
      {
          offset.x -= e.scrollLeft;
          offset.y -= e.scrollTop;
          e = e.parentNode;
      }

      assign(node.style, {
        top: offset.y + 'px',
        left: offset.x + 'px',
        width: table.clientWidth + 'px'
      });

    } else {

      // traverse the offset parent chain to find the offset sum
      e = gfx;
      offset = {x:0,y:0};

      while (e)
      {
          offset.x += e.offsetLeft;
          offset.y += e.offsetTop;
          e = e.offsetParent;
      }

      // now also traverse the complete parent chain to determine the full scroll offset
      e = gfx;
      while (e && typeof e.scrollTop === 'number' && typeof e.scrollLeft === 'number')
      {
          offset.x -= e.scrollLeft;
          offset.y -= e.scrollTop;
          e = e.parentNode;
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
      template.querySelector('.dmn-icon-clear').addEventListener('click', function() {
        complexCell.close();
      });

      // click on Expression link switches to expression mode
      template.querySelector('.expression').addEventListener('click', function() {
        domClasses(template.parentNode).remove('use-script');
        positionTemplate(template.parentNode, evt.element, false);

        // focus the script expression input field
        template.querySelector('.expression.region > input').focus();

        evt.element.complex.mappingType = 'expression';
      });

      // click on Script link switches to script mode
      template.querySelector('.script').addEventListener('click', function() {
        domClasses(template.parentNode).add('use-script');
        positionTemplate(template.parentNode, evt.element, true);

        // focus the script area
        template.querySelector('.script.region > textarea').focus();

        evt.element.complex.mappingType = 'script';
      });

      // pressing enter in the input field closes the dialog
      template.querySelector('.expression.region > input').addEventListener('keydown', function(evt) {
        if(evt.keyCode === 13) {
          complexCell.close();
        }
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
      var template = evt.config.template;
      if(typeof evt.config.element.content.expressionLanguage !== 'undefined') {
        evt.config.mappingType = 'script';
        domClasses(evt.container).add('use-script');
        positionTemplate(evt.container, evt.config.element, true);
        evt.container.querySelector('.script.region > textarea').focus();
      } else {
        evt.config.mappingType = 'expression';
        evt.container.querySelector('.expression.region > input').focus();
      }
      // disable input fields if inputMapping editing is not allowed
      if(!rules.allowed('inputMapping.edit')) {
        template.querySelector('.expression.region > input').setAttribute('disabled', 'true');
        template.querySelector('.script.region > textarea').setAttribute('disabled', 'true');
        evt.config.comboBox.disable();

        // also set a disabled css class on the template
        domClasses(template.parentNode).add('read-only');
      }

    }
  });

  // whenever an input mapping cell is closed, apply the changes to the underlying model
  eventBus.on('complexCell.close', function(evt) {
    if(evt.config.type === 'mapping') {
      var template = evt.config.template;
      if(evt.config.mappingType === 'expression') {
        eventBus.fire('mappingsRow.editInputMapping', {
          element: evt.config.element,
          expression: template.querySelector('input[placeholder="propertyName"]').value
        });
      } else if(evt.config.mappingType === 'script') {
        eventBus.fire('mappingsRow.editInputMapping', {
          element: evt.config.element,
          expression: template.querySelector('textarea').value,
          language: evt.config.comboBox.getValue()
        });
      }

    }
  });
}

MappingsRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'graphicsFactory', 'complexCell', 'rules' ];

module.exports = MappingsRow;

MappingsRow.prototype.getRow = function() {
  return this.row;
};
