const allTests = require.context('.', true, /.*Spec\.js$/);

allTests.keys().forEach(allTests);

const allSources = require.context('../src', true, /.*\.js$/);

allSources.keys().forEach(allSources);