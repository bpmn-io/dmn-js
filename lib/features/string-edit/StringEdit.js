'use strict';

var assign = require('lodash/object/assign');

var domify     = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    utils      = require('./utils');

var parseString        = utils.parseString,
    parseAllowedValues = utils.parseAllowedValues,
    isStringCell       = utils.isStringCell;

function StringEdit(eventBus, simpleMode, elementRegistry, graphicsFactory, modeling) {
  this._eventBus = eventBus;
  this._simpleMode = simpleMode;
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
  this._modeling = modeling;

  var refreshHandler = function() {
    if (this._simpleMode.isActive()) {
      this.refresh();
    }
  };
  this._eventBus.on('simpleMode.activated', this.setupComplexCells, this);
  this._eventBus.on('simpleMode.deactivated', this.teardownComplexCells, this);
  this._eventBus.on('typeRow.editDataType', refreshHandler, this);
  this._eventBus.on('typeRow.editAllowedValues', refreshHandler, this);
  this._eventBus.on('typeRow.editAllowedValues', refreshHandler, this);
  this._eventBus.on('contentNode.created', refreshHandler, this);
  this._eventBus.on('element.changed', refreshHandler, this);

  // whenever an type cell is opened, we have to position the template, because the x offset changes
  // over time, when columns are added and deleted
  this._eventBus.on('complexCell.open', function(evt) {
    var config = evt.config;

    if (config.type === 'stringEdit') {
      var gfx = elementRegistry.getGraphics(config.element);
      var template = config.template;

      assign(template.parentNode.style, {
        left: (gfx.offsetLeft + gfx.offsetWidth - 10) + 'px'
      });
    }
  });


  eventBus.on('complexCell.close', function(complexCell) {
    var config = complexCell.config;

    if (config.type === 'stringEdit') {
      var node = config.template,
          element = config.element,
          parsed = config.parsed;

      // if the input field contains content, add this content
      var inputField = node.querySelector('.free-input input');
      if (inputField.value && inputField.value.indexOf('"') === -1) {
        var values = inputField.value.split(',');
        values.forEach(function(value) {
          var trimmedValue = value.trim();
          if (parsed.values.indexOf(trimmedValue) === -1) {
            parsed.values.push(value.trim());
          }
        });
        this.renderValues(parsed.values, node.querySelector('.free-input ul'));
      }
      inputField.value = '';

      this.setCellContent(parsed, element);
      graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));

    }

  }, this);

}

StringEdit.prototype.refresh = function() {
  this.teardownComplexCells();
  this.setupComplexCells();
};

StringEdit.prototype.setupComplexCells = function() {
  var graphicsFactory = this._graphicsFactory;
  var elementRegistry = this._elementRegistry;

  var self = this;
  elementRegistry.forEach(function(element) {
    if (isStringCell(element)) {
      var parsed = parseString(element.content.text);

      if (element.content.text && !parsed) {
        // in this case, the date contains an expression, we should not show the date editor here

        // show nothing instead
        element.complex = {
          template: domify('<div>'),
          element: element,
          type: 'stringEdit',
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
      var allowedValues = parseAllowedValues(element);
      self.updateElementVisibility(parsed.type, allowedValues, node);

      // select the correct dropdown option
      node.querySelector('.string-type-dropdown').value = parsed.type;

      // add the initial data nodes
      if (parsed.values && !allowedValues) {
        self.renderValues(parsed.values, node.querySelector('.free-input ul'));
      }
      if (allowedValues) {
        self.renderValues(allowedValues, node.querySelector('.input-values ul'), parsed.values);
      }

      // wire the elements
      node.querySelector('.string-type-dropdown').addEventListener('change', function(evt) {
        var type = evt.target.value;
        parsed.type = type;
        self.updateElementVisibility(type, allowedValues, node);
      });

      if (!allowedValues) {
        node.querySelector('.free-input input').addEventListener('keydown', function(keyboardEvt) {
          if (keyboardEvt.keyCode === 13 && keyboardEvt.target.value.indexOf('"') === -1) {
            var values = keyboardEvt.target.value.split(',');
            values.forEach(function(value) {
              var trimmedValue = value.trim();
              if (parsed.values.indexOf(trimmedValue) === -1) {
                parsed.values.push(trimmedValue);
              }
            });
            self.renderValues(parsed.values, node.querySelector('.free-input ul'));
            keyboardEvt.target.value = '';
          }
        });

        node.querySelector('.free-input input').addEventListener('input', function(keyboardEvt) {
          // validate input
          var val = keyboardEvt.target.value;

          if (val.indexOf('"') === -1) {
            // is valid
            domClasses(keyboardEvt.target).remove('invalid');
            node.querySelector('.free-input .helptext').style.display = 'none';
          } else {
            // is invalid
            domClasses(keyboardEvt.target).add('invalid');
            node.querySelector('.free-input .helptext').style.display = 'block';
          }

        });


      }

      var complexCellConfig = {
        className: 'dmn-string-editor',
        template: node,
        element: element,
        parsed: parsed,
        type: 'stringEdit',
        offset: {
          x: 0,
          y: 0
        }
      };

      element.complex = complexCellConfig;

      graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
    }
  });
};

StringEdit.prototype.setCellContent = function(data, element) {
  if (data.type === '' || data.values.length === 0) {
    return this._modeling.editCell(element.row.id, element.column.id, '');
  }

  var values = data.values.map(function(value) {
    return '"' + value + '"';
  }).join(', ');

  if (data.type === 'negation') {
    return this._modeling.editCell(element.row.id, element.column.id, 'not(' + values + ')');
  } else {
    return this._modeling.editCell(element.row.id, element.column.id, values);
  }
};

StringEdit.prototype.renderValues = function(values, container, checkedValues) {
  var self = this;
  container.innerHTML = '';
  values.forEach(function(value) {
    var valueNode;
    if (checkedValues) {
      valueNode = domify('<li><input type="checkbox"><span class="value-text"></span></li>');
      valueNode.querySelector('.value-text').textContent = value;
      if (checkedValues.indexOf(value) !== -1) {
        valueNode.querySelector('input').checked = true;
      }
      valueNode.querySelector('input').addEventListener('change', function(evt) {
        if (evt.target.checked) {
          // add value
          checkedValues.push(value);
        } else {
          // remove value
          checkedValues.splice(checkedValues.indexOf(value), 1);
        }
      });
    } else {
      valueNode = domify('<li><span class="value-text"></span><button class="dmn-icon-clear"></button></li>');
      valueNode.querySelector('.value-text').textContent = value;
      valueNode.querySelector('button').addEventListener('click', function(evt) {
        values.splice(values.indexOf(value), 1);
        self.renderValues(values, container);
      });
    }
    container.appendChild(valueNode);
  });
};

StringEdit.prototype.updateElementVisibility = function(type, allowedValues, node) {
  if (type) {
    node.querySelector('.input-values').style.display = allowedValues ? 'block' : 'none';
    node.querySelector('.free-input').style.display = !allowedValues ? 'block' : 'none';
  } else {
    node.querySelector('.input-values').style.display = 'none';
    node.querySelector('.free-input').style.display = 'none';
  }
};

StringEdit.prototype.teardownComplexCells = function() {
  var graphicsFactory = this._graphicsFactory;
  var elementRegistry = this._elementRegistry;

  elementRegistry.forEach(function(element) {
    if (element.complex && element.complex.type === 'stringEdit') {

      delete element.complex;

      graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
    }
  });
};

StringEdit.$inject = ['eventBus', 'simpleMode', 'elementRegistry', 'graphicsFactory', 'modeling'];

module.exports = StringEdit;
