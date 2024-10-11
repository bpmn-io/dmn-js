import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

export default [
  {
    ignores: [
      '**/lib',
      '**/dist'
    ]
  },
  ...bpmnIoPlugin.configs.browser.map(config => {
    return {
      ...config,
      files: [
        '**/src/**/*.js'
      ]
    };
  }),
  ...bpmnIoPlugin.configs.jsx.map(config => {
    return {
      ...config,
      files: [
        '**/src/**/*.js',
        '**/test/**/*.js'
      ]
    };
  }),
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: [
        '**/test/**/*.js'
      ]
    };
  }),
  {
    rules: {
      'max-len': [ 2, { 'code': 90 } ],
      'no-restricted-imports': [ 2, {
        'patterns': [ 'dmn-js/src', 'dmn-js-*/src' ]
      } ]
    }
  }
];
