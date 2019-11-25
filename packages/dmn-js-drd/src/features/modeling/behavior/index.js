import CreateConnectionBehavior from './CreateConnectionBehavior';
import ReplaceConnectionBehavior from './ReplaceConnectionBehavior';
import ReplaceElementBehavior from './ReplaceElementBehavior';

export default {
  __init__: [
    'createConnectionBehavior',
    'replaceConnectionBehavior',
    'replaceElementBehavior'
  ],
  createConnectionBehavior: [ 'type', CreateConnectionBehavior ],
  replaceConnectionBehavior: [ 'type', ReplaceConnectionBehavior ],
  replaceElementBehavior: [ 'type', ReplaceElementBehavior ]
};
