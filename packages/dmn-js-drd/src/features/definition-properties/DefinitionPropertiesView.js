import {
  domify,
  query as domQuery,
  delegate as domDelegate
} from 'min-dom';


export default function DefinitionPropertiesView(eventBus, canvas) {
  this._eventBus = eventBus;
  this._canvas = canvas;

  eventBus.on('diagram.init', function() {
    this._init();
  }, this);

  eventBus.on('import.done', function(event) {
    if (!event.error) {
      this.update();
    }
  }, this);
}

DefinitionPropertiesView.$inject = [ 'eventBus', 'canvas' ];

/**
 * Initialize
 */
DefinitionPropertiesView.prototype._init = function() {
  var canvas = this._canvas,
      eventBus = this._eventBus;

  var parent = canvas.getContainer(),
      container = this._container = domify(DefinitionPropertiesView.HTML_MARKUP);

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

  this.nameElement.textContent = businessObject.name;
  this.idElement.textContent = businessObject.id;
};


/* markup definition */

DefinitionPropertiesView.HTML_MARKUP =
  '<div class="dmn-definitions">' +
    '<div class="dmn-definitions-name" title="Definition Name"></div>' +
    '<div class="dmn-definitions-id" title="Definition ID"></div>' +
  '</div>';
