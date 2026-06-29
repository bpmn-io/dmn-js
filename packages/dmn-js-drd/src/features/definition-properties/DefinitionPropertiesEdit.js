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
    eventBus, modeling, canvas, definitionPropertiesView, translate, injector) {
  this._eventBus = eventBus;
  this._modeling = modeling;
  this._canvas = canvas;
  this._definitionPropertiesView = definitionPropertiesView;
  this._translate = translate;

  this._elements = {};

  eventBus.on('definitionIdView.create', function(event) {
    this._container = event.html;
    var nameElement = domQuery('.dmn-definitions-name', this._container),
        idElement = domQuery('.dmn-definitions-id', this._container);

    this._setup(nameElement, 'name');
    this._setup(idElement, 'id');
  }, this);

  // the diagram is cleared before the view gets detached (and the field blurred);
  // discard pending edits until a new diagram is imported
  eventBus.on('diagram.clear', function() {
    this._cleared = true;
  }, this);

  eventBus.on('import.done', function() {
    this._cleared = false;
  }, this);

  var parent = injector.get('_parent', false);

  if (parent) {
    var commitFocused = this._commitFocused.bind(this);

    parent.on('saveXML.start', commitFocused);

    eventBus.on('diagram.destroy', function() {
      parent.off('saveXML.start', commitFocused);
    });
  }
}

DefinitionIdEdit.$inject = [
  'eventBus',
  'modeling',
  'canvas',
  'definitionPropertiesView',
  'translate',
  'injector'
];


DefinitionIdEdit.prototype.update = function(type, newValue) {
  var element = this._canvas.getRootElement();
  var newProperties = {};
  newProperties[type] = newValue;

  if (type === 'id') {
    var errorMessage = validateId(getBusinessObject(element), newValue);

    if (errorMessage) {
      this._addErrorMessage(errorMessage);
      this._definitionPropertiesView.update();

      return;
    }

    this._clearErrorMessage();
  }

  this._modeling.updateProperties(element, newProperties);
};

DefinitionIdEdit.prototype._setup = function(node, type) {
  var self = this;

  this._elements[type] = node;

  node.setAttribute('contenteditable', true);

  node.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 13) {
      node.blur();
      window.getSelection().removeAllRanges();
    }
  });

  node.addEventListener('blur', function() {
    self._commit(type);
  });
};

/**
 * Commit the displayed value of the given field if it differs from the model.
 *
 * @param {'name'|'id'} type
 */
DefinitionIdEdit.prototype._commit = function(type) {
  if (this._cleared) {
    return;
  }

  var node = this._elements[type],
      businessObject = getBusinessObject(this._canvas.getRootElement());

  var value = (node.textContent || '').trim(),
      currentValue = businessObject.get(type) || '';

  this._clearErrorMessage();

  if (value === currentValue) {
    this._definitionPropertiesView.update();

    return;
  }

  this.update(type, value);
};

/**
 * Commit the field currently being edited, if any.
 */
DefinitionIdEdit.prototype._commitFocused = function() {
  var activeElement = document.activeElement;

  for (var type in this._elements) {
    if (this._elements[type] === activeElement) {
      this._commit(type);
    }
  }
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
