var allTests = require.context('.', true, /.*Spec\.js$/);

allTests.keys().forEach(allTests);

var allSources = require.context('../src', true, /.*\.js$/);

allSources.keys().forEach(allSources);