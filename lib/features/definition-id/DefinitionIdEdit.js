'use strict';

var domQuery = require('min-dom/lib/query');

function DefinitionIdEdit(eventBus, modeling, canvas) {
  this._eventBus = eventBus;
  this._modeling = modeling;
  this._canvas = canvas;

  eventBus.on('definitionIdView.create', function(event) {
    var container = event.html,
        nameElement = domQuery('.dmn-definitions-name', container),
        idElement = domQuery('.dmn-definitions-id', container);

    this._setup(nameElement, 'name');
    this._setup(idElement, 'id');
  }, this);
}

DefinitionIdEdit.$inject = [ 'eventBus', 'modeling', 'canvas' ];

module.exports = DefinitionIdEdit;

DefinitionIdEdit.prototype.update = function(type, newValue) {
  var newProperties = {};
  newProperties[type] = newValue;

  this._modeling.updateProperties(this._canvas.getRootElement(), newProperties);
};

DefinitionIdEdit.prototype._setup = function(node, type) {
  var self = this;

  node.setAttribute('contenteditable', true);

  node.addEventListener('blur', function(evt) {
    self.update(type, node.textContent.trim());
  });

  node.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 13)  {
      node.blur();
      window.getSelection().removeAllRanges();
    }
  });

};
