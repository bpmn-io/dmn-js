'use strict';

var domify = require('min-dom/lib/domify'),
    utils  = require('./utils');

var isDateCell = utils.isDateCell,
    parseDate  = utils.parseDate;

function DateView(eventBus, simpleMode) {
  this._eventBus = eventBus;
  this._simpleMode = simpleMode;

  this._eventBus.on('cell.render', function(evt) {

    // remove potential datafield
    dateGfx = evt.gfx.querySelector('.date-content');
    if (dateGfx) {
      dateGfx.parentNode.removeChild(dateGfx);
    }
    if (evt.gfx.childNodes.length === 1) {
        // make sure the contenteditable field is visible
      evt.gfx.firstChild.style.display = 'inline';
      evt.data.preventAutoUpdate = false;
    }

    if (isDateCell(evt.data)) {
      if (this._simpleMode.isActive()) {
        // make sure the contendeditable field is hidden
        evt.gfx.firstChild.style.display = 'none';
        evt.data.preventAutoUpdate = true;

        // check for the datafield
        var dateGfx = evt.gfx.querySelector('.date-content');
        if (!dateGfx) {
          dateGfx = domify('<span class="date-content">');
          evt.gfx.appendChild(dateGfx);
        }
        this.renderDate(evt.data.content, dateGfx);
      } else {
        // make sure the contenteditable field is visible
        evt.gfx.firstChild.style.display = '';
        evt.data.preventAutoUpdate = false;

        // remove potential datafield
        dateGfx = evt.gfx.querySelector('.date-content');
        
        if (dateGfx) {
          dateGfx.parentNode.removeChild(dateGfx);
        }
      }
    }
  }, this);
}

DateView.prototype.renderDate = function(data, gfx) {
  if (data && data.text) {
    var parsed = parseDate(data.text);
    if (!parsed) {
      if (data.description) {
        gfx.innerHTML = '<span class="expression-hint"><b>[expression]</b> (<i></i>)</span>';
        gfx.querySelector('i').textContent = data.description;
      } else {
        gfx.innerHTML = '<span class="expression-hint"><b>[expression]</b></span>';
      }
    } else {
      var dateString;
      var date1 = new Date(parsed.date1 + '.000Z');
      if (parsed.type === 'exact') {
        dateString = date1.toUTCString().slice(0, -7);
      } else {
        dateString = parsed.type + ' ' + date1.toUTCString().slice(0, -7);

        if (parsed.date2) {
          var date2 = new Date(parsed.date2 + '.000Z');
          dateString += ' and ' + date2.toUTCString().slice(0, -7);
        }
      }

      gfx.textContent = dateString;
    }
  } else {
    gfx.innerHTML = '<span style="display: inline-block; width: 100%; color: #777777; text-align: center;">-</span>';
  }
};

DateView.$inject = ['eventBus', 'simpleMode'];

module.exports = DateView;
