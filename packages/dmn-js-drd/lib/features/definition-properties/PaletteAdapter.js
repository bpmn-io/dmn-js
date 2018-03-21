var domClasses = require('min-dom').classes;


function PaletteAdapter(eventBus, canvas) {

  function toggleMarker(cls, on) {
    var container = canvas.getContainer();

    domClasses(container).toggle(cls, on);
  }

  eventBus.on('palette.create', function() {
    toggleMarker('with-palette', true);
  });

  eventBus.on('palette.changed', function(event) {
    toggleMarker('with-palette-two-column', event.twoColumn);
  });

}

PaletteAdapter.$inject = [ 'eventBus', 'canvas' ];

module.exports = PaletteAdapter;