import SimpleMode from '../simple-mode';
import SimpleStringEdit from './SimpleStringEdit';
import Keyboard from '../keyboard';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ Keyboard, SimpleMode, Translate ],
  __init__: [ 'simpleStringEdit' ],
  simpleStringEdit: [ 'type', SimpleStringEdit ]
};