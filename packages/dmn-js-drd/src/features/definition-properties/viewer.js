import DefinitionPropertiesView from './DefinitionPropertiesView';
import PaletteAdapter from './PaletteAdapter';
import DiagramTranslate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ DiagramTranslate ],
  __init__: [
    'definitionPropertiesView',
    'definitionPropertiesPaletteAdapter'
  ],
  definitionPropertiesView: [ 'type', DefinitionPropertiesView ],
  definitionPropertiesPaletteAdapter: [ 'type', PaletteAdapter ]
};
