// require all modules ending in "Spec" from the
// current directory and all subdirectories
const testsContext = require.context('test', true, /Spec$/);

testsContext.keys().forEach(testsContext);