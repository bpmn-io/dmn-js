import AddRule from './AddRule';
import EditorActions from '../editor-actions';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ EditorActions, Translate ],
  __init__: [ 'addRule' ],
  addRule: [ 'type', AddRule ]
};