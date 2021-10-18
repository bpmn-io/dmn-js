import DefinitionPropertiesView from './viewer';
import DefinitionPropertiesEdit from './DefinitionPropertiesEdit';
import PaletteAdapter from './PaletteAdapter';

export default {
  __depends__: [ DefinitionPropertiesView ],
  __init__: [
    'definitionPropertiesEdit',
    'definitionPropertiesPaletteAdapter'
  ],
  definitionPropertiesEdit: [ 'type', DefinitionPropertiesEdit ],
  definitionPropertiesPaletteAdapter: [ 'type', PaletteAdapter ]
};
