import SimpleMode from '../simple-mode';
import SimpleDurationEdit from './SimpleDurationEdit';
import Keyboard from '../keyboard';

export default {
  __depends__: [ Keyboard, SimpleMode ],
  __init__: [ 'simpleDurationEdit' ],
  simpleDurationEdit: [ 'type', SimpleDurationEdit ]
};