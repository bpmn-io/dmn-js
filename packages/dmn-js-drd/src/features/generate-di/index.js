import DrdFactory from '../modeling/DrdFactory';
import DiGenerator from './DiGenerator';

export default {
  __init__: [ 'diGenerator' ],
  drdFactory: [ 'type', DrdFactory ],
  diGenerator: [ 'type', DiGenerator ]
};
