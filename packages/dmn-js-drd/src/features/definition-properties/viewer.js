import DefinitionPropertiesView from './DefinitionPropertiesView';
import PaletteAdapter from './PaletteAdapter';

export default {
  __init__: [
    'definitionPropertiesView',
    'definitionPropertiesPaletteAdapter'
  ],
  definitionPropertiesView: [ 'type', DefinitionPropertiesView ],
  definitionPropertiesPaletteAdapter: [ 'type', PaletteAdapter ]
};
