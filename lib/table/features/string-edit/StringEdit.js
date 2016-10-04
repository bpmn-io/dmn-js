'use strict';

var assign = require('lodash/object/assign');

var domify     = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    utils      = require('./utils');

var hasSecondaryModifier = require('diagram-js/lib/util/Mouse').hasSecondaryModifier;

var parseString        = utils.parseString,
    parseAllowedValues = utils.parseAllowedValues,
    isStringCell       = utils.isStringCell;

function StringEdit(eventBus, simpleMode, elementRegistry, graphicsFactory, modeling, complexCell, selection) {
  this._eventBus = eventBus;
  this._simpleMode = simpleMode;
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
  this._modeling = modeling;
  this._complexCell = complexCell;
  this._selection = selection;

  var refreshHandler = function() {
    if (simpleMode.isActive()) {
      this.refresh();
    }
  };

  eventBus.on('simpleMode.activated', this.setupComplexCells, this);
  eventBus.on('simpleMode.deactivated', this.teardownComplexCells, this);
  eventBus.on('typeRow.editDataType', refreshHandler, this);
  eventBus.on('typeRow.editAllowedValues', refreshHandler, this);
  eventBus.on('typeRow.editAllowedValues', refreshHandler, this);
  eventBus.on('contentNode.created', refreshHandler, this);
  eventBus.on('element.changed', refreshHandler, this);

  // whenever an type cell is opened, we have to position the template, because the x offset changes
  // over time, when columns are added and deleted
  eventBus.on('complexCell.open', function(evt) {
    var config = evt.config;

    if (config.type === 'stringEdit') {
      var gfx = elementRegistry.getGraphics(config.element);
      var template = config.template;

      assign(template.parentNode.style, {
        left: (gfx.offsetLeft + gfx.offsetWidth - 10) + 'px'
      });

      var focusableNode = template.querySelector('input[type="text"]') || template.querySelector('textarea');
      if (focusableNode) {
        focusableNode.focus();
        focusableNode.select();

      }
      selection.select(config.element);
    }
  });

  eventBus.on('complexCell.close', function(complexCell) {
    var config = complexCell.config,
        inputField;

    if (config.type === 'stringEdit' && !config.isEmpty) {
      if (config.isInput) {
        // if the input field contains content, add this content
        inputField = config.template.querySelector('.free-input input');

        if (inputField.value && inputField.value.indexOf('"') === -1) {
          var values = inputField.value.split(','),
              parsedValues = config.parsed.values;

          values.forEach(function(value) {
            var trimmedValue = value.trim();

            if (parsedValues.indexOf(trimmedValue) === -1) {
              parsedValues.push(trimmedValue);
            }
          });

          this.renderValues(parsedValues, config.template.querySelector('.free-input'), undefined, config.isInput);
        }
        inputField.value = '';
      } else {
        if (!config.allowedValues) {
          inputField = config.template.querySelector('.free-input textarea');

          if (inputField.value.trim()) {
            config.parsed.values = [ inputField.value ];
          } else {
            config.parsed.values = [];
          }
        }
      }
      this.setCellContent(config.parsed, config.element);

      graphicsFactory.update('cell', config.element, elementRegistry.getGraphics(config.element));
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
    var node, isInput;

    if (isStringCell(element)) {
      var parsed = parseString(element.content.text);

      if (element.content.text && !parsed) {
        // in this case, the date contains an expression, we should not show the date editor here

        // show nothing instead
        element.complex = {
          template: domify('<div>'),
          element: element,
          isEmpty: true,
          type: 'stringEdit',
          offset: {
            x: 0,
            y: 0
          }
        };

        graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
        return;
      }

      if (element.column.type === 'dmn:InputClause') {
        node = domify(require('./template-input.html'));
        isInput = true;
      } else {
        node = domify(require('./template-output.html'));
        isInput = false;
      }

      // set the initial state based on the cell content
      var allowedValues = parseAllowedValues(element);
      self.updateElementVisibility(parsed.type, allowedValues, node);


      // add the initial data nodes
      if (parsed.values && !allowedValues) {
        self.renderValues(parsed.values, node.querySelector('.free-input'), undefined, isInput);
      }
      if (allowedValues) {
        self.renderValues(allowedValues, node.querySelector('.input-values'), parsed.values, isInput);
      }

      // wire the elements
      if (node.querySelector('.string-type-dropdown')) {
        // select the correct dropdown option
        node.querySelector('.string-type-dropdown').value = parsed.type;

        node.querySelector('.string-type-dropdown').addEventListener('change', function(evt) {
          var type = evt.target.value;
          parsed.type = type;
          self.updateElementVisibility(type, allowedValues, node);
        });
      }

      var inputNode = node.querySelector('.free-input input') || node.querySelector('.free-input textarea');
      if (!allowedValues) {
        inputNode.addEventListener('keydown', function(keyboardEvt) {
          if (keyboardEvt.keyCode === 13) {
            if (!isInput && !hasSecondaryModifier(keyboardEvt)) {
              self._complexCell.close();
            } else if (isInput && keyboardEvt.target.value.indexOf('"') === -1) {

              var values = keyboardEvt.target.value.split(',');

              values.forEach(function(value) {
                var trimmedValue = value.trim();

                if (parsed.values.indexOf(trimmedValue) === -1) {
                  parsed.values.push(trimmedValue);
                }
              });

              self.renderValues(parsed.values, node.querySelector('.free-input'), undefined, isInput);
              keyboardEvt.target.value = '';
            }
          }
        });

        inputNode.addEventListener('input', function(keyboardEvt) {
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
        isInput: isInput,
        allowedValues: allowedValues,
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
  var modeling = this._modeling;

  if (data.type === '' || data.values.length === 0) {
    return this._modeling.editCell(element.row.id, element.column.id, '');
  }

  var values = data.values.map(function(value) {
    return '"' + value + '"';
  }).join(', ');

  if (data.type === 'negation') {
    return modeling.editCell(element.row.id, element.column.id, 'not(' + values + ')');
  } else {
    return modeling.editCell(element.row.id, element.column.id, values);
  }
};

StringEdit.prototype.renderValues = function(values, container, checkedValues, isInput) {
  var self = this;

  var listContainer = container.querySelector('ul');

  if (isInput) {
    listContainer.innerHTML = '';

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
          self.renderValues(values, container, undefined, isInput);
        });
      }
      listContainer.appendChild(valueNode);
    });
  } else {
    if (values && checkedValues) {
      listContainer.innerHTML = '';
      values.forEach(function(value) {
        var valueNode = domify('<li><input type="radio" name="radio-group"><span class="value-text"></span></li>');
        valueNode.querySelector('.value-text').textContent = value;
        if (checkedValues.indexOf(value) !== -1) {
          valueNode.querySelector('input').checked = true;
        }
        valueNode.querySelector('input').addEventListener('change', function(evt) {
          checkedValues.length = 0;
          checkedValues.push(value);
        });
        listContainer.appendChild(valueNode);
      });
    } else {
      var inputNode = container.querySelector('.free-input-value-field');
      inputNode.value = values[0] || '';
    }
  }
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

StringEdit.$inject = ['eventBus', 'simpleMode', 'elementRegistry', 'graphicsFactory', 'modeling', 'complexCell', 'selection'];

module.exports = StringEdit;
