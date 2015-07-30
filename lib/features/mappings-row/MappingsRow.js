'use strict';

var fs = require('fs');

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    assign = require('lodash/object/assign'),
    ComboBox = require('table-js/lib/features/combo-box'),
    forEach = require('lodash/collection/forEach');

// document wide unique clause ids
var ids = new (require('diagram-js/lib/util/IdGenerator'))('clause');

/**
 * Adds a control to the table to add more rows
 *
 * @param {EventBus} eventBus
 */
function MappingsRow(eventBus, sheet, elementRegistry, modeling, graphicsFactory, complexCell) {

  this.row = null;

  var self = this;
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

  eventBus.on('sheet.destroy', function(event) {

    eventBus.fire('mappingsRow.destroy', self.row);

    sheet.removeRow({
      id: 'mappingsRow'
    });

    eventBus.fire('mappingsRow.destroyed', self.row);
  });

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
      assign(node.style, {
        left: (gfx.offsetLeft + 2) + 'px',
        top: (gfx.offsetTop - 40)  + 'px',
        width: 'auto',
        height: 'auto'
      });
    }
  };

  eventBus.on('cell.added', function(evt) {
    if(evt.element.row.id === 'mappingsRow' &&
       evt.element.column.businessObject &&
       evt.element.column.businessObject.inputExpression) {

      evt.element.content = evt.element.column.businessObject.inputExpression;

      var template = domify(fs.readFileSync(__dirname + '/ExpressionTemplate.html', 'utf-8'));

      var comboBox = new ComboBox({
        label: 'Language',
        classNames: ['dmn-combobox', 'language'],
        options: ['Javascript', 'Groovy', 'Python', 'Ruby'],
        dropdownClassNames: ['dmn-combobox-suggestions']
      });

      if(typeof evt.element.content.expressionLanguage !== 'undefined') {
        template.querySelector('textarea').value = evt.element.content.text;
        comboBox.querySelector('input').value = evt.element.content.expressionLanguage;
      } else {
        template.querySelector('input').value = evt.element.content.text;
      }
      template.querySelector('.icon-clear').addEventListener('click', function() {
        complexCell.close();
      });
      template.querySelector('.expression').addEventListener('click', function() {
        domClasses(template.parentNode).remove('use-script');
        positionTemplate(template.parentNode, evt.element, false);
        evt.element.complex.mappingType = 'expression';
      });
      template.querySelector('.script').addEventListener('click', function() {
        domClasses(template.parentNode).add('use-script');
        positionTemplate(template.parentNode, evt.element, true);
        evt.element.complex.mappingType = 'script';
      });

      template.querySelector('.script.region').insertBefore(
        comboBox,
        template.querySelector('textarea')
      );

      evt.element.complex = {
        className: 'dmn-clauseexpression-setter',
        template: template,
        element: evt.element,
        mappingType: typeof evt.element.content.expressionLanguage !== 'undefined' ? 'script' : 'expression',
        type: 'mapping',
        offset: {
          x: 2,
          y: -40
        }
      };

      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));
    } else if(evt.element.row.id === 'mappingsRow' &&
              evt.element.column.businessObject) {
      evt.element.content = evt.element.column.businessObject;
      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));
    }

  });

  eventBus.on('complexCell.open', function(evt) {
    if(typeof evt.config.element.content.expressionLanguage !== 'undefined') {
      evt.config.mappingType = 'script';
      domClasses(evt.container).add('use-script');
      positionTemplate(evt.container, evt.config.element, true);
    } else {
      evt.config.mappingType = 'expression';
    }
  });

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
          template.querySelector('.script input').value
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
