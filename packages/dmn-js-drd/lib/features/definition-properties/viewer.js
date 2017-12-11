module.exports = {
  __depends__: [ ],
  __init__: [
    'definitionPropertiesView',
    'definitionPropertiesPaletteAdapter'
  ],
  definitionPropertiesView: [ 'type', require('./DefinitionPropertiesView') ],
  definitionPropertiesPaletteAdapter: [ 'type', require('./PaletteAdapter') ]
};
