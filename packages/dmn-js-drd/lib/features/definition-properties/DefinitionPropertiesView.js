import {
  domify,
  query as domQuery,
  delegate as domDelegate
} from 'min-dom';


export default function DefinitionIdView(eventBus, canvas) {
  this._eventBus = eventBus;
  this._canvas = canvas;

  eventBus.on('diagram.init', function() {
    this._init();
  }, this);

  eventBus.on('import.done', function(event) {
    this.update();
  }, this);
}

DefinitionIdView.$inject = [ 'eventBus', 'canvas' ];

/**
 * Initialize
 */
DefinitionIdView.prototype._init = function() {
  var canvas = this._canvas,
      eventBus = this._eventBus;

  var parent = canvas.getContainer(),
      container = this._container = domify(DefinitionIdView.HTML_MARKUP);

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

DefinitionIdView.prototype.update = function(newName) {
  var businessObject = this._canvas.getRootElement().businessObject;

  this.nameElement.textContent = businessObject.name;
  this.idElement.textContent = businessObject.id;
};


/* markup definition */

DefinitionIdView.HTML_MARKUP =
  '<div class="dmn-definitions">' +
    '<div class="dmn-definitions-name" title="Definition Name"></div>' +
    '<div class="dmn-definitions-id" title="Definition ID"></div>' +
  '</div>';
