// require all modules ending in "Spec" from the
// current directory and all subdirectories
const testsContext = require.context('.', true, /Spec$/);

testsContext.keys().forEach(testsContext);