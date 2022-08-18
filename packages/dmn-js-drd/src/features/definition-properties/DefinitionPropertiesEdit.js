import {
  debounce
} from 'min-dash';

var DEBOUNCE_DELAY = 300;

import {
  domify,
  classes as domClasses,
  query as domQuery
} from 'min-dom';

import {
  getBusinessObject
} from 'dmn-js-shared/lib/util/ModelUtil';

import {
  validateId
} from 'dmn-js-shared/lib/util/IdsUtil';


export default function DefinitionIdEdit(
    eventBus, modeling, canvas, definitionPropertiesView, translate) {
  this._eventBus = eventBus;
  this._modeling = modeling;
  this._canvas = canvas;
  this._definitionPropertiesView = definitionPropertiesView;
  this._translate = translate;

  eventBus.on('definitionIdView.create', function(event) {
    this._container = event.html;
    var nameElement = domQuery('.dmn-definitions-name', this._container),
        idElement = domQuery('.dmn-definitions-id', this._container);

    this._setup(nameElement, 'name');
    this._setup(idElement, 'id');
  }, this);
}

DefinitionIdEdit.$inject = [
  'eventBus',
  'modeling',
  'canvas',
  'definitionPropertiesView',
  'translate'
];


DefinitionIdEdit.prototype.update = function(type, newValue) {
  var element = this._canvas.getRootElement();
  var newProperties = {};
  newProperties[type] = newValue;

  if (type === 'id') {
    var errorMessage = validateId(getBusinessObject(element), newValue);

    if (errorMessage) {
      this._addErrorMessage(errorMessage);

      return;
    }

    this._clearErrorMessage();
  }

  this._modeling.updateProperties(element, newProperties);
};

DefinitionIdEdit.prototype._setup = function(node, type) {
  var self = this;

  node.setAttribute('contenteditable', true);

  node.addEventListener('input', debounce(function(evt) {
    var value = evt.target.value || evt.target.textContent;

    self.update(type, value.trim());
  }, DEBOUNCE_DELAY));

  node.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 13) {
      node.blur();
      window.getSelection().removeAllRanges();
    }
  });

  node.addEventListener('blur', function() {
    self._clearErrorMessage();

    self._definitionPropertiesView.update();
  });
};

DefinitionIdEdit.prototype._addErrorMessage = function(errorMessage) {
  const errorHTML =
    '<span class="dmn-definitions-error-message">' +
    this._translate(errorMessage) +
    '</span>';

  var idElement = domQuery('.dmn-definitions-id', this._container);

  // clear previous error message
  this._clearErrorMessage();

  // add current error message
  domClasses(idElement).add('dmn-definitions-error');
  idElement.parentElement.appendChild(domify(errorHTML));
};

DefinitionIdEdit.prototype._clearErrorMessage = function() {
  var idElement = domQuery('.dmn-definitions-id', this._container);

  if (domClasses(idElement).has('dmn-definitions-error')) {
    domClasses(idElement).remove('dmn-definitions-error');

    const errorLabel = domQuery('.dmn-definitions-error-message', this._container);
    idElement.parentNode.removeChild(errorLabel);
  }
};
