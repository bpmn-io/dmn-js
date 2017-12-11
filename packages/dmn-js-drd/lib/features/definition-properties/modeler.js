module.exports = {
  __depends__: [ ],
  __init__: [
    'definitionPropertiesEdit',
    'definitionPropertiesPaletteAdapter'
  ],
  definitionPropertiesEdit: [ 'type', require('./DefinitionPropertiesEdit') ],
  definitionPropertiesPaletteAdapter: [ 'type', require('./PaletteAdapter') ]
};
