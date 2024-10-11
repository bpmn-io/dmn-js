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
      'max-len': [ 'error', { 'code': 90 } ],
      'no-restricted-imports': [ 'error', {
        'patterns': [ 'dmn-js/src', 'dmn-js-*/src' ]
      } ],
      'react/display-name': 'off',
      'react/no-deprecated': 'off',
      'react/jsx-key': 'off', // TODO(@barmac): reenable and fix problems
      'react/no-unknown-property': 'off',
    }
  }
];
