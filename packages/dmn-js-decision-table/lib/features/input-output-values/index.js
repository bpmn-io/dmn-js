import EditTypeRefBehavior from './behavior/EditTypeRefBehavior';
import InputOutputValues from './InputOutputValues';
import TypeRefModule from '../type-ref';

export default {
  __depends__: [ TypeRefModule ],
  __init__: [ 'editTypeRefBehavior', 'inputOutputValues' ],
  editTypeRefBehavior: [ 'type', EditTypeRefBehavior ],
  inputOutputValues: [ 'type', InputOutputValues ]
};