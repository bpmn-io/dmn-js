import IdClaimBehavior from './IdClaimBehavior';
import IdUnclaimBehavior from './IdUnclaimBehavior';

export default {
  __init__: [
    'idClaimBehavior',
    'idUnclaimBehavior',
  ],
  idClaimBehavior: [ 'type', IdClaimBehavior ],
  idUnclaimBehavior: [ 'type', IdUnclaimBehavior ]
};
