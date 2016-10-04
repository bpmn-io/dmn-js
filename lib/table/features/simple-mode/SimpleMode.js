'use strict';

var domClasses = require('min-dom/lib/classes'),
    domify = require('min-dom/lib/domify');

function isType(bo, type) {
  return bo.inputExpression &&
         bo.inputExpression.typeRef === type ||
         bo.typeRef === type;
}

function SimpleMode(eventBus, sheet, config, graphicsFactory) {

  this._sheet = sheet;
  this._eventBus = eventBus;
  this._graphicsFactory = graphicsFactory;

  this.simple = false;

  var self = this;

  eventBus.on('controls.init', function(event) {
    this._node = event.controls.addControl('Exit Advanced Mode', function() {

      if (!domClasses(sheet.getContainer().parentNode).contains('simple-mode')) {
        self.activate();
      } else {
        self.deactivate();
      }
    });
  }, this);

  eventBus.on('import.done', function(event) {
    if (event.error) {
      return;
    }

    if (!config.advancedMode) {
      this.activate();
    }
  }, this);

  eventBus.on([ 'sheet.destroy', 'sheet.clear' ], function(event) {
    if (event.error) {
      return;
    }

    this.deactivate();
  }, this);

  eventBus.on('cell.render', function(event) {
    var data = event.data,
        gfx = event.gfx,
        row = data.row,
        businessObject = data.column.businessObject;

    var checkbox = gfx.querySelector('.simple-mode-checkbox'),
        expressionHint = gfx.querySelector('.expression-hint'),
        hint,
        content,
        newCheckbox;

    data.preventAutoUpdate = false;

    if (expressionHint) {
      gfx.childNodes[0].style.display = '';
      expressionHint.parentNode.removeChild(expressionHint);
    }

    if (!this.simple && checkbox) {
      gfx.childNodes[0].style.display = '';
      checkbox.parentNode.removeChild(checkbox);
      data.preventAutoUpdate = false;
    }

    if (!businessObject || !this.simple) {
      return;
    }

    if (row.type === 'dmn:DecisionRule' && !row.isHead && businessObject) {
      if (isType(businessObject, 'boolean')) {

        if (this.simple) {
          data.preventAutoUpdate = true;
        }

        content = data.content;

        if (this.simple && content && content.text !== '' && content.text !== 'false' && content.text !== 'true') {
          // in case of a non boolean expression, hint that it cannot be edited
          gfx.childNodes[0].style.display = 'none';

          hint = self.getExpressionNode(data.content);
          data.preventAutoUpdate = true;

          gfx.appendChild(hint);

        } else if (this.simple && !checkbox) {
          // create a dropdown for the booleans
          gfx.childNodes[0].style.display = 'none';
          newCheckbox = domify([
            '<select class="simple-mode-checkbox">',
            '<option value="true">Yes</option>',
            '<option value="false">No</option>',
            '<option value="">-</option>',
            '</select>'
          ].join(''));

          // we set it readonly. An optional modeling module can make it editable
          newCheckbox.setAttribute('disabled', 'disabled');

          if (content && content.text) {
            newCheckbox.selectedIndex = ['true', 'false', ''].indexOf(content.text);
          } else {
            newCheckbox.selectedIndex = 2;
          }

          eventBus.fire('simpleCheckbox.render', newCheckbox, data);

          gfx.appendChild(newCheckbox);

        } else if (this.simple && checkbox) {

          if (content && content.text) {
            checkbox.selectedIndex = ['true', 'false', ''].indexOf(content.text);
          } else {
            checkbox.selectedIndex = 2;
          }
        }
      }

      if (checkbox) {
        // IF NOT (
        // type is boolean
        // ) THEN { remove checkbox }
        if (!(
          (businessObject.inputExpression &&
         businessObject.inputExpression.typeRef === 'boolean' ||
         businessObject.typeRef === 'boolean')
        )) {

          checkbox.parentNode.removeChild(checkbox);
          gfx.childNodes[0].style.display = '';

        }

      }
    }
  }, this);
}

SimpleMode.$inject = [ 'eventBus', 'sheet', 'config', 'graphicsFactory' ];

module.exports = SimpleMode;

SimpleMode.prototype.getExpressionNode = function(businessObject) {
  var node;

  if (businessObject.description) {
    node = domify('<span class="expression-hint"><b>[expression]</b> (<i></i>)</span>');

    node.querySelector('i').textContent = businessObject.description;

  } else {
    node = domify('<span class="expression-hint"><b>[expression]</b></span>');
  }
  return node;
};

SimpleMode.prototype.activate = function() {
  if (!this._node) {
    return;
  }

  domClasses(this._sheet.getContainer().parentNode).add('simple-mode');

  this._node.textContent = 'Enter Advanced Mode';

  this.simple = true;

  this._graphicsFactory.redraw();

  this._eventBus.fire('simpleMode.activated');
};

SimpleMode.prototype.deactivate = function() {
  if (!this._node) {
    return;
  }

  domClasses(this._sheet.getContainer().parentNode).remove('simple-mode');

  this._node.textContent = 'Exit Advanced Mode';

  this.simple = false;

  this._graphicsFactory.redraw();

  this._eventBus.fire('simpleMode.deactivated');
};

SimpleMode.prototype.toggle = function() {
  if (this.simple) {
    this.deactivate();
  } else {
    this.activate();
  }
};

SimpleMode.prototype.isActive = function() {
  return this.simple;
};

SimpleMode.prototype.hasComplexContent = function(context) {
  var businessObject = context.column.businessObject,
      textContent;

  if (!businessObject || !context.content || !context.content.text) {
    return false;
  }

  textContent = context.content.text;

  // boolean
  if (isType(businessObject, 'boolean')) {

    return [ 'true', 'false' ].indexOf(textContent) === -1;
  }

  // string
  if (isType(businessObject, 'string')) {

    return !this.isString(textContent);
  }
};

SimpleMode.prototype.isString = function(textContent) {
  var match = textContent.match(/"/g),
      firstCondition, secondCondition;

  if (textContent.length === 0) {
    return true;
  }

  // check if there are is a even number of quotes
  firstCondition = (match && match.length % 2 === 0);

  // exit early if the number of quotes is odd
  if (!firstCondition) {
    return false;
  }

  // being the number of quotes even, make sure there aren't multiple strings
  secondCondition = textContent.match(/".{0,1},.{0,1}"/);

  return firstCondition && !secondCondition;
};
