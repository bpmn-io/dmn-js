'use strict';

var assign = require('lodash/object/assign');

var domify     = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    utils      = require('./utils');

var getSampleDate   = utils.getSampleDate,
    isDateCell      = utils.isDateCell,
    isISODateString = utils.isISODateString,
    parseDate       = utils.parseDate;

function DateEdit(eventBus, simpleMode, elementRegistry, graphicsFactory, modeling, complexCell) {
  this._eventBus = eventBus;
  this._simpleMode = simpleMode;
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
  this._modeling = modeling;
  this._complexCell = complexCell;

  this._eventBus.on('simpleMode.activated', this.setupComplexCells, this);
  this._eventBus.on('simpleMode.deactivated', this.teardownComplexCells, this);
  this._eventBus.on('typeRow.editDataType', function() {
    if (this._simpleMode.isActive()) {
      this.refresh();
    }
  }, this);

  // whenever an type cell is opened, we have to position the template, because the x offset changes
  // over time, when columns are added and deleted
  this._eventBus.on('complexCell.open', function(evt) {
    var config = evt.config;

    if (config.type === 'dateEdit') {
      var gfx = elementRegistry.getGraphics(config.element);
      var template = config.template;

      assign(template.parentNode.style, {
        left: (gfx.offsetLeft + gfx.offsetWidth - 10) + 'px'
      });
    }
  });

}

DateEdit.prototype.refresh = function() {
  this.teardownComplexCells();
  this.setupComplexCells();
};

DateEdit.prototype.setupComplexCells = function() {
  var graphicsFactory = this._graphicsFactory;
  var elementRegistry = this._elementRegistry;
  var eventBus = this._eventBus;
  var complexCell = this._complexCell;

  var self = this;
  elementRegistry.forEach(function(element) {
    if (isDateCell(element)) {
      var parsed = parseDate(element.content.text);

      if (element.content.text && !parsed) {
        // in this case, the date contains an expression, we should not show the date editor here

        // show nothing instead
        element.complex = {
          template: domify('<div>'),
          element: element,
          type: 'dateEdit',
          offset: {
            x: 0,
            y: 0
          }
        };

        graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
        return;
      }

      var node = domify(require('./template.html'));

      // set the initial state based on the cell content
      if (!parsed) {
        node.querySelector('.dateEdit-type-dropdown').value = '';
        node.querySelector('.date-1 input').value = getSampleDate();
        node.querySelector('.date-2 input').value = getSampleDate(true);
      } else {
        node.querySelector('.dateEdit-type-dropdown').value = parsed.type;
        node.querySelector('.date-1 input').value = parsed.date1 || getSampleDate();
        node.querySelector('.date-2 input').value = parsed.date2 || getSampleDate(true);

        if (parsed.date1) {
          node.querySelector('.date-1').style.display = 'block';
        }
        if (parsed.date2) {
          node.querySelector('.date-2').style.display = 'block';
        }
      }


      // wire the elements
      node.querySelector('.dateEdit-type-dropdown').addEventListener('change', function(evt) {
        var type = evt.target.value;

        // update visibility of elements
        node.querySelector('.date-1').style.display = type === '' ? 'none' : 'block';
        node.querySelector('.date-2').style.display = type === 'between' ? 'block' : 'none';
      });

      var closeFct = function(evt) {
        if (evt.keyCode === 13) {
          complexCell.close();
        }
      };

      var validateInput = function(evt) {
        var val = evt.target.value;
        var date = new Date(val);

        if (isISODateString(val) && date.toString() !== 'Invalid Date') {
          // is valid
          domClasses(evt.target).remove('invalid');
        } else {
          // is invalid
          domClasses(evt.target).add('invalid');
        }

      };
      node.querySelector('.date-1 input').addEventListener('keydown', closeFct);
      node.querySelector('.date-2 input').addEventListener('keydown', closeFct);

      node.querySelector('.date-1 input').addEventListener('input', validateInput);
      node.querySelector('.date-2 input').addEventListener('input', validateInput);


      var complexCellConfig = {
        className: 'dmn-date-editor',
        template: node,
        element: element,
        type: 'dateEdit',
        offset: {
          x: 0,
          y: 0
        }
      };

      eventBus.on('complexCell.close', function(complexCell) {
        if (complexCell.config === complexCellConfig) {
          self.updateCellContent(element, {
            type: node.querySelector('.dateEdit-type-dropdown').value,
            date1: node.querySelector('.date-1 input').value,
            date2: node.querySelector('.date-2 input').value
          });
        }
      });

      element.complex = complexCellConfig;

      graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
    }
  });
};

DateEdit.prototype.updateCellContent = function(element, data) {
  var type = data.type;
  var date1 = data.date1;
  var date2 = data.date2;

  // only apply valid entries
  if (type) {
    var date = new Date(date1);
    if (!isISODateString(date1) || date.toString() === 'Invalid Date') {
      return;
    }
    if (type === 'between') {
      date = new Date(date2);
      if (!isISODateString(date2) || date.toString() === 'Invalid Date') {
        return;
      }
    }
  }

  var content = '';
  switch (type) {
  case 'exact':
    content = 'date and time("' + date1 + '")';
    break;
  case 'before':
    content = '< date and time("' + date1 + '")';
    break;
  case 'after':
    content = '> date and time("' + date1 + '")';
    break;
  case 'between':
    content = '[date and time("' + date1 + '")..date and time("' + date2 + '")]';
    break;
  }
  this._modeling.editCell(element.row.id, element.column.id, content);
};

DateEdit.prototype.teardownComplexCells = function() {
  var graphicsFactory = this._graphicsFactory;
  var elementRegistry = this._elementRegistry;

  elementRegistry.forEach(function(element) {
    if (element.complex && element.complex.type === 'dateEdit') {

      delete element.complex;

      graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
    }
  });
};

DateEdit.$inject = [ 'eventBus', 'simpleMode', 'elementRegistry', 'graphicsFactory', 'modeling', 'complexCell' ];

module.exports = DateEdit;
