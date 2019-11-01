import CreateConnectionBehavior from './CreateConnectionBehavior';
import ReplaceElementBehavior from './ReplaceElementBehavior';

export default {
  __init__: [
    'createConnectionBehavior',
    'replaceElementBehavior'
  ],
  createConnectionBehavior: [ 'type', CreateConnectionBehavior ],
  replaceElementBehavior: [ 'type', ReplaceElementBehavior ]
};
