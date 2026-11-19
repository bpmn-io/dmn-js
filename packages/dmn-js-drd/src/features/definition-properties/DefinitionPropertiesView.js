import {
  domify,
  query as domQuery,
  delegate as domDelegate
} from 'min-dom';


export default function DefinitionPropertiesView(eventBus, canvas, translate) {
  this._eventBus = eventBus;
  this._canvas = canvas;
  this._translate = translate;

  eventBus.on('diagram.init', function() {
    this._init();
  }, this);

  eventBus.on('import.done', function(event) {
    if (!event.error) {
      this.update();
    }
  }, this);

  /* markup definition */

  this.HTML_MARKUP =
    '<div class="dmn-definitions">' +
    '<div class="dmn-definitions-name" title="' +
      this._translate('Definition name') +
    '" spellcheck="false">' +
    '</div>' +
    '<div class="dmn-definitions-id" title="' +
      this._translate('Definition ID') +
    '" spellcheck="false">' +
    '</div>' +
    '</div>';
}

DefinitionPropertiesView.$inject = [ 'eventBus', 'canvas', 'translate' ];

/**
 * Initialize
 */
DefinitionPropertiesView.prototype._init = function() {
  var canvas = this._canvas,
      eventBus = this._eventBus;

  var parent = canvas.getContainer(),
      container = this._container = domify(this.HTML_MARKUP);

  parent.appendChild(container);

  this.nameElement = domQuery('.dmn-definitions-name', this._container);
  this.idElement = domQuery('.dmn-definitions-id', this._container);

  domDelegate.bind(
    container,
    '.dmn-definitions-name, .dmn-definitions-id', 'mousedown',
    function(event) {
      event.stopPropagation();
    }
  );

  eventBus.fire('definitionIdView.create', {
    html: container
  });
};

DefinitionPropertiesView.prototype.update = function() {
  var businessObject = this._canvas.getRootElement().businessObject;

  setText(this.nameElement, businessObject.name);
  setText(this.idElement, businessObject.id);
};


// helpers //////////

/**
 * Set text only if changed to keep the caret of a focused element in place.
 *
 * @param {HTMLElement} element
 * @param {string} [text]
 */
function setText(element, text) {
  text = text || '';

  if (element.textContent !== text) {
    element.textContent = text;
  }
}


