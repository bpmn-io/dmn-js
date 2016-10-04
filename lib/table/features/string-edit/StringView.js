'use strict';

var domify = require('min-dom/lib/domify'),
    utils  = require('./utils');

var isStringCell = utils.isStringCell,
    parseString  = utils.parseString;

function StringView(eventBus, simpleMode) {
  this._eventBus = eventBus;
  this._simpleMode = simpleMode;

  this._eventBus.on('cell.render', function(evt) {
    // remove potential datafield
    stringGfx = evt.gfx.querySelector('.string-content');
    if (stringGfx) {
      stringGfx.parentNode.removeChild(stringGfx);
    }
    if (evt.gfx.childNodes.length === 1) {
        // make sure the contenteditable field is visible
      evt.gfx.firstChild.style.display = 'inline';
      evt.data.preventAutoUpdate = false;
    }

    if (isStringCell(evt.data)) {
      if (this._simpleMode.isActive()) {
        // make sure the contendeditable field is hidden
        evt.gfx.firstChild.style.display = 'none';
        evt.data.preventAutoUpdate = true;

        // check for the datafield
        var stringGfx = evt.gfx.querySelector('.string-content');
        if (!stringGfx) {
          stringGfx = domify('<span class="string-content">');
          evt.gfx.appendChild(stringGfx);
        }
        this.renderString(evt.data.content, stringGfx);
      } else {
        // make sure the contenteditable field is visible
        evt.gfx.firstChild.style.display = '';
        evt.data.preventAutoUpdate = false;

        // remove potential datafield
        stringGfx = evt.gfx.querySelector('.string-content');
        if (stringGfx) {
          stringGfx.parentNode.removeChild(stringGfx);
        }
      }
    } else {
      // remove potential datafield
      stringGfx = evt.gfx.querySelector('.string-content');
      if (stringGfx) {
        stringGfx.parentNode.removeChild(stringGfx);
      }

      // if only the inline edit field is remaining, display it
      if (evt.gfx.childNodes.length === 1) {
        evt.gfx.firstChild.style.display = '';
      }
    }
  }, this);
}

StringView.prototype.renderString = function(data, gfx) {
  if (data.text) {
    var parsed = parseString(data.text);
    if (!parsed) {
      if (data.description) {
        gfx.innerHTML = '<span class="expression-hint"><b>[expression]</b> (<i></i>)</span>';
        gfx.querySelector('i').textContent = data.description;
      } else {
        gfx.innerHTML = '<span class="expression-hint"><b>[expression]</b></span>';
      }
    } else {
      gfx.textContent = data.text;
    }
  } else {
    gfx.innerHTML = '<span style="display: inline-block; width: 100%; color: #777777; text-align: center;">-</span>';
  }
};

StringView.$inject = ['eventBus', 'simpleMode'];

module.exports = StringView;
