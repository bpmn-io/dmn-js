'use strict';

var domClasses = require('min-dom/lib/classes');
var domify = require('min-dom/lib/domify');

function SimpleMode(eventBus, sheet, config, graphicsFactory) {

  this._sheet = sheet;
  this._eventBus = eventBus;
  this._graphicsFactory = graphicsFactory;
  this.simple = false;

  var self = this;

  eventBus.on('controls.init', function(evt) {
    self._node = evt.controls.addControl('Exit Advanced Mode', function() {
      if(!domClasses(sheet.getContainer().parentNode).contains('simple-mode')) {
        self.activate();
      } else {
        self.deactivate();
      }
    });
  });

  eventBus.on('import.success', function() {
    if(!config.advancedMode) {
      self.activate();
    }
  });

  eventBus.on('cell.render', function(event) {
    var data = event.data,
        gfx = event.gfx,
        row = data.row,
        businessObject = data.column.businessObject;


    data.preventAutoUpdate = false;
    var checkbox = gfx.querySelector('.simple-mode-checkbox');
    var expressionHint = gfx.querySelector('.expression-hint');

    if(expressionHint) {
      gfx.childNodes[0].style.display = 'inline';
      expressionHint.parentNode.removeChild(expressionHint);
    }

    if(!self.simple && checkbox) {
      gfx.childNodes[0].style.display = 'inline';
      checkbox.parentNode.removeChild(checkbox);
      data.preventAutoUpdate = false;
    }

    if(!businessObject || !self.simple) {
      return;
    }

    if(row.type === 'dmn:DecisionRule' && !row.isHead && businessObject) {
      if(businessObject.inputExpression &&
         businessObject.inputExpression.typeRef === 'boolean' ||
         businessObject.typeRef === 'boolean') {

        if(self.simple) {
          data.preventAutoUpdate = true;
        }

        var content = data.content;
        if(self.simple && content && content.text !== '' && content.text !== 'false' && content.text !== 'true') {
          // in case of a non boolean expression, hint that it cannot be edited
          gfx.childNodes[0].style.display = 'none';
          var hint = domify('<span class="expression-hint">[expression]</span>');
          gfx.appendChild(hint);
        } else if(self.simple && !checkbox) {
          // create a dropdown for the booleans
          gfx.childNodes[0].style.display = 'none';
          var newCheckbox = domify('<select class="simple-mode-checkbox"><option value="true">Yes</option><option value="false">No</option><option value=""></option></select>');

          // we set it readonly. An optional modeling module can make it editable
          newCheckbox.setAttribute('disabled', 'disabled');

          if(content && content.text) {
            newCheckbox.selectedIndex = ['true', 'false', ''].indexOf(content.text);
          } else {
            newCheckbox.selectedIndex = 2;
          }

          eventBus.fire('simpleCheckbox.render', newCheckbox, data);

          gfx.appendChild(newCheckbox);
        }
      } else {
        if(checkbox) {
          gfx.childNodes[0].style.display = 'inline';
          checkbox.parentNode.removeChild(checkbox);
        }
      }

      if(businessObject.inputExpression &&
         businessObject.inputExpression.typeRef === 'string' ||
         businessObject.typeRef === 'string') {

        if(self.simple) {
          var firstChar = gfx.childNodes[0].textContent[0];
          var lastChar = gfx.childNodes[0].textContent[gfx.childNodes[0].textContent.length - 1];
          if(firstChar === '"' && lastChar === '"' || gfx.childNodes[0].textContent.length === 0) {
            gfx.childNodes[0].textContent = gfx.childNodes[0].textContent.replace(/^"|"$/g, '');
          } else {
            gfx.childNodes[0].style.display = 'none';
            var hint = domify('<span class="expression-hint">[expression]</span>');
            gfx.appendChild(hint);
          }
        }

      }

    }
  });
}

SimpleMode.$inject = [ 'eventBus', 'sheet', 'config', 'graphicsFactory' ];

module.exports = SimpleMode;

SimpleMode.prototype.activate = function() {
  if(!this._node) return;
  domClasses(this._sheet.getContainer().parentNode).add('simple-mode');
  this._node.textContent = 'Advanced Mode';
  this.simple = true;

  this._graphicsFactory.redraw();
  this._eventBus.fire('simpleMode.activated');
};

SimpleMode.prototype.deactivate = function() {
  if(!this._node) return;
  domClasses(this._sheet.getContainer().parentNode).remove('simple-mode');
  this._node.textContent = 'Exit Advanced Mode';
  this.simple = false;

  this._graphicsFactory.redraw();
  this._eventBus.fire('simpleMode.deactivated');
};

SimpleMode.prototype.isSimple = function() {
  return this.simple;
};

SimpleMode.prototype.hasComplexContent = function(context) {
  var businessObject = context.column.businessObject;

  if(!businessObject || !context.content || !context.content.text) {
    return false;
  }

  // boolean
  if(businessObject.inputExpression &&
     businessObject.inputExpression.typeRef === 'boolean' ||
     businessObject.typeRef === 'boolean') {

    return ['true', 'false'].indexOf(context.content.text) === -1;

  }

  // string
  if(businessObject.inputExpression &&
     businessObject.inputExpression.typeRef === 'string' ||
     businessObject.typeRef === 'string') {

    var firstChar = context.content.text[0];
    var lastChar = context.content.text[context.content.text.length - 1];
    return firstChar !== '"' || lastChar !== '"';

  }
};
