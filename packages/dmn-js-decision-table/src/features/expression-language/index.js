import ExpressionLanguage from './ExpressionLanguage';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ Translate ],
  __init__: [ 'expressionLanguage' ],
  expressionLanguage: [ 'type', ExpressionLanguage ]
};