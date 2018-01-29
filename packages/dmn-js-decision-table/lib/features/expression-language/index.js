import ExpressionLanguage from './ExpressionLanguage';
import Modeling from '../modeling';

export default {
  __depends__: [ Modeling ],
  __init__: [ 'expressionLanguage' ],
  expressionLanguage: [ 'type', ExpressionLanguage ]
};