import ElementRegistry from './ElementRegistry';
import { DmnFactory } from './DmnFactory';

export default {
  __init__: [ 'elementRegistry' ],
  elementRegistry: [ 'type', ElementRegistry ],
  dmnFactory: [ 'type', DmnFactory ]
};
